import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import type { AuthUser } from "@/lib/auth-shared";
import { LogoutButton } from "./LogoutButton";

type PublicShellProps = {
  title: string;
  description: string;
  user?: AuthUser | null;
  children: ReactNode;
};

const navLinkClass =
  "rounded-full border border-amber-200/25 bg-stone-950/50 px-4 py-2 text-sm font-semibold tracking-[0.18em] text-stone-100 transition hover:border-amber-200/60 hover:bg-amber-300/10";

export function PublicShell({
  title,
  description,
  user = null,
  children,
}: PublicShellProps) {
  return (
    <main className="h-full w-full overflow-hidden bg-[radial-gradient(circle_at_top,#204735_0%,#101718_42%,#090b0f_100%)] text-stone-100">
      <div className="mx-auto flex h-full w-full max-w-7xl flex-col px-4 py-4 sm:px-6 lg:px-8">
        <nav className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-amber-200/20 bg-stone-950/45 px-4 py-3 shadow-2xl shadow-black/30">
          <Link href="/" className="flex items-center gap-3">
            <div className="rounded-2xl border border-amber-200/30 bg-black/35 px-3 py-2">
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-200">
                Oracle
              </span>
            </div>
            <span className="text-sm text-stone-300">
              The Oracle of Lost Knowledge
            </span>
          </Link>

          <div className="flex flex-wrap items-center gap-2">
            <Link href="/" className={navLinkClass}>
              Home
            </Link>
            {!user ? (
              <>
                <Link href="/login" className={navLinkClass}>
                  Login
                </Link>
                <Link href="/register" className={navLinkClass}>
                  Register
                </Link>
              </>
            ) : (
              <>
                <Link href="/game/mainHub" className={navLinkClass}>
                  Continue
                </Link>
                <LogoutButton
                  showError={false}
                  className={navLinkClass}
                />
              </>
            )}
          </div>
        </nav>

        <div className="grid flex-1 gap-6 py-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(20rem,0.85fr)]">
          <section className="relative overflow-hidden rounded-[2rem] border border-amber-100/10 bg-stone-950/45 p-6 shadow-2xl shadow-black/25 sm:p-8">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(251,191,36,0.14),transparent_32%),radial-gradient(circle_at_bottom_left,rgba(34,197,94,0.18),transparent_30%)]" />
            <div className="relative flex h-full flex-col justify-between gap-8">
              <div className="space-y-6">
                <div className="space-y-2">
                  <p className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-200/90">
                    Quiz RPG MVP
                  </p>
                  <div className="relative overflow-hidden rounded-[1.5rem] border border-amber-100/10 bg-black/30 p-4">
                    <Image
                      src="/banners/game-title-banner.png"
                      alt="The Oracle of Lost Knowledge"
                      width={1200}
                      height={300}
                      className="h-auto w-full"
                      priority
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h1 className="max-w-3xl text-3xl font-semibold text-stone-50 sm:text-4xl lg:text-5xl">
                    {title}
                  </h1>
                  <p className="max-w-2xl text-base leading-7 text-stone-300 sm:text-lg">
                    {description}
                  </p>
                </div>

                <div className="grid gap-3 text-sm text-stone-300 sm:grid-cols-3">
                  <div className="rounded-2xl border border-emerald-300/15 bg-emerald-400/8 p-4">
                    Persistent identity backed by PostgreSQL
                  </div>
                  <div className="rounded-2xl border border-amber-300/15 bg-amber-400/8 p-4">
                    Session-based login across refreshes
                  </div>
                  <div className="rounded-2xl border border-sky-300/15 bg-sky-400/8 p-4">
                    Player progress synced into the game store
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-sm text-stone-300">
                {user ? (
                  <span className="rounded-full border border-emerald-200/20 bg-emerald-400/10 px-4 py-2">
                    Logged in as {user.username}
                  </span>
                ) : (
                  <span className="rounded-full border border-stone-200/15 bg-stone-100/5 px-4 py-2">
                    Create an account to preserve your character and progress.
                  </span>
                )}
              </div>
            </div>
          </section>

          <aside className="flex min-h-0">{children}</aside>
        </div>
      </div>
    </main>
  );
}

