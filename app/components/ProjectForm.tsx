"use client";

import { useActionState, useState } from "react";
import { createProject, type CreateProjectState } from "@/app/actions";
import {
  REGIONS,
  SERVICES,
  ENGAGEMENT_TYPES,
  DEPARTMENTS,
  ERPNEXT_PROJECT_TYPES,
} from "@/lib/naming/constants";

const initialState: CreateProjectState = { status: "idle" };

const inputClass =
  "w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50";
const labelClass = "block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1";

export function ProjectForm() {
  const [state, formAction, pending] = useActionState(createProject, initialState);
  const [mode, setMode] = useState<"external" | "internal">("external");
  const [deptCode, setDeptCode] = useState<string>(DEPARTMENTS[0].code);

  return (
    <form action={formAction} className="flex flex-col gap-5">
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

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
          >
            <option value="" disabled>
              Select project type
            </option>
            {ERPNEXT_PROJECT_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
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
        </div>
      )}
    </form>
  );
}
