"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { useMCStore } from "@/store/mcStore";
import { LogoutButton } from "@/components/auth/LogoutButton";

export function MainHub() {
  const player = useMCStore((state) => state.player);
  const setLocation = useMCStore((state) => state.setLocation);

  useEffect(() => {
    setLocation("mainHub");
  }, [setLocation]);

  const destinations = [
    {
      id: "forest",
      eyebrow: "Wild Route",
      title: "Foggy Forest",
      description:
        "Follow the damp lantern trail into drifting mist, hidden questions, and the first edge of danger.",
      href: "/game/foggyForest",
      image: "/backgrounds/foggy-forest.png",
      accent: "from-emerald-200/70 via-lime-100/20 to-transparent",
      action: "Travel To Forest",
    },
    {
      id: "tavern",
      eyebrow: "Safe Haven",
      title: "Ashen Tavern",
      description:
        "Rest beside the hearth, gather rumors from wandering scholars, and prepare for your next push outward.",
      href: "/game/tavern",
      image: "/backgrounds/Tavern_Background3.png",
      accent: "from-amber-100/75 via-orange-200/20 to-transparent",
      action: "Enter Tavern",
    },
    {
      id: "monolith",
      eyebrow: "High Risk",
      title: "The Monolith",
      description:
        "Approach the fractured pillar where forgotten knowledge hums through the stone and trials answer back.",
      href: "/game/monolith",
      image: "/backgrounds/monolith.png",
      accent: "from-cyan-100/70 via-sky-200/20 to-transparent",
      action: "Approach Monolith",
    },
  ] as const;

  const playerHighlights = [
    { label: "Level", value: player.level, note: "Current mastery" },
    { label: "HP", value: `${player.hp} / ${player.maxHp}`, note: "Vitality" },
    { label: "Experience", value: player.exp, note: "Stored knowledge" },
    { label: "Coins", value: player.coins, note: "Travel provisions" },
  ];

  return (
    <main className="relative flex min-h-full w-full flex-col overflow-hidden bg-[#07110f] text-stone-100">
      <div className="pointer-events-none absolute inset-0">
        <Image
          src="/backgrounds/city-hub.png"
          alt="City hub background"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-30"
        />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(214,192,126,0.14),transparent_30%),linear-gradient(180deg,rgba(5,10,12,0.5)_0%,rgba(4,8,9,0.7)_45%,rgba(3,5,7,0.92)_100%)]" />

      <div className="relative mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-4 pb-8 pt-24 sm:px-6 lg:px-8 lg:pb-10">
        <section className="overflow-hidden rounded-[2rem] border border-amber-100/15 bg-stone-950/55 shadow-[0_30px_120px_rgba(0,0,0,0.45)] backdrop-blur-md">
          <div className="grid gap-0 lg:grid-cols-[1.25fr_0.85fr]">
            <div className="p-6 sm:p-8 lg:p-10">
              <p className="text-xs font-semibold uppercase tracking-[0.42em] text-amber-200/90">
                Main Hub
              </p>
              <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight text-stone-50 sm:text-5xl">
                Chart the next path for {player.name}.
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-stone-300 sm:text-base">
                The city sleeps beneath drifting cinders while three routes stay
                open. Recover strength in the tavern, test your nerve in the
                forest, or face the monolith and whatever knowledge still
                survives inside it.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/game/tavern"
                  className="rounded-full border border-amber-200/35 bg-amber-100/10 px-5 py-3 text-sm font-semibold uppercase tracking-[0.22em] text-amber-50 transition hover:border-amber-100/60 hover:bg-amber-100/18"
                >
                  Rest First
                </Link>
                <Link
                  href="/game/battle"
                  className="rounded-full border border-stone-100/15 bg-stone-100/5 px-5 py-3 text-sm font-semibold uppercase tracking-[0.22em] text-stone-100 transition hover:border-stone-100/35 hover:bg-stone-100/10"
                >
                  Battle Demo
                </Link>
                <LogoutButton className="rounded-full border border-stone-100/15 bg-stone-100/5 px-5 py-3 text-sm font-semibold uppercase tracking-[0.22em] text-stone-100 transition hover:border-stone-100/35 hover:bg-stone-100/10" />
              </div>
            </div>

            <div className="grid gap-px bg-amber-100/10 p-px">
              <div className="grid h-full gap-px bg-stone-950/70 sm:grid-cols-2 lg:grid-cols-1">
                {playerHighlights.map((item) => (
                  <div
                    key={item.label}
                    className="flex min-h-[124px] flex-col justify-between bg-[linear-gradient(180deg,rgba(24,24,24,0.8),rgba(10,10,10,0.92))] p-5"
                  >
                    <span className="text-[11px] font-semibold uppercase tracking-[0.34em] text-stone-400">
                      {item.label}
                    </span>
                    <div>
                      <div className="text-3xl font-semibold text-stone-50">
                        {item.value}
                      </div>
                      <div className="mt-2 text-sm text-stone-400">
                        {item.note}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-5 lg:grid-cols-3">
          {destinations.map((destination) => (
            <Link
              key={destination.id}
              href={destination.href}
              className="group relative min-h-[24rem] overflow-hidden rounded-[2rem] border border-stone-100/10 bg-stone-950/50 shadow-[0_20px_80px_rgba(0,0,0,0.35)]"
            >
              <div className="pointer-events-none absolute inset-0">
                <Image
                  src={destination.image}
                  alt={destination.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  className="object-cover object-center transition duration-500 group-hover:scale-105"
                />
              </div>
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(6,6,6,0.08)_0%,rgba(10,9,9,0.35)_34%,rgba(9,8,7,0.92)_100%)]" />
              <div
                className={`pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b ${destination.accent}`}
              />

              <div className="relative flex h-full flex-col justify-between p-6">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.38em] text-stone-100/85">
                    {destination.eyebrow}
                  </p>
                  <h2 className="mt-4 text-3xl font-semibold text-stone-50">
                    {destination.title}
                  </h2>
                  <p className="mt-3 max-w-sm text-sm leading-6 text-stone-200/80">
                    {destination.description}
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="h-px w-full bg-stone-100/15" />
                  <div className="block w-full rounded-[1.1rem] border border-stone-100/15 bg-stone-950/45 px-4 py-3 text-left text-sm font-semibold uppercase tracking-[0.22em] text-stone-50 transition hover:border-amber-100/45 hover:bg-stone-900/80">
                    {destination.action}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </section>

        <section className="grid gap-4 rounded-[2rem] border border-stone-100/10 bg-stone-950/45 p-5 backdrop-blur-sm lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.36em] text-stone-400">
              Travel Notes
            </p>
            <h2 className="mt-3 text-2xl font-semibold text-stone-50">
              Three destinations, three different moods.
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-stone-300">
              The hub now acts like a real junction: the forest advances the
              adventure, the tavern offers recovery and story space, and the
              monolith is positioned as the dangerous mystery route.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            <Link
              href="/game/foggyForest"
              className="block rounded-[1.25rem] border border-emerald-200/15 bg-emerald-300/5 px-4 py-4 text-left transition hover:bg-emerald-300/10"
            >
              <div className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-100/80">
                Forest
              </div>
              <div className="mt-2 text-sm text-stone-200">
                Best for exploration and progression.
              </div>
            </Link>
            <Link
              href="/game/tavern"
              className="block rounded-[1.25rem] border border-amber-200/15 bg-amber-200/5 px-4 py-4 text-left transition hover:bg-amber-200/10"
            >
              <div className="text-xs font-semibold uppercase tracking-[0.28em] text-amber-100/80">
                Tavern
              </div>
              <div className="mt-2 text-sm text-stone-200">
                Best for regrouping and interaction.
              </div>
            </Link>
            <Link
              href="/game/monolith"
              className="block rounded-[1.25rem] border border-cyan-200/15 bg-cyan-200/5 px-4 py-4 text-left transition hover:bg-cyan-200/10"
            >
              <div className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-100/80">
                Monolith
              </div>
              <div className="mt-2 text-sm text-stone-200">
                Best for high-stakes mystery and trial.
              </div>
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
