"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { AuthUser } from "@/lib/auth-shared";
import { LogoutButton } from "@/components/auth/LogoutButton";

type HomePageClientProps = {
  user: AuthUser | null;
};

const authButtonClass =
  "inline-flex min-h-10 items-center justify-center rounded-lg border border-lime-200/35 bg-black/45 px-4 py-2 text-sm font-semibold text-lime-50 shadow-[0_8px_18px_rgba(0,0,0,0.32)] transition duration-200 hover:-translate-y-0.5 hover:border-lime-100/70 hover:bg-lime-300/15 active:translate-y-0 active:scale-95";

const modeButtonClass =
  "group relative inline-flex min-h-16 w-56 items-center justify-center overflow-hidden rounded-lg border border-cyan-100/35 bg-black/55 px-6 py-4 text-lg font-bold text-stone-50 shadow-[0_16px_32px_rgba(0,0,0,0.45)] transition duration-200 hover:-translate-y-1 hover:scale-[1.03] hover:border-cyan-100/80 hover:bg-cyan-300/15 active:translate-y-0 active:scale-95 sm:w-64 sm:text-xl";

export function HomePageClient({ user }: HomePageClientProps) {
  const router = useRouter();
  const playerName = user?.username || user?.id || null;

  function handleModeClick(mode: "Story Mode" | "Arcade Mode") {
    if (mode === "Story Mode") {
      router.push("/game");
      return;
    }

    router.push("/arcade");
  }

  return (
    <main className="relative h-full w-full overflow-hidden bg-black text-stone-50">
      <div className="relative z-10 flex h-full w-full flex-col px-5 py-4 sm:px-8 sm:py-6">
        <header className="flex items-start justify-end">
          {!user ? (
            <Link href="/login?returnTo=%2F" className={authButtonClass}>
              Login
            </Link>
          ) : (
            <div className="flex items-center gap-3 rounded-lg border border-stone-100/18 bg-black/45 px-3 py-2 shadow-[0_8px_18px_rgba(0,0,0,0.32)]">
              <span className="max-w-48 truncate text-sm font-semibold text-stone-100 sm:max-w-64">
                {playerName}
              </span>
              <LogoutButton className={authButtonClass} showError={false} />
            </div>
          )}
        </header>

        <section className="flex flex-1 flex-col items-center justify-center gap-8 pb-8 text-center sm:gap-10">
          <div className="w-full max-w-[36rem] px-2">
            <h1>The Last Answer</h1>
          </div>

          <div className="flex flex-col items-center gap-4 sm:gap-6">
            <button
              type="button"
              onClick={() => handleModeClick("Story Mode")}
              className={modeButtonClass}
            >
              Story Mode
            </button>

            <button
              type="button"
              onClick={() => handleModeClick("Arcade Mode")}
              className={modeButtonClass}
            >
              Arcade Mode
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
