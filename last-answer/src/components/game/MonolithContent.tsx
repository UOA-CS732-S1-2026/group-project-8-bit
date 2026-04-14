"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMCStore } from "@/store/mcStore";
import GameMainFooter from "./GameMainFooter";

export default function MonolithContent() {
  const router = useRouter();
  const player = useMCStore((state) => state.player);
  const setLocation = useMCStore((state) => state.setLocation);

  useEffect(() => {
    setLocation("monolith");
  }, [setLocation]);

  return (
    <main className="min-h-screen text-stone-100">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,6,12,0.04)_0%,rgba(3,6,11,0.08)_45%,rgba(2,4,8,0.16)_100%)]" />

      <div className="absolute inset-0 flex flex-col px-4 pb-4 pt-0 md:px-6 md:pb-6 md:pt-0">
        <section className="flex flex-1 flex-col pt-6">
          <div className="flex-1" />

          <div className="space-y-4">
            <div className="grid gap-3 md:grid-cols-3">
              <button
                type="button"
                onClick={() => router.push("/game/mainHub")}
                aria-label="Return to hub"
                className="relative min-h-[10rem] overflow-hidden rounded-[1.35rem] border border-cyan-100/20 bg-cover bg-center bg-no-repeat shadow-[0_14px_35px_rgba(0,0,0,0.35)] transition hover:scale-[1.01] hover:border-cyan-100/40"
                style={{
                  backgroundImage:
                    "url('/buttons/return-to-hub-monolith-v2.png')",
                }}
              >
                <div className="absolute inset-0 flex items-center justify-center px-4">
                  <span className="bg-[linear-gradient(180deg,#ffffff_0%,#eefcff_34%,#b5ecff_72%,#76dbff_100%)] bg-clip-text px-2 text-center text-xl font-semibold uppercase tracking-[0.18em] text-transparent [text-shadow:0_2px_8px_rgba(0,0,0,0.95),0_0_22px_rgba(109,212,255,0.5)] sm:text-2xl">
                    Return to Hub
                  </span>
                </div>
              </button>
              <button
                type="button"
                onClick={() => router.push("/game/tavern")}
                aria-label="Return to tavern"
                className="relative min-h-[10rem] overflow-hidden rounded-[1.35rem] border border-amber-100/20 bg-cover bg-center bg-no-repeat shadow-[0_14px_35px_rgba(0,0,0,0.35)] transition hover:scale-[1.01] hover:border-amber-100/45"
                style={{
                  backgroundImage:
                    "url('/buttons/start-trial-monolith-v2.png')",
                }}
              >
                <div className="absolute inset-0 flex items-center justify-center px-4">
                  <span className="bg-[linear-gradient(180deg,#fffdf4_0%,#fff0b8_30%,#ffd36e_68%,#ffab43_100%)] bg-clip-text px-2 text-center text-xl font-semibold uppercase tracking-[0.18em] text-transparent [text-shadow:0_2px_8px_rgba(0,0,0,0.95),0_0_22px_rgba(255,181,76,0.46)] sm:text-2xl">
                    Recover to Tavern
                  </span>
                </div>
              </button>
              <button
                type="button"
                onClick={() => router.push("/game/battle")}
                aria-label="Start trial"
                className="relative min-h-[10rem] overflow-hidden rounded-[1.35rem] border border-orange-200/20 bg-cover bg-center bg-no-repeat shadow-[0_14px_35px_rgba(0,0,0,0.35)] transition hover:scale-[1.01] hover:border-orange-100/45"
                style={{
                  backgroundImage:
                    "url('/buttons/return-to-tavern-monolith-v2.png')",
                }}
              >
                <div className="absolute inset-0 flex items-center justify-center px-4">
                  <span className="bg-[linear-gradient(180deg,#fff8ef_0%,#ffe0ae_30%,#ffbb72_64%,#ff7f32_100%)] bg-clip-text px-2 text-center text-xl font-semibold uppercase tracking-[0.18em] text-transparent [text-shadow:0_2px_8px_rgba(0,0,0,0.95),0_0_22px_rgba(255,120,44,0.5)] sm:text-2xl">
                    Start Trial
                  </span>
                </div>
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
