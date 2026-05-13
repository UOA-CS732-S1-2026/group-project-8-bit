"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { AuthUser } from "@/lib/auth-shared";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { resumeMainInterfaceMusic } from "@/lib/mainInterfaceMusic";

type HomePageClientProps = {
  user: AuthUser | null;
};

const authButtonClass =
  "inline-flex min-h-[clamp(1.25rem,5cqh,2.5rem)] items-center justify-center rounded-lg border border-lime-200/35 bg-black/45 px-[clamp(0.45rem,1.6cqw,1rem)] py-[clamp(0.25rem,1cqh,0.5rem)] text-[clamp(0.5rem,1.15cqw,0.875rem)] font-semibold leading-none text-lime-50 shadow-[0_8px_18px_rgba(0,0,0,0.32)] transition duration-200 hover:-translate-y-0.5 hover:border-lime-100/70 hover:bg-lime-300/15 active:translate-y-0 active:scale-95 font-[family-name:var(--font-cinzel)]";

const modeButtonClass =
  "inline-flex items-center justify-center rounded-xl border border-amber-400/60 bg-black/55 font-bold tracking-widest text-amber-100 backdrop-blur-[2px] transition-transform duration-300 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 w-[clamp(5.25rem,18cqw,18rem)] min-h-[clamp(1.35rem,7cqh,4.2rem)] px-[clamp(0.35rem,2.2cqw,1.5rem)] py-[clamp(0.2rem,1.6cqh,1rem)] text-[clamp(0.45rem,1.45cqw,1.25rem)] leading-none font-[family-name:var(--font-cinzel)]";

type EmberConfig = {
  left: string;
  bottom: string;
  delay: string;
  duration: string;
  drift: string;
  size: number;
};

const EMBERS: EmberConfig[] = [
  {
    left: "8%",
    bottom: "2%",
    delay: "0s",
    duration: "7s",
    drift: "25px",
    size: 3,
  },
  {
    left: "14%",
    bottom: "5%",
    delay: "1.5s",
    duration: "5.5s",
    drift: "-20px",
    size: 2.5,
  },
  {
    left: "22%",
    bottom: "1%",
    delay: "0.8s",
    duration: "8s",
    drift: "30px",
    size: 4,
  },
  {
    left: "31%",
    bottom: "3%",
    delay: "2.3s",
    duration: "6s",
    drift: "-15px",
    size: 2,
  },
  {
    left: "38%",
    bottom: "2%",
    delay: "0.3s",
    duration: "9s",
    drift: "20px",
    size: 3,
  },
  {
    left: "45%",
    bottom: "4%",
    delay: "1.8s",
    duration: "6.5s",
    drift: "-25px",
    size: 2.5,
  },
  {
    left: "52%",
    bottom: "1%",
    delay: "3.1s",
    duration: "7.5s",
    drift: "15px",
    size: 3,
  },
  {
    left: "60%",
    bottom: "3%",
    delay: "0.6s",
    duration: "5s",
    drift: "-30px",
    size: 2,
  },
  {
    left: "67%",
    bottom: "2%",
    delay: "2.0s",
    duration: "8.5s",
    drift: "25px",
    size: 4,
  },
  {
    left: "75%",
    bottom: "5%",
    delay: "1.2s",
    duration: "6s",
    drift: "-20px",
    size: 2.5,
  },
  {
    left: "82%",
    bottom: "1%",
    delay: "3.5s",
    duration: "7s",
    drift: "30px",
    size: 3,
  },
  {
    left: "88%",
    bottom: "3%",
    delay: "0.9s",
    duration: "5.5s",
    drift: "-15px",
    size: 2,
  },
  {
    left: "93%",
    bottom: "2%",
    delay: "4.2s",
    duration: "8s",
    drift: "20px",
    size: 3,
  },
  {
    left: "12%",
    bottom: "4%",
    delay: "2.8s",
    duration: "6.5s",
    drift: "-25px",
    size: 2.5,
  },
  {
    left: "28%",
    bottom: "1%",
    delay: "1.0s",
    duration: "9s",
    drift: "15px",
    size: 4,
  },
  {
    left: "42%",
    bottom: "2%",
    delay: "3.8s",
    duration: "5s",
    drift: "-30px",
    size: 2,
  },
  {
    left: "58%",
    bottom: "5%",
    delay: "0.4s",
    duration: "7.5s",
    drift: "25px",
    size: 3,
  },
  {
    left: "72%",
    bottom: "3%",
    delay: "2.5s",
    duration: "6s",
    drift: "-20px",
    size: 2.5,
  },
  {
    left: "86%",
    bottom: "1%",
    delay: "1.7s",
    duration: "8.5s",
    drift: "30px",
    size: 3,
  },
  {
    left: "5%",
    bottom: "2%",
    delay: "3.2s",
    duration: "7s",
    drift: "-15px",
    size: 2,
  },
  {
    left: "96%",
    bottom: "4%",
    delay: "0.2s",
    duration: "6.5s",
    drift: "20px",
    size: 4,
  },
  {
    left: "18%",
    bottom: "1%",
    delay: "4.5s",
    duration: "5.5s",
    drift: "-25px",
    size: 2.5,
  },
  {
    left: "35%",
    bottom: "3%",
    delay: "2.1s",
    duration: "8s",
    drift: "15px",
    size: 3,
  },
  {
    left: "50%",
    bottom: "2%",
    delay: "1.4s",
    duration: "6s",
    drift: "-30px",
    size: 2,
  },
  {
    left: "78%",
    bottom: "5%",
    delay: "3.6s",
    duration: "9s",
    drift: "25px",
    size: 4,
  },
  {
    left: "10%",
    bottom: "3%",
    delay: "5.0s",
    duration: "6s",
    drift: "18px",
    size: 3,
  },
  {
    left: "20%",
    bottom: "1%",
    delay: "4.8s",
    duration: "7.5s",
    drift: "-22px",
    size: 2,
  },
  {
    left: "33%",
    bottom: "4%",
    delay: "5.3s",
    duration: "5s",
    drift: "28px",
    size: 3.5,
  },
  {
    left: "47%",
    bottom: "2%",
    delay: "4.1s",
    duration: "8s",
    drift: "-18px",
    size: 2.5,
  },
  {
    left: "55%",
    bottom: "3%",
    delay: "5.7s",
    duration: "6.5s",
    drift: "22px",
    size: 3,
  },
  {
    left: "63%",
    bottom: "1%",
    delay: "4.6s",
    duration: "7s",
    drift: "-28px",
    size: 2,
  },
  {
    left: "70%",
    bottom: "4%",
    delay: "5.2s",
    duration: "5.5s",
    drift: "18px",
    size: 3.5,
  },
  {
    left: "80%",
    bottom: "2%",
    delay: "4.9s",
    duration: "8.5s",
    drift: "-22px",
    size: 2.5,
  },
  {
    left: "91%",
    bottom: "3%",
    delay: "5.5s",
    duration: "6s",
    drift: "25px",
    size: 3,
  },
  {
    left: "3%",
    bottom: "1%",
    delay: "4.3s",
    duration: "7.5s",
    drift: "-18px",
    size: 2,
  },
];

export function HomePageClient({ user }: HomePageClientProps) {
  const router = useRouter();
  const playerName = user?.username || user?.id || null;

  function handleModeClick(mode: "Story Mode" | "Arcade Mode") {
    resumeMainInterfaceMusic();

    if (mode === "Story Mode") {
      router.push("/game");
      return;
    }
    router.push("/arcade");
  }

  return (
    <main className="relative h-full w-full overflow-hidden bg-black text-stone-50 [container-type:size]">
      {/* 背景层 */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/backgrounds/game-cover.jpg')" }}
      />

      {/* 火星粒子层 */}
      {EMBERS.map((e, i) => (
        <span
          key={i}
          className="animate-ember pointer-events-none absolute rounded-full"
          style={
            {
              left: e.left,
              bottom: e.bottom,
              width: `${e.size}px`,
              height: `${e.size}px`,
              backgroundColor: "#fb923c",
              boxShadow: `0 0 ${e.size * 2}px #f97316, 0 0 ${e.size * 4}px #f59e0b`,
              "--ember-duration": e.duration,
              "--ember-delay": e.delay,
              "--ember-drift": e.drift,
            } as React.CSSProperties
          }
        />
      ))}

      {/* 内容层 */}
      <div className="relative z-10 flex h-full w-full flex-col px-[clamp(0.5rem,3cqw,2rem)] py-[clamp(0.4rem,3cqh,1.5rem)]">
        <header className="flex items-start justify-end">
          {!user ? (
            <Link href="/login?returnTo=%2F" className={authButtonClass}>
              Login
            </Link>
          ) : (
            <div className="flex items-center gap-[clamp(0.3rem,1.2cqw,0.75rem)] rounded-lg border border-stone-100/18 bg-black/45 px-[clamp(0.4rem,1.5cqw,0.75rem)] py-[clamp(0.25rem,1cqh,0.5rem)] shadow-[0_8px_18px_rgba(0,0,0,0.32)]">
              <span className="max-w-[clamp(5rem,16cqw,16rem)] truncate font-[family-name:var(--font-cinzel)] text-[clamp(0.5rem,1.15cqw,0.875rem)] font-semibold leading-none text-stone-100">
                {playerName}
              </span>
              <LogoutButton className={authButtonClass} showError={false} />
            </div>
          )}
        </header>

        <section className="flex flex-1 flex-col items-end justify-end pb-[clamp(0.6rem,9cqh,5rem)] text-center">
          <div className="flex w-full flex-col items-center gap-[clamp(0.25rem,2.2cqh,1.25rem)]">
            <button
              type="button"
              onClick={() => handleModeClick("Story Mode")}
              className={modeButtonClass}
              style={{
                animation:
                  "btn-enter 1.1s cubic-bezier(0.16,1,0.3,1) 0.1s both, border-pulse 3s ease-in-out 1.2s infinite",
              }}
            >
              Story Mode
            </button>

            <button
              type="button"
              onClick={() => handleModeClick("Arcade Mode")}
              className={modeButtonClass}
              style={{
                animation:
                  "btn-enter 1.1s cubic-bezier(0.16,1,0.3,1) 0.3s both, border-pulse 3s ease-in-out 1.4s infinite",
              }}
            >
              Arcade Mode
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
