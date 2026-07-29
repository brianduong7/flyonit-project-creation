"use client";

import { useActionState, useState } from "react";
import { createProject, type CreateProjectState } from "@/app/actions";
import { REGIONS, SERVICES, ENGAGEMENT_TYPES, DEPARTMENTS } from "@/lib/naming/constants";
import { PROJECT_TEMPLATE_NAMES } from "@/lib/tasks/templates";

const initialState: CreateProjectState = { status: "idle" };

const inputClass =
  "w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50";
const labelClass = "block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1";

export function ProjectForm({
  projectTypes,
  portfolios,
}: {
  projectTypes: string[];
  portfolios: string[];
}) {
  const [state, formAction, pending] = useActionState(createProject, initialState);
  const [mode, setMode] = useState<"external" | "internal">("external");
  const [deptCode, setDeptCode] = useState<string>(DEPARTMENTS[0].code);
  const [selectedTemplates, setSelectedTemplates] = useState<string[]>([]);

  const availableTemplates = PROJECT_TEMPLATE_NAMES.filter(
    (name) => !selectedTemplates.includes(name)
  );

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <div>
        <label className={labelClass} htmlFor="projectTemplateAdd">
          Project templates
        </label>
        <p className="mb-2 text-xs text-zinc-500 dark:text-zinc-400">
          Optional. Add one or more from the list. Leave none to create no tasks.
          Tasks also include any match for service + engagement type.
        </p>
        <select
          id="projectTemplateAdd"
          className={inputClass}
          value=""
          onChange={(e) => {
            const name = e.target.value;
            if (!name) return;
            setSelectedTemplates((prev) =>
              prev.includes(name) ? prev : [...prev, name]
            );
          }}
        >
          <option value="">
            {availableTemplates.length === 0
              ? "All templates selected"
              : "Add a template…"}
          </option>
          {availableTemplates.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
        {selectedTemplates.map((name) => (
          <input key={name} type="hidden" name="projectTemplates" value={name} />
        ))}
        {selectedTemplates.length > 0 && (
          <ul className="mt-2 flex flex-col gap-1.5">
            {selectedTemplates.map((name) => (
              <li
                key={name}
                className="flex items-center justify-between gap-2 rounded-md border border-zinc-300 px-3 py-1.5 text-sm dark:border-zinc-700"
              >
                <span>{name}</span>
                <button
                  type="button"
                  className="shrink-0 text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
                  onClick={() =>
                    setSelectedTemplates((prev) => prev.filter((n) => n !== name))
                  }
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <fieldset className="flex gap-4 text-sm">
        <legend className={labelClass}>Client type</legend>
        <label className="flex items-center gap-2">
          <input
            type="radio"
            name="clientType"
            checked={mode === "external"}
            onChange={() => setMode("external")}
          />
          External client
        </label>
        <label className="flex items-center gap-2">
          <input
            type="radio"
            name="clientType"
            checked={mode === "internal"}
            onChange={() => setMode("internal")}
          />
          Internal department
        </label>
      </fieldset>

      {mode === "external" ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor="clientOrDeptCode">
              Client code (3-8 letters/numbers)
            </label>
            <input
              id="clientOrDeptCode"
              name="clientOrDeptCode"
              className={`${inputClass} uppercase`}
              maxLength={8}
              minLength={3}
              pattern="[A-Za-z0-9]{3,8}"
              placeholder="ACME"
              required
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="clientOrDeptName">
              Client full name
            </label>
            <input
              id="clientOrDeptName"
              name="clientOrDeptName"
              className={inputClass}
              placeholder="Acme Corporation"
              required
            />
          </div>
        </div>
      ) : (
        <div>
          <label className={labelClass} htmlFor="deptSelect">
            Department
          </label>
          <select
            id="deptSelect"
            className={inputClass}
            value={deptCode}
            onChange={(e) => setDeptCode(e.target.value)}
          >
            {DEPARTMENTS.map((d) => (
              <option key={d.code} value={d.code}>
                {d.code} — {d.label}
              </option>
            ))}
          </select>
          <input type="hidden" name="clientOrDeptCode" value={deptCode} />
          <input
            type="hidden"
            name="clientOrDeptName"
            value={DEPARTMENTS.find((d) => d.code === deptCode)?.label ?? ""}
          />
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <label className={labelClass} htmlFor="region">
            Region
          </label>
          <select id="region" name="region" className={inputClass} required defaultValue="">
            <option value="" disabled>
              Select region
            </option>
            {REGIONS.map((r) => (
              <option key={r.code} value={r.code}>
                {r.code} — {r.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass} htmlFor="service">
            Service
          </label>
          <select id="service" name="service" className={inputClass} required defaultValue="">
            <option value="" disabled>
              Select service
            </option>
            {SERVICES.map((s) => (
              <option key={s.code} value={s.code}>
                {s.code} — {s.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass} htmlFor="engagementType">
            Engagement type
          </label>
          <select
            id="engagementType"
            name="engagementType"
            className={inputClass}
            required
            defaultValue=""
          >
            <option value="" disabled>
              Select type
            </option>
            {ENGAGEMENT_TYPES.map((e) => (
              <option key={e.code} value={e.code}>
                {e.code} — {e.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <label className={labelClass} htmlFor="erpNextProjectType">
            ERPNext project type
          </label>
          <select
            id="erpNextProjectType"
            name="erpNextProjectType"
            className={inputClass}
            required
            defaultValue=""
            disabled={projectTypes.length === 0}
          >
            <option value="" disabled>
              {projectTypes.length === 0 ? "ERPNext unavailable" : "Select project type"}
            </option>
            {projectTypes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass} htmlFor="portfolio">
            Portfolio
          </label>
          <select
            id="portfolio"
            name="portfolio"
            className={inputClass}
            required
            defaultValue=""
            disabled={portfolios.length === 0}
          >
            <option value="" disabled>
              {portfolios.length === 0 ? "ERPNext unavailable" : "Select portfolio"}
            </option>
            {portfolios.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass} htmlFor="scopeTitle">
            Scope title
          </label>
          <input
            id="scopeTitle"
            name="scopeTitle"
            className={inputClass}
            placeholder="Copilot Enablement"
            required
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-zinc-950 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200 sm:w-auto"
      >
        {pending ? "Generating..." : "Generate project code"}
      </button>

      {state.status === "error" && (
        <p className="text-sm text-red-600 dark:text-red-400">{state.message}</p>
      )}

      {state.status === "success" && state.project && (
        <div className="rounded-md border border-emerald-300 bg-emerald-50 p-4 text-sm text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-100">
          <p className="font-mono text-base font-semibold">{state.project.projectCode}</p>
          <p className="mt-1">{state.project.displayName}</p>
          <p className="mt-2 font-mono text-xs opacity-80">{state.project.sharePointPath}</p>
          {state.project.erpNextName && (
            <p className="mt-2 text-xs opacity-80">
              Created in ERPNext as <span className="font-mono">{state.project.erpNextName}</span>
            </p>
          )}
          {state.project.chatTopic && (
            <p className="mt-2 text-xs opacity-80">
              MS Teams group chat <span className="font-mono">{state.project.chatTopic}</span>{" "}
              created (Mahesh, Rani and Purba added)
            </p>
          )}
          {state.project.chatError && (
            <p className="mt-2 text-xs text-red-700 dark:text-red-400">
              Project created, but MS Teams group chat failed: {state.project.chatError}
            </p>
          )}
          {!!state.project.tasksCreated && (
            <p className="mt-2 text-xs opacity-80">
              {state.project.tasksCreated} tasks created from{" "}
              <span className="font-mono">{state.project.taskTemplateCode}</span>
            </p>
          )}
          {!state.project.tasksCreated && !state.project.tasksError && (
            <p className="mt-2 text-xs opacity-80">No project templates selected — no tasks created.</p>
          )}
          {state.project.tasksError && (
            <p className="mt-2 text-xs text-red-700 dark:text-red-400">
              Project created, but task creation failed: {state.project.tasksError}
            </p>
          )}
        </div>
      )}
    </form>
  );
}
