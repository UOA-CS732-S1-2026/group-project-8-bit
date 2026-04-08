import { BattleStageEnemyArt } from "./BattleStageEnemyArt";
import { BattleStageEnemyHud } from "./BattleStageEnemyHud";
import { BattleStagePlayerArt } from "./BattleStagePlayerArt";

type BattleStageProps = {
  backgroundLabel: string;
  enemy: {
    name: string;
    hp: number;
    maxHp: number;
    attack: number;
    defense: number;
  };
};

export function BattleStage({ backgroundLabel, enemy }: BattleStageProps) {
  return (
    <section
      className="relative z-0 flex-1 overflow-visible"
      style={{
        minHeight: "21rem",
        height: "clamp(21rem, 44vh, 27rem)",
      }}
      aria-label={`${backgroundLabel} battle stage`}
    >
      <BattleStageEnemyHud enemy={enemy} />
      <BattleStagePlayerArt />
      <BattleStageEnemyArt />
    </section>
  );
}
