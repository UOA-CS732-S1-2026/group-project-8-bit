"use client";

import Image from "next/image";
import { type ReactNode, useLayoutEffect, useRef, useState } from "react";
import { maxLevel, xpIntoCurrentLevel, xpToNextLevel } from "@/game/core/level";
import { supportToolConfigs } from "@/game/core/battleCore";
import { useMCStore } from "@/store/mcStore";
import ModalPortal from "./ModalPortal";
import { useModalCloseAnimation } from "./useModalCloseAnimation";

type InfoPanelProps = {
  onClose: () => void;
};

const statCardClass =
  "rounded-md border border-amber-200/20 bg-black/35 px-4 py-3";
const panelButtonClass =
  "rounded border border-stone-700/45 bg-stone-900/55 px-5 py-2 text-sm font-semibold uppercase tracking-[0.18em] text-stone-300/65 shadow-sm transition duration-150 hover:-translate-y-0.5 hover:border-amber-100/65 hover:bg-amber-200/15 hover:text-amber-50 active:translate-y-[1px] active:scale-[0.98]";

const INFO_PANEL_DESIGN_WIDTH = 860;
const INFO_PANEL_FALLBACK_HEIGHT = 980;
const INFO_PANEL_GAP_X = 20;
const INFO_PANEL_GAP_Y = 20;

function ScaledInfoPanel({ children }: { children: ReactNode }) {
  const frameRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [metrics, setMetrics] = useState({
    height: INFO_PANEL_FALLBACK_HEIGHT,
    scale: 1,
  });

  useLayoutEffect(() => {
    const updateScale = () => {
      const frame = frameRef.current;
      const content = contentRef.current;

      if (!frame || !content) {
        return;
      }

      const contentHeight =
        content.scrollHeight || content.offsetHeight || INFO_PANEL_FALLBACK_HEIGHT;
      const availableWidth = Math.max(frame.clientWidth - INFO_PANEL_GAP_X, 1);
      const availableHeight = Math.max(frame.clientHeight - INFO_PANEL_GAP_Y, 1);
      const nextScale = Math.min(
        availableWidth / INFO_PANEL_DESIGN_WIDTH,
        availableHeight / contentHeight,
        1,
      );

      setMetrics((currentMetrics) => {
        const heightChanged =
          Math.abs(currentMetrics.height - contentHeight) > 0.5;
        const scaleChanged = Math.abs(currentMetrics.scale - nextScale) > 0.001;

        if (!heightChanged && !scaleChanged) {
          return currentMetrics;
        }

        return {
          height: contentHeight,
          scale: nextScale,
        };
      });
    };

    updateScale();

    const resizeObserver = new ResizeObserver(updateScale);

    if (frameRef.current) {
      resizeObserver.observe(frameRef.current);
    }

    if (contentRef.current) {
      resizeObserver.observe(contentRef.current);
    }

    window.addEventListener("resize", updateScale);

    return () => {
      window.removeEventListener("resize", updateScale);
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div
      ref={frameRef}
      className="flex h-full min-h-0 w-full items-center justify-center overflow-hidden"
    >
      <div
        className="relative shrink-0"
        style={{
          flex: "0 0 auto",
          width: INFO_PANEL_DESIGN_WIDTH * metrics.scale,
          height: metrics.height * metrics.scale,
        }}
      >
        <div
          ref={contentRef}
          className="absolute left-0 top-0 origin-top-left"
          style={{
            width: INFO_PANEL_DESIGN_WIDTH,
            transform: `scale(${metrics.scale})`,
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

export default function InfoPanel({ onClose }: InfoPanelProps) {
  const { isClosing, requestClose } = useModalCloseAnimation(onClose);
  const player = useMCStore((state) => state.readPlayer());
  const isMaxLevel = player.level >= maxLevel;
  const currentLevelXp = xpIntoCurrentLevel(player.exp, player.level);
  const nextLevelXp = isMaxLevel ? 0 : xpToNextLevel(player.level);

  return (
    <ModalPortal>
      <div
        className="game-modal-backdrop fixed inset-0 z-[60] h-dvh w-dvw overflow-hidden bg-black/60 backdrop-blur-sm"
        data-closing={isClosing}
        onClick={requestClose}
      >
        <ScaledInfoPanel>
          <section
            className="game-modal-panel relative w-full bg-[url('/panels/menu-panel6.png')] bg-[length:100%_100%] bg-center bg-no-repeat px-[8%] py-[9%] text-amber-100 shadow-[0_24px_70px_rgba(0,0,0,0.65)]"
            data-closing={isClosing}
            role="dialog"
            aria-modal="true"
            aria-label="Player information"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={requestClose}
              className={`${panelButtonClass} absolute right-[8%] top-[11%] z-10`}
            >
              Close
            </button>

            <h2 className="text-center font-serif text-5xl font-extrabold tracking-wide text-amber-950">
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
                <div className="grid gap-3 max-sm:grid-cols-2 sm:grid-cols-2">
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
                    <div className="mt-3 grid gap-3 max-sm:grid-cols-2 sm:grid-cols-2">
                      {player.inventory.map((property) => {
                        const tool = supportToolConfigs[property.id];

                        return (
                          <div
                            key={property.id}
                            className={`${statCardClass} overflow-hidden`}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <p className="text-sm font-semibold text-stone-100">
                                  {tool.name}
                                </p>
                                <p className="mt-1 text-xs uppercase tracking-[0.16em] text-amber-100/60">
                                  {property.id}
                                </p>
                              </div>
                              <p className="shrink-0 self-start rounded-md border border-amber-200/20 bg-black/35 px-2 py-1 text-xs font-semibold text-amber-100">
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
        </ScaledInfoPanel>
      </div>
    </ModalPortal>
  );
}
