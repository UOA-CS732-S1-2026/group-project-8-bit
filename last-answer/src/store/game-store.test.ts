import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { PLAYER_SAVE_SLOT_IDS } from "@/lib/save-slots";

function createMemoryStorage() {
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
  };
}

async function loadGameStore() {
  vi.resetModules();

  const localStorage = createMemoryStorage();
  vi.stubGlobal("localStorage", localStorage);

  const storeModule = await import("./game-store");

  storeModule.useGameStore.getState().resetGameSettings();

  return {
    ...storeModule,
    localStorage,
  };
}

beforeEach(() => {
  vi.resetModules();
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("useGameStore", () => {
  it("starts with empty game settings", async () => {
    const { useGameStore } = await loadGameStore();

    expect(useGameStore.getState().readGameSettings()).toEqual({
      category: null,
      difficulty: null,
      type: null,
    });
  });

  it("updates category, difficulty, and question type independently", async () => {
    const { useGameStore } = await loadGameStore();

    useGameStore.getState().setCategory("18");
    useGameStore.getState().setDifficulty("hard");
    useGameStore.getState().setType("boolean");

    expect(useGameStore.getState().readGameSettings()).toEqual({
      category: "18",
      difficulty: "hard",
      type: "boolean",
    });
  });

  it("applies partial game settings without clearing unrelated fields", async () => {
    const { useGameStore } = await loadGameStore();

    useGameStore.getState().setCategory("23");
    useGameStore.getState().setType("multiple");
    useGameStore.getState().setGameSettings({ difficulty: "medium" });

    expect(useGameStore.getState().readGameSettings()).toEqual({
      category: "23",
      difficulty: "medium",
      type: "multiple",
    });
  });

  it("resets game settings to defaults", async () => {
    const { useGameStore } = await loadGameStore();

    useGameStore.getState().setGameSettings({
      category: "18",
      difficulty: "easy",
      type: "multiple",
    });
    useGameStore.getState().resetGameSettings();

    expect(useGameStore.getState().readGameSettings()).toEqual({
      category: null,
      difficulty: null,
      type: null,
    });
  });

  it("exposes save slots from the shared slot list", async () => {
    const { gameSlots } = await loadGameStore();

    expect(gameSlots).toEqual([...PLAYER_SAVE_SLOT_IDS]);
    expect(gameSlots).not.toBe(PLAYER_SAVE_SLOT_IDS);
  });
});
