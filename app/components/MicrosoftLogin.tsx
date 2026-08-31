export function MicrosoftLogin({ error }: { error?: string }) {
  return (
    <div className="flex flex-1 items-center justify-center bg-zinc-50 px-6 font-sans dark:bg-black">
      <div className="flex w-full max-w-sm flex-col gap-4 rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <div>
          <h1 className="font-mono text-2xl font-black uppercase tracking-[0.3em] text-zinc-900 dark:text-zinc-50">
            FORGE
          </h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Sign in with your approved FLYONIT Microsoft account.
          </p>
        </div>
        <a
          href="/auth/login"
          className="w-full rounded-full bg-zinc-950 px-5 py-2.5 text-center text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
        >
          Sign in with Microsoft
        </a>
        {error && (
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        )}
      </div>
    </div>
  );
}
