// Server-only. Do not import from client components.
// Client-credentials (app-only) auth against Microsoft Graph - no interactive sign-in.

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
  const res = await fetch(`https://graph.microsoft.com/v1.0${path}`, {
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

/**
 * Creates an M365 Group + Team in one call (async - Graph returns 202 while it
 * provisions in the background). Requires Group.ReadWrite.All and Team.Create
 * application permissions.
 */
export async function createTeam(params: {
  displayName: string;
  description?: string;
  members: TeamMemberInput[];
}): Promise<{ operationLocation: string | null }> {
  const token = await getAccessToken();
  const res = await fetch("https://graph.microsoft.com/v1.0/teams", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      "template@odata.bind": "https://graph.microsoft.com/v1.0/teamsTemplates('standard')",
      displayName: params.displayName,
      description: params.description ?? "",
      members: params.members.map((m) => ({
        "@odata.type": "#microsoft.graph.aadUserConversationMember",
        roles: m.role === "owner" ? ["owner"] : [],
        "user@odata.bind": `https://graph.microsoft.com/v1.0/users('${m.email}')`,
      })),
    }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    const message = body?.error?.message || `Team creation failed (${res.status})`;
    throw new Error(message);
  }

  return { operationLocation: res.headers.get("Location") };
}
