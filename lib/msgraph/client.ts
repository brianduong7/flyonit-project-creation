// Server-only. Do not import from client components.
// Client-credentials (app-only) auth against Microsoft Graph - no interactive sign-in.

const GRAPH_BASE = "https://graph.microsoft.com/v1.0";

function config() {
  const tenantId = process.env.MS_TENANT_ID;
  const clientId = process.env.MS_CLIENT_ID;
  const clientSecret = process.env.MS_CLIENT_SECRET;
  if (!tenantId || !clientId || !clientSecret) {
    throw new Error(
      "Microsoft Graph is not configured. Set MS_TENANT_ID, MS_CLIENT_ID and MS_CLIENT_SECRET in .env.local"
    );
  }
  return { tenantId, clientId, clientSecret };
}

export function isMsGraphConfigured(): boolean {
  return Boolean(process.env.MS_TENANT_ID && process.env.MS_CLIENT_ID && process.env.MS_CLIENT_SECRET);
}

let cachedToken: { accessToken: string; expiresAt: number } | null = null;

async function getAccessToken(): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now() + 60_000) {
    return cachedToken.accessToken;
  }

  const { tenantId, clientId, clientSecret } = config();
  const res = await fetch(`https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      scope: "https://graph.microsoft.com/.default",
      grant_type: "client_credentials",
    }),
  });
  const body = await res.json();
  if (!res.ok) {
    throw new Error(body?.error_description || body?.error || `Token request failed (${res.status})`);
  }

  cachedToken = {
    accessToken: body.access_token,
    expiresAt: Date.now() + body.expires_in * 1000,
  };
  return cachedToken.accessToken;
}

async function graphFetch(path: string, init?: RequestInit) {
  const token = await getAccessToken();
  const res = await fetch(`${GRAPH_BASE}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });
  const body = await res.json().catch(() => null);
  if (!res.ok) {
    const message = body?.error?.message || `Microsoft Graph request failed (${res.status})`;
    throw new Error(message);
  }
  return body;
}

/** Read-only check that the app registration can reach Graph and read directory data. Creates nothing. */
export async function getTenantName(): Promise<string> {
  const body = await graphFetch("/organization?$select=displayName");
  return body?.value?.[0]?.displayName ?? "";
}

export type TeamMemberInput = { email: string; role?: "owner" | "member" };

/** Always added as Owners on every project Team, in addition to the project's own PM/team. */
export const DEFAULT_TEAM_OWNERS: TeamMemberInput[] = [
  { email: "mahesh@flyonit.com.au", role: "owner" },
  { email: "rani@flyonit.com.au", role: "owner" },
  { email: "purba@flyonit.com.au", role: "owner" },
];

function conversationMember(member: TeamMemberInput) {
  return {
    "@odata.type": "#microsoft.graph.aadUserConversationMember",
    roles: member.role === "owner" ? ["owner"] : [],
    "user@odata.bind": `${GRAPH_BASE}/users('${member.email}')`,
  };
}

/**
 * Polls a teamsAsyncOperation until it succeeds/fails, returning the provisioned team's id.
 * Right after creation the operation is often not yet queryable at all - Graph returns
 * "Operation id not found for given Team" instead of a "notStarted"/"running" status - so
 * a failed lookup is treated as "not ready yet" and retried, not as a hard failure.
 */
async function waitForTeamProvisioning(
  operationLocation: string,
  { maxAttempts = 20, intervalMs = 3000, initialDelayMs = 5000 } = {}
): Promise<string> {
  const path = operationLocation.startsWith(GRAPH_BASE)
    ? operationLocation.slice(GRAPH_BASE.length)
    : operationLocation;

  await new Promise((resolve) => setTimeout(resolve, initialDelayMs));

  let lastError: unknown;
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      const body = await graphFetch(path);
      if (body.status === "succeeded") return body.targetResourceId;
      if (body.status === "failed") {
        throw new Error(body.error?.message || "Team provisioning failed");
      }
      // status is "notStarted" or "running" - keep polling
    } catch (err) {
      lastError = err;
    }
    await new Promise((resolve) => setTimeout(resolve, intervalMs));
  }
  throw lastError instanceof Error
    ? lastError
    : new Error("Timed out waiting for Team provisioning to finish");
}

/**
 * Creates an M365 Group + Team (async - Graph returns 202 while it provisions
 * in the background). Requires Group.ReadWrite.All and Team.Create application
 * permissions.
 *
 * Graph's create-team call only accepts a single owner in the initial request
 * ("Adding more than one member is not supported" otherwise) - so the first
 * entry in `members` becomes the initial owner, and any remaining members are
 * added afterward, once provisioning has finished.
 */
export async function createTeam(params: {
  displayName: string;
  description?: string;
  members: TeamMemberInput[];
}): Promise<{ teamId: string }> {
  const [firstOwner, ...rest] = params.members;
  const token = await getAccessToken();
  const res = await fetch(`${GRAPH_BASE}/teams`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      "template@odata.bind": `${GRAPH_BASE}/teamsTemplates('standard')`,
      displayName: params.displayName,
      description: params.description ?? "",
      members: firstOwner ? [conversationMember(firstOwner)] : [],
    }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    const message = body?.error?.message || `Team creation failed (${res.status})`;
    throw new Error(message);
  }

  const operationLocation = res.headers.get("Location");
  if (!operationLocation) {
    throw new Error("Team creation accepted, but no operation location was returned to track it");
  }

  const teamId = await waitForTeamProvisioning(operationLocation);

  for (const member of rest) {
    await graphFetch(`/teams/${teamId}/members`, {
      method: "POST",
      body: JSON.stringify(conversationMember(member)),
    });
  }

  return { teamId };
}
