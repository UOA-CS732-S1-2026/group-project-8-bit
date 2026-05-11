"use client";

import { useEffect, useRef } from "react";
import { useMCStore } from "@/store/mcStore";
import { useAchievementStore } from "@/store/achievementStore";

export function AchievementProgressTracker() {
  const player = useMCStore((state) => state.player);
  const activeScopeId = useAchievementStore((state) => state.activeScopeId);
  const hasHydrated = useAchievementStore((state) => state.hasHydrated);
  const recordLevelReached = useAchievementStore((state) => state.recordLevelReached);
  const recordCoinsSnapshot = useAchievementStore((state) => state.recordCoinsSnapshot);
  const recordCoinsEarned = useAchievementStore((state) => state.recordCoinsEarned);
  const recordQuestCompletion = useAchievementStore((state) => state.recordQuestCompletion);

  const safeLevel = Number.isFinite(player?.level) ? Math.max(1, player.level) : 1;
  const safeCoins = Number.isFinite(player?.coins) ? Math.max(0, player.coins) : 0;
  const safeCompletedQuestCount = Array.isArray(player?.completedQuests)
    ? player.completedQuests.length
    : 0;

  const previousRef = useRef({
    level: safeLevel,
    coins: safeCoins,
    completedQuests: safeCompletedQuestCount,
  });

  useEffect(() => {
    previousRef.current = {
      level: safeLevel,
      coins: safeCoins,
      completedQuests: safeCompletedQuestCount,
    };
    // Reset the delta baseline only when the active achievement scope changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeScopeId]);

  useEffect(() => {
    if (!hasHydrated) {
      return;
    }

    const previous = previousRef.current;
    if (safeLevel > previous.level) {
      recordLevelReached(safeLevel);
    } else {
      recordLevelReached(Math.max(safeLevel, previous.level));
    }

    recordCoinsSnapshot(safeCoins);
    if (safeCoins > previous.coins) {
      recordCoinsEarned(safeCoins - previous.coins);
    }

    if (safeCompletedQuestCount !== previous.completedQuests) {
      recordQuestCompletion(safeCompletedQuestCount);
    }

    previousRef.current = {
      level: safeLevel,
      coins: safeCoins,
      completedQuests: safeCompletedQuestCount,
    };
  }, [
    activeScopeId,
    hasHydrated,
    safeCoins,
    safeCompletedQuestCount,
    safeLevel,
    recordCoinsEarned,
    recordCoinsSnapshot,
    recordLevelReached,
    recordQuestCompletion,
  ]);

  return null;
}
