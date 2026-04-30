import { describe, expect, it } from "vitest";

import {
  applyLevelProgression,
  baseEnemyXp,
  battleXpPaceRatio,
  discoveryXp,
  enemyXpReward,
  levelDiffMultiplier,
  levelForTotalXp,
  levelGrowth,
  maxLevel,
  pacedBattleXpFloor,
  questXp,
  totalXpForLevel,
  xpIntoCurrentLevel,
  xpRemainingToNextLevel,
  xpToNextLevel,
} from "./level";
import type { Player } from "./types";

function createPlayer(overrides: Partial<Player> = {}): Player {
  return {
    name: "Tester",
    level: 1,
    hp: 30,
    maxHp: 50,
    attack: 6,
    defense: 3,
    exp: 0,
    coins: 0,
    location: "mainHub",
    activeQuest: null,
    completedQuests: null,
    inventory: [],
    ...overrides,
  };
}

describe("level experience curve", () => {
  it("calculates the XP required for the next level", () => {
    expect(xpToNextLevel(1)).toBe(105);
    expect(xpToNextLevel(2)).toBe(170);
    expect(xpToNextLevel(3)).toBe(255);
  });

  it("calculates the total XP needed to reach a target level", () => {
    expect(totalXpForLevel(1)).toBe(0);
    expect(totalXpForLevel(2)).toBe(105);
    expect(totalXpForLevel(3)).toBe(275);
    expect(totalXpForLevel(4)).toBe(530);
  });

  it("derives the current level from total XP", () => {
    expect(levelForTotalXp(-25)).toBe(1);
    expect(levelForTotalXp(0)).toBe(1);
    expect(levelForTotalXp(104)).toBe(1);
    expect(levelForTotalXp(105)).toBe(2);
    expect(levelForTotalXp(274)).toBe(2);
    expect(levelForTotalXp(275)).toBe(3);
  });

  it("caps derived levels at the maximum level", () => {
    expect(levelForTotalXp(totalXpForLevel(maxLevel + 5))).toBe(maxLevel);
  });

  it("calculates XP progress inside the current level", () => {
    expect(xpIntoCurrentLevel(120)).toBe(15);
    expect(xpIntoCurrentLevel(-10)).toBe(0);
    expect(xpIntoCurrentLevel(280, 3)).toBe(5);
  });

  it("calculates remaining XP to the next level", () => {
    expect(xpRemainingToNextLevel(0)).toBe(105);
    expect(xpRemainingToNextLevel(120)).toBe(155);
    expect(xpRemainingToNextLevel(totalXpForLevel(maxLevel), maxLevel)).toBe(0);
  });
});

describe("applyLevelProgression", () => {
  it("adds XP without levelling when the threshold is not reached", () => {
    const result = applyLevelProgression(createPlayer(), 80);

    expect(result.player).toEqual({
      ...createPlayer(),
      exp: 80,
    });
    expect(result.levelsGained).toBe(0);
    expect(result.statIncreases).toEqual({
      maxHp: 0,
      attack: 0,
      defense: 0,
    });
  });

  it("levels up and applies stat growth when enough XP is gained", () => {
    const result = applyLevelProgression(createPlayer(), totalXpForLevel(2));

    expect(result.player.level).toBe(2);
    expect(result.player.exp).toBe(totalXpForLevel(2));
    expect(result.player.maxHp).toBe(50 + levelGrowth.maxHp);
    expect(result.player.hp).toBe(30 + levelGrowth.maxHp);
    expect(result.player.attack).toBe(6 + levelGrowth.attack);
    expect(result.player.defense).toBe(3 + levelGrowth.defense);
    expect(result.levelsGained).toBe(1);
    expect(result.statIncreases).toEqual(levelGrowth);
  });

  it("can apply multiple level-ups from a single XP gain", () => {
    const result = applyLevelProgression(createPlayer(), totalXpForLevel(3));

    expect(result.player.level).toBe(3);
    expect(result.player.maxHp).toBe(50 + levelGrowth.maxHp * 2);
    expect(result.player.hp).toBe(30 + levelGrowth.maxHp * 2);
    expect(result.player.attack).toBe(6 + levelGrowth.attack * 2);
    expect(result.player.defense).toBe(3 + levelGrowth.defense * 2);
    expect(result.levelsGained).toBe(2);
    expect(result.statIncreases).toEqual({
      maxHp: levelGrowth.maxHp * 2,
      attack: levelGrowth.attack * 2,
      defense: levelGrowth.defense * 2,
    });
  });

  it("does not heal above the new maximum HP", () => {
    const result = applyLevelProgression(
      createPlayer({ hp: 48, maxHp: 50 }),
      totalXpForLevel(2),
    );

    expect(result.player.maxHp).toBe(60);
    expect(result.player.hp).toBe(58);
  });

  it("clamps total XP at zero when XP loss exceeds current XP", () => {
    const result = applyLevelProgression(createPlayer({ exp: 20 }), -50);

    expect(result.player.exp).toBe(0);
    expect(result.player.level).toBe(1);
    expect(result.levelsGained).toBe(0);
  });

  it("does not increase level or stats beyond the maximum level", () => {
    const maxLevelPlayer = createPlayer({
      level: maxLevel,
      exp: totalXpForLevel(maxLevel),
    });
    const result = applyLevelProgression(maxLevelPlayer, 999_999);

    expect(result.player.level).toBe(maxLevel);
    expect(result.player.maxHp).toBe(maxLevelPlayer.maxHp);
    expect(result.player.attack).toBe(maxLevelPlayer.attack);
    expect(result.player.defense).toBe(maxLevelPlayer.defense);
    expect(result.levelsGained).toBe(0);
  });
});

describe("battle XP rewards", () => {
  it("calculates base enemy XP by tier", () => {
    expect(baseEnemyXp(2, "trash")).toBe(10);
    expect(baseEnemyXp(2, "normal")).toBe(20);
    expect(baseEnemyXp(2, "elite")).toBe(60);
    expect(baseEnemyXp(2, "miniboss")).toBe(126);
    expect(baseEnemyXp(2, "boss")).toBe(300);
  });

  it("calculates level difference multipliers", () => {
    expect(levelDiffMultiplier(10, 5)).toBe(1.5);
    expect(levelDiffMultiplier(8, 5)).toBe(1.25);
    expect(levelDiffMultiplier(5, 5)).toBe(1);
    expect(levelDiffMultiplier(3, 5)).toBe(0.7);
    expect(levelDiffMultiplier(0, 5)).toBe(0.4);
    expect(levelDiffMultiplier(-1, 5)).toBe(0.15);
  });

  it("calculates battle XP pacing ratios by enemy tier", () => {
    expect(battleXpPaceRatio("trash")).toBe(0.05);
    expect(battleXpPaceRatio("normal")).toBe(0.12);
    expect(battleXpPaceRatio("elite")).toBe(0.22);
    expect(battleXpPaceRatio("miniboss")).toBe(0.4);
    expect(battleXpPaceRatio("boss")).toBe(0.6);
  });

  it("calculates the paced battle XP floor", () => {
    expect(pacedBattleXpFloor(5, 5, "normal")).toBe(58);
    expect(pacedBattleXpFloor(5, 10, "boss")).toBe(436);
  });

  it("uses the larger value between existing enemy reward and pacing floor", () => {
    expect(enemyXpReward(1, 10, "trash")).toBe(10);
    expect(enemyXpReward(10, 5, "boss")).toBe(930);
  });
});

describe("quest and discovery XP", () => {
  it("calculates quest XP by tier", () => {
    expect(questXp(4, "minor")).toBe(220);
    expect(questXp(4, "standard")).toBe(420);
    expect(questXp(4, "major")).toBe(840);
    expect(questXp(4, "chapter")).toBe(1620);
  });

  it("calculates discovery XP by tier", () => {
    expect(discoveryXp(4, "small")).toBe(100);
    expect(discoveryXp(4, "hidden")).toBe(190);
    expect(discoveryXp(4, "major")).toBe(360);
  });
});
