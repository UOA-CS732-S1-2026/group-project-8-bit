import { BattleItemsPanel } from "./BattleItemsPanel";
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
};

export function BattleBottomBar({ player }: BattleBottomBarProps) {
  return (
    <section className="flex max-w-full items-stretch gap-3">
      <div
        className="min-w-0 flex-none"
        style={{ width: "clamp(22.5rem, 33vw, 31rem)" }}
      >
        <BattlePlayerPanel player={player} />
      </div>
      <div className="shrink-0 self-stretch">
        <BattleItemsPanel />
      </div>
    </section>
  );
}
