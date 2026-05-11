import { beforeEach, describe, expect, it } from "vitest";
import { EMPTY_ACHIEVEMENT_METRICS } from "@/lib/achievement-data";
import { useAchievementStore } from "./achievementStore";

function buildEmptyProgress() {
  return Object.fromEntries(
    Object.keys(useAchievementStore.getState().progress).map((key) => [
      key,
      { value: 0, unlockedAt: null },
    ]),
  );
}

function buildEmptyMetrics() {
  return { ...EMPTY_ACHIEVEMENT_METRICS };
}

function resetStore() {
  const progress = buildEmptyProgress();
  const metrics = buildEmptyMetrics();
  useAchievementStore.setState({
    metrics,
    progress,
    toasts: [],
    scopes: {
      "local:auto": {
        metrics,
        progress,
      },
    },
    activeScopeId: "local:auto",
    hasHydrated: true,
  });
}

describe("achievementStore", () => {
  beforeEach(() => {
    resetStore();
  });

  it("unlocks first win achievement and creates toast", () => {
    useAchievementStore
      .getState()
      .recordBattleCompletion({ outcome: "won", reward: null }, 3);

    const state = useAchievementStore.getState();
    const firstBlood = state.progress["battle_win_1"];

    expect(firstBlood?.unlockedAt).not.toBeNull();
    expect(state.toasts.some((item) => item.id === "battle_win_1")).toBe(true);
  });

  it("tracks support tool usage and unlocks tool milestone", () => {
    const store = useAchievementStore.getState();
    for (let index = 0; index < 5; index += 1) {
      store.recordSupportToolUse("hourglass", false);
    }

    const state = useAchievementStore.getState();
    expect(state.metrics.toolsUsed).toBe(5);
    expect(state.progress["tools_5"]?.unlockedAt).not.toBeNull();
  });

  it("tracks battle results without mutating the completion payload", () => {
    const completion = {
      outcome: "won" as const,
      reward: {
        enemyId: "ash-hound",
        enemyName: "Ash Hound",
        baseXp: 12,
        finalXp: 18,
        baseCoins: 8,
        finalCoins: 11,
        bestCombo: 7,
        avgAnswerTimeMs: 900,
        burstClicks: 0,
        assistBreakdown: {
          standardUses: 1,
          strongUses: 0,
        },
      },
    };
    const snapshot = structuredClone(completion);

    useAchievementStore.getState().recordBattleCompletion(completion, 7);

    const state = useAchievementStore.getState();
    expect(completion).toEqual(snapshot);
    expect(state.metrics.battlesWon).toBe(1);
    expect(state.metrics.bestComboEver).toBe(7);
    expect(state.progress["battle_win_1"]?.unlockedAt).not.toBeNull();
    expect(state.progress["combo_5"]?.unlockedAt).not.toBeNull();
  });

  it("keeps achievement progress isolated per scope and restores it on load", () => {
    const store = useAchievementStore.getState();

    store.recordCoinsSnapshot(220);
    store.copyActiveScopeTo("local:slot:slot1");

    store.setActiveScope("local:slot:slot2");
    expect(useAchievementStore.getState().progress["wallet_200"]?.unlockedAt).toBeNull();
    expect(useAchievementStore.getState().metrics.highestCoinsHeld).toBe(0);

    store.setActiveScope("local:slot:slot1");
    expect(useAchievementStore.getState().progress["wallet_200"]?.unlockedAt).not.toBeNull();
    expect(useAchievementStore.getState().metrics.highestCoinsHeld).toBe(220);
  });

  it("resets only the active scope for a new character flow", () => {
    const store = useAchievementStore.getState();

    store.recordCoinsSnapshot(220);
    store.copyActiveScopeTo("local:slot:slot1");

    store.setActiveScope("character:new-run");
    store.recordLevelReached(5);
    store.resetAchievements();

    const state = useAchievementStore.getState();
    expect(state.activeScopeId).toBe("character:new-run");
    expect(state.metrics).toEqual(buildEmptyMetrics());
    expect(state.progress["level_3"]?.unlockedAt).toBeNull();
    expect(state.progress["wallet_200"]?.unlockedAt).toBeNull();

    store.setActiveScope("local:slot:slot1");
    expect(useAchievementStore.getState().progress["wallet_200"]?.unlockedAt).not.toBeNull();
  });

  it("unlocks ending achievements including the hidden dual-ending milestone", () => {
    const store = useAchievementStore.getState();

    store.recordEndingSeen("golden");
    expect(useAchievementStore.getState().progress["ending_golden"]?.unlockedAt).not.toBeNull();
    expect(useAchievementStore.getState().progress["ending_dual_truth"]?.unlockedAt).toBeNull();

    store.recordEndingSeen("ashes");
    const state = useAchievementStore.getState();
    expect(state.progress["ending_ashes"]?.unlockedAt).not.toBeNull();
    expect(state.progress["ending_dual_truth"]?.unlockedAt).not.toBeNull();
  });

  it("exports cloud data and hydrates a scope from it without creating toasts", () => {
    const store = useAchievementStore.getState();

    store.recordCoinsSnapshot(220);
    store.recordBattleCompletion({ outcome: "won", reward: null }, 9);

    const cloudData = store.exportActiveCloudData();
    store.hydrateScopeFromCloudData("cloud:slot:slot1", cloudData);

    const state = useAchievementStore.getState();
    expect(state.activeScopeId).toBe("cloud:slot:slot1");
    expect(state.metrics.highestCoinsHeld).toBe(220);
    expect(state.metrics.battlesWon).toBe(1);
    expect(state.progress["wallet_200"]?.unlockedAt).not.toBeNull();
    expect(state.progress["battle_win_1"]?.unlockedAt).not.toBeNull();
    expect(state.toasts).toEqual([]);
  });
});
