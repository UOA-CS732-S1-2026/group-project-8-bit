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
    <main
      className="relative min-h-screen bg-cover bg-center bg-no-repeat text-stone-100"
      style={{ backgroundImage: "url('/backgrounds/monolith-new.png')" }}
    >
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,6,12,0.04)_0%,rgba(3,6,11,0.08)_45%,rgba(2,4,8,0.16)_100%)]" />

      <div className="absolute inset-0 flex flex-col px-4 pb-4 pt-0 md:px-6 md:pb-6 md:pt-0">
        <div
          className="bg-no-repeat bg-center bg-[length:100%_480%] p-2 text-center text-base text-stone-100 md:text-xl"
          style={{ backgroundImage: "url('/panels/Tavern-bottom.png')" }}
        >
          Atmosphere: Cold blue fire circles the monument | Threat: Unknown |
          Reward: Lost knowledge
        </div>

        <section className="flex flex-1 flex-col pt-6">
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[0.95fr_1.05fr] xl:items-start">
            <div className="max-w-[40rem] self-start">
              <div className="text-sm font-semibold uppercase tracking-[0.42em] text-cyan-100/85 [text-shadow:0_0_12px_rgba(126,214,255,0.35)] sm:text-base">
                The Monolith
              </div>
              <h1 className="mt-3 max-w-[26rem] bg-[linear-gradient(180deg,#f6fbff_0%,#d5ecff_38%,#8fd7ff_100%)] bg-clip-text text-3xl font-semibold leading-tight text-transparent [text-shadow:0_0_26px_rgba(102,201,255,0.22)] sm:text-5xl">
                The stone remembers more than it should.
              </h1>
            </div>

            <div className="flex justify-end xl:pr-[2vw]">
              <p className="max-w-[34rem] bg-[linear-gradient(180deg,#fff7e6_0%,#ffd6a3_42%,#ffb067_100%)] bg-clip-text pt-2 text-right text-base leading-8 text-transparent [text-shadow:0_0_24px_rgba(255,163,84,0.18)] sm:text-[1.55rem] sm:leading-[2.5rem] xl:mt-8">
                Strange light runs through the fractures ahead. {player.name} can
                withdraw to the hub, recover in the tavern, or continue forward
                and test what the monolith is guarding.
              </p>
            </div>
          </div>

          <div className="flex-1" />

          <div className="space-y-4">
          <div className="grid gap-3 md:grid-cols-3">
            <button
              type="button"
              onClick={() => router.push("/game/mainHub")}
              aria-label="Return to hub"
              className="relative min-h-[10rem] overflow-hidden rounded-[1.35rem] border border-cyan-100/20 bg-cover bg-center bg-no-repeat shadow-[0_14px_35px_rgba(0,0,0,0.35)] transition hover:scale-[1.01] hover:border-cyan-100/40"
              style={{ backgroundImage: "url('/buttons/return-to-hub-monolith-v2.png')" }}
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
              style={{ backgroundImage: "url('/buttons/start-trial-monolith-v2.png')" }}
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
              style={{ backgroundImage: "url('/buttons/return-to-tavern-monolith-v2.png')" }}
            >
              <div className="absolute inset-0 flex items-center justify-center px-4">
                <span className="bg-[linear-gradient(180deg,#fff8ef_0%,#ffe0ae_30%,#ffbb72_64%,#ff7f32_100%)] bg-clip-text px-2 text-center text-xl font-semibold uppercase tracking-[0.18em] text-transparent [text-shadow:0_2px_8px_rgba(0,0,0,0.95),0_0_22px_rgba(255,120,44,0.5)] sm:text-2xl">
                  Start Trial
                </span>
              </div>
            </button>
          </div>

          <GameMainFooter />
          </div>
        </section>
      </div>
    </main>
  );
}
