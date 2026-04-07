import { BattlePlayerPanel } from "./BattlePlayerPanel";
import { BattleStageHud } from "./BattleStageHud";

type BattleStagePlayerHudProps = {
  player: {
    name: string;
    level: number;
    hp: number;
    maxHp: number;
    attack: number;
    defense: number;
  };
};

export function BattleStagePlayerHud({ player }: BattleStagePlayerHudProps) {
  return (
    <BattleStageHud anchor="player">
      <BattlePlayerPanel player={player} />
    </BattleStageHud>
  );
}
