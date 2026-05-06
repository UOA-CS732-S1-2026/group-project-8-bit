import { enemyXpReward } from "./level";
import type { BattleReward, Enemy, Player, SupportToolId } from "./types";

// Shared battle pacing values live here so handlers and UI read the same rules.
export const STANDARD_TURN_LIMIT = 10;
export const BOSS_TURN_LIMIT = 20;
export const QUESTION_TIME_LIMIT_MS = 12_000;
export const HOURGLASS_BONUS_MS = 4_000;
export const BURST_DURATION_MS = 3_000;

export function getBattleTurnLimit(isBoss: boolean): number {
  return isBoss ? BOSS_TURN_LIMIT : STANDARD_TURN_LIMIT;
}

const BASE_PLAYER_DAMAGE = 12;
const BASE_ENEMY_DAMAGE = 8;
const BASE_COIN_DIVISOR = 4;

// Tool metadata stays in the pure battle core because it drives both UI labels and rules.
export const supportToolConfigs: Record<
  SupportToolId,
  {
    id: SupportToolId;
    name: string;
    description: string;
    maxUses: number;
    strongAssist: boolean;
  }
> = {
  analyze: {
    id: "analyze",
    name: "Scripture of Unmasking",
    description: "Remove two wrong answers from the current question.",
    maxUses: 2,
    strongAssist: true,
  },
  hourglass: {
    id: "hourglass",
    name: "Suspended Sand",
    description: "Add 4 seconds to the current question timer.",
    maxUses: 1,
    strongAssist: false,
  },
  barrier: {
    id: "barrier",
    name: "Veil of Aegis",
    description: "Block the next enemy counterattack after a mistake.",
    maxUses: 1,
    strongAssist: false,
  },
  chainGuard: {
    id: "chainGuard",
    name: "Oathbound Chain",
    description: "Preserve your combo on the next wrong answer or timeout.",
    maxUses: 1,
    strongAssist: true,
  },
};

// These helpers keep combo/speed/burst math deterministic and reusable across handlers.
export function comboDamageMultiplier(streak: number): number {
  if (streak >= 5) return 1.3;
  if (streak >= 3) return 1.15;
  return 1;
}

export function comboRewardMultiplier(bestCombo: number): number {
  if (bestCombo >= 5) return 1.15;
  if (bestCombo >= 3) return 1.08;
  return 1;
}

export function speedDamageMultiplier(
  timeLeftMs: number,
  timeLimitMs: number,
): number {
  const safeLimit = Math.max(1, timeLimitMs);
  const ratio = Math.max(0, Math.min(1, timeLeftMs / safeLimit));
  return 1 + ratio * 0.25;
}

export function burstDamageMultiplier(clicks: number): number {
  return 1.5 + Math.min(0.5, clicks * 0.02);
}

export function burstRewardMultiplier(clicks: number): number {
  return 1 + Math.min(0.05, clicks * 0.0025);
}

// Player damage is purely formula-driven; turn flow decisions happen outside this file.
export function calculatePlayerDamage(args: {
  player: Player;
  enemy: Enemy;
  timeLeftMs: number;
  timeLimitMs: number;
  streak: number;
  burstClicks?: number;
}): number {
  const {
    player,
    enemy,
    timeLeftMs,
    timeLimitMs,
    streak,
    burstClicks = 0,
  } = args;

  const rawDamage =
    (BASE_PLAYER_DAMAGE +
      player.level * 2 +
      player.attack * 1.4 -
      enemy.defense * 0.7) *
    speedDamageMultiplier(timeLeftMs, timeLimitMs) *
    comboDamageMultiplier(streak) *
    burstDamageMultiplier(burstClicks);

  return Math.max(1, Math.round(rawDamage));
}

// Enemy damage is also kept pure so timeout/wrong-answer handlers can stay simple.
export function calculateEnemyDamage(player: Player, enemy: Enemy): number {
  const rawDamage =
    BASE_ENEMY_DAMAGE +
    enemy.level * 2 +
    enemy.attack * 1.2 -
    player.defense * 0.8;

  return Math.max(1, Math.round(rawDamage));
}

export function averageSpeedRatio(speedRatios: number[]): number {
  if (speedRatios.length === 0) {
    return 0;
  }

  const total = speedRatios.reduce((sum, ratio) => sum + ratio, 0);
  return total / speedRatios.length;
}

export function averageAnswerTimeMs(answerTimesMs: number[]): number {
  if (answerTimesMs.length === 0) {
    return 0;
  }

  const total = answerTimesMs.reduce((sum, answerTime) => sum + answerTime, 0);
  return total / answerTimesMs.length;
}

export function canTriggerBurst(args: {
  streak: number;
  enemy: Enemy;
  burstUsesThisBattle: number;
}): boolean {
  const { streak } = args;

  if (streak < 5) {
    return false;
  }

  return streak % 5 === 0;
}

// Enemy generation is stat construction only, not battle-session orchestration.
export function createEnemy(args: {
  id: string;
  name: string;
  level: number;
  tier?: Enemy["tier"];
  isBoss?: boolean;
}): Enemy {
  const { id, name, level, tier = "normal", isBoss = false } = args;

  const hpBonusByTier = {
    trash: 0,
    normal: 30,
    elite: 70,
    miniboss: 110,
    boss: 170,
  };

  const attackBonusByTier = {
    trash: 0,
    normal: 2,
    elite: 5,
    miniboss: 8,
    boss: 12,
  };

  const defenseBonusByTier = {
    trash: 0,
    normal: 2,
    elite: 4,
    miniboss: 6,
    boss: 8,
  };

  const normalizedTier = isBoss ? "boss" : tier;

  return {
    id,
    name,
    level,
    tier: normalizedTier,
    hp: 110 + level * 18 + hpBonusByTier[normalizedTier],
    maxHp: 110 + level * 18 + hpBonusByTier[normalizedTier],
    attack: 8 + level * 2 + attackBonusByTier[normalizedTier],
    defense: 6 + level + defenseBonusByTier[normalizedTier],
    isBoss,
    portraitPath: "/battle/monster1-portrait.png",
  };
}

export function createBaseBattleCoins(baseXp: number): number {
  return Math.max(12, Math.floor(baseXp / BASE_COIN_DIVISOR));
}

// Reward calculation stays in the core so result handlers only assemble battle outcomes.
export function calculateBattleReward(args: {
  player: Player;
  enemy: Enemy;
  turnsUsed: number;
  correctAnswers: number;
  answerTimesMs: number[];
  speedRatios: number[];
  assistUses: number;
  strongAssistUses: number;
  bestCombo: number;
  burstClicks: number;
}): BattleReward {
  const {
    player,
    enemy,
    turnsUsed,
    correctAnswers,
    answerTimesMs,
    speedRatios,
    assistUses,
    strongAssistUses,
    bestCombo,
    burstClicks,
  } = args;

  const baseXp = enemyXpReward(enemy.level, player.level, enemy.tier);
  const baseCoins = createBaseBattleCoins(baseXp);
  const accuracy = turnsUsed > 0 ? correctAnswers / turnsUsed : 0;
  const accuracyMultiplier = 0.85 + 0.4 * accuracy;
  const speedRewardMultiplier = 1 + averageSpeedRatio(speedRatios) * 0.15;
  const assistMultiplier = Math.max(
    0.75,
    1 - assistUses * 0.05 - strongAssistUses * 0.1,
  );
  const totalRewardMultiplier =
    accuracyMultiplier *
    speedRewardMultiplier *
    comboRewardMultiplier(bestCombo) *
    assistMultiplier *
    burstRewardMultiplier(burstClicks);

  return {
    enemyId: enemy.id,
    enemyName: enemy.name,
    baseXp,
    finalXp: Math.floor(baseXp * totalRewardMultiplier),
    baseCoins,
    finalCoins: Math.floor(baseCoins * totalRewardMultiplier),
    bestCombo,
    avgAnswerTimeMs: averageAnswerTimeMs(answerTimesMs),
    burstClicks,
    assistBreakdown: {
      standardUses: assistUses,
      strongUses: strongAssistUses,
    },
  };
}
