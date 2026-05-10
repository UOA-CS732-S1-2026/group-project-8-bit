"use client";

import { useEffect } from "react";
import { useAchievementStore } from "@/store/achievementStore";
import { getAchievementIconSrc } from "./achievementIconMap";
import ModalPortal from "./ModalPortal";

const TIER_CLASS: Record<string, string> = {
  bronze: "border-amber-500/55 bg-amber-900/78 text-amber-100",
  silver: "border-slate-300/55 bg-slate-700/78 text-slate-100",
  gold: "border-yellow-300/65 bg-yellow-800/85 text-yellow-100",
  mythic: "border-violet-300/70 bg-violet-900/88 text-violet-100",
};

export function AchievementToastStack() {
  const toasts = useAchievementStore((state) => state.toasts);
  const dismissToast = useAchievementStore((state) => state.dismissToast);
  const currentToast = toasts[0] ?? null;

  useEffect(() => {
    if (!currentToast) {
      return;
    }

    const timer = window.setTimeout(() => dismissToast(currentToast.id), 2000);

    return () => {
      window.clearTimeout(timer);
    };
  }, [currentToast, dismissToast]);

  if (!currentToast) {
    return null;
  }

  return (
    <ModalPortal>
      <div className="pointer-events-none fixed left-1/2 top-5 z-[130] flex w-[min(24rem,92vw)] -translate-x-1/2 flex-col gap-2">
        <div
          key={`${currentToast.id}-${currentToast.createdAt}`}
          className={`achievement-toast-inout pointer-events-auto rounded-md border px-3 py-2 shadow-[0_14px_24px_rgba(0,0,0,0.42)] backdrop-blur-sm ${TIER_CLASS[currentToast.tier]}`}
        >
          <div className="flex items-center gap-3">
            <img
              src={getAchievementIconSrc(currentToast.id)}
              alt={`${currentToast.title} icon`}
              width={48}
              height={48}
              className="h-12 w-12 shrink-0 object-contain drop-shadow-[0_0_12px_rgba(255,190,90,0.18)]"
            />
            <div className="min-w-0">
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.16em]">
                Achievement Unlocked · {currentToast.tier}
              </p>
              <p className="mt-0.5 text-sm font-semibold">{currentToast.title}</p>
            </div>
          </div>
        </div>
      </div>
    </ModalPortal>
  );
}
