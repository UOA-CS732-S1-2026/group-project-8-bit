import { beforeEach, describe, expect, it, vi } from "vitest";

import { totalXpForLevel } from "@/game/core/level";
import type { BattleReward, Quest } from "@/game/core/types";
import { buildInitialPlayer, createPlayerStorageKey } from "@/lib/player";
import { createMCStore, defaultPlayer } from "./mcStore";

function createMemoryLocalStorage() {
  const items = new Map<string, string>();

  return {
    getItem: vi.fn((key: string) => items.get(key) ?? null),
    setItem: vi.fn((key: string, value: string) => {
      items.set(key, value);
    }),
    removeItem: vi.fn((key: string) => {
      items.delete(key);
    }),
    clear: vi.fn(() => {
      items.clear();
    }),
    read: (key: string) => items.get(key) ?? null,
  };
}

function createReward(overrides: Partial<BattleReward> = {}): BattleReward {
  return {
    enemyId: "forest-wisp",
    enemyName: "Forest Wisp",
    baseXp: 10,
    finalXp: totalXpForLevel(2),
    baseCoins: 12,
    finalCoins: 25,
    bestCombo: 3,
    avgAnswerTimeMs: 1_000,
    burstClicks: 0,
    assistBreakdown: {
      standardUses: 0,
      strongUses: 0,
    },
    ...overrides,
  };
}

function createQuest(id: string): Quest {
  return {
    id,
    title: `Quest ${id}`,
    description: `Description ${id}`,
  };
}

beforeEach(() => {
  vi.unstubAllGlobals();
});

describe("createMCStore", () => {
  it("starts with the default player and empty context", () => {
    const store = createMCStore();

    expect(store.getState()).toMatchObject({
      player: defaultPlayer,
      storageKey: createPlayerStorageKey(),
      userId: null,
    });
    expect(store.getState().readPlayer()).toEqual(defaultPlayer);
  });

  it("saves and normalizes a player", () => {
    const store = createMCStore();

    store.getState().savePlayer({
      ...defaultPlayer,
      name: "Ada",
      hp: 999,
      coins: -10,
    });

    expect(store.getState().player).toMatchObject({
      name: "Ada",
      hp: defaultPlayer.maxHp,
      coins: 0,
    });
  });

  it("hydrates and clears player context", () => {
    const store = createMCStore();

    store.getState().hydratePlayer("user-1", {
      ...defaultPlayer,
      name: "Ada",
      coins: 40,
    });

    expect(store.getState()).toMatchObject({
      userId: "user-1",
      storageKey: createPlayerStorageKey(),
      player: expect.objectContaining({
        name: "Ada",
        coins: 40,
      }),
    });

    store.getState().clearPlayerContext();

    expect(store.getState()).toMatchObject({
      userId: null,
      storageKey: createPlayerStorageKey(),
      player: defaultPlayer,
    });
  });

  it("updates HP with clamped set, add, damage, and restore actions", () => {
    const store = createMCStore();

    store.getState().setHp(150);
    expect(store.getState().player.hp).toBe(100);

    store.getState().applyDamage(35);
    expect(store.getState().player.hp).toBe(65);

    store.getState().addHp(20);
    expect(store.getState().player.hp).toBe(85);

    store.getState().applyDamage(999);
    expect(store.getState().player.hp).toBe(0);

    store.getState().restoreHpToFull();
    expect(store.getState().player.hp).toBe(100);
  });

  it("updates experience, level progression, and battle rewards", () => {
    const store = createMCStore();

    store.getState().setExp(totalXpForLevel(2));
    expect(store.getState().player).toMatchObject({
      level: 2,
      exp: totalXpForLevel(2),
      maxHp: 110,
      attack: 12,
      defense: 6,
    });

    store.getState().addExp(totalXpForLevel(3));
    expect(store.getState().player.level).toBe(3);

    store.getState().grantBattleRewards(createReward({ finalCoins: 30 }));
    expect(store.getState().player.coins).toBe(30);
    expect(store.getState().player.exp).toBeGreaterThan(totalXpForLevel(3));
  });

  it("updates coins with clamping", () => {
    const store = createMCStore();

    store.getState().setCoins(20);
    expect(store.getState().player.coins).toBe(20);

    store.getState().addCoins(15);
    expect(store.getState().player.coins).toBe(35);

    store.getState().addCoins(-100);
    expect(store.getState().player.coins).toBe(0);
  });

  it("buys, adds, reduces, and restocks support properties", () => {
    const store = createMCStore();

    store.getState().setCoins(120);

    expect(store.getState().buyProperty("hourglass", 2)).toBe(true);
    expect(store.getState().player.coins).toBe(80);
    expect(
      store
        .getState()
        .player.inventory.find((property) => property.id === "hourglass")
        ?.leftNumber,
    ).toBe(3);

    expect(store.getState().buyProperty("analyze", 999)).toBe(false);
    expect(store.getState().addProperty("barrier", 2)).toBe(true);
    expect(store.getState().reduceProperty("barrier", 2)).toBe(true);
    expect(store.getState().reduceProperty("barrier", 999)).toBe(false);

    store.getState().reduceProperty("chainGuard", 1);
    store.getState().restockSupportTools(2);

    expect(
      store.getState().player.inventory.map((property) => property.leftNumber),
    ).toEqual([2, 3, 2, 2]);
  });

  it("rejects invalid property amounts", () => {
    const store = createMCStore();

    expect(store.getState().buyProperty("analyze", 0)).toBe(false);
    expect(store.getState().addProperty("analyze", -1)).toBe(false);
    expect(store.getState().reduceProperty("analyze", 1.5)).toBe(false);

    const beforeInventory = store.getState().player.inventory;
    store.getState().restockSupportTools(0);

    expect(store.getState().player.inventory).toBe(beforeInventory);
  });

  it("updates location and quest state", () => {
    const store = createMCStore();
    const firstQuest = createQuest("q1");
    const secondQuest = createQuest("q2");

    store.getState().setLocation("tavern");
    store.getState().startQuest(firstQuest);
    store.getState().startQuest(secondQuest);
    store.getState().completeQuest(firstQuest);

    expect(store.getState().player.location).toBe("tavern");
    expect(store.getState().player.activeQuest).toEqual([secondQuest]);
    expect(store.getState().player.completedQuests).toEqual([firstQuest]);
  });

  it("resets player while preserving the current name fallback", () => {
    const store = createMCStore();

    store.getState().savePlayer({
      ...defaultPlayer,
      name: "Ada",
      coins: 50,
    });

    store.getState().resetPlayer("   ");

    expect(store.getState().player).toEqual(buildInitialPlayer("Ada"));

    store.getState().resetPlayer("Grace");
    expect(store.getState().player).toEqual(buildInitialPlayer("Grace"));
  });

  it("reads and writes persisted players through localStorage", () => {
    const localStorage = createMemoryLocalStorage();
    vi.stubGlobal("window", { localStorage });
    const store = createMCStore();
    const player = {
      ...defaultPlayer,
      name: "Persisted",
      coins: 45,
    };

    store.getState().savePersistPlayer(player, "slot1");

    const storageKey = createPlayerStorageKey("slot1");
    expect(JSON.parse(localStorage.read(storageKey) ?? "{}")).toMatchObject({
      name: "Persisted",
      coins: 45,
    });
    expect(store.getState().readPersistPlayer("slot1")).toMatchObject({
      name: "Persisted",
      coins: 45,
    });
  });

  it("returns null when persisted player data is missing or invalid", () => {
    const localStorage = createMemoryLocalStorage();
    vi.stubGlobal("window", { localStorage });
    const store = createMCStore();

    expect(store.getState().readPersistPlayer("slot1")).toBeNull();

    localStorage.setItem(createPlayerStorageKey("slot1"), "{invalid-json");

    expect(store.getState().readPersistPlayer("slot1")).toBeNull();
  });

});
