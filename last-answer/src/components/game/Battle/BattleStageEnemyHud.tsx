import { BattleEnemyPanel } from "./BattleEnemyPanel";
import { BattleStageHud } from "./BattleStageHud";

type BattleStageEnemyHudProps = {
  enemy: {
    name: string;
    hp: number;
    maxHp: number;
    attack: number;
    defense: number;
  };
};

export function BattleStageEnemyHud({ enemy }: BattleStageEnemyHudProps) {
  return (
    <BattleStageHud anchor="enemy">
      <BattleEnemyPanel enemy={enemy} />
    </BattleStageHud>
  );
}
