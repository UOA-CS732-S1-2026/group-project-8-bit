"use client";

import Image from "next/image";
import { maxLevel, xpIntoCurrentLevel, xpToNextLevel } from "@/game/core/level";
import { useMCStore } from "@/store/mcStore";
import HPBar from "./HPBar";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import InfoPanel from "./InfoPanel";
import { TopBarMenu } from "./TopBarMenu";

export function GameMainBar() {
  const player = useMCStore((state) => state.player);

  const pathname = usePathname();

  const [showMenu, setShowMenu] = useState(false);
  const [showInfoPanel, setShowInfoPanel] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!showMenu) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [showMenu]);

  const routeTitleMap: Record<string, string> = {
    "/game/foggyForest": "Foggy Forest",
    "/game/tavern": "Ashen Tavern - Last Light",
    "/game/mainHub": "Main Hub",
  };

  const pageTitle =
    routeTitleMap[pathname] ?? "The Last Answer: Ashes of The First Monolith";

  const panelFill = "bg-center bg-no-repeat bg-[length:100%_100%]";
  const buttonClass =
    "flex items-center justify-center gap-1 rounded-sm bg-[url('/buttons/parchment-btn.png')] px-1 text-[10px] font-semibold text-zinc-900 sm:gap-1.5 sm:px-2 sm:text-xs";
  const xpCurrent = xpIntoCurrentLevel(player.exp, player.level);
  const xpNeeded = player.level >= maxLevel ? 1 : xpToNextLevel(player.level);
  const xpPercent = Math.min(100, Math.round((xpCurrent / xpNeeded) * 100));

  return (
    <main>
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

          <div className={`py-2 px-2 min-w-35`}>
            <div className="tracking-normal text-stone-200">
              LV {player.level}
            </div>
            <HPBar
              currentHp={player.hp}
              maxHp={player.maxHp}
              className="w-[clamp(8.25rem,30vw,15.5rem)] max-w-none"
              showValueText={false}
              showOverlayValues={true}
            />
            <div className="mt-0.5">
              <div className="flex items-center">
                <span className="text-stone-200 mr-1">XP</span>
                <div className="flex-1 h-2 overflow-hidden rounded-full border border-stone-500/70 bg-stone-950/80">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 via-yellow-300 to-amber-200 transition-all duration-500"
                    style={{
                      width: `${player.level >= maxLevel ? 100 : xpPercent}%`,
                    }}
                  />
                </div>
              </div>

              <div className="mt-1 text-[14px] font-semibold tracking-normal text-stone-300">
                {player.coins} Coins
              </div>
            </div>
          </div>
        </div>

        <div className="center-banner min-w-0 min-h-[135px] flex-1">
          <div
            className={`w-full bg-[url('/banners/game-title-banner.png')] px-3 py-4 ${panelFill}`}
          >
            <h2 className="truncate text-center text-xs font-semibold tracking-[0.08em] text-stone-200 sm:text-sm md:text-base">
              {pageTitle}
            </h2>
          </div>
        </div>

        <div
          className={`relative shrink-0 bg-[url('/panels/buttons-panel2.png')] p-2 mt-3 sm:px-4 min-h-[50px] self-start ${panelFill}`}
          ref={menuRef}
        >
          <div className="flex items-center gap-1">
            <button
              type="button"
              className={`${buttonClass} h-[clamp(1.5rem,5vh,2rem)] w-[clamp(3rem, 8vw, 4.2rem)] ${panelFill}`}
              onClick={() => setShowInfoPanel(true)}
            >
              <Image
                src="/icons/info-icon.png"
                alt="information"
                width={32}
                height={32}
                className="size-3.5 sm:size-5"
              />
              <span className="hidden sm:inline">Info</span>
            </button>

            <div>
              <button
                type="button"
                className={`${buttonClass} h-[clamp(1.5rem,5vh,2rem)] w-[clamp(3rem, 8vw, 4.2rem)] ${panelFill}`}
                onClick={() => setShowMenu((isOpen) => !isOpen)}
                aria-haspopup="menu"
                aria-expanded={showMenu}
              >
                <Image
                  src="/icons/menu-icon.png"
                  alt="Menu"
                  width={32}
                  height={32}
                  className="size-3.5 sm:size-5"
                />
                <span className="hidden sm:inline">Menu</span>
              </button>
            </div>
          </div>
          <div className="absolute left-0 right-0 top-full z-50 mt-1">
            <TopBarMenu
              isOpen={showMenu}
              onCloseMenu={() => setShowMenu(false)}
            />
          </div>
        </div>
      </header>
      {showInfoPanel ? (
        <InfoPanel onClose={() => setShowInfoPanel(false)} />
      ) : null}
    </main>
  );
}
