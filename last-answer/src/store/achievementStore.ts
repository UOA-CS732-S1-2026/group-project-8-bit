"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { BattleCompletionResult, SupportToolId } from "@/game/core/types";
import {
  buildAchievementCloudData,
  cloneAchievementMetrics,
  EMPTY_ACHIEVEMENT_METRICS,
  normalizeAchievementMetrics,
  type AchievementCloudData,
  type AchievementMetrics,
} from "@/lib/achievement-data";

export type AchievementTier = "bronze" | "silver" | "gold" | "mythic";
export type AchievementCategory =
  | "progression"
  | "combat"
  | "mastery"
  | "resource"
  | "quest";

export type AchievementDef = {
  id: string;
  title: string;
  description: string;
  hint?: string;
  hidden?: boolean;
  tier: AchievementTier;
  category: AchievementCategory;
  metric: keyof AchievementMetrics;
  target: number;
};

type AchievementProgress = {
  value: number;
  unlockedAt: number | null;
};

export type AchievementScopeState = {
  metrics: AchievementMetrics;
  progress: Record<string, AchievementProgress>;
};

export type AchievementToast = {
  id: string;
  title: string;
  tier: AchievementTier;
  createdAt: number;
};

type AchievementStore = {
  metrics: AchievementMetrics;
  progress: Record<string, AchievementProgress>;
  toasts: AchievementToast[];
  scopes: Record<string, AchievementScopeState>;
  activeScopeId: string;
  hasHydrated: boolean;
  markHydrated: (ready: boolean) => void;
  setActiveScope: (scopeId: string) => void;
  copyActiveScopeTo: (scopeId: string) => void;
  exportActiveCloudData: () => AchievementCloudData;
  hydrateScopeFromCloudData: (
    scopeId: string,
    cloudData: AchievementCloudData | null,
  ) => void;
  recordLevelReached: (level: number) => void;
  recordCoinsSnapshot: (coins: number) => void;
  recordCoinsEarned: (amount: number) => void;
  recordQuestCompletion: (count: number) => void;
  recordBattleCompletion: (
    completion: BattleCompletionResult | null,
    bestComboInBattle: number,
  ) => void;
  recordSupportToolUse: (toolId: SupportToolId, isStrong: boolean) => void;
  recordEndingSeen: (ending: "golden" | "ashes") => void;
  dismissToast: (achievementId: string) => void;
  resetAchievements: () => void;
};

const DEFAULT_SCOPE_ID = "local:auto";

export const ACHIEVEMENTS: AchievementDef[] = [
  {
    id: "level_3",
    title: "Awakening",
    description: "Reach level 3.",
    tier: "bronze",
    category: "progression",
    metric: "levelReached",
    target: 3,
  },
  {
    id: "level_5",
    title: "Pathfinder",
    description: "Reach level 5.",
    tier: "silver",
    category: "progression",
    metric: "levelReached",
    target: 5,
  },
  {
    id: "level_10",
    title: "Veteran of Ashes",
    description: "Reach level 10.",
    tier: "gold",
    category: "progression",
    metric: "levelReached",
    target: 10,
  },
  {
    id: "battle_win_1",
    title: "First Blood",
    description: "Win your first battle.",
    tier: "bronze",
    category: "combat",
    metric: "battlesWon",
    target: 1,
  },
  {
    id: "battle_win_5",
    title: "Field Survivor",
    description: "Win 5 battles.",
    tier: "silver",
    category: "combat",
    metric: "battlesWon",
    target: 5,
  },
  {
    id: "battle_win_20",
    title: "Relentless Hunter",
    description: "Win 20 battles.",
    tier: "gold",
    category: "combat",
    metric: "battlesWon",
    target: 20,
  },
  {
    id: "battle_loss_1",
    title: "Fall and Return",
    description: "Lose 1 battle and keep going.",
    tier: "bronze",
    category: "combat",
    metric: "battlesLost",
    target: 1,
  },
  {
    id: "combo_5",
    title: "Rhythm Finder",
    description: "Reach best combo 5 in battle.",
    tier: "bronze",
    category: "mastery",
    metric: "bestComboEver",
    target: 5,
  },
  {
    id: "combo_10",
    title: "Pressure Artist",
    description: "Reach best combo 10 in battle.",
    tier: "silver",
    category: "mastery",
    metric: "bestComboEver",
    target: 10,
  },
  {
    id: "combo_15",
    title: "Monolith Tempo",
    description: "Reach best combo 15 in battle.",
    tier: "gold",
    category: "mastery",
    metric: "bestComboEver",
    target: 15,
  },
  {
    id: "tools_5",
    title: "Prepared Mind",
    description: "Use support tools 5 times.",
    tier: "bronze",
    category: "resource",
    metric: "toolsUsed",
    target: 5,
  },
  {
    id: "tools_20",
    title: "Tactical Discipline",
    description: "Use support tools 20 times.",
    tier: "silver",
    category: "resource",
    metric: "toolsUsed",
    target: 20,
  },
  {
    id: "strong_tools_10",
    title: "Risk Controller",
    description: "Use strong assist tools 10 times.",
    tier: "gold",
    category: "resource",
    metric: "strongToolsUsed",
    target: 10,
  },
  {
    id: "coins_300",
    title: "Coin Keeper",
    description: "Earn a total of 300 coins.",
    tier: "bronze",
    category: "resource",
    metric: "coinsEarned",
    target: 300,
  },
  {
    id: "coins_1000",
    title: "Ashen Broker",
    description: "Earn a total of 1000 coins.",
    tier: "gold",
    category: "resource",
    metric: "coinsEarned",
    target: 1000,
  },
  {
    id: "wallet_200",
    title: "Loaded Purse",
    description: "Hold 200 coins at once.",
    tier: "silver",
    category: "resource",
    metric: "highestCoinsHeld",
    target: 200,
  },
  {
    id: "quest_1",
    title: "First Lead",
    description: "Complete 1 quest.",
    tier: "bronze",
    category: "quest",
    metric: "questsCompleted",
    target: 1,
  },
  {
    id: "quest_5",
    title: "Story Walker",
    description: "Complete 5 quests.",
    tier: "silver",
    category: "quest",
    metric: "questsCompleted",
    target: 5,
  },
  {
    id: "ending_golden",
    title: "Crown of Dawn",
    description: "Witness the Golden Order ending.",
    tier: "gold",
    category: "quest",
    metric: "endingGoldenSeen",
    target: 1,
  },
  {
    id: "ending_ashes",
    title: "Ashes of Resolve",
    description: "Witness the Ashes ending.",
    tier: "gold",
    category: "quest",
    metric: "endingAshesSeen",
    target: 1,
  },
  {
    id: "ending_dual_truth",
    title: "Two Truths, One Fate",
    description: "Stand where certainty breaks, and still see what both roads reveal.",
    hint: "Hint: Truth is rarely one-sided.",
    hidden: true,
    tier: "mythic",
    category: "quest",
    metric: "endingsSeen",
    target: 2,
  },
];

const buildInitialProgress = () =>
  ACHIEVEMENTS.reduce<Record<string, AchievementProgress>>((acc, achievement) => {
    acc[achievement.id] = {
      value: 0,
      unlockedAt: null,
    };
    return acc;
  }, {});

const buildEmptyScopeState = (): AchievementScopeState => ({
  metrics: cloneAchievementMetrics(EMPTY_ACHIEVEMENT_METRICS),
  progress: buildInitialProgress(),
});

function cloneAchievementProgress(
  progress: Record<string, AchievementProgress>,
): Record<string, AchievementProgress> {
  return Object.fromEntries(
    Object.entries(progress).map(([achievementId, item]) => [
      achievementId,
      { ...item },
    ]),
  );
}

function buildScopeStateFromMetrics(metrics: AchievementMetrics): AchievementScopeState {
  const normalizedMetrics = normalizeAchievementMetrics(metrics);
  const { nextProgress } = evaluateUnlocks(
    normalizedMetrics,
    buildInitialProgress(),
  );

  return {
    metrics: normalizedMetrics,
    progress: nextProgress,
  };
}

const TIER_ORDER: Record<AchievementTier, number> = {
  bronze: 1,
  silver: 2,
  gold: 3,
  mythic: 4,
};

function evaluateUnlocks(
  metrics: AchievementMetrics,
  previousProgress: Record<string, AchievementProgress>,
) {
  const nextProgress = { ...previousProgress };
  const unlockedToasts: AchievementToast[] = [];
  const now = Date.now();

  for (const achievement of ACHIEVEMENTS) {
    const currentValue = metrics[achievement.metric];
    const prev = previousProgress[achievement.id] ?? { value: 0, unlockedAt: null };
    const wasUnlocked = Boolean(prev.unlockedAt);
    const unlockedNow = currentValue >= achievement.target;

    nextProgress[achievement.id] = {
      value: Math.max(prev.value, currentValue),
      unlockedAt: unlockedNow ? prev.unlockedAt ?? now : null,
    };

    if (!wasUnlocked && unlockedNow) {
      unlockedToasts.push({
        id: achievement.id,
        title: achievement.title,
        tier: achievement.tier,
        createdAt: now,
      });
    }
  }

  unlockedToasts.sort((left, right) => TIER_ORDER[right.tier] - TIER_ORDER[left.tier]);
  return { nextProgress, unlockedToasts };
}

export const useAchievementStore = create<AchievementStore>()(
  persist(
    (set, get) => ({
      metrics: cloneAchievementMetrics(EMPTY_ACHIEVEMENT_METRICS),
      progress: buildInitialProgress(),
      toasts: [],
      scopes: {
        [DEFAULT_SCOPE_ID]: buildEmptyScopeState(),
      },
      activeScopeId: DEFAULT_SCOPE_ID,
      hasHydrated: false,
      markHydrated: (ready) => set({ hasHydrated: ready }),
      setActiveScope: (scopeId) => {
        const normalizedScopeId = scopeId.trim() || DEFAULT_SCOPE_ID;
        const existingScope = get().scopes[normalizedScopeId] ?? buildEmptyScopeState();
        set((state) => ({
          activeScopeId: normalizedScopeId,
          metrics: cloneAchievementMetrics(existingScope.metrics),
          progress: cloneAchievementProgress(existingScope.progress),
          scopes: state.scopes[normalizedScopeId]
            ? state.scopes
            : {
                ...state.scopes,
                [normalizedScopeId]: existingScope,
              },
        }));
      },
      copyActiveScopeTo: (scopeId) => {
        const normalizedScopeId = scopeId.trim();
        if (!normalizedScopeId) {
          return;
        }
        const activeScopeId = get().activeScopeId;
        const activeScope =
          get().scopes[activeScopeId] ?? {
            metrics: get().metrics,
            progress: get().progress,
          };
        set((state) => ({
          scopes: {
            ...state.scopes,
            [normalizedScopeId]: {
              metrics: cloneAchievementMetrics(activeScope.metrics),
              progress: cloneAchievementProgress(activeScope.progress),
            },
          },
        }));
      },
      exportActiveCloudData: () => {
        const activeScope =
          get().scopes[get().activeScopeId] ?? {
            metrics: get().metrics,
            progress: get().progress,
          };

        return buildAchievementCloudData(activeScope.metrics);
      },
      hydrateScopeFromCloudData: (scopeId, cloudData) => {
        const normalizedScopeId = scopeId.trim() || DEFAULT_SCOPE_ID;
        const nextScope = cloudData
          ? buildScopeStateFromMetrics(cloudData.metrics)
          : buildEmptyScopeState();

        set((state) => ({
          activeScopeId: normalizedScopeId,
          metrics: nextScope.metrics,
          progress: nextScope.progress,
          toasts: [],
          scopes: {
            ...state.scopes,
            [normalizedScopeId]: nextScope,
          },
        }));
      },
      recordLevelReached: (level) => {
        const safeLevel = Math.max(1, Math.floor(level));
        const metrics = {
          ...get().metrics,
          levelReached: Math.max(get().metrics.levelReached, safeLevel),
        };
        const { nextProgress, unlockedToasts } = evaluateUnlocks(
          metrics,
          get().progress,
        );
        set((state) => ({
          metrics,
          progress: nextProgress,
          toasts: [...state.toasts, ...unlockedToasts],
          scopes: {
            ...state.scopes,
            [state.activeScopeId]: {
              metrics,
              progress: nextProgress,
            },
          },
        }));
      },
      recordCoinsSnapshot: (coins) => {
        const safeCoins = Math.max(0, Math.floor(coins));
        const metrics = {
          ...get().metrics,
          highestCoinsHeld: Math.max(get().metrics.highestCoinsHeld, safeCoins),
        };
        const { nextProgress, unlockedToasts } = evaluateUnlocks(
          metrics,
          get().progress,
        );
        set((state) => ({
          metrics,
          progress: nextProgress,
          toasts: [...state.toasts, ...unlockedToasts],
          scopes: {
            ...state.scopes,
            [state.activeScopeId]: {
              metrics,
              progress: nextProgress,
            },
          },
        }));
      },
      recordCoinsEarned: (amount) => {
        const safeAmount = Math.max(0, Math.floor(amount));
        if (safeAmount <= 0) {
          return;
        }
        const metrics = {
          ...get().metrics,
          coinsEarned: get().metrics.coinsEarned + safeAmount,
        };
        const { nextProgress, unlockedToasts } = evaluateUnlocks(
          metrics,
          get().progress,
        );
        set((state) => ({
          metrics,
          progress: nextProgress,
          toasts: [...state.toasts, ...unlockedToasts],
          scopes: {
            ...state.scopes,
            [state.activeScopeId]: {
              metrics,
              progress: nextProgress,
            },
          },
        }));
      },
      recordQuestCompletion: (count) => {
        const safeCount = Math.max(0, Math.floor(count));
        const metrics = {
          ...get().metrics,
          questsCompleted: Math.max(get().metrics.questsCompleted, safeCount),
        };
        const { nextProgress, unlockedToasts } = evaluateUnlocks(
          metrics,
          get().progress,
        );
        set((state) => ({
          metrics,
          progress: nextProgress,
          toasts: [...state.toasts, ...unlockedToasts],
          scopes: {
            ...state.scopes,
            [state.activeScopeId]: {
              metrics,
              progress: nextProgress,
            },
          },
        }));
      },
      recordBattleCompletion: (completion, bestComboInBattle) => {
        if (!completion) {
          return;
        }
        const metrics = { ...get().metrics };
        metrics.bestComboEver = Math.max(
          metrics.bestComboEver,
          Math.max(0, Math.floor(bestComboInBattle)),
        );
        if (completion.outcome === "won") {
          metrics.battlesWon += 1;
        } else {
          metrics.battlesLost += 1;
        }
        const { nextProgress, unlockedToasts } = evaluateUnlocks(
          metrics,
          get().progress,
        );
        set((state) => ({
          metrics,
          progress: nextProgress,
          toasts: [...state.toasts, ...unlockedToasts],
          scopes: {
            ...state.scopes,
            [state.activeScopeId]: {
              metrics,
              progress: nextProgress,
            },
          },
        }));
      },
      recordSupportToolUse: (_toolId, isStrong) => {
        const metrics = { ...get().metrics };
        metrics.toolsUsed += 1;
        if (isStrong) {
          metrics.strongToolsUsed += 1;
        }
        const { nextProgress, unlockedToasts } = evaluateUnlocks(
          metrics,
          get().progress,
        );
        set((state) => ({
          metrics,
          progress: nextProgress,
          toasts: [...state.toasts, ...unlockedToasts],
          scopes: {
            ...state.scopes,
            [state.activeScopeId]: {
              metrics,
              progress: nextProgress,
            },
          },
        }));
      },
      recordEndingSeen: (ending) => {
        const metrics = { ...get().metrics };
        if (ending === "golden") {
          metrics.endingGoldenSeen = 1;
        }
        if (ending === "ashes") {
          metrics.endingAshesSeen = 1;
        }
        metrics.endingsSeen = metrics.endingGoldenSeen + metrics.endingAshesSeen;
        const { nextProgress, unlockedToasts } = evaluateUnlocks(
          metrics,
          get().progress,
        );
        set((state) => ({
          metrics,
          progress: nextProgress,
          toasts: [...state.toasts, ...unlockedToasts],
          scopes: {
            ...state.scopes,
            [state.activeScopeId]: {
              metrics,
              progress: nextProgress,
            },
          },
        }));
      },
      dismissToast: (achievementId) =>
        set((state) => ({
          toasts: state.toasts.filter((toast) => toast.id !== achievementId),
        })),
      resetAchievements: () =>
        set((state) => {
          const emptyScope = buildEmptyScopeState();
          return {
            metrics: cloneAchievementMetrics(emptyScope.metrics),
            progress: cloneAchievementProgress(emptyScope.progress),
            toasts: [],
            scopes: {
              ...state.scopes,
              [state.activeScopeId]: emptyScope,
            },
          };
        }),
    }),
    {
      name: "achievement-store-v1",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        metrics: state.metrics,
        progress: state.progress,
        scopes: state.scopes,
        activeScopeId: state.activeScopeId,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          const scopes = state.scopes;
          const activeScopeId = state.activeScopeId || DEFAULT_SCOPE_ID;
          if (!scopes || Object.keys(scopes).length === 0) {
            state.scopes = {
              [activeScopeId]: {
                metrics: normalizeAchievementMetrics(state.metrics),
                progress: state.progress ?? buildInitialProgress(),
              },
            };
          }
          const activeScope =
            state.scopes[activeScopeId] ??
            state.scopes[DEFAULT_SCOPE_ID] ??
            buildEmptyScopeState();
          state.activeScopeId = activeScopeId;
          state.metrics = cloneAchievementMetrics(activeScope.metrics);
          state.progress = cloneAchievementProgress(activeScope.progress);
        }
        state?.markHydrated(true);
      },
    },
  ),
);
