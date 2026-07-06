"use client";

import { useActionState } from "react";
import { login } from "@/app/login-action";
import type { LoginState } from "@/lib/auth";

const initialState: LoginState = { status: "idle" };

export function PasscodeLogin() {
  const [state, formAction, pending] = useActionState(login, initialState);

  return (
    <div className="flex flex-1 items-center justify-center bg-zinc-50 px-6 font-sans dark:bg-black">
      <form
        action={formAction}
        className="flex w-full max-w-xs flex-col gap-4 rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
      >
        <div>
          <h1 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            FLYONIT Project Creation
          </h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Enter the passcode to continue.
          </p>
        </div>
        <input
          type="password"
          inputMode="numeric"
          pattern="[0-9]{4}"
          maxLength={4}
          name="code"
          autoFocus
          required
          placeholder="••••"
          className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-center text-lg tracking-[0.5em] text-zinc-900 shadow-sm focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
        />
        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-full bg-zinc-950 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
        >
          {pending ? "Checking..." : "Unlock"}
        </button>
        {state.status === "error" && (
          <p className="text-sm text-red-600 dark:text-red-400">{state.message}</p>
        )}
      </form>
    </div>
  );
}
