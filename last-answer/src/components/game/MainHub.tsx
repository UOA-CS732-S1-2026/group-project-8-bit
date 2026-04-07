"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useMCStore } from "@/store/mcStore";
import { LogoutButton } from "@/components/auth/LogoutButton";
import InteractBtn from "./InteractBtn";

export function MainHub() {
  const router = useRouter();
  const player = useMCStore((state) => state.player);
  const setLocation = useMCStore((state) => state.setLocation);

  useEffect(() => {
    setLocation("mainHub");
  }, [setLocation]);

  return (
    <main className="flex h-full w-full flex-col overflow-auto bg-[radial-gradient(circle_at_top,#193728_0%,#101617_45%,#090b0f_100%)] px-4 pb-6 pt-24 text-stone-100 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6">
        <section className="rounded-[2rem] border border-amber-100/10 bg-stone-950/45 p-6 shadow-2xl shadow-black/25">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-3">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-200">
                Main Hub
              </p>
              <h1 className="text-3xl font-semibold text-stone-50 sm:text-4xl">
                Welcome back, {player.name}
              </h1>
              <p className="max-w-2xl text-sm leading-6 text-stone-300 sm:text-base">
                Your authenticated save is active. Continue training in battle or
                step into the Foggy Forest while your player progress stays tied
                to this account.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/game/battle"
                className="rounded-2xl border border-amber-300/35 bg-amber-400/15 px-4 py-3 text-sm font-semibold uppercase tracking-[0.24em] text-amber-100 transition hover:border-amber-200/60 hover:bg-amber-300/20"
              >
                Battle Demo
              </Link>
              <LogoutButton
                className="rounded-2xl border border-stone-300/20 bg-stone-100/5 px-4 py-3 text-sm font-semibold uppercase tracking-[0.24em] text-stone-100 transition hover:border-stone-100/40 hover:bg-stone-100/10"
              />
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-4">
          <div className="rounded-[1.5rem] border border-stone-200/10 bg-stone-950/45 p-5">
            <div className="text-xs font-semibold uppercase tracking-[0.26em] text-stone-400">
              Level
            </div>
            <div className="mt-2 text-3xl font-semibold text-stone-50">
              {player.level}
            </div>
          </div>
          <div className="rounded-[1.5rem] border border-stone-200/10 bg-stone-950/45 p-5">
            <div className="text-xs font-semibold uppercase tracking-[0.26em] text-stone-400">
              HP
            </div>
            <div className="mt-2 text-3xl font-semibold text-stone-50">
              {player.hp} / {player.maxHp}
            </div>
          </div>
          <div className="rounded-[1.5rem] border border-stone-200/10 bg-stone-950/45 p-5">
            <div className="text-xs font-semibold uppercase tracking-[0.26em] text-stone-400">
              Experience
            </div>
            <div className="mt-2 text-3xl font-semibold text-stone-50">
              {player.exp}
            </div>
          </div>
          <div className="rounded-[1.5rem] border border-stone-200/10 bg-stone-950/45 p-5">
            <div className="text-xs font-semibold uppercase tracking-[0.26em] text-stone-400">
              Coins
            </div>
            <div className="mt-2 text-3xl font-semibold text-stone-50">
              {player.coins}
            </div>
          </div>
        </section>

        <section className="grid gap-4 rounded-[2rem] border border-amber-100/10 bg-stone-950/40 p-5 shadow-2xl shadow-black/20 sm:grid-cols-2 lg:grid-cols-3">
          <InteractBtn
            className="w-full max-w-none"
            onPress={() => router.push("/game/battle")}
            title="Battle Demo"
            content="Train against the current battle renderer and watch your saved player stats update."
          />
          <InteractBtn
            className="w-full max-w-none"
            onPress={() => router.push("/game/foggyForest")}
            title="Foggy Forest"
            content="Move deeper into the world and keep the authenticated game shell active."
          />
          <InteractBtn
            className="w-full max-w-none"
            onPress={() => router.push("/")}
            title="Return Home"
            content="Go back to the public landing page without losing your active session."
          />
        </section>
      </div>
    </main>
  );
}
