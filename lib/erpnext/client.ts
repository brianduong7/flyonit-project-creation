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

/**
 * Reads the valid "Portfolio List" options. This instance has a custom mandatory
 * field on Project (custom_work_domain, labelled "Portfolio") linking to this
 * doctype - not part of stock ERPNext or the FLYONIT naming spec, but required
 * for every create call to succeed.
 */
export async function listPortfolios(): Promise<string[]> {
  const { url } = config();
  const body = await erpnextFetch(resourceUrl(url, "Portfolio List", { limit_page_length: "0" }));
  return ((body?.data ?? []) as { name: string }[]).map((d) => d.name);
}

export type ErpNextProjectSummary = {
  name: string;
  project_name: string;
  status: string;
  project_type: string | null;
  creation: string;
};

/** Reads projects directly from ERPNext (the system of record) for display in the register. */
export async function listErpNextProjects(limit = 100): Promise<ErpNextProjectSummary[]> {
  const { url } = config();
  const body = await erpnextFetch(
    resourceUrl(url, "Project", {
      fields: JSON.stringify(["name", "project_name", "status", "project_type", "creation"]),
      order_by: "creation desc",
      limit_page_length: String(limit),
    })
  );
  return (body?.data ?? []) as ErpNextProjectSummary[];
}

export type ErpNextProjectPayload = {
  project_name: string;
  project_type?: string;
  custom_work_domain: string;
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

export type ErpNextTaskPayload = {
  subject: string;
  project: string;
  custom_task_phase?: string;
  priority?: string;
  exp_start_date?: string;
  exp_end_date?: string;
  task_weight?: number;
  description?: string;
  /** Real ERPNext Task ids (the "name" field) this task depends on. */
  depends_on?: { task: string }[];
};

/**
 * Creates a Task in ERPNext linked to a project. `type` (Task Type link) is
 * deliberately not set - this instance's configured Task Type options
 * (Planning, Setup, Marketing...) don't match the spreadsheet's task-type
 * values (Assessment, Documentation...), so setting it would fail the same
 * way the missing Portfolio link did for Project.
 */
export async function createErpNextTask(payload: ErpNextTaskPayload): Promise<{ name: string }> {
  const { url } = config();
  const body = await erpnextFetch(resourceUrl(url, "Task"), {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return body.data;
}
