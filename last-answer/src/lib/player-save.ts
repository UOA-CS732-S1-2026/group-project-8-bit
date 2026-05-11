import type { QueryResultRow } from "pg";
import type { Player } from "@/game/core/types";
import { PLAYER_SAVE_SLOT_IDS, type PlayerSaveSlotId } from "./save-slots";
import { query, type Queryable } from "./db";
import { buildInitialPlayer, normalizePlayer } from "./player";

type SaveRow = QueryResultRow & {
  user_id: string;
  save_id: PlayerSaveSlotId;
  save_data: Player;
  updated_at?: Date | string | null;
};

type UpdatedAtRow = QueryResultRow & {
  updated_at: Date | string | null;
};

export type PlayerSaveListing = {
  saveList: Array<Player | null>;
  savedAtList: Array<string | null>;
};

const defaultQueryable: Queryable = { query };

function toIsoString(value: Date | string | null | undefined): string | null {
  if (value == null) return null;
  if (value instanceof Date) return value.toISOString();
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString();
}

function buildSaveListing(rows: SaveRow[]): PlayerSaveListing {
  const savesBySlot = new Map(
    rows.map((save) => [save.save_id, normalizePlayer(save.save_data)]),
  );
  const savedAtBySlot = new Map(
    rows.map((save) => [save.save_id, toIsoString(save.updated_at)]),
  );

  return {
    saveList: PLAYER_SAVE_SLOT_IDS.map(
      (saveId) => savesBySlot.get(saveId) ?? null,
    ),
    savedAtList: PLAYER_SAVE_SLOT_IDS.map(
      (saveId) => savedAtBySlot.get(saveId) ?? null,
    ),
  };
}

export async function createInitialPlayerSave(
  userId: string,
  username: string,
  db: Queryable = defaultQueryable,
) {
  const initialPlayer = buildInitialPlayer(username);

  await db.query(
    `INSERT INTO player_saves (user_id, save_id, save_data, updated_at)
     VALUES ($1, $2, $3::jsonb, NOW())
     ON CONFLICT (user_id, save_id)
     DO UPDATE SET
       save_data = EXCLUDED.save_data,
       updated_at = NOW()`,
    [userId, PLAYER_SAVE_SLOT_IDS[0], JSON.stringify(initialPlayer)],
  );

  return initialPlayer;
}

export async function getPlayerSave(
  userId: string,
  db: Queryable = defaultQueryable,
): Promise<PlayerSaveListing> {
  const result = await db.query<SaveRow>(
    `SELECT user_id, save_id, save_data, updated_at
       FROM player_saves
      WHERE user_id = $1
      ORDER BY save_id`,
    [userId],
  );

  return buildSaveListing(result.rows);
}

export async function ensurePlayerSave(
  userId: string,
  username: string,
  db: Queryable = defaultQueryable,
): Promise<PlayerSaveListing> {
  const existing = await getPlayerSave(userId, db);

  if (existing.saveList.some(Boolean)) {
    return existing;
  }

  await createInitialPlayerSave(userId, username, db);
  return getPlayerSave(userId, db);
}

export async function deletePlayerSave(
  userId: string,
  saveId: string,
  db: Queryable = defaultQueryable,
) {
  await db.query(
    `DELETE FROM player_saves WHERE user_id = $1 AND save_id = $2`,
    [userId, saveId],
  );
}

export async function updatePlayerSave(
  userId: string,
  saveId: string,
  player: Player,
  db: Queryable = defaultQueryable,
): Promise<{ player: Player; savedAt: string | null }> {
  const normalizedPlayer = normalizePlayer(player);

  const result = await db.query<UpdatedAtRow>(
    `INSERT INTO player_saves (user_id, save_id, save_data, updated_at)
     VALUES ($1, $2, $3::jsonb, NOW())
     ON CONFLICT (user_id, save_id)
     DO UPDATE SET
       save_data = EXCLUDED.save_data,
       updated_at = NOW()
     RETURNING updated_at`,
    [userId, saveId, JSON.stringify(normalizedPlayer)],
  );

  return {
    player: normalizedPlayer,
    savedAt: toIsoString(result.rows[0]?.updated_at),
  };
}
