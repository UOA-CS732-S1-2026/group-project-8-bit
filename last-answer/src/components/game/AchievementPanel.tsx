"use client";

import { useCallback, useEffect } from "react";
import ModalPortal from "./ModalPortal";
import { getAchievementIconSrc } from "./achievementIconMap";
import { useModalCloseAnimation } from "./useModalCloseAnimation";
import {
  ACHIEVEMENTS,
  type AchievementCategory,
  useAchievementStore,
} from "@/store/achievementStore";

type AchievementPanelProps = {
  onClose: () => void;
};

const CATEGORY_LABEL: Record<AchievementCategory, string> = {
  progression: "Progression",
  combat: "Combat",
  mastery: "Mastery",
  resource: "Resource",
  quest: "Quest",
};

const TIER_STYLE = {
  bronze: "border-amber-500/40 bg-amber-900/25 text-amber-100",
  silver: "border-slate-300/40 bg-slate-700/25 text-slate-100",
  gold: "border-yellow-300/45 bg-yellow-900/30 text-yellow-100",
  mythic: "border-violet-300/55 bg-violet-900/32 text-violet-100",
};

export default function AchievementPanel({ onClose }: AchievementPanelProps) {
  const { isClosing, requestClose } = useModalCloseAnimation(onClose);
  const progress = useAchievementStore((state) => state.progress);
  const resetAchievements = useAchievementStore((state) => state.resetAchievements);
  const recordLevelReached = useAchievementStore((state) => state.recordLevelReached);
  const recordBattleCompletion = useAchievementStore(
    (state) => state.recordBattleCompletion,
  );
  const recordSupportToolUse = useAchievementStore(
    (state) => state.recordSupportToolUse,
  );
  const recordCoinsEarned = useAchievementStore((state) => state.recordCoinsEarned);
  const recordCoinsSnapshot = useAchievementStore(
    (state) => state.recordCoinsSnapshot,
  );
  const recordQuestCompletion = useAchievementStore(
    (state) => state.recordQuestCompletion,
  );

  const triggerDemoUnlock = useCallback(() => {
    recordLevelReached(10);
    recordBattleCompletion({ outcome: "won", reward: null }, 15);
    recordCoinsSnapshot(250);
    recordCoinsEarned(1200);
    recordQuestCompletion(5);
    for (let i = 0; i < 10; i += 1) {
      recordSupportToolUse("barrier", true);
    }
  }, [
    recordBattleCompletion,
    recordCoinsEarned,
    recordCoinsSnapshot,
    recordLevelReached,
    recordQuestCompletion,
    recordSupportToolUse,
  ]);

  const triggerDemoReset = useCallback(() => {
    resetAchievements();
  }, [resetAchievements]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      // Hidden QA shortcuts:
      // Shift + Alt + U => demo unlock
      // Shift + Alt + R => reset achievements
      if (event.shiftKey && event.altKey && event.key.toLowerCase() === "u") {
        event.preventDefault();
        triggerDemoUnlock();
      }
      if (event.shiftKey && event.altKey && event.key.toLowerCase() === "r") {
        event.preventDefault();
        triggerDemoReset();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [triggerDemoReset, triggerDemoUnlock]);

  const unlockedCount = ACHIEVEMENTS.filter(
    (achievement) => progress[achievement.id]?.unlockedAt,
  ).length;

  const completionPercent = Math.round((unlockedCount / ACHIEVEMENTS.length) * 100);

  return (
    <ModalPortal>
      <div
        className="game-modal-backdrop fixed inset-0 z-[75] bg-black/65 backdrop-blur-sm"
        data-closing={isClosing}
        onClick={requestClose}
      >
        <section
          role="dialog"
          aria-modal="true"
          aria-label="Achievements"
          className="game-modal-panel absolute left-1/2 top-1/2 h-[min(42rem,calc(100dvh-3rem))] w-[min(66rem,calc(100vw-3rem))] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-xl border border-amber-200/20 bg-[url('/panels/menu-panel6.png')] bg-[length:100%_100%] bg-center bg-no-repeat p-3 shadow-[0_24px_70px_rgba(0,0,0,0.65)]"
          data-closing={isClosing}
          onClick={(event) => event.stopPropagation()}
        >
          <div className="mx-auto my-[5.2%] flex h-[85%] min-h-0 w-[min(54rem,86%)] flex-col rounded-xl border border-stone-700/35 bg-[rgba(245,238,220,0.58)] p-3 text-[#3d2f21]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="font-serif text-2xl font-bold tracking-wide leading-tight text-[#2b1f14]">
                  Achievements
                </h2>
                <p className="mt-1 text-[0.95rem] leading-tight text-[#5a4a36]">
                  {unlockedCount}/{ACHIEVEMENTS.length} unlocked · {completionPercent}% completion
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="rounded border border-stone-600/55 bg-stone-800/75 px-4 py-2 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-amber-100 transition hover:bg-stone-700/80"
                  onClick={requestClose}
                >
                  Close
                </button>
              </div>
            </div>

            <div className="mt-3 h-2 overflow-hidden rounded-full bg-stone-900/20">
              <div
                className="h-full bg-gradient-to-r from-amber-600 to-yellow-500 transition-all duration-500"
                style={{ width: `${completionPercent}%` }}
              />
            </div>

            <div className="guide-scroll mt-3 min-h-0 flex-1 overflow-y-auto pr-1 pb-1">
              <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2">
              {ACHIEVEMENTS.map((achievement) => {
                const itemProgress = progress[achievement.id] ?? {
                  value: 0,
                  unlockedAt: null,
                };
                const isUnlocked = Boolean(itemProgress.unlockedAt);
                const ratio = Math.min(
                  100,
                  Math.round((itemProgress.value / achievement.target) * 100),
                );
                const showHiddenMask = Boolean(achievement.hidden && !isUnlocked);
                const title = showHiddenMask ? "???" : achievement.title;
                const description = showHiddenMask
                  ? achievement.hint ?? "Hint: Hidden condition."
                  : achievement.description;
                const tierLabel = showHiddenMask ? "hidden" : achievement.tier;

                return (
                  <article
                    key={achievement.id}
                    className={[
                      "rounded-md border px-3 py-2.5 shadow-[0_1px_0_rgba(255,249,237,0.5)]",
                      isUnlocked
                        ? `${TIER_STYLE[achievement.tier]}`
                        : "border-stone-700/22 bg-[rgba(252,246,234,0.78)] text-[#4c3a29]",
                    ].join(" ")}
                  >
                    <div className="flex items-start gap-3">
                      <div className="relative mt-0.5 flex h-16 w-16 shrink-0 items-center justify-center">
                        <img
                          src={getAchievementIconSrc(achievement.id)}
                          alt={showHiddenMask ? "Hidden achievement icon" : `${achievement.title} icon`}
                          width={64}
                          height={64}
                          className={[
                            "h-16 w-16 object-contain transition duration-300",
                            showHiddenMask
                              ? "scale-[1.08] blur-[2px] brightness-[0.42] saturate-0 opacity-70"
                              : isUnlocked
                                ? "drop-shadow-[0_0_14px_rgba(255,180,72,0.2)]"
                                : "opacity-88 saturate-[0.9]",
                          ].join(" ")}
                        />
                        {showHiddenMask ? (
                          <div className="absolute inset-1 flex items-center justify-center rounded-full bg-black/18 text-[1.6rem] font-bold text-amber-50/92">
                            ?
                          </div>
                        ) : null}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="text-[1rem] font-semibold leading-tight">{title}</p>
                            <p className="mt-0.5 text-[0.86rem] leading-snug">{description}</p>
                          </div>
                          <div className="shrink-0 text-right text-[#5f4a35]">
                            <p className="text-[0.62rem] uppercase tracking-[0.12em]">
                              {CATEGORY_LABEL[achievement.category]}
                            </p>
                            <p className="mt-0.5 text-[0.62rem] uppercase tracking-[0.12em]">
                              {tierLabel}
                            </p>
                          </div>
                        </div>

                        <div className="mt-1.5">
                          <div className="flex items-center justify-between text-[0.68rem] uppercase tracking-[0.1em] text-[#5b4a37]">
                            <span>
                              {Math.min(itemProgress.value, achievement.target)} / {achievement.target}
                            </span>
                            <span>{isUnlocked ? "Unlocked" : `${ratio}%`}</span>
                          </div>
                          <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-stone-900/20">
                            <div
                              className="h-full bg-gradient-to-r from-amber-600 to-yellow-500 transition-all duration-300"
                              style={{ width: `${ratio}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
              </div>
            </div>
          </div>
        </section>
      </div>
    </ModalPortal>
  );
}
