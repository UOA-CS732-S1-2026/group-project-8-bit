export type AchievementMetrics = {
  levelReached: number;
  battlesWon: number;
  battlesLost: number;
  toolsUsed: number;
  strongToolsUsed: number;
  bestComboEver: number;
  coinsEarned: number;
  highestCoinsHeld: number;
  questsCompleted: number;
  endingGoldenSeen: number;
  endingAshesSeen: number;
  endingsSeen: number;
};

export type AchievementCloudData = {
  metrics: AchievementMetrics;
};

export const EMPTY_ACHIEVEMENT_METRICS: AchievementMetrics = {
  levelReached: 1,
  battlesWon: 0,
  battlesLost: 0,
  toolsUsed: 0,
  strongToolsUsed: 0,
  bestComboEver: 0,
  coinsEarned: 0,
  highestCoinsHeld: 0,
  questsCompleted: 0,
  endingGoldenSeen: 0,
  endingAshesSeen: 0,
  endingsSeen: 0,
};

const METRIC_KEYS = Object.keys(
  EMPTY_ACHIEVEMENT_METRICS,
) as Array<keyof AchievementMetrics>;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function normalizeNonNegativeInteger(value: unknown) {
  return Number.isFinite(value) ? Math.max(0, Math.floor(Number(value))) : 0;
}

export function cloneAchievementMetrics(
  metrics: AchievementMetrics,
): AchievementMetrics {
  return { ...metrics };
}

export function normalizeAchievementMetrics(
  value: unknown,
): AchievementMetrics {
  const baseMetrics = cloneAchievementMetrics(EMPTY_ACHIEVEMENT_METRICS);

  if (!isRecord(value)) {
    return baseMetrics;
  }

  for (const key of METRIC_KEYS) {
    const normalizedValue = normalizeNonNegativeInteger(value[key]);
    baseMetrics[key] =
      key === "levelReached" ? Math.max(1, normalizedValue) : normalizedValue;
  }

  return baseMetrics;
}

export function buildAchievementCloudData(
  metrics: AchievementMetrics,
): AchievementCloudData {
  return {
    metrics: normalizeAchievementMetrics(metrics),
  };
}

export function normalizeAchievementCloudData(
  value: unknown,
): AchievementCloudData | null {
  if (!isRecord(value) || !("metrics" in value)) {
    return null;
  }

  return {
    metrics: normalizeAchievementMetrics(value.metrics),
  };
}
