"use client";

import type { Player } from "@/game/core/types";
import { gameSlots } from "@/store/game-store";
import { useMCStore } from "@/store/mcStore";
import { SaveLoadConfirmAlert } from "./SaveLoadConfirmAlert";
import SaveLoadMenu from "./SaveLoadMenu";
import { useState } from "react";

type SaveLoadLocalPanelProps = {
  onClose: () => void;
};

type PendingAction = "save" | "load" | null;

const panelButtonClass =
  "rounded-md border border-amber-200/30 bg-black/35 px-5 py-2 text-sm font-semibold uppercase tracking-[0.16em] text-amber-100 transition duration-150 hover:border-amber-100/65 hover:bg-amber-200/15 active:translate-y-[1px] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-amber-200/30 disabled:hover:bg-black/35 disabled:active:translate-y-0 disabled:active:scale-100";

export default function SaveLoadLocalPanel({ onClose }: SaveLoadLocalPanelProps) {
  const player = useMCStore((state) => state.player);
  const readPersistPlayer = useMCStore((state) => state.readPersistPlayer);
  const savePersistPlayer = useMCStore((state) => state.savePersistPlayer);
  const savePlayer = useMCStore((state) => state.savePlayer);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);
  const [saveList, setSaveList] = useState<Array<Player | null>>(() =>
    gameSlots.slice(0, 10).map((slotId) => readPersistPlayer(slotId)),
  );

  const refreshSaveList = () => {
    setSaveList(gameSlots.slice(0, 10).map((slotId) => readPersistPlayer(slotId)));
  };

  const selectedSave =
    selectedSlot === null ? null : saveList[selectedSlot] ?? null;
  const selectedSlotLabel =
    selectedSlot === null ? "" : `Slot ${selectedSlot + 1}`;

  const handleConfirm = () => {
    if (selectedSlot === null) {
      return;
    }

    const slotId = gameSlots[selectedSlot];

    if (pendingAction === "save") {
      savePersistPlayer(player, slotId);
      refreshSaveList();
      return;
    }

    if (pendingAction === "load" && selectedSave) {
      savePlayer(selectedSave);
      refreshSaveList();
    }
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <section
        className="relative w-full max-w-4xl bg-[url('/panels/menu-panel.png')] bg-[length:100%_100%] bg-center bg-no-repeat px-7 py-8 text-amber-100 shadow-[0_24px_70px_rgba(0,0,0,0.65)]"
        role="dialog"
        aria-modal="true"
        aria-label="Save and load local panel"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 rounded-md border border-amber-100/30 bg-black/35 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-amber-100 transition hover:border-amber-100/65 hover:bg-amber-100/15 active:scale-95"
        >
          Close
        </button>

        <h2 className="text-center text-2xl font-semibold text-stone-100">
          Save&Load Local
        </h2>

        <div className="mt-7">
          <SaveLoadMenu
            saveList={saveList}
            selectedSlot={selectedSlot}
            onSlotClick={setSelectedSlot}
          />
        </div>

        <div className="mt-6 flex justify-center gap-4">
          <button
            type="button"
            className={panelButtonClass}
            disabled={selectedSlot === null}
            onClick={() => setPendingAction("save")}
          >
            Save
          </button>
          <button
            type="button"
            className={panelButtonClass}
            disabled={!selectedSave}
            onClick={() => setPendingAction("load")}
          >
            Load
          </button>
        </div>

        {pendingAction ? (
          <SaveLoadConfirmAlert
            message={`${pendingAction === "save" ? "Save to" : "Load"} ${selectedSlotLabel}?`}
            onConfirm={handleConfirm}
            onClose={() => setPendingAction(null)}
          />
        ) : null}
      </section>
    </div>
  );
}
