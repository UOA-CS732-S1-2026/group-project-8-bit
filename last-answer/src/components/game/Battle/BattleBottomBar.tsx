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
};

export function BattleBottomBar({ player, logEntries }: BattleBottomBarProps) {
  return (
    <section className="flex w-full max-w-full flex-col gap-3 xl:flex-row xl:items-end">
      <div
        className="min-w-0 w-full xl:flex-none"
        style={{ width: "min(100%, 27.5rem)" }}
      >
        <BattlePlayerPanel player={player} />
      </div>
      <div className="flex w-full min-w-0 flex-col gap-3 sm:flex-row xl:flex-1 xl:items-end">
        <div className="shrink-0 self-start sm:self-end">
          <BattleItemsPanel />
        </div>
        <div className="min-w-0 flex-1 self-stretch xl:self-end">
          <BattleLogPanel entries={logEntries} />
        </div>
      </div>
    </section>
  );
}
