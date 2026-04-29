"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { useMCStore } from "@/store/mcStore";

export function MainHub() {
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
      actionTone: "text-emerald-800 group-hover:text-emerald-700",
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
      actionTone: "text-orange-800 group-hover:text-orange-700",
    },
  ] as const;

  return (
    <main className="w-full overflow-hidden px-[clamp(0.45rem,2cqw,1.25rem)] pb-[clamp(0.25rem,1.2cqw,0.75rem)] text-stone-100 [container-type:inline-size]">
      <div className="mx-auto w-full max-w-5xl">
        <section className="grid grid-cols-2 gap-[clamp(0.45rem,2cqw,1.25rem)]">
          {destinations.map((destination) => (
            <Link
              key={destination.id}
              href={destination.href}
              className="group relative min-w-0 overflow-hidden rounded-lg bg-[url('/panels/interact-panel.png')] bg-[length:100%_100%] bg-center bg-no-repeat p-[clamp(0.3rem,1.3cqw,0.85rem)] shadow-[0_12px_36px_rgba(0,0,0,0.48)] transition duration-200 hover:-translate-y-0.5 hover:brightness-110 active:translate-y-0 active:scale-[0.98]"
            >
              <div className="relative h-[clamp(3.75rem,18cqw,13rem)] overflow-hidden rounded-md border border-amber-100/25 bg-stone-950/70">
                <Image
                  src={destination.image}
                  alt={destination.title}
                  fill
                  sizes="(max-width: 640px) 50vw, 480px"
                  className="object-cover object-center transition duration-500 group-hover:scale-105"
                />
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(6,6,6,0.05)_0%,rgba(11,8,5,0.18)_42%,rgba(9,7,5,0.84)_100%)]" />
                <div
                  className={`pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b sm:h-24 ${destination.accent}`}
                />
                <div className="absolute inset-x-2 bottom-2 min-w-0 sm:inset-x-4 sm:bottom-4">
                  <p className="truncate text-[0.52rem] font-semibold uppercase tracking-[0.16em] text-amber-100/90 sm:text-xs sm:tracking-[0.22em]">
                    {destination.eyebrow}
                  </p>
                  <h2 className="mt-0.5 truncate font-[family-name:var(--font-cinzel)] text-xs font-black text-stone-50 sm:mt-1 sm:text-2xl">
                    {destination.title}
                  </h2>
                </div>
              </div>
              <p className="mt-2 hidden min-h-10 overflow-hidden px-2 text-sm leading-5 text-amber-100/82 lg:line-clamp-2">
                {destination.description}
              </p>
              <div
                className={`mt-[clamp(0.22rem,0.9cqw,0.5rem)] flex min-h-[clamp(1.55rem,5.6cqw,2.75rem)] items-center justify-center bg-[url('/buttons/parchment-btn.png')] bg-[length:100%_100%] bg-center bg-no-repeat px-2 text-center font-[family-name:var(--font-cinzel)] text-[0.52rem] font-black uppercase tracking-[0.12em] drop-shadow-[0_1px_0_rgba(255,244,190,0.72)] transition-colors sm:text-xs sm:tracking-[0.16em] ${destination.actionTone}`}
              >
                {destination.action}
              </div>
            </Link>
          ))}
        </section>
      </div>
    </main>
  );
}
