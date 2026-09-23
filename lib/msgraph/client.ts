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

export type DirectoryUser = {
  displayName: string;
  email: string;
};

/** Search Entra users by name or email. Needs User.Read.All. */
export async function searchDirectoryUsers(query: string, limit = 8): Promise<DirectoryUser[]> {
  const q = query.trim().replace(/["\\]/g, "");
  if (q.length < 2) return [];

  const params = new URLSearchParams({
    $search: `"displayName:${q}" OR "mail:${q}" OR "userPrincipalName:${q}"`,
    $select: "displayName,mail,userPrincipalName,accountEnabled",
    $top: String(limit),
    $count: "true",
    $orderby: "displayName",
  });
  const body = await graphFetch(`/users?${params}`, {
    headers: { ConsistencyLevel: "eventual" },
  });

  const rows = (body?.value ?? []) as {
    displayName?: string;
    mail?: string | null;
    userPrincipalName?: string | null;
    accountEnabled?: boolean;
  }[];

  return rows
    .filter((u) => u.accountEnabled !== false)
    .map((u) => {
      const email = (u.mail || u.userPrincipalName || "").trim().toLowerCase();
      return {
        displayName: (u.displayName || email).trim(),
        email,
      };
    })
    .filter((u) => u.email.includes("@"));
}

export type SignedInUserProfile = {
  email: string;
  displayName: string;
  givenName?: string;
  surname?: string;
  jobTitle?: string;
  officeLocation?: string;
  mobilePhone?: string;
  userPrincipalName?: string;
};

/** Load profile fields for a signed-in allowlisted user. Needs User.Read.All. */
export async function getSignedInUserProfile(email: string): Promise<SignedInUserProfile | null> {
  const normalized = email.trim().toLowerCase();
  const params = new URLSearchParams({
    $select:
      "displayName,givenName,surname,mail,userPrincipalName,jobTitle,officeLocation,mobilePhone",
  });
  const result = await graphFetchMaybe(`/users/${encodeURIComponent(normalized)}?${params}`);
  if (!result.ok || !result.body) return null;
  const u = result.body as {
    displayName?: string;
    givenName?: string;
    surname?: string;
    mail?: string | null;
    userPrincipalName?: string | null;
    jobTitle?: string | null;
    officeLocation?: string | null;
    mobilePhone?: string | null;
  };
  const resolvedEmail = (u.mail || u.userPrincipalName || normalized).trim().toLowerCase();
  return {
    email: resolvedEmail,
    displayName: (u.displayName || resolvedEmail).trim(),
    givenName: u.givenName || undefined,
    surname: u.surname || undefined,
    jobTitle: u.jobTitle || undefined,
    officeLocation: u.officeLocation || undefined,
    mobilePhone: u.mobilePhone || undefined,
    userPrincipalName: u.userPrincipalName || undefined,
  };
}

/** Fetch the user's Microsoft profile photo bytes, if any. */
export async function getUserPhotoBytes(
  email: string
): Promise<{ bytes: ArrayBuffer; contentType: string } | null> {
  const token = await getAccessToken();
  const res = await fetch(
    `${GRAPH_BASE}/users/${encodeURIComponent(email.trim().toLowerCase())}/photo/$value`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  if (!res.ok) return null;
  return {
    bytes: await res.arrayBuffer(),
    contentType: res.headers.get("content-type") || "image/jpeg",
  };
}

async function graphFetchMaybe(path: string, init?: RequestInit) {
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
  return { ok: res.ok, status: res.status, body };
}

function sharePointSitePath() {
  const hostname = process.env.SHAREPOINT_HOSTNAME ?? "flyonitcomau.sharepoint.com";
  const sitePath = process.env.SHAREPOINT_SITE_PATH ?? "/sites/FLYONITProjects";
  return { hostname, sitePath };
}

function encodeDrivePath(segments: string[]): string {
  return segments.map(encodeURIComponent).join("/");
}

async function getOrCreateChildFolder(
  driveId: string,
  parentId: string,
  pathSegments: string[],
  folderName: string
): Promise<{ id: string; webUrl: string }> {
  const itemPath = encodeDrivePath([...pathSegments, folderName]);
  const existing = await graphFetchMaybe(`/drives/${driveId}/root:/${itemPath}`);
  if (existing.ok && existing.body?.id) {
    return { id: existing.body.id, webUrl: existing.body.webUrl };
  }

  const created = await graphFetchMaybe(`/drives/${driveId}/items/${parentId}/children`, {
    method: "POST",
    body: JSON.stringify({
      name: folderName,
      folder: {},
      "@microsoft.graph.conflictBehavior": "fail",
    }),
  });
  if (created.ok && created.body?.id) {
    return { id: created.body.id, webUrl: created.body.webUrl };
  }
  if (created.status === 409) {
    const retry = await graphFetch(`/drives/${driveId}/root:/${itemPath}`);
    return { id: retry.id, webUrl: retry.webUrl };
  }
  throw new Error(created.body?.error?.message || `Could not create SharePoint folder (${created.status})`);
}

/**
 * Creates (or reuses) the project folder on FLYONIT Projects:
 * Shared Documents / {workArea} / {parentFolder} / {folderName}
 * parentFolder is a region (01_AU…) for client/managed, or a dept (FOIT, 02_OPS…) for internal.
 */
export async function createSharePointProjectFolder(params: {
  workArea: string;
  parentFolder: string;
  folderName: string;
}): Promise<{ webUrl: string; path: string }> {
  const { hostname, sitePath } = sharePointSitePath();
  const site = await graphFetch(`/sites/${hostname}:${sitePath}`);
  const drive = await graphFetch(`/sites/${site.id}/drive`);
  const root = await graphFetch(`/drives/${drive.id}/root`);
  const segments = [params.workArea, params.parentFolder, params.folderName];
  let parentId = root.id;
  let folder = { id: root.id, webUrl: root.webUrl as string };
  const walked: string[] = [];
  for (const name of segments) {
    folder = await getOrCreateChildFolder(drive.id, parentId, walked, name);
    parentId = folder.id;
    walked.push(name);
  }
  return {
    webUrl: folder.webUrl,
    path: `/Shared Documents/${params.workArea}/${params.parentFolder}/${params.folderName}`,
  };
}

/** Built-in Teams "Website" tab. Needs TeamsTab.ReadWriteForChat.All (application). */
const TEAMS_WEBSITE_APP_ID = "com.microsoft.teamspace.tab.web";

export async function addChatWebsiteTab(params: {
  chatId: string;
  displayName: string;
  url: string;
}): Promise<void> {
  await graphFetch(`/chats/${params.chatId}/tabs`, {
    method: "POST",
    body: JSON.stringify({
      displayName: params.displayName,
      "teamsApp@odata.bind": `${GRAPH_BASE}/appCatalogs/teamsApps/${TEAMS_WEBSITE_APP_ID}`,
      configuration: {
        contentUrl: params.url,
        websiteUrl: params.url,
      },
    }),
  });
}

/** Read-only check that the app registration can reach Graph and read directory data. Creates nothing. */
export async function getTenantName(): Promise<string> {
  const body = await graphFetch("/organization?$select=displayName");
  return body?.value?.[0]?.displayName ?? "";
}

export type ChatMemberInput = { email: string; role?: "owner" | "guest" };

/** Always added to every project group chat, in addition to the project's own PM/team. */
export const DEFAULT_CHAT_OWNERS: ChatMemberInput[] = [
  { email: "mahesh@flyonit.com", role: "owner" },
  { email: "rani@flyonit.com", role: "owner" },
  { email: "purba@flyonit.com", role: "owner" },
];

function conversationMember(member: ChatMemberInput) {
  return {
    "@odata.type": "#microsoft.graph.aadUserConversationMember",
    // Group chats only accept owner (or guest). Empty roles fail create.
    roles: member.role === "guest" ? ["guest"] : ["owner"],
    "user@odata.bind": `${GRAPH_BASE}/users('${member.email}')`,
  };
}

export function mergeChatMembers(extraEmails: string[]): ChatMemberInput[] {
  const seen = new Set<string>();
  const members: ChatMemberInput[] = [];
  for (const member of [
    ...DEFAULT_CHAT_OWNERS,
    ...extraEmails.map((email) => ({ email, role: "owner" as const })),
  ]) {
    const key = member.email.trim().toLowerCase();
    if (!key || seen.has(key)) continue;
    seen.add(key);
    members.push({ ...member, email: key });
  }
  return members;
}

/**
 * Creates a plain MS Teams group chat (not a full Team - no channels, no
 * SharePoint site, just a chat thread). Unlike Team creation this is
 * synchronous and returns the finished chat directly, no async polling
 * needed. Requires the Chat.Create application permission. A group chat
 * needs at least 2 members.
 */
export async function createGroupChat(params: {
  topic: string;
  members: ChatMemberInput[];
}): Promise<{ chatId: string }> {
  const body = await graphFetch("/chats", {
    method: "POST",
    body: JSON.stringify({
      chatType: "group",
      topic: params.topic,
      members: params.members.map(conversationMember),
    }),
  });
  return { chatId: body.id };
}
