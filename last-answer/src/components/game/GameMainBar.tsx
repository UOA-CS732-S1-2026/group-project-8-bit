"use client";

import Image from "next/image";
import Link from "next/link";
import { maxLevel, xpIntoCurrentLevel, xpToNextLevel } from "@/game/core/level";
import { useMCStore } from "@/store/mcStore";
import { LogoutButton } from "@/components/auth/LogoutButton";
import HPBar from "./HPBar";

function formatLocation(location: string) {
  if (location === "mainHub") {
    return "Main Hub";
  }

  return location
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/(^|\s)\S/g, (character) => character.toUpperCase());
}

export function GameMainBar() {
  const player = useMCStore((state) => state.player);
  const panelFill = "bg-center bg-no-repeat bg-[length:100%_100%]";
  const buttonClass =
    "flex items-center justify-center gap-1 rounded-sm bg-[url('/buttons/parchment-btn.png')] px-1 text-[10px] font-semibold text-zinc-900 sm:gap-1.5 sm:px-2 sm:text-xs";
  const xpCurrent = xpIntoCurrentLevel(player.exp, player.level);
  const xpNeeded = player.level >= maxLevel ? 1 : xpToNextLevel(player.level);
  const xpPercent = Math.min(100, Math.round((xpCurrent / xpNeeded) * 100));

  return (
    <header className="flex w-full items-start gap-1 p-1.5 sm:items-center sm:gap-2 sm:p-2">
      <div
        className={`min-w-0 bg-[url('/panels/state-panel3.png')] px-2 py-1 ${panelFill} flex shrink-0 items-start gap-1 sm:items-center sm:gap-2`}
      >
        <div
          className={`relative flex size-[clamp(3rem,8vw,5rem)] items-center justify-center bg-[url('/panels/mc-portrait-frame3.png')] ${panelFill}`}
        >
          <Image
            src="/portraits/mc-portrait.png"
            alt="Character Portrait"
            width={96}
            height={96}
            className="h-[86%] w-[86%] object-cover"
            priority
          />
        </div>

        <div className={`p-2`}>
          <div className="text-[10px] font-semibold tracking-wide text-white sm:text-xs">
            LV {player.level}
          </div>
          <HPBar
            currentHp={player.hp}
            maxHp={player.maxHp}
            className="w-[clamp(8.25rem,30vw,15.5rem)] max-w-none"
            showValues={true}
          />
          <div className="mt-2">
            <div className="mb-1 flex items-center justify-between text-[10px] font-semibold tracking-[0.18em] text-stone-200/90">
              <span>XP</span>
              <span>
                {player.level >= maxLevel ? "MAX" : `${xpCurrent} / ${xpNeeded}`}
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full border border-stone-500/70 bg-stone-950/80">
              <div
                className="h-full bg-gradient-to-r from-amber-500 via-yellow-300 to-amber-200 transition-all duration-500"
                style={{ width: `${player.level >= maxLevel ? 100 : xpPercent}%` }}
              />
            </div>
            <div className="mt-1 text-[10px] font-semibold tracking-[0.18em] text-stone-300">
              {player.coins} coins
            </div>
          </div>
        </div>
      </div>

      <div className="center-banner min-w-0 flex-1">
        <div
          className={`w-full bg-[url('/banners/game-title-banner.png')] px-2 py-1 ${panelFill}`}
        >
          <h2 className="truncate text-center text-xs font-semibold tracking-[0.08em] text-stone-200 sm:text-sm md:text-base">
            {formatLocation(player.location)}
          </h2>
        </div>
      </div>

      <div
        className={`shrink-0 bg-[url('/panels/buttons-panel2.png')] px-2 py-2 sm:px-4 ${panelFill}`}
      >
        <div className="flex items-center gap-1">
          <Link
            href="/game/mainHub"
            className={`${buttonClass} h-[clamp(1.5rem,5vh,2rem)] w-[clamp(3rem, 8vw, 4.8rem)] ${panelFill}`}
          >
            <Image
              src="/icons/info-icon.png"
              alt="Main hub"
              width={32}
              height={32}
              className="size-3.5 sm:size-5"
            />
            <span className="hidden sm:inline">Hub</span>
          </Link>

          <LogoutButton
            showError={false}
            className={`${buttonClass} h-[clamp(1.5rem,5vh,2rem)] w-[clamp(3rem, 8vw, 4.8rem)] ${panelFill}`}
          >
            <>
              <Image
                src="/icons/menu-icon.png"
                alt="Logout"
                width={32}
                height={32}
                className="size-3.5 sm:size-5"
              />
              <span className="hidden sm:inline">Exit</span>
            </>
          </LogoutButton>
        </div>
      </div>
    </header>
  );
}
