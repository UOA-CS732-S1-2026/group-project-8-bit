import type { QueryResultRow } from "pg";
import type { Player } from "@/game/core/types";
import type { AchievementCloudData } from "@/lib/achievement-data";
import {
  createPlayerSaveRecord,
  normalizePlayerSaveRecord,
  type PlayerSaveRecord,
} from "@/lib/player-save-data";
import { PLAYER_SAVE_SLOT_IDS, type PlayerSaveSlotId } from "./save-slots";
import { query, type Queryable } from "./db";
import { buildInitialPlayer } from "./player";

type SaveRow = QueryResultRow & {
  user_id: string;
  save_id: PlayerSaveSlotId;
  save_data: unknown;
};

const defaultQueryable: Queryable = { query };

function buildSaveList(rows: SaveRow[]): Array<PlayerSaveRecord | null> {
  const savesBySlot = new Map(
    rows.map((save) => [save.save_id, normalizePlayerSaveRecord(save.save_data)]),
  );

  return PLAYER_SAVE_SLOT_IDS.map((saveId) => savesBySlot.get(saveId) ?? null);
}

export async function createInitialPlayerSave(
  userId: string,
  username: string,
  db: Queryable = defaultQueryable,
) {
  const initialPlayer = buildInitialPlayer(username);
  const initialSave = createPlayerSaveRecord(initialPlayer);

  await db.query(
    `INSERT INTO player_saves (user_id, save_id, save_data, updated_at)
     VALUES ($1, $2, $3::jsonb, NOW())
     ON CONFLICT (user_id, save_id)
     DO UPDATE SET
       save_data = EXCLUDED.save_data,
       updated_at = NOW()`,
    [userId, PLAYER_SAVE_SLOT_IDS[0], JSON.stringify(initialSave)],
  );

  return initialSave;
}

export async function getPlayerSave(
  userId: string,
  db: Queryable = defaultQueryable,
) {
  const result = await db.query<SaveRow>(
    `SELECT user_id, save_id, save_data
       FROM player_saves
      WHERE user_id = $1
      ORDER BY save_id`,
    [userId],
  );

  return buildSaveList(result.rows);
}

export async function ensurePlayerSave(
  userId: string,
  username: string,
  db: Queryable = defaultQueryable,
) {
  const existingSaves = await getPlayerSave(userId, db);

  if (existingSaves.some(Boolean)) {
    return existingSaves;
  }

  await createInitialPlayerSave(userId, username, db);
  return getPlayerSave(userId, db);
}

export async function updatePlayerSave(
  userId: string,
  saveId: string,
  player: Player,
  achievements: AchievementCloudData | null = null,
  db: Queryable = defaultQueryable,
) {
  const normalizedSave = createPlayerSaveRecord(player, achievements);

  await db.query(
    `INSERT INTO player_saves (user_id, save_id, save_data, updated_at)
     VALUES ($1, $2, $3::jsonb, NOW())
     ON CONFLICT (user_id, save_id)
     DO UPDATE SET
       save_data = EXCLUDED.save_data,
       updated_at = NOW()`,
    [userId, saveId, JSON.stringify(normalizedSave)],
  );

  return normalizedSave;
}
