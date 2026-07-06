import { cookies } from "next/headers";
import { listProjects } from "@/lib/store";
import {
  listErpNextProjects,
  listPortfolios,
  listProjectTypes,
  type ErpNextProjectSummary,
} from "@/lib/erpnext/client";
import { ProjectForm } from "@/app/components/ProjectForm";
import { PasscodeLogin } from "@/app/components/PasscodeLogin";
import { AUTH_COOKIE } from "@/lib/auth";

export default async function Home() {
  const cookieStore = await cookies();
  if (cookieStore.get(AUTH_COOKIE)?.value !== "granted") {
    return <PasscodeLogin />;
  }

  // Chat status only exists in our local register (ERPNext doesn't know about it),
  // so join it in by erpNextName once the authoritative project list comes back.
  const localProjects = await listProjects();
  const chatByErpNextName = new Map(
    localProjects.filter((p) => p.erpNextName).map((p) => [p.erpNextName, p])
  );

  let projects: ErpNextProjectSummary[] = [];
  let projectTypes: string[] = [];
  let portfolios: string[] = [];
  let erpNextError: string | null = null;
  try {
    [projects, projectTypes, portfolios] = await Promise.all([
      listErpNextProjects(),
      listProjectTypes(),
      listPortfolios(),
    ]);
  } catch (err) {
    erpNextError = err instanceof Error ? err.message : String(err);
  }

  return (
    <div className="flex flex-1 flex-col items-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex w-full max-w-3xl flex-1 flex-col gap-10 px-6 py-16 sm:px-10">
        <header>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            FLYONIT Project Creation
          </h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Generate the official ProjectCode and display name for an approved project. Format:{" "}
            <code className="rounded bg-zinc-200 px-1 py-0.5 text-xs dark:bg-zinc-800">
              [CLIENT_OR_DEPT]-[REGION]-[SERVICE]-[ENG_TYPE]-[###]
            </code>
          </p>
        </header>

        {erpNextError && (
          <div className="rounded-md border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-100">
            Could not reach ERPNext: {erpNextError}
          </div>
        )}

        <section className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <ProjectForm projectTypes={projectTypes} portfolios={portfolios} />
        </section>

        <section>
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            Project register ({projects.length})
          </h2>
          <div className="mt-4 overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-800">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="bg-zinc-100 text-xs uppercase text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400">
                <tr>
                  <th className="px-4 py-2">Project</th>
                  <th className="px-4 py-2">ERPNext ID</th>
                  <th className="px-4 py-2">Type</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Chat</th>
                  <th className="px-4 py-2">Created</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((p) => {
                  const local = chatByErpNextName.get(p.name);
                  return (
                    <tr key={p.name} className="border-t border-zinc-200 dark:border-zinc-800">
                      <td className="px-4 py-2 font-mono text-xs">{p.project_name}</td>
                      <td className="px-4 py-2 font-mono text-xs text-zinc-500 dark:text-zinc-400">
                        {p.name}
                      </td>
                      <td className="px-4 py-2">{p.project_type ?? "—"}</td>
                      <td className="px-4 py-2">{p.status}</td>
                      <td className="px-4 py-2 text-xs">
                        {local?.chatTopic ? (
                          <span className="font-mono">{local.chatTopic}</span>
                        ) : local?.chatError ? (
                          <span className="text-red-600 dark:text-red-400">failed</span>
                        ) : (
                          <span className="text-zinc-400">—</span>
                        )}
                      </td>
                      <td className="px-4 py-2 text-zinc-500 dark:text-zinc-400">
                        {new Date(p.creation).toLocaleDateString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
