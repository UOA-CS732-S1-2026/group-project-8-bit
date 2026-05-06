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
    imagePath?: string;
    artPreset?: "default" | "page" | "andrew" | "darkside";
  };
  playerHit?: boolean;
  enemyHit?: boolean;
  enemyAttacking?: boolean;
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
  actionCue?: {
    id: string;
    title: string;
    detail: string;
    tone: "player" | "enemy" | "system";
  } | null;
};

export function BattleStage({
  backgroundLabel,
  enemy,
  playerHit = false,
  enemyHit = false,
  enemyAttacking = false,
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
  actionCue = null,
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
      <div className="pointer-events-none absolute inset-0 z-[2] overflow-hidden">
        <div className="absolute inset-x-[-8%] bottom-[9%] h-[18%] animate-[battle-stage-ground-haze_9s_ease-in-out_infinite] bg-[radial-gradient(ellipse_at_center,rgba(229,178,109,0.1)_0%,rgba(88,54,28,0.05)_34%,rgba(0,0,0,0)_72%)] blur-[16px]" />
        <div className="absolute left-[-6%] top-[18%] h-[28%] w-[46%] animate-[battle-stage-fog-drift_15s_ease-in-out_infinite] bg-[radial-gradient(circle,rgba(255,228,191,0.07)_0%,rgba(120,94,70,0.04)_34%,rgba(0,0,0,0)_74%)] blur-[20px]" />
        <div className="absolute right-[-8%] top-[8%] h-[36%] w-[42%] animate-[battle-stage-fog-drift-reverse_18s_ease-in-out_infinite] bg-[radial-gradient(circle,rgba(255,224,184,0.06)_0%,rgba(110,82,60,0.035)_38%,rgba(0,0,0,0)_76%)] blur-[22px]" />
        {Array.from({ length: 9 }).map((_, index) => (
          <span
            key={index}
            className="absolute rounded-full bg-[#efb35f]/60 animate-[battle-stage-ember-rise_8s_linear_infinite]"
            style={{
              left: `${8 + index * 10}%`,
              bottom: `${8 + (index % 3) * 4}%`,
              width: `${3 + (index % 3)}px`,
              height: `${3 + (index % 3)}px`,
              animationDelay: `${index * 0.7}s`,
              animationDuration: `${7.2 + (index % 4) * 1.4}s`,
              boxShadow: "0 0 12px rgba(239,179,95,0.45)",
            }}
          />
        ))}
      </div>
      <BattleStageEnemyHud enemy={enemy} muted={hudMuted} />
      <BattleStagePlayerArt
        isHit={playerHit}
        isAttacking={playerAttacking}
        isDefeated={playerDefeated}
        defeatAnimationMs={defeatAnimationMs}
      />
      {enemy.isBoss ? (
        <>
          <div className="pointer-events-none absolute right-[18%] top-[14%] z-[4] h-[44%] w-[28%] rounded-full bg-[radial-gradient(circle,rgba(221,179,97,0.1)_0%,rgba(221,179,97,0.04)_28%,rgba(0,0,0,0)_72%)] blur-[10px]" />
        </>
      ) : null}
      <BattleStageEnemyArt
        imagePath={enemy.imagePath}
        enemyName={enemy.name}
        artPreset={enemy.artPreset}
        isHit={enemyHit}
        isAttacking={enemyAttacking}
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
              ? "bg-[radial-gradient(circle_at_70%_40%,rgba(255,247,220,0.48)_0%,rgba(255,233,176,0.18)_18%,rgba(255,233,176,0)_44%)]"
              : "bg-[radial-gradient(circle_at_28%_62%,rgba(255,226,220,0.38)_0%,rgba(255,172,150,0.16)_18%,rgba(255,172,150,0)_42%)]",
          ].join(" ")}
        />
      ) : null}
      {actionCue ? (
        <div className="pointer-events-none absolute left-[57%] top-[45%] z-[26] animate-[battle-action-cue_1250ms_ease-out_forwards] -translate-x-1/2">
          <div
            className={[
              "min-w-[16rem] rounded-[1rem] border px-5 py-3 text-center shadow-[0_18px_36px_rgba(0,0,0,0.38)] backdrop-blur-[4px]",
              actionCue.tone === "player"
                ? "border-[#f0cf8a]/82 bg-[linear-gradient(180deg,rgba(83,56,25,0.92)_0%,rgba(41,27,15,0.9)_100%)] text-[#fff0c9]"
                : actionCue.tone === "enemy"
                  ? "border-[#dd9b8d]/8 bg-[linear-gradient(180deg,rgba(82,33,24,0.92)_0%,rgba(38,18,15,0.9)_100%)] text-[#ffe0d8]"
                  : "border-[#d6bc88]/82 bg-[linear-gradient(180deg,rgba(78,57,30,0.9)_0%,rgba(34,24,17,0.88)_100%)] text-[#f8e4b8]",
            ].join(" ")}
          >
            <div className="text-[0.66rem] font-black uppercase tracking-[0.32em] opacity-90">
              {actionCue.title}
            </div>
            <div className="mt-2 text-[0.92rem] font-semibold leading-5 opacity-95">
              {actionCue.detail}
            </div>
          </div>
        </div>
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
              "rounded-full border px-4 py-1.5 text-[1.05rem] font-black tracking-[0.08em] shadow-[0_14px_28px_rgba(0,0,0,0.38)]",
              entry.tone === "heal"
                ? "border-[#8dc18f]/80 bg-[rgba(40,70,42,0.82)] text-[#d6ffd8]"
                : entry.tone === "info"
                  ? "border-[#d7bc83]/80 bg-[rgba(71,53,28,0.84)] text-[#f4e1b8]"
                  : "border-[#e2a08c]/88 bg-[rgba(92,35,25,0.9)] text-[#ffe0d8]",
              entry.tone === "damage"
                ? "text-[1.35rem] tracking-[0.1em] shadow-[0_18px_34px_rgba(0,0,0,0.45)]"
                : "",
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

        @keyframes battle-stage-fog-drift {
          0%,
          100% {
            transform: translate3d(0, 0, 0) scale(1);
            opacity: 0.78;
          }
          50% {
            transform: translate3d(40px, -10px, 0) scale(1.08);
            opacity: 1;
          }
        }

        @keyframes battle-stage-fog-drift-reverse {
          0%,
          100% {
            transform: translate3d(0, 0, 0) scale(1);
            opacity: 0.72;
          }
          50% {
            transform: translate3d(-34px, 8px, 0) scale(1.06);
            opacity: 0.96;
          }
        }

        @keyframes battle-stage-ground-haze {
          0%,
          100% {
            transform: scaleX(1) translateY(0);
            opacity: 0.72;
          }
          50% {
            transform: scaleX(1.08) translateY(-4px);
            opacity: 0.92;
          }
        }

        @keyframes battle-stage-ember-rise {
          0% {
            opacity: 0;
            transform: translate3d(0, 0, 0) scale(0.6);
          }
          12% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            transform: translate3d(12px, -96px, 0) scale(0.2);
          }
        }

        @keyframes battle-action-cue {
          0% {
            opacity: 0;
            transform: translate(-50%, 10px) scale(0.9);
          }
          14% {
            opacity: 1;
            transform: translate(-50%, -4px) scale(1.03);
          }
          72% {
            opacity: 1;
            transform: translate(-50%, -8px) scale(1);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -22px) scale(0.98);
          }
        }
      `}</style>
    </section>
  );
}
