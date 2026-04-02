import type { Player } from "./types";

export const maxLevel = 30;
export type EnemyTier = "trash" | "normal" | "elite" | "miniboss" | "boss";
export type QuestTier = "minor" | "standard" | "major" | "chapter";
export type DiscoveryTier = "small" | "hidden" | "major";
export const levelGrowth = {
  maxHp: 10,
  attack: 2,
  defense: 1,
} as const;

export function xpToNextLevel(level: number): number {
  return Math.floor(60 + level * 35 + level * level * 10);
}

export function totalXpForLevel(targetLevel: number): number {
  let total = 0;
  for (let level = 1; level < targetLevel; level++) {
    total += xpToNextLevel(level);
  }
  return total;
}

export function levelForTotalXp(totalXp: number): number {
  const safeXp = Math.max(0, totalXp);
  let level = 1;

  while (level < maxLevel && safeXp >= totalXpForLevel(level + 1)) {
    level += 1;
  }

  return level;
}

export function xpIntoCurrentLevel(
  totalXp: number,
  level: number = levelForTotalXp(totalXp),
): number {
  return Math.max(0, totalXp - totalXpForLevel(level));
}

export function xpRemainingToNextLevel(
  totalXp: number,
  level: number = levelForTotalXp(totalXp),
): number {
  if (level >= maxLevel) {
    return 0;
  }

  return Math.max(0, totalXpForLevel(level + 1) - totalXp);
}

export function applyLevelProgression(
  player: Player,
  xpGained: number,
): {
  player: Player;
  levelsGained: number;
  statIncreases: {
    maxHp: number;
    attack: number;
    defense: number;
  };
} {
  const nextPlayer = {
    ...player,
    exp: Math.max(0, player.exp + xpGained),
  };

  let levelsGained = 0;
  let hpGain = 0;
  let attackGain = 0;
  let defenseGain = 0;

  while (
    nextPlayer.level < maxLevel &&
    nextPlayer.exp >= totalXpForLevel(nextPlayer.level + 1)
  ) {
    nextPlayer.level += 1;
    nextPlayer.maxHp += levelGrowth.maxHp;
    nextPlayer.hp = Math.min(
      nextPlayer.maxHp,
      nextPlayer.hp + levelGrowth.maxHp,
    );
    nextPlayer.attack += levelGrowth.attack;
    nextPlayer.defense += levelGrowth.defense;

    levelsGained += 1;
    hpGain += levelGrowth.maxHp;
    attackGain += levelGrowth.attack;
    defenseGain += levelGrowth.defense;
  }

  return {
    player: nextPlayer,
    levelsGained,
    statIncreases: {
      maxHp: hpGain,
      attack: attackGain,
      defense: defenseGain,
    },
  };
}

export function baseEnemyXp(enemyLevel: number, tier: EnemyTier): number {
  switch (tier) {
    case "trash":
      return 6 + enemyLevel * 2;
    case "normal":
      return 12 + enemyLevel * 4;
    case "elite":
      return 40 + enemyLevel * 10;
    case "miniboss":
      return 90 + enemyLevel * 18;
    case "boss":
      return 220 + enemyLevel * 40;
  }
}

export function levelDiffMultiplier(
  enemyLevel: number,
  playerLevel: number,
): number {
  const diff = enemyLevel - playerLevel;

  if (diff >= 5) return 1.5;
  if (diff >= 3) return 1.25;
  if (diff >= -1) return 1.0;
  if (diff >= -3) return 0.7;
  if (diff >= -5) return 0.4;
  return 0.15;
}

export function battleXpPaceRatio(tier: EnemyTier): number {
  switch (tier) {
    case "trash":
      return 0.05;
    case "normal":
      return 0.12;
    case "elite":
      return 0.22;
    case "miniboss":
      return 0.4;
    case "boss":
      return 0.6;
  }
}

export function pacedBattleXpFloor(
  playerLevel: number,
  enemyLevel: number,
  tier: EnemyTier,
): number {
  return Math.floor(
    xpToNextLevel(playerLevel) *
      battleXpPaceRatio(tier) *
      levelDiffMultiplier(enemyLevel, playerLevel),
  );
}

export function enemyXpReward(
  enemyLevel: number,
  playerLevel: number,
  tier: EnemyTier,
): number {
  const diffMultiplier = levelDiffMultiplier(enemyLevel, playerLevel);
  const existingReward = Math.floor(baseEnemyXp(enemyLevel, tier) * diffMultiplier);
  const pacingFloor = pacedBattleXpFloor(playerLevel, enemyLevel, tier);

  return Math.max(existingReward, pacingFloor);
}

export function questXp(recommendedLevel: number, tier: QuestTier): number {
  switch (tier) {
    case "minor":
      return 100 + recommendedLevel * 30;
    case "standard":
      return 180 + recommendedLevel * 60;
    case "major":
      return 400 + recommendedLevel * 110;
    case "chapter":
      return 900 + recommendedLevel * 180;
  }
}

export function discoveryXp(
  recommendedLevel: number,
  tier: DiscoveryTier,
): number {
  switch (tier) {
    case "small":
      return 40 + recommendedLevel * 15;
    case "hidden":
      return 90 + recommendedLevel * 25;
    case "major":
      return 180 + recommendedLevel * 45;
  }
}
