// Server-only. Do not import from client components.

function config() {
  const url = process.env.ERPNEXT_URL;
  const apiKey = process.env.ERPNEXT_API_KEY;
  const apiSecret = process.env.ERPNEXT_API_SECRET;
  if (!url || !apiKey || !apiSecret) {
    throw new Error(
      "ERPNext is not configured. Set ERPNEXT_URL, ERPNEXT_API_KEY and ERPNEXT_API_SECRET in .env.local"
    );
  }
  return { url: url.replace(/\/$/, ""), apiKey, apiSecret };
}

export function isErpNextConfigured(): boolean {
  return Boolean(
    process.env.ERPNEXT_URL && process.env.ERPNEXT_API_KEY && process.env.ERPNEXT_API_SECRET
  );
}

function resourceUrl(baseUrl: string, doctype: string, params?: Record<string, string>): string {
  const u = new URL(`/api/resource/${encodeURIComponent(doctype)}`, baseUrl);
  for (const [k, v] of Object.entries(params ?? {})) u.searchParams.set(k, v);
  return u.toString();
}

async function erpnextFetch(url: string, init?: RequestInit) {
  const { apiKey, apiSecret } = config();
  const res = await fetch(url, {
    ...init,
    headers: {
      Authorization: `token ${apiKey}:${apiSecret}`,
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });
  const body = await res.json().catch(() => null);
  if (!res.ok) {
    const message =
      (typeof body?._server_messages === "string" && body._server_messages) ||
      body?.exception ||
      body?.message ||
      `ERPNext request failed (${res.status})`;
    throw new Error(message);
  }
  return body;
}

/** Reads the valid "Project Type" link options configured in this ERPNext instance. */
export async function listProjectTypes(): Promise<string[]> {
  const { url } = config();
  const body = await erpnextFetch(resourceUrl(url, "Project Type", { limit_page_length: "0" }));
  return ((body?.data ?? []) as { name: string }[]).map((d) => d.name);
}

export type ErpNextProjectPayload = {
  project_name: string;
  project_type?: string;
};

/** Creates a Project in ERPNext. project_name carries the full ProjectCode - ScopeTitle display name. */
export async function createErpNextProject(
  payload: ErpNextProjectPayload
): Promise<{ name: string }> {
  const { url } = config();
  const body = await erpnextFetch(resourceUrl(url, "Project"), {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return body.data;
}
