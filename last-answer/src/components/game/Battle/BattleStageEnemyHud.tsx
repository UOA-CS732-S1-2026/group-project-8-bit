import { BattleEnemyPanel } from "./BattleEnemyPanel";
import { BattleStageHud } from "./BattleStageHud";

type BattleStageEnemyHudProps = {
  enemy: {
    name: string;
    hp: number;
    maxHp: number;
    attack: number;
    defense: number;
    isBoss?: boolean;
    portraitPath?: string;
  };
  muted?: boolean;
};

export function BattleStageEnemyHud({
  enemy,
  muted = false,
}: BattleStageEnemyHudProps) {
  const mutedClasses = "opacity-40 blur-[3px] saturate-[0.78]";

  return (
    <BattleStageHud anchor="enemy">
      <div
        className={[
          "transition duration-300",
          muted ? mutedClasses : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <BattleEnemyPanel enemy={enemy} />
      </div>
    </BattleStageHud>
  );
}
