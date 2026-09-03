"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { createProject, type CreateProjectState } from "@/app/actions";
import { REGIONS, SERVICES, ENGAGEMENT_TYPES, DEPARTMENTS } from "@/lib/naming/constants";
import { PROJECT_TEMPLATE_NAMES } from "@/lib/tasks/templates";

const initialState: CreateProjectState = { status: "idle" };

const inputClass =
  "w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50";
const labelClass = "block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1";

type DirectoryUser = { displayName: string; email: string };

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
  const [extraUsers, setExtraUsers] = useState<string[]>([]);
  const [userDraft, setUserDraft] = useState("");
  const [suggestions, setSuggestions] = useState<DirectoryUser[]>([]);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [highlight, setHighlight] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const searchBoxRef = useRef<HTMLDivElement>(null);

  const availableTemplates = PROJECT_TEMPLATE_NAMES.filter(
    (name) => !selectedTemplates.includes(name)
  );

  function addExtraUser(email: string) {
    const normalized = email.trim().toLowerCase();
    if (!normalized || !normalized.includes("@")) return;
    setExtraUsers((prev) => (prev.includes(normalized) ? prev : [...prev, normalized]));
    setUserDraft("");
    setSuggestions([]);
    setMenuOpen(false);
    setSearchError(null);
  }

  useEffect(() => {
    const q = userDraft.trim();
    if (q.length < 2) {
      setSuggestions([]);
      setSearching(false);
      setSearchError(null);
      return;
    }

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setSearching(true);
      setSearchError(null);
      try {
        const res = await fetch(`/api/users/search?q=${encodeURIComponent(q)}`, {
          signal: controller.signal,
        });
        const body = await res.json().catch(() => null);
        if (!res.ok) {
          throw new Error(body?.error || `Search failed (${res.status})`);
        }
        const users = ((body?.users ?? []) as DirectoryUser[]).filter(
          (u) => !extraUsers.includes(u.email.toLowerCase())
        );
        setSuggestions(users);
        setHighlight(0);
        setMenuOpen(true);
      } catch (err) {
        if ((err as Error).name === "AbortError") return;
        setSuggestions([]);
        setSearchError(err instanceof Error ? err.message : "Search failed");
      } finally {
        setSearching(false);
      }
    }, 250);

    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [userDraft, extraUsers]);

  useEffect(() => {
    function onPointerDown(event: MouseEvent) {
      if (!searchBoxRef.current?.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, []);

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

      <div>
        <label className={labelClass} htmlFor="extraUserAdd">
          Pre-add users
        </label>
        <p className="mb-2 text-xs text-zinc-500 dark:text-zinc-400">
          Optional. Besides Mahesh, Rani and Purba, search Microsoft users to add
          to the ERPNext project (so they can see its tasks) and the Teams group
          chat.
        </p>
        <div className="relative" ref={searchBoxRef}>
          <input
            id="extraUserAdd"
            type="text"
            autoComplete="off"
            value={userDraft}
            onChange={(e) => {
              setUserDraft(e.target.value);
              setMenuOpen(true);
            }}
            onFocus={() => {
              if (suggestions.length > 0) setMenuOpen(true);
            }}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown" && suggestions.length > 0) {
                e.preventDefault();
                setMenuOpen(true);
                setHighlight((i) => (i + 1) % suggestions.length);
                return;
              }
              if (e.key === "ArrowUp" && suggestions.length > 0) {
                e.preventDefault();
                setMenuOpen(true);
                setHighlight((i) => (i - 1 + suggestions.length) % suggestions.length);
                return;
              }
              if (e.key === "Enter") {
                e.preventDefault();
                if (menuOpen && suggestions[highlight]) {
                  addExtraUser(suggestions[highlight].email);
                } else {
                  addExtraUser(userDraft);
                }
                return;
              }
              if (e.key === "Escape") {
                setMenuOpen(false);
              }
            }}
            className={inputClass}
            placeholder="Search name or email…"
          />
          {menuOpen && (searching || suggestions.length > 0 || searchError) && (
            <ul className="absolute z-20 mt-1 max-h-56 w-full overflow-auto rounded-md border border-zinc-300 bg-white py-1 shadow-lg dark:border-zinc-700 dark:bg-zinc-900">
              {searching && (
                <li className="px-3 py-2 text-xs text-zinc-500">Searching…</li>
              )}
              {searchError && !searching && (
                <li className="px-3 py-2 text-xs text-red-600 dark:text-red-400">
                  {searchError}
                </li>
              )}
              {!searching &&
                !searchError &&
                suggestions.length === 0 &&
                userDraft.trim().length >= 2 && (
                  <li className="px-3 py-2 text-xs text-zinc-500">No users found</li>
                )}
              {suggestions.map((user, index) => (
                <li key={user.email}>
                  <button
                    type="button"
                    className={`flex w-full flex-col items-start px-3 py-2 text-left text-sm ${
                      index === highlight
                        ? "bg-zinc-100 dark:bg-zinc-800"
                        : "hover:bg-zinc-50 dark:hover:bg-zinc-800/70"
                    }`}
                    onMouseEnter={() => setHighlight(index)}
                    onClick={() => addExtraUser(user.email)}
                  >
                    <span className="text-zinc-900 dark:text-zinc-50">{user.displayName}</span>
                    <span className="font-mono text-xs text-zinc-500">{user.email}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        {extraUsers.map((email) => (
          <input key={email} type="hidden" name="extraUsers" value={email} />
        ))}
        {extraUsers.length > 0 && (
          <ul className="mt-2 flex flex-col gap-1.5">
            {extraUsers.map((email) => (
              <li
                key={email}
                className="flex items-center justify-between gap-2 rounded-md border border-zinc-300 px-3 py-1.5 text-sm dark:border-zinc-700"
              >
                <span className="font-mono text-xs">{email}</span>
                <button
                  type="button"
                  className="shrink-0 text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
                  onClick={() =>
                    setExtraUsers((prev) => prev.filter((e) => e !== email))
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
          {state.project.sharePointUrl ? (
            <p className="mt-2 text-xs opacity-80">
              SharePoint folder:{" "}
              <a
                href={state.project.sharePointUrl}
                target="_blank"
                rel="noreferrer"
                className="underline"
              >
                {state.project.sharePointPath}
              </a>
            </p>
          ) : (
            <p className="mt-2 font-mono text-xs opacity-80">{state.project.sharePointPath}</p>
          )}
          {state.project.sharePointError && (
            <p className="mt-2 text-xs text-red-700 dark:text-red-400">
              Project created, but SharePoint folder failed: {state.project.sharePointError}
            </p>
          )}
          {state.project.chatTabError && (
            <p className="mt-2 text-xs text-amber-800 dark:text-amber-300">
              SharePoint folder is ready. Adding the Website tab in Teams needs
              TeamsTab.ReadWriteForChat.All (waiting on admin): {state.project.chatTabError}
            </p>
          )}
          {state.project.erpNextName && (
            <p className="mt-2 text-xs opacity-80">
              Created in ERPNext as <span className="font-mono">{state.project.erpNextName}</span>
            </p>
          )}
          {state.project.chatTopic && (
            <p className="mt-2 text-xs opacity-80">
              MS Teams group chat <span className="font-mono">{state.project.chatTopic}</span>{" "}
              created (Mahesh, Rani and Purba
              {state.project.extraUsers?.length
                ? `, plus ${state.project.extraUsers.join(", ")}`
                : ""}{" "}
              added)
            </p>
          )}
          {state.project.usersError && (
            <p className="mt-2 text-xs text-amber-800 dark:text-amber-300">
              Project created, but some users could not be assigned in ERPNext:{" "}
              {state.project.usersError}
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
