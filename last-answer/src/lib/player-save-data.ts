import type { Player } from "@/game/core/types";
import {
  buildAchievementCloudData,
  normalizeAchievementCloudData,
  type AchievementCloudData,
} from "@/lib/achievement-data";
import { normalizePlayer } from "@/lib/player";

export type PlayerSaveRecord = {
  player: Player;
  achievements: AchievementCloudData | null;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function createPlayerSaveRecord(
  player: Player,
  achievements?: AchievementCloudData | null,
): PlayerSaveRecord {
  return {
    player: normalizePlayer(player),
    achievements: achievements
      ? buildAchievementCloudData(achievements.metrics)
      : null,
  };
}

export function normalizePlayerSaveRecord(value: unknown): PlayerSaveRecord | null {
  if (!isRecord(value)) {
    return null;
  }

  if ("player" in value) {
    return createPlayerSaveRecord(
      normalizePlayer(value.player as Partial<Player> | null),
      normalizeAchievementCloudData(value.achievements),
    );
  }

  return createPlayerSaveRecord(normalizePlayer(value as Partial<Player>));
}
