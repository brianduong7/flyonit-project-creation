import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AUTH_COOKIE, getSession } from "@/lib/auth";
import { getSignedInUserProfile } from "@/lib/msgraph/client";
import { UserMenu } from "@/app/components/UserMenu";
import { ProfileAvatar } from "@/app/components/ProfileAvatar";

export default async function ProfilePage() {
  const cookieStore = await cookies();
  const session = getSession(cookieStore.get(AUTH_COOKIE)?.value);
  if (!session) {
    redirect("/");
  }

  let profile = null;
  let profileError: string | null = null;
  try {
    profile = await getSignedInUserProfile(session.email);
  } catch (err) {
    profileError = err instanceof Error ? err.message : String(err);
  }

  const displayName = profile?.displayName || session.displayName;
  const email = profile?.email || session.email;
  const rows: { label: string; value: string }[] = [
    { label: "Display name", value: displayName },
    { label: "Email", value: email },
    { label: "User principal name", value: profile?.userPrincipalName || email },
    { label: "Given name", value: profile?.givenName || "—" },
    { label: "Surname", value: profile?.surname || "—" },
    { label: "Job title", value: profile?.jobTitle || "—" },
    { label: "Office", value: profile?.officeLocation || "—" },
    { label: "Mobile", value: profile?.mobilePhone || "—" },
  ];

  return (
    <div className="relative flex flex-1 flex-col items-center bg-zinc-50 font-sans dark:bg-black">
      <div className="absolute right-4 top-4 z-20 sm:right-8 sm:top-8">
        <UserMenu email={email} displayName={displayName} />
      </div>

      <main className="flex w-full max-w-3xl flex-1 flex-col gap-8 px-6 py-16 sm:px-10">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
          >
            ← Back to FORGE
          </Link>
          <h1 className="mt-4 font-mono text-3xl font-black uppercase tracking-[0.35em] text-zinc-900 dark:text-zinc-50">
            FORGE
          </h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Microsoft account profile
          </p>
        </div>

        <section className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
            <ProfileAvatar displayName={displayName} />
            <div>
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
                {displayName}
              </h2>
              <p className="font-mono text-sm text-zinc-500">{email}</p>
            </div>
          </div>

          {profileError && (
            <p className="mt-4 text-sm text-amber-700 dark:text-amber-300">
              Could not load full Microsoft profile details: {profileError}
            </p>
          )}

          <dl className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {rows.map((row) => (
              <div key={row.label}>
                <dt className="text-xs uppercase tracking-wide text-zinc-500">{row.label}</dt>
                <dd className="mt-1 text-sm text-zinc-900 dark:text-zinc-50">{row.value}</dd>
              </div>
            ))}
          </dl>
        </section>
      </main>
    </div>
  );
}
