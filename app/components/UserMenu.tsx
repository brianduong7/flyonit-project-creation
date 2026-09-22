"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export function UserMenu({
  email,
  displayName,
}: {
  email: string;
  displayName: string;
}) {
  const [photoOk, setPhotoOk] = useState(true);
  const [exiting, setExiting] = useState(false);
  const label = displayName || email;

  useEffect(() => {
    setPhotoOk(true);
  }, [email]);

  function exitApp() {
    setExiting(true);
    // Full navigation so Set-Cookie from the logout route reliably clears the session.
    window.location.href = "/auth/logout";
  }

  return (
    <div className="group relative">
      <button
        type="button"
        aria-label={`Account menu for ${label}`}
        className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-zinc-300 bg-zinc-200 text-xs font-semibold text-zinc-700 outline-none ring-zinc-400 transition hover:ring-2 focus-visible:ring-2 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
      >
        {photoOk ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src="/api/me/photo"
            alt=""
            className="h-full w-full object-cover"
            onError={() => setPhotoOk(false)}
          />
        ) : (
          <span>{initials(label)}</span>
        )}
      </button>

      <div className="invisible absolute right-0 z-30 w-56 origin-top-right scale-95 pt-2 opacity-0 transition group-hover:visible group-hover:scale-100 group-hover:opacity-100 group-focus-within:visible group-focus-within:scale-100 group-focus-within:opacity-100">
        <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-lg dark:border-zinc-700 dark:bg-zinc-950">
          <div className="border-b border-zinc-200 px-3 py-2 dark:border-zinc-800">
            <p className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-50">
              {label}
            </p>
            <p className="truncate font-mono text-xs text-zinc-500">{email}</p>
          </div>
          <Link
            href="/profile"
            className="block px-3 py-2 text-sm text-zinc-800 hover:bg-zinc-100 dark:text-zinc-100 dark:hover:bg-zinc-900"
          >
            User profile
          </Link>
          <button
            type="button"
            onClick={exitApp}
            disabled={exiting}
            className="block w-full px-3 py-2 text-left text-sm text-zinc-800 hover:bg-zinc-100 disabled:opacity-50 dark:text-zinc-100 dark:hover:bg-zinc-900"
          >
            {exiting ? "Exiting…" : "Exit FORGE"}
          </button>
        </div>
      </div>
    </div>
  );
}
