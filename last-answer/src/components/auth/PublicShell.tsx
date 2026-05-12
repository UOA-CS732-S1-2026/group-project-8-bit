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
  "inline-flex min-h-[clamp(1.55rem,4.4cqh,2.35rem)] items-center justify-center rounded-md border border-amber-300/35 bg-black/48 px-[clamp(0.55rem,1.45cqw,0.95rem)] py-[clamp(0.22rem,0.8cqh,0.45rem)] font-[family-name:var(--font-cinzel)] text-[clamp(0.55rem,0.92cqw,0.74rem)] font-black uppercase tracking-[0.18em] text-amber-50 shadow-[0_8px_18px_rgba(0,0,0,0.35)] transition duration-200 hover:-translate-y-0.5 hover:border-amber-100/70 hover:bg-amber-300/14 active:translate-y-0 active:scale-95";

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
    delay: "2s",
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
];

export function PublicShell({
  title,
  description,
  user = null,
  children,
}: PublicShellProps) {
  return (
    <main className="relative h-full w-full overflow-hidden bg-black text-stone-100 [container-type:size]">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/backgrounds/auth-tavern-entrance.jpg')",
        }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_24%_58%,rgba(245,158,11,0.15),transparent_27%),linear-gradient(90deg,rgba(0,0,0,0.28)_0%,rgba(0,0,0,0.42)_44%,rgba(0,0,0,0.76)_100%),linear-gradient(180deg,rgba(0,0,0,0.38)_0%,rgba(0,0,0,0.1)_44%,rgba(0,0,0,0.72)_100%)]" />

      {EMBERS.map((ember, index) => (
        <span
          key={index}
          className="animate-ember pointer-events-none absolute rounded-full"
          style={
            {
              left: ember.left,
              bottom: ember.bottom,
              width: `${ember.size}px`,
              height: `${ember.size}px`,
              backgroundColor: "#fb923c",
              boxShadow: `0 0 ${ember.size * 2}px #f97316, 0 0 ${ember.size * 4}px #f59e0b`,
              "--ember-duration": ember.duration,
              "--ember-delay": ember.delay,
              "--ember-drift": ember.drift,
            } as React.CSSProperties
          }
        />
      ))}

      <div className="relative z-10 flex h-full w-full flex-col px-[clamp(0.55rem,2.4cqw,1.35rem)] py-[clamp(0.45rem,2.2cqh,1.15rem)]">
        <nav className="flex items-start justify-between gap-3">
          <Link
            href="/"
            className="group flex max-w-[46cqw] items-center gap-[clamp(0.45rem,1.2cqw,0.75rem)]"
          >
            <span className="rounded-md border border-amber-300/35 bg-black/50 px-[clamp(0.5rem,1.3cqw,0.85rem)] py-[clamp(0.24rem,0.8cqh,0.45rem)] font-[family-name:var(--font-cinzel)] text-[clamp(0.55rem,0.95cqw,0.78rem)] font-black uppercase tracking-[0.28em] text-amber-200 transition group-hover:border-amber-100/70">
              Home
            </span>
            <span className="truncate text-[clamp(0.58rem,1.05cqw,0.82rem)] font-semibold text-stone-300">
              The Last Answer: Ashes of The First Monolith
            </span>
          </Link>

          <div className="flex flex-wrap items-center justify-end gap-[clamp(0.3rem,0.8cqw,0.55rem)]">
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
                <LogoutButton showError={false} className={navLinkClass} />
              </>
            )}
          </div>
        </nav>

        <div className="grid min-h-0 flex-1 grid-cols-[minmax(0,0.9fr)_minmax(23rem,0.68fr)] items-center gap-[clamp(0.75rem,2.4cqw,2rem)] pb-[clamp(0.35rem,1.8cqh,1rem)] pt-[clamp(0.25rem,1.4cqh,0.8rem)] max-[760px]:grid-cols-1">
          <section className="min-w-0 self-end pb-[clamp(0.4rem,7cqh,4rem)] max-[760px]:hidden">
            <div className="max-w-[min(40rem,47cqw)] space-y-[clamp(0.65rem,1.8cqh,1.15rem)]">
              <div className="max-w-[min(34rem,42cqw)] border-y border-amber-200/25 bg-black/35 px-[clamp(0.75rem,1.6cqw,1.1rem)] py-[clamp(0.45rem,1.35cqh,0.9rem)] shadow-[0_12px_28px_rgba(0,0,0,0.5)]">
                <p className="font-[family-name:var(--font-cinzel)] text-[clamp(0.86rem,2.15cqw,1.85rem)] font-black uppercase leading-tight tracking-[0.18em] text-amber-100 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                  The Last Answer: Ashes of The First Monolith
                </p>
              </div>
              <div className="max-w-[min(34rem,42cqw)] space-y-[clamp(0.35rem,1.15cqh,0.7rem)]">
                <h1 className="font-[family-name:var(--font-cinzel)] text-[clamp(1.25rem,3.1cqw,3rem)] font-black leading-tight text-stone-50 drop-shadow-[0_3px_10px_rgba(0,0,0,0.85)]">
                  {title}
                </h1>
                <p className="max-w-[31rem] text-[clamp(0.74rem,1.25cqw,1rem)] leading-[1.55] text-stone-200 drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]">
                  {description}
                </p>
              </div>
              <div className="inline-flex max-w-full rounded-md border border-amber-200/20 bg-black/45 px-[clamp(0.7rem,1.4cqw,1rem)] py-[clamp(0.45rem,1.1cqh,0.7rem)] text-[clamp(0.62rem,1cqw,0.8rem)] text-stone-300 shadow-[0_10px_26px_rgba(0,0,0,0.45)]">
                {user
                  ? `Logged in as ${user.username}`
                  : "Create an account to preserve your character and progress."}
              </div>
            </div>
          </section>

          <aside className="flex min-h-0 items-center justify-center max-[760px]:h-full">
            {children}
          </aside>
        </div>
      </div>
    </main>
  );
}
