import type { ReactNode } from "react";
import { BattleItemsPanel } from "./BattleItemsPanel";
import { BattleLogPanel } from "./BattleLogPanel";
import { BattlePlayerPanel } from "./BattlePlayerPanel";

type BattleBottomBarProps = {
  player: {
    name: string;
    level: number;
    hp: number;
    maxHp: number;
    attack: number;
    defense: number;
  };
  logEntries: {
    id: string;
    kind: "player" | "enemy";
    text: string;
  }[];
  onToggleItems?: () => void;
  onToggleLogCollapsed?: () => void;
  itemsDisabled?: boolean;
  itemCount?: number;
  itemsOpen?: boolean;
  logCollapsed?: boolean;
  itemsOverlay?: ReactNode;
};

export function BattleBottomBar({
  player,
  logEntries,
  onToggleItems,
  onToggleLogCollapsed,
  itemsDisabled,
  itemCount,
  itemsOpen,
  logCollapsed,
  itemsOverlay,
}: BattleBottomBarProps) {
  return (
    <section className="flex w-full max-w-full flex-col gap-2.5">
      {itemsOverlay}
      <div className="flex w-full max-w-full flex-col gap-2.5 xl:flex-row xl:items-end">
        <div
          className="min-w-0 w-full xl:flex-none"
          style={{ width: "min(100%, 24rem)" }}
        >
          <BattlePlayerPanel player={player} />
        </div>
        <div className="flex w-full min-w-0 flex-col gap-2.5 sm:flex-row xl:flex-1 xl:items-end">
          <div className="relative shrink-0 self-start sm:self-end">
            <BattleItemsPanel
              onClick={onToggleItems}
              disabled={itemsDisabled}
              activeCount={itemCount}
              isOpen={itemsOpen}
            />
          </div>
          <div className="min-w-0 flex-1 self-stretch xl:self-end">
            <BattleLogPanel
              entries={logEntries}
              collapsed={logCollapsed}
              onToggleCollapsed={onToggleLogCollapsed}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
