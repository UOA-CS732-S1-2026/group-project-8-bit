import { BattleStageEffectLayer } from "./BattleStageEffectLayer";
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
        minHeight: "23rem",
        height: "clamp(23rem, 48vh, 30rem)",
      }}
      aria-label={`${backgroundLabel} battle stage`}
    >
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.08)_0%,rgba(0,0,0,0)_24%,rgba(0,0,0,0.18)_74%,rgba(0,0,0,0.24)_100%)]" />
      <BattleStageEnemyHud enemy={enemy} />
      <BattleStagePlayerArt />
      <BattleStageEnemyArt />
      <BattleStageEffectLayer />
    </section>
  );
}
