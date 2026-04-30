import { describe, expect, it } from "vitest";

import {
  BOSS_TURN_LIMIT,
  STANDARD_TURN_LIMIT,
  averageAnswerTimeMs,
  averageSpeedRatio,
  burstDamageMultiplier,
  burstRewardMultiplier,
  calculateBattleReward,
  calculateEnemyDamage,
  calculatePlayerDamage,
  canTriggerBurst,
  comboDamageMultiplier,
  comboRewardMultiplier,
  createBaseBattleCoins,
  createEnemy,
  getBattleTurnLimit,
  speedDamageMultiplier,
  supportToolConfigs,
} from "./battleCore";
import type { Enemy, Player } from "./types";

function createPlayer(overrides: Partial<Player> = {}): Player {
  return {
    name: "Tester",
    level: 3,
    hp: 45,
    maxHp: 60,
    attack: 10,
    defense: 5,
    exp: 0,
    coins: 0,
    location: "mainHub",
    activeQuest: null,
    completedQuests: null,
    inventory: [],
    ...overrides,
  };
}

function createTestEnemy(overrides: Partial<Enemy> = {}): Enemy {
  return {
    id: "training-wisp",
    name: "Training Wisp",
    level: 3,
    tier: "normal",
    hp: 100,
    maxHp: 100,
    attack: 10,
    defense: 4,
    isBoss: false,
    ...overrides,
  };
}

describe("battle pacing", () => {
  it("uses the standard turn limit for normal battles", () => {
    expect(getBattleTurnLimit(false)).toBe(STANDARD_TURN_LIMIT);
    expect(STANDARD_TURN_LIMIT).toBe(10);
  });

  it("uses the boss turn limit for boss battles", () => {
    expect(getBattleTurnLimit(true)).toBe(BOSS_TURN_LIMIT);
    expect(BOSS_TURN_LIMIT).toBe(20);
  });
});

describe("battle multipliers", () => {
  it("calculates combo damage multipliers by streak threshold", () => {
    expect(comboDamageMultiplier(0)).toBe(1);
    expect(comboDamageMultiplier(2)).toBe(1);
    expect(comboDamageMultiplier(3)).toBe(1.15);
    expect(comboDamageMultiplier(5)).toBe(1.3);
  });

  it("calculates combo reward multipliers by best combo threshold", () => {
    expect(comboRewardMultiplier(0)).toBe(1);
    expect(comboRewardMultiplier(2)).toBe(1);
    expect(comboRewardMultiplier(3)).toBe(1.08);
    expect(comboRewardMultiplier(5)).toBe(1.15);
  });

  it("clamps speed damage multiplier between no bonus and full bonus", () => {
    expect(speedDamageMultiplier(-1_000, 12_000)).toBe(1);
    expect(speedDamageMultiplier(6_000, 12_000)).toBe(1.125);
    expect(speedDamageMultiplier(12_000, 12_000)).toBe(1.25);
    expect(speedDamageMultiplier(24_000, 12_000)).toBe(1.25);
    expect(speedDamageMultiplier(1_000, 0)).toBe(1.25);
  });

  it("caps burst damage and reward multipliers", () => {
    expect(burstDamageMultiplier(0)).toBe(1.5);
    expect(burstDamageMultiplier(10)).toBe(1.7);
    expect(burstDamageMultiplier(100)).toBe(2);
    expect(burstRewardMultiplier(0)).toBe(1);
    expect(burstRewardMultiplier(10)).toBe(1.025);
    expect(burstRewardMultiplier(100)).toBe(1.05);
  });
});

describe("damage calculation", () => {
  it("calculates player damage from player stats, enemy defense, speed, combo, and burst clicks", () => {
    const damage = calculatePlayerDamage({
      player: createPlayer({ level: 2, attack: 10 }),
      enemy: createTestEnemy({ defense: 4 }),
      timeLeftMs: 12_000,
      timeLimitMs: 12_000,
      streak: 3,
      burstClicks: 0,
    });

    expect(damage).toBe(59);
  });

  it("increases player damage when burst clicks increase", () => {
    const baseDamage = calculatePlayerDamage({
      player: createPlayer(),
      enemy: createTestEnemy(),
      timeLeftMs: 6_000,
      timeLimitMs: 12_000,
      streak: 0,
      burstClicks: 0,
    });
    const burstDamage = calculatePlayerDamage({
      player: createPlayer(),
      enemy: createTestEnemy(),
      timeLeftMs: 6_000,
      timeLimitMs: 12_000,
      streak: 0,
      burstClicks: 10,
    });

    expect(burstDamage).toBeGreaterThan(baseDamage);
  });

  it("keeps player damage at a minimum of 1", () => {
    const damage = calculatePlayerDamage({
      player: createPlayer({ level: 1, attack: 0 }),
      enemy: createTestEnemy({ defense: 999 }),
      timeLeftMs: 0,
      timeLimitMs: 12_000,
      streak: 0,
    });

    expect(damage).toBe(1);
  });

  it("calculates enemy damage from enemy stats and player defense", () => {
    expect(calculateEnemyDamage(createPlayer(), createTestEnemy())).toBe(22);
  });

  it("keeps enemy damage at a minimum of 1", () => {
    expect(
      calculateEnemyDamage(
        createPlayer({ defense: 999 }),
        createTestEnemy({ level: 1, attack: 0 }),
      ),
    ).toBe(1);
  });
});

describe("battle averages and burst triggers", () => {
  it("calculates average speed ratio and answer time", () => {
    expect(averageSpeedRatio([])).toBe(0);
    expect(averageSpeedRatio([1, 0.5, 0.25])).toBeCloseTo(0.5833, 4);
    expect(averageAnswerTimeMs([])).toBe(0);
    expect(averageAnswerTimeMs([1_000, 2_000, 3_000])).toBe(2_000);
  });

  it("allows burst only on non-zero multiples of five streaks", () => {
    const enemy = createTestEnemy();

    expect(
      canTriggerBurst({ streak: 4, enemy, burstUsesThisBattle: 0 }),
    ).toBe(false);
    expect(
      canTriggerBurst({ streak: 5, enemy, burstUsesThisBattle: 0 }),
    ).toBe(true);
    expect(
      canTriggerBurst({ streak: 6, enemy, burstUsesThisBattle: 0 }),
    ).toBe(false);
    expect(
      canTriggerBurst({ streak: 10, enemy, burstUsesThisBattle: 1 }),
    ).toBe(true);
  });
});

describe("enemy and support config", () => {
  it("creates a normal enemy with tier-based stats", () => {
    expect(
      createEnemy({
        id: "wisp",
        name: "Wisp",
        level: 2,
        tier: "normal",
      }),
    ).toEqual({
      id: "wisp",
      name: "Wisp",
      level: 2,
      tier: "normal",
      hp: 176,
      maxHp: 176,
      attack: 14,
      defense: 10,
      isBoss: false,
    });
  });

  it("normalizes boss enemies to the boss tier", () => {
    const enemy = createEnemy({
      id: "lord",
      name: "Forest Lord",
      level: 4,
      tier: "normal",
      isBoss: true,
    });

    expect(enemy.tier).toBe("boss");
    expect(enemy.hp).toBe(352);
    expect(enemy.maxHp).toBe(352);
    expect(enemy.attack).toBe(28);
    expect(enemy.defense).toBe(18);
    expect(enemy.isBoss).toBe(true);
  });

  it("defines support tool limits and strong assist metadata", () => {
    expect(supportToolConfigs.analyze.maxUses).toBe(2);
    expect(supportToolConfigs.analyze.strongAssist).toBe(true);
    expect(supportToolConfigs.hourglass.maxUses).toBe(1);
    expect(supportToolConfigs.hourglass.strongAssist).toBe(false);
    expect(supportToolConfigs.barrier.maxUses).toBe(1);
    expect(supportToolConfigs.chainGuard.strongAssist).toBe(true);
  });
});

describe("battle rewards", () => {
  it("creates base battle coins with a minimum value", () => {
    expect(createBaseBattleCoins(20)).toBe(12);
    expect(createBaseBattleCoins(100)).toBe(25);
  });

  it("calculates final rewards from accuracy, speed, combo, assists, and burst clicks", () => {
    const reward = calculateBattleReward({
      player: createPlayer({ level: 5 }),
      enemy: createTestEnemy({
        id: "forest-wisp",
        name: "Forest Wisp",
        level: 5,
        tier: "normal",
      }),
      turnsUsed: 5,
      correctAnswers: 4,
      answerTimesMs: [1_000, 2_000, 3_000],
      speedRatios: [1, 0.5],
      assistUses: 1,
      strongAssistUses: 1,
      bestCombo: 5,
      burstClicks: 10,
    });

    expect(reward).toEqual({
      enemyId: "forest-wisp",
      enemyName: "Forest Wisp",
      baseXp: 58,
      finalXp: 75,
      baseCoins: 14,
      finalCoins: 18,
      bestCombo: 5,
      avgAnswerTimeMs: 2_000,
      burstClicks: 10,
      assistBreakdown: {
        standardUses: 1,
        strongUses: 1,
      },
    });
  });

  it("uses zero accuracy when no turns were used", () => {
    const reward = calculateBattleReward({
      player: createPlayer({ level: 1 }),
      enemy: createTestEnemy({ level: 1, tier: "trash" }),
      turnsUsed: 0,
      correctAnswers: 0,
      answerTimesMs: [],
      speedRatios: [],
      assistUses: 10,
      strongAssistUses: 10,
      bestCombo: 0,
      burstClicks: 0,
    });

    expect(reward.finalXp).toBe(Math.floor(reward.baseXp * 0.85 * 0.75));
    expect(reward.finalCoins).toBe(
      Math.floor(reward.baseCoins * 0.85 * 0.75),
    );
    expect(reward.avgAnswerTimeMs).toBe(0);
    expect(reward.assistBreakdown).toEqual({
      standardUses: 10,
      strongUses: 10,
    });
  });
});
