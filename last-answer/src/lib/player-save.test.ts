import type { QueryResult, QueryResultRow } from "pg";
import { describe, expect, it, vi } from "vitest";

import type { Player } from "@/game/core/types";
import { buildInitialPlayer, normalizePlayer } from "./player";
import {
  createInitialPlayerSave,
  ensurePlayerSave,
  getPlayerSave,
  updatePlayerSave,
} from "./player-save";
import { PLAYER_SAVE_SLOT_IDS, type PlayerSaveSlotId } from "./save-slots";
import type { Queryable } from "./db";

type SaveRow = QueryResultRow & {
  user_id: string;
  save_id: PlayerSaveSlotId;
  save_data: Player;
};

function queryResult<TRow extends QueryResultRow>(
  rows: TRow[],
): QueryResult<TRow> {
  return {
    rows,
    command: "SELECT",
    rowCount: rows.length,
    oid: 0,
    fields: [],
  };
}

function createDb(results: QueryResult<QueryResultRow>[] = []) {
  const queryMock = vi.fn(
    async <TRow extends QueryResultRow = QueryResultRow>() =>
      (results.shift() ?? queryResult([])) as QueryResult<TRow>,
  );

  return {
    db: {
      query: queryMock as Queryable["query"],
    },
    queryMock,
  };
}

function saveRow(saveId: PlayerSaveSlotId, player: Partial<Player>): SaveRow {
  return {
    user_id: "user-1",
    save_id: saveId,
    save_data: normalizePlayer(player),
  };
}

describe("createInitialPlayerSave", () => {
  it("creates the first save slot from the username", async () => {
    const { db, queryMock } = createDb([queryResult([])]);

    const player = await createInitialPlayerSave("user-1", "Ada", db);

    expect(player).toEqual(buildInitialPlayer("Ada"));
    expect(queryMock).toHaveBeenCalledWith(
      expect.stringContaining("INSERT INTO player_saves"),
      ["user-1", PLAYER_SAVE_SLOT_IDS[0], JSON.stringify(player)],
    );
  });
});

describe("getPlayerSave", () => {
  it("returns normalized saves ordered by configured slot with null gaps", async () => {
    const slot3Player = normalizePlayer({
      name: "Slot Three",
      hp: 999,
      coins: 25,
    });
    const slot1Player = normalizePlayer({
      name: "Slot One",
      coins: 10,
    });
    const { db } = createDb([
      queryResult([
        saveRow("slot3", slot3Player),
        saveRow("slot1", slot1Player),
      ]),
    ]);

    const saves = await getPlayerSave("user-1", db);

    expect(saves).toHaveLength(PLAYER_SAVE_SLOT_IDS.length);
    expect(saves[0]).toEqual(slot1Player);
    expect(saves[1]).toBeNull();
    expect(saves[2]).toEqual(slot3Player);
    expect(saves.slice(3)).toEqual(Array(7).fill(null));
  });

  it("normalizes persisted save data before returning it", async () => {
    const { db } = createDb([
      queryResult([
        saveRow("slot1", {
          name: "Persisted",
          hp: -1,
          coins: -50,
          inventory: [{ id: "analyze", leftNumber: -2, price: 999 }],
        }),
      ]),
    ]);

    const [firstSave] = await getPlayerSave("user-1", db);

    expect(firstSave).toMatchObject({
      name: "Persisted",
      hp: 0,
      coins: 0,
      inventory: [
        { id: "analyze", leftNumber: 0, price: 60 },
        { id: "hourglass", leftNumber: 1, price: 20 },
        { id: "barrier", leftNumber: 1, price: 50 },
        { id: "chainGuard", leftNumber: 1, price: 30 },
      ],
    });
  });
});

describe("ensurePlayerSave", () => {
  it("returns existing saves without creating a new initial save", async () => {
    const existingPlayer = normalizePlayer({ name: "Existing" });
    const { db, queryMock } = createDb([
      queryResult([saveRow("slot1", existingPlayer)]),
    ]);

    const saves = await ensurePlayerSave("user-1", "Ada", db);

    expect(saves[0]).toEqual(existingPlayer);
    expect(queryMock).toHaveBeenCalledTimes(1);
    expect(queryMock).toHaveBeenCalledWith(
      expect.stringContaining("SELECT user_id, save_id, save_data"),
      ["user-1"],
    );
  });

  it("creates and reloads an initial save when no saves exist", async () => {
    const initialPlayer = buildInitialPlayer("Ada");
    const { db, queryMock } = createDb([
      queryResult([]),
      queryResult([]),
      queryResult([saveRow("slot1", initialPlayer)]),
    ]);

    const saves = await ensurePlayerSave("user-1", "Ada", db);

    expect(queryMock).toHaveBeenCalledTimes(3);
    expect(queryMock).toHaveBeenNthCalledWith(
      2,
      expect.stringContaining("INSERT INTO player_saves"),
      ["user-1", PLAYER_SAVE_SLOT_IDS[0], JSON.stringify(initialPlayer)],
    );
    expect(saves[0]).toEqual(initialPlayer);
  });
});

describe("updatePlayerSave", () => {
  it("normalizes the player before upserting save data", async () => {
    const { db, queryMock } = createDb([queryResult([])]);
    const player = normalizePlayer({
      name: "Updated",
      hp: 999,
      coins: 12,
      inventory: [{ id: "hourglass", leftNumber: 5, price: 999 }],
    });

    const updatedPlayer = await updatePlayerSave(
      "user-1",
      "slot4",
      {
        ...player,
        hp: 999,
      },
      db,
    );

    expect(updatedPlayer).toEqual(player);
    expect(queryMock).toHaveBeenCalledWith(
      expect.stringContaining("INSERT INTO player_saves"),
      ["user-1", "slot4", JSON.stringify(player)],
    );
  });
});
