"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { useMCStore } from "@/store/mcStore";

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
    <main className="flex min-h-full w-full flex-col overflow-hidden text-stone-100">
      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-4 pb-8 pt-24 sm:px-6 lg:px-8 lg:pb-10">
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
      </div>
    </main>
  );
}
