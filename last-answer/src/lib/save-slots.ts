export const PLAYER_SAVE_SLOT_IDS = [
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
] as const;

export type PlayerSaveSlotId = (typeof PLAYER_SAVE_SLOT_IDS)[number];

export function isPlayerSaveSlotId(value: unknown): value is PlayerSaveSlotId {
  return (
    typeof value === "string" &&
    PLAYER_SAVE_SLOT_IDS.includes(value as PlayerSaveSlotId)
  );
}
