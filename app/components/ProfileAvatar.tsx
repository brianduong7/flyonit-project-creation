"use client";

import { useState } from "react";

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export function ProfileAvatar({
  displayName,
  sizeClass = "h-20 w-20 text-lg",
}: {
  displayName: string;
  sizeClass?: string;
}) {
  const [photoOk, setPhotoOk] = useState(true);

  return (
    <div
      className={`flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-zinc-300 bg-zinc-200 font-semibold text-zinc-700 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100 ${sizeClass}`}
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
        <span>{initials(displayName)}</span>
      )}
    </div>
  );
}
