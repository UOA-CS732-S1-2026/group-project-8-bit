import { BattleStageEnemyArt } from "./BattleStageEnemyArt";
import { BattleStageEnemyHud } from "./BattleStageEnemyHud";
import { BattleStageEffectLayer } from "./BattleStageEffectLayer";
import { BattleStagePlayerArt } from "./BattleStagePlayerArt";

type BattleStageFloatingText = {
  id: string;
  target: "enemy" | "player" | "center";
  text: string;
  tone?: "damage" | "heal" | "info";
  emphasis?: "normal" | "burst";
};

type BattleStageProps = {
  backgroundLabel: string;
  enemy: {
    name: string;
    hp: number;
    maxHp: number;
    attack: number;
    defense: number;
    isBoss?: boolean;
  };
  playerHit?: boolean;
  enemyHit?: boolean;
  playerAttacking?: boolean;
  burstActive?: boolean;
  floatingTexts?: BattleStageFloatingText[];
  shakeTone?: "none" | "playerHit" | "enemyHit";
  hitStopActive?: boolean;
  impactFlashTone?: "none" | "playerHit" | "enemyHit";
  enemyHitTier?: "normal" | "burst";
  enemyDefeated?: boolean;
  playerDefeated?: boolean;
  hudMuted?: boolean;
  defeatAnimationMs?: number;
};

export function BattleStage({
  backgroundLabel,
  enemy,
  playerHit = false,
  enemyHit = false,
  playerAttacking = false,
  burstActive = false,
  floatingTexts = [],
  shakeTone = "none",
  hitStopActive = false,
  impactFlashTone = "none",
  enemyHitTier = "normal",
  enemyDefeated = false,
  playerDefeated = false,
  hudMuted = false,
  defeatAnimationMs = 1800,
}: BattleStageProps) {
  return (
    <section
      className={[
        "relative z-0 flex-1 overflow-visible transition-transform duration-75",
        shakeTone === "playerHit"
          ? "animate-[battle-stage-shake-heavy_420ms_ease-out]"
          : shakeTone === "enemyHit"
            ? "animate-[battle-stage-shake-light_320ms_ease-out]"
            : "",
        hitStopActive ? "scale-[1.01]" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      style={{
        minHeight: "21rem",
        height: "clamp(21rem, 44vh, 27rem)",
      }}
      aria-label={`${backgroundLabel} battle stage`}
    >
      <BattleStageEnemyHud enemy={enemy} muted={hudMuted} />
      <BattleStagePlayerArt
        isHit={playerHit}
        isAttacking={playerAttacking}
        isDefeated={playerDefeated}
        defeatAnimationMs={defeatAnimationMs}
      />
      {enemy.isBoss ? (
        <>
          <div className="pointer-events-none absolute inset-0 z-[4] bg-[radial-gradient(circle_at_72%_36%,rgba(221,179,97,0.13)_0%,rgba(221,179,97,0.04)_20%,rgba(0,0,0,0)_44%)]" />
          <div className="pointer-events-none absolute inset-0 z-[4] bg-[linear-gradient(180deg,rgba(70,18,12,0.16)_0%,rgba(0,0,0,0)_26%,rgba(70,18,12,0.12)_100%)]" />
        </>
      ) : null}
      <BattleStageEnemyArt
        isHit={enemyHit}
        isBursting={burstActive}
        hitTier={enemyHitTier}
        isDefeated={enemyDefeated}
        defeatAnimationMs={defeatAnimationMs}
      />
      {impactFlashTone !== "none" ? (
        <div
          className={[
            "pointer-events-none absolute inset-0 z-[22] animate-[battle-impact-flash_220ms_ease-out_forwards]",
            impactFlashTone === "enemyHit"
              ? "bg-[radial-gradient(circle_at_70%_40%,rgba(255,247,220,0.34)_0%,rgba(255,233,176,0.14)_20%,rgba(255,233,176,0)_42%)]"
              : "bg-[radial-gradient(circle_at_28%_62%,rgba(255,226,220,0.28)_0%,rgba(255,172,150,0.12)_20%,rgba(255,172,150,0)_42%)]",
          ].join(" ")}
        />
      ) : null}
      <BattleStageEffectLayer visible={burstActive} anchor="enemy" />
      {floatingTexts.map((entry) => (
        <div
          key={entry.id}
          className="pointer-events-none absolute z-[28] animate-[battle-float_1250ms_ease-out_forwards]"
          style={{
            left:
              entry.target === "player"
                ? "26%"
                : entry.target === "center"
                  ? "50%"
                  : "71%",
            bottom:
              entry.target === "player"
                ? "24%"
                : entry.target === "center"
                  ? "42%"
                  : "48%",
            transform: "translate(-50%, 0)",
          }}
        >
          <div
            className={[
              "rounded-full border px-3 py-1 text-sm font-bold tracking-[0.08em] shadow-[0_10px_24px_rgba(0,0,0,0.3)]",
              entry.tone === "heal"
                ? "border-[#8dc18f]/80 bg-[rgba(40,70,42,0.82)] text-[#d6ffd8]"
                : entry.tone === "info"
                  ? "border-[#d7bc83]/80 bg-[rgba(71,53,28,0.84)] text-[#f4e1b8]"
                  : "border-[#d48672]/80 bg-[rgba(82,35,27,0.84)] text-[#ffd2c7]",
              entry.emphasis === "burst"
                ? "px-6 py-3 text-[1.05rem] uppercase tracking-[0.2em] shadow-[0_20px_48px_rgba(0,0,0,0.42)] sm:px-7 sm:text-[1.2rem]"
                : "",
            ].join(" ")}
          >
            {entry.text}
          </div>
        </div>
      ))}
      <style jsx>{`
        @keyframes battle-stage-shake-light {
          0% {
            transform: translate3d(0, 0, 0);
          }
          18% {
            transform: translate3d(-6px, 1px, 0);
          }
          36% {
            transform: translate3d(5px, -1px, 0);
          }
          54% {
            transform: translate3d(-4px, 0, 0);
          }
          72% {
            transform: translate3d(3px, 0, 0);
          }
          100% {
            transform: translate3d(0, 0, 0);
          }
        }

        @keyframes battle-stage-shake-heavy {
          0% {
            transform: translate3d(0, 0, 0);
          }
          16% {
            transform: translate3d(10px, -2px, 0);
          }
          32% {
            transform: translate3d(-9px, 2px, 0);
          }
          48% {
            transform: translate3d(7px, -1px, 0);
          }
          64% {
            transform: translate3d(-5px, 1px, 0);
          }
          80% {
            transform: translate3d(3px, 0, 0);
          }
          100% {
            transform: translate3d(0, 0, 0);
          }
        }

        @keyframes battle-float {
          0% {
            opacity: 0;
            transform: translate(-50%, 14px) scale(0.78);
          }
          10% {
            opacity: 1;
            transform: translate(-50%, -8px) scale(1.08);
          }
          62% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -48px) scale(0.98);
          }
        }

        @keyframes battle-impact-flash {
          0% {
            opacity: 0;
          }
          20% {
            opacity: 1;
          }
          100% {
            opacity: 0;
          }
        }
      `}</style>
    </section>
  );
}
