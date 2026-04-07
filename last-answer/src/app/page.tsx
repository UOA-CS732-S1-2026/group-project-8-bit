import Link from "next/link";
import { PublicShell } from "@/components/auth/PublicShell";
import { getCurrentSession } from "@/lib/auth";

const primaryButtonClass =
  "inline-flex items-center justify-center rounded-2xl border border-amber-300/35 bg-amber-400/15 px-5 py-3 text-sm font-semibold uppercase tracking-[0.24em] text-amber-100 transition hover:border-amber-200/60 hover:bg-amber-300/20";

const secondaryButtonClass =
  "inline-flex items-center justify-center rounded-2xl border border-stone-300/20 bg-stone-100/5 px-5 py-3 text-sm font-semibold uppercase tracking-[0.24em] text-stone-100 transition hover:border-stone-100/40 hover:bg-stone-100/10";

export default async function Home() {
  const session = await getCurrentSession();

  return (
    <PublicShell
      user={session?.user ?? null}
      title="Recover lost knowledge, one battle at a time"
      description="Build a persistent player identity, re-enter the main hub on every visit, and keep your progress synced while the team continues filling out the world."
    >
      <div className="flex w-full flex-1 flex-col justify-between rounded-[2rem] border border-amber-100/10 bg-stone-950/55 p-6 shadow-2xl shadow-black/30 sm:p-8">
        <div className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-amber-200">
            Current MVP flow
          </p>
          <h2 className="text-2xl font-semibold text-stone-50">
            Login, enter the hub, then continue into the game world.
          </h2>
          <p className="text-sm leading-6 text-stone-300">
            This authentication layer now creates a real user, stores a secure
            password hash, opens a session cookie, and links your account to a
            persistent player save.
          </p>
        </div>

        <div className="mt-8 grid gap-4">
          {session ? (
            <>
              <Link href="/game/mainHub" className={primaryButtonClass}>
                Continue Game
              </Link>
              <Link href="/game/battle" className={secondaryButtonClass}>
                Open Battle Demo
              </Link>
            </>
          ) : (
            <>
              <Link href="/register" className={primaryButtonClass}>
                Create Account
              </Link>
              <Link href="/login" className={secondaryButtonClass}>
                Login
              </Link>
            </>
          )}
        </div>
      </div>
    </PublicShell>
  );
}
