"use client";

import Image from "next/image";
import { maxLevel, xpIntoCurrentLevel, xpToNextLevel } from "@/game/core/level";
import { supportToolConfigs } from "@/game/core/battleCore";
import { useMCStore } from "@/store/mcStore";

type InfoPanelProps = {
  onClose: () => void;
};

const statCardClass =
  "rounded-md border border-amber-200/20 bg-black/35 px-4 py-3";

export default function InfoPanel({ onClose }: InfoPanelProps) {
  const player = useMCStore((state) => state.readPlayer());
  const isMaxLevel = player.level >= maxLevel;
  const currentLevelXp = xpIntoCurrentLevel(player.exp, player.level);
  const nextLevelXp = isMaxLevel ? 0 : xpToNextLevel(player.level);

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <section
        className="relative w-full max-w-3xl bg-[url('/panels/menu-panel.png')] bg-[length:100%_100%] bg-center bg-no-repeat px-7 py-8 text-amber-100 shadow-[0_24px_70px_rgba(0,0,0,0.65)]"
        role="dialog"
        aria-modal="true"
        aria-label="Player information"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 rounded-md border border-amber-100/30 bg-black/35 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-amber-100 transition hover:border-amber-100/65 hover:bg-amber-100/15 active:scale-95"
        >
          Close
        </button>

        <h2 className="text-center text-2xl font-semibold text-stone-100">
          Player Info
        </h2>

        <div className="mt-7 grid gap-6 md:grid-cols-[10rem_minmax(0,1fr)]">
          <div className="mx-auto flex w-40 flex-col items-center gap-3 md:mx-0">
            <div className="relative flex size-36 items-center justify-center bg-[url('/panels/mc-portrait-frame3.png')] bg-[length:100%_100%] bg-center bg-no-repeat">
              <Image
                src="/portraits/mc-portrait.png"
                alt={`${player.name} portrait`}
                width={128}
                height={128}
                className="h-[84%] w-[84%] object-cover"
                priority
              />
            </div>
            <div className="text-center">
              <p className="text-xl font-semibold text-stone-100">
                {player.name}
              </p>
              <p className="mt-1 text-sm font-semibold uppercase tracking-[0.16em] text-amber-200">
                Level {player.level}
              </p>
            </div>
          </div>

          <div className="min-w-0">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className={statCardClass}>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-200/85">
                  HP
                </p>
                <p className="mt-1 text-lg font-semibold text-stone-100">
                  {player.hp} / {player.maxHp}
                </p>
              </div>
              <div className={statCardClass}>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-200/85">
                  XP
                </p>
                <p className="mt-1 text-lg font-semibold text-stone-100">
                  {isMaxLevel
                    ? `${player.exp} total`
                    : `${currentLevelXp} / ${nextLevelXp}`}
                </p>
              </div>
              <div className={statCardClass}>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-200/85">
                  Attack
                </p>
                <p className="mt-1 text-lg font-semibold text-stone-100">
                  {player.attack}
                </p>
              </div>
              <div className={statCardClass}>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-200/85">
                  Defense
                </p>
                <p className="mt-1 text-lg font-semibold text-stone-100">
                  {player.defense}
                </p>
              </div>
              <div className={statCardClass}>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-200/85">
                  Coins
                </p>
                <p className="mt-1 text-lg font-semibold text-stone-100">
                  {player.coins}
                </p>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-200">
                Inventory
              </h3>

              {player.inventory.length > 0 ? (
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  {player.inventory.map((property) => {
                    const tool = supportToolConfigs[property.id];

                    return (
                      <div key={property.id} className={statCardClass}>
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-sm font-semibold text-stone-100">
                              {tool.name}
                            </p>
                            <p className="mt-1 text-xs uppercase tracking-[0.16em] text-amber-100/60">
                              {property.id}
                            </p>
                          </div>
                          <p className="shrink-0 rounded-md border border-amber-200/20 bg-black/35 px-2 py-1 text-xs font-semibold text-amber-100">
                            x{property.leftNumber}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="mt-3 text-sm text-amber-100/70">
                  Inventory is empty.
                </p>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
