import type { Player } from "@/game/core/types";
import { gameSlots } from "@/store/game-store";

type SaveLoadMenuProps = {
  saveList: Array<Player | null>;
  selectedSlot: number | null;
  onSlotClick: (slot: number) => void;
};

const slotButtonClass =
  "min-h-20 overflow-hidden rounded-md border bg-black/35 px-3 py-2 text-left text-amber-100 transition duration-150 hover:border-amber-100/65 hover:bg-amber-200/15 hover:text-amber-50 active:translate-y-[1px] active:scale-[0.98]";

export default function SaveLoadMenu({
  saveList,
  selectedSlot,
  onSlotClick,
}: SaveLoadMenuProps) {
  return (
    <div className="grid grid-cols-5 gap-3">
      {gameSlots.slice(0, 10).map((slotId, index) => {
        const save = saveList[index] ?? null;
        const isSelected = selectedSlot === index;

        return (
          <button
            key={slotId}
            type="button"
            onClick={() => onSlotClick(index)}
            className={`${slotButtonClass} ${
              isSelected
                ? "border-amber-100 bg-amber-200/20 shadow-[0_0_16px_rgba(251,191,36,0.22)]"
                : "border-amber-200/20"
            }`}
            aria-pressed={isSelected}
          >
            <div className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-100/85">
              Slot {index + 1}
            </div>
            {save ? (
              <div className="mt-2 space-y-1 text-sm leading-tight">
                <div className="truncate font-semibold text-amber-100">
                  {save.name}
                </div>
                <div>Level {save.level}</div>
                <div>
                  HP {save.hp} / {save.maxHp}
                </div>
                <div>{save.coins} coins</div>
              </div>
            ) : (
              <div className="mt-4 text-sm text-amber-100/65">Empty</div>
            )}
          </button>
        );
      })}
    </div>
  );
}
