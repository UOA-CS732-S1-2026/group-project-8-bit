import type { QueryResult, QueryResultRow } from "pg";
import { describe, expect, it, vi } from "vitest";

import type { Player } from "@/game/core/types";
import { buildInitialPlayer, normalizePlayer } from "./player";
import {
  createInitialPlayerSave,
  deletePlayerSave,
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
  updated_at?: Date | string | null;
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

function saveRow(
  saveId: PlayerSaveSlotId,
  player: Partial<Player>,
  updatedAt: Date | string | null = null,
): SaveRow {
  return {
    user_id: "user-1",
    save_id: saveId,
    save_data: normalizePlayer(player),
    updated_at: updatedAt,
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

    const { saveList } = await getPlayerSave("user-1", db);

    expect(saveList).toHaveLength(PLAYER_SAVE_SLOT_IDS.length);
    expect(saveList[0]).toEqual(slot1Player);
    expect(saveList[1]).toBeNull();
    expect(saveList[2]).toEqual(slot3Player);
    expect(saveList.slice(3)).toEqual(Array(7).fill(null));
  });

  it("returns ISO savedAt timestamps aligned with each slot", async () => {
    const slot1At = new Date("2025-01-15T10:30:00.000Z");
    const slot3At = "2025-02-20T08:45:00.000Z";
    const { db } = createDb([
      queryResult([
        saveRow("slot1", { name: "A" }, slot1At),
        saveRow("slot3", { name: "C" }, slot3At),
      ]),
    ]);

    const { savedAtList } = await getPlayerSave("user-1", db);

    expect(savedAtList[0]).toBe(slot1At.toISOString());
    expect(savedAtList[1]).toBeNull();
    expect(savedAtList[2]).toBe(new Date(slot3At).toISOString());
    expect(savedAtList.slice(3)).toEqual(Array(7).fill(null));
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

    const { saveList } = await getPlayerSave("user-1", db);
    const firstSave = saveList[0];

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

    const { saveList } = await ensurePlayerSave("user-1", "Ada", db);

    expect(saveList[0]).toEqual(existingPlayer);
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

    const { saveList } = await ensurePlayerSave("user-1", "Ada", db);

    expect(queryMock).toHaveBeenCalledTimes(3);
    expect(queryMock).toHaveBeenNthCalledWith(
      2,
      expect.stringContaining("INSERT INTO player_saves"),
      ["user-1", PLAYER_SAVE_SLOT_IDS[0], JSON.stringify(initialPlayer)],
    );
    expect(saveList[0]).toEqual(initialPlayer);
  });
});

describe("updatePlayerSave", () => {
  it("normalizes the player before upserting save data", async () => {
    const updatedAt = new Date("2025-03-01T12:00:00.000Z");
    const { db, queryMock } = createDb([
      queryResult([{ updated_at: updatedAt } as QueryResultRow]),
    ]);
    const player = normalizePlayer({
      name: "Updated",
      hp: 999,
      coins: 12,
      inventory: [{ id: "hourglass", leftNumber: 5, price: 999 }],
    });

    const result = await updatePlayerSave(
      "user-1",
      "slot4",
      {
        ...player,
        hp: 999,
      },
      db,
    );

    expect(result.player).toEqual(player);
    expect(result.savedAt).toBe(updatedAt.toISOString());
    expect(queryMock).toHaveBeenCalledWith(
      expect.stringContaining("INSERT INTO player_saves"),
      ["user-1", "slot4", JSON.stringify(player)],
    );
  });

  it("returns null savedAt when the database omits updated_at", async () => {
    const { db } = createDb([queryResult([])]);
    const result = await updatePlayerSave(
      "user-1",
      "slot1",
      normalizePlayer({ name: "X" }),
      db,
    );
    expect(result.savedAt).toBeNull();
  });
});

describe("deletePlayerSave", () => {
  it("issues a parameterized DELETE for the given user and slot", async () => {
    const { db, queryMock } = createDb([queryResult([])]);

    await deletePlayerSave("user-1", "slot3", db);

    expect(queryMock).toHaveBeenCalledTimes(1);
    expect(queryMock).toHaveBeenCalledWith(
      expect.stringContaining("DELETE FROM player_saves"),
      ["user-1", "slot3"],
    );
  });
});
