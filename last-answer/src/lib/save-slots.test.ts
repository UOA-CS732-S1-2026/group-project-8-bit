import { describe, expect, it } from "vitest";

import { PLAYER_SAVE_SLOT_IDS, isPlayerSaveSlotId } from "./save-slots";

describe("PLAYER_SAVE_SLOT_IDS", () => {
  it("defines ten ordered save slots", () => {
    expect(PLAYER_SAVE_SLOT_IDS).toEqual([
      "slot1",
      "slot2",
      "slot3",
      "slot4",
      "slot5",
      "slot6",
      "slot7",
      "slot8",
      "slot9",
      "slot10",
    ]);
  });
});

describe("isPlayerSaveSlotId", () => {
  it("accepts known save slot IDs", () => {
    expect(isPlayerSaveSlotId("slot1")).toBe(true);
    expect(isPlayerSaveSlotId("slot10")).toBe(true);
  });

  it("rejects unknown or non-string values", () => {
    expect(isPlayerSaveSlotId("slot0")).toBe(false);
    expect(isPlayerSaveSlotId("slot11")).toBe(false);
    expect(isPlayerSaveSlotId("SLOT1")).toBe(false);
    expect(isPlayerSaveSlotId(null)).toBe(false);
    expect(isPlayerSaveSlotId(1)).toBe(false);
  });
});
