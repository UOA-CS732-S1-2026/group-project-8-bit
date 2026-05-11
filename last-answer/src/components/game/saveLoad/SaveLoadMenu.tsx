import type { Player } from "@/game/core/types";
import { gameSlots } from "@/store/game-store";

type SaveLoadMenuProps = {
  saveList: Array<Player | null>;
  savedAtList?: Array<string | null>;
  selectedSlot: number | null;
  onSlotClick: (slot: number) => void;
};

function formatSavedAt(isoString: string): string {
  const diffMs = Date.now() - new Date(isoString).getTime();
  const minutes = Math.floor(diffMs / 60_000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

const slotButtonClass =
  "relative flex h-[8.75rem] flex-col overflow-hidden rounded-md border bg-black/35 px-3 pt-2 pb-2 text-left text-amber-100 transition duration-150 hover:border-amber-100/65 hover:bg-amber-200/15 hover:text-amber-50 active:translate-y-[1px] active:scale-[0.98]";

export default function SaveLoadMenu({
  saveList,
  savedAtList,
  selectedSlot,
  onSlotClick,
}: SaveLoadMenuProps) {
  return (
    <div className="grid grid-cols-5 gap-3">
      {gameSlots.slice(0, 10).map((slotId, index) => {
        const save = saveList[index] ?? null;
        const savedAt = savedAtList?.[index] ?? null;
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
            <div className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-amber-100/80">
              Slot {index + 1}
            </div>

            {save ? (
              <>
                <div className="mt-1.5 flex-1 space-y-[2px] text-[0.8rem] leading-snug">
                  <div className="truncate text-[0.85rem] font-bold text-amber-100">
                    {save.name}
                  </div>
                  <div className="text-amber-100/90">Level {save.level}</div>
                  <div className="text-amber-100/90">
                    HP {save.hp} / {save.maxHp}
                  </div>
                  <div className="text-amber-100/90">{save.coins} coins</div>
                </div>

                {savedAt ? (
                  <div className="mt-1.5 border-t border-amber-200/15 pt-1 text-[0.72rem] font-semibold italic tracking-wide text-amber-200">
                    {formatSavedAt(savedAt)}
                  </div>
                ) : null}
              </>
            ) : (
              <div className="flex flex-1 items-center justify-center text-sm italic text-amber-100/55">
                Empty
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}
