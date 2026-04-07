import type { QueryResultRow } from "pg";
import type { Player } from "@/game/core/types";
import { query, type Queryable } from "./db";
import { buildInitialPlayer, normalizePlayer } from "./player";

type SaveRow = QueryResultRow & {
  user_id: string;
  save_data: Player;
};

const defaultQueryable: Queryable = { query };

export async function createInitialPlayerSave(
  userId: string,
  username: string,
  db: Queryable = defaultQueryable,
) {
  const initialPlayer = buildInitialPlayer(username);

  await db.query(
    `INSERT INTO player_saves (user_id, save_data, updated_at)
     VALUES ($1, $2::jsonb, NOW())`,
    [userId, JSON.stringify(initialPlayer)],
  );

  return initialPlayer;
}

export async function getPlayerSave(
  userId: string,
  db: Queryable = defaultQueryable,
) {
  const result = await db.query<SaveRow>(
    `SELECT user_id, save_data
       FROM player_saves
      WHERE user_id = $1
      LIMIT 1`,
    [userId],
  );

  const save = result.rows[0];
  return save ? normalizePlayer(save.save_data) : null;
}

export async function ensurePlayerSave(
  userId: string,
  username: string,
  db: Queryable = defaultQueryable,
) {
  const existingSave = await getPlayerSave(userId, db);

  if (existingSave) {
    return existingSave;
  }

  return createInitialPlayerSave(userId, username, db);
}

export async function updatePlayerSave(
  userId: string,
  player: Player,
  db: Queryable = defaultQueryable,
) {
  const normalizedPlayer = normalizePlayer(player);

  await db.query(
    `INSERT INTO player_saves (user_id, save_data, updated_at)
     VALUES ($1, $2::jsonb, NOW())
     ON CONFLICT (user_id)
     DO UPDATE SET
       save_data = EXCLUDED.save_data,
       updated_at = NOW()`,
    [userId, JSON.stringify(normalizedPlayer)],
  );

  return normalizedPlayer;
}

