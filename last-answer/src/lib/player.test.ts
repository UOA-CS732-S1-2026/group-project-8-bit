import { describe, expect, it } from "vitest";

import { totalXpForLevel } from "@/game/core/level";
import {
  DEFAULT_STORAGE_KEY_PREFIX,
  buildInitialPlayer,
  clampHp,
  clampStat,
  createPlayerStorageKey,
  defaultPlayer,
  normalizeInventory,
  normalizePlayer,
  normalizePropertyAmount,
} from "./player";

describe("player defaults", () => {
  it("builds an initial player with the provided name", () => {
    expect(buildInitialPlayer("Ada")).toEqual({
      ...defaultPlayer,
      name: "Ada",
    });
  });

  it("falls back to the default player name when no name is provided", () => {
    expect(buildInitialPlayer().name).toBe(defaultPlayer.name);
  });
});

describe("player storage keys", () => {
  it("uses the default key for anonymous local storage", () => {
    expect(createPlayerStorageKey()).toBe(DEFAULT_STORAGE_KEY_PREFIX);
    expect(createPlayerStorageKey(null, "slot1")).toBe(
      DEFAULT_STORAGE_KEY_PREFIX,
    );
  });

  it("scopes the storage key by user and slot", () => {
    expect(createPlayerStorageKey("user-1", "slot3")).toBe(
      `${DEFAULT_STORAGE_KEY_PREFIX}:user-1-slot3`,
    );
  });
});

describe("player normalization helpers", () => {
  it("clamps stats and HP to safe ranges", () => {
    expect(clampStat(-5)).toBe(0);
    expect(clampStat(12)).toBe(12);
    expect(clampHp(-5, 100)).toBe(0);
    expect(clampHp(120, 100)).toBe(100);
    expect(clampHp(80, 100)).toBe(80);
  });

  it("normalizes property amounts", () => {
    expect(normalizePropertyAmount()).toBe(1);
    expect(normalizePropertyAmount(3)).toBe(3);
    expect(normalizePropertyAmount(0)).toBeNull();
    expect(normalizePropertyAmount(-1)).toBeNull();
    expect(normalizePropertyAmount(1.5)).toBeNull();
  });

  it("normalizes inventory against the default support tools", () => {
    expect(
      normalizeInventory([
        { id: "analyze", leftNumber: 3, price: 999 },
        { id: "hourglass", leftNumber: -2, price: 999 },
      ]),
    ).toEqual([
      { id: "analyze", leftNumber: 3, price: 60 },
      { id: "hourglass", leftNumber: 0, price: 20 },
      { id: "barrier", leftNumber: 1, price: 50 },
      { id: "chainGuard", leftNumber: 1, price: 30 },
    ]);
  });
});

describe("normalizePlayer", () => {
  it("returns the normalized default player for missing input", () => {
    expect(normalizePlayer()).toEqual(defaultPlayer);
    expect(normalizePlayer(null)).toEqual(defaultPlayer);
  });

  it("clamps unsafe numeric values", () => {
    expect(
      normalizePlayer({
        hp: -10,
        exp: -50,
        coins: -20,
      }),
    ).toMatchObject({
      hp: 0,
      exp: 0,
      coins: 0,
      level: 1,
    });
  });

  it("caps HP at the normalized maximum HP", () => {
    expect(
      normalizePlayer({
        hp: 999,
        maxHp: 100,
      }).hp,
    ).toBe(100);
  });

  it("rebuilds level and stats from total XP", () => {
    const player = normalizePlayer({
      exp: totalXpForLevel(3),
      hp: 95,
    });

    expect(player).toMatchObject({
      level: 3,
      exp: totalXpForLevel(3),
      maxHp: 120,
      attack: 14,
      defense: 7,
      hp: 95,
    });
  });

  it("preserves supported profile and progress fields", () => {
    expect(
      normalizePlayer({
        name: "Grace",
        coins: 42,
        location: "tavern",
        inventory: [{ id: "barrier", leftNumber: 4, price: 999 }],
      }),
    ).toMatchObject({
      name: "Grace",
      coins: 42,
      location: "tavern",
      inventory: [
        { id: "analyze", leftNumber: 1, price: 60 },
        { id: "hourglass", leftNumber: 1, price: 20 },
        { id: "barrier", leftNumber: 4, price: 50 },
        { id: "chainGuard", leftNumber: 1, price: 30 },
      ],
    });
  });
});
