import Image from "next/image";

type BattleStageEnemyArtProps = {
  imagePath?: string;
  enemyName?: string;
  artPreset?: "default" | "page" | "andrew" | "darkside";
  isHit?: boolean;
  isAttacking?: boolean;
  isBursting?: boolean;
  hitTier?: "normal" | "burst";
  isDefeated?: boolean;
  defeatAnimationMs?: number;
};

export function BattleStageEnemyArt({
  imagePath = "/battle/monster1.png",
  enemyName = "Enemy",
  artPreset = "default",
  isHit = false,
  isAttacking = false,
  isBursting = false,
  hitTier = "normal",
  isDefeated = false,
  defeatAnimationMs = 1800,
}: BattleStageEnemyArtProps) {
  const artDirection =
    artPreset === "page"
      ? {
          bottom: "17%",
          right: "11%",
          height: "clamp(39rem, 82vh, 54rem)",
          imageClass: "scale-[1.34] object-[center_bottom]",
        }
      : artPreset === "andrew"
        ? {
            bottom: "2%",
            right: "16%",
            height: "clamp(27rem, 56vh, 36rem)",
            imageClass: "scale-x-[1.12] scale-y-[1.02] object-[center_bottom]",
          }
        : artPreset === "darkside"
          ? {
              bottom: "-10%",
              right: "19%",
              height: "clamp(31rem, 68vh, 42rem)",
              imageClass: "scale-[1.1] object-[center_bottom]",
            }
          : {
            bottom: "-20%",
            right: "20%",
            height: "clamp(30rem, 64vh, 41rem)",
            imageClass: "scale-[1.08] object-[center_bottom]",
          };

  return (
    <div
      className={[
        "absolute z-[8] pointer-events-none",
        !isDefeated && isHit
          ? hitTier === "burst"
            ? "animate-[battle-enemy-hit-burst_980ms_ease-out]"
            : "animate-[battle-enemy-hit_860ms_ease-out]"
          : "",
        !isDefeated && !isHit && isAttacking
          ? "animate-[battle-enemy-attack_760ms_ease-out]"
          : "",
        !isDefeated && isBursting
          ? "animate-[battle-enemy-burst_1.2s_ease-in-out_infinite]"
          : "",
      ]
        .filter(Boolean)
        .join(" ")}
      style={{
        bottom: artDirection.bottom,
        right: artDirection.right,
        height: artDirection.height,
        aspectRatio: "1024 / 1536",
        animation: isDefeated
          ? `battle-enemy-defeat ${defeatAnimationMs}ms ease-out forwards`
          : undefined,
      }}
    >
      <div className="relative h-full w-full">
        {isDefeated ? (
          <>
            <div
              className="absolute inset-[12%_12%_18%_12%] rounded-full bg-[radial-gradient(circle,rgba(242,183,83,0.22)_0%,rgba(152,72,26,0.14)_32%,rgba(0,0,0,0)_74%)]"
              style={{
                animation: `battle-enemy-embers ${Math.round(defeatAnimationMs * 0.9)}ms ease-out forwards`,
              }}
            />
            <div
              className="absolute inset-[14%_12%_20%_12%] rounded-full bg-[radial-gradient(circle,rgba(255,238,208,0.16)_0%,rgba(164,104,48,0.1)_30%,rgba(0,0,0,0)_72%)]"
              style={{
                animation: `battle-enemy-ash-halo ${Math.round(defeatAnimationMs * 0.82)}ms ease-out forwards`,
              }}
            />
          </>
        ) : null}
        {!isDefeated && isHit ? (
          <>
            <div className="absolute inset-[18%_20%_18%_20%] animate-[battle-enemy-hit-sigil_520ms_ease-out_forwards] rounded-full bg-[radial-gradient(circle,rgba(255,231,182,0.42)_0%,rgba(190,110,38,0.22)_32%,rgba(0,0,0,0)_72%)]" />
            <div className="absolute left-[26%] top-[38%] h-[0.22rem] w-[48%] rotate-[-18deg] animate-[battle-enemy-hit-sigil_420ms_ease-out_forwards] rounded-full bg-[linear-gradient(90deg,rgba(255,238,203,0)_0%,rgba(255,238,203,0.95)_46%,rgba(255,208,135,0.88)_54%,rgba(255,208,135,0)_100%)] shadow-[0_0_18px_rgba(255,214,138,0.38)]" />
          </>
        ) : null}
        {!isDefeated && isAttacking ? (
          <>
            <div className="absolute inset-[32%_14%_10%_18%] animate-[battle-enemy-attack-halo_680ms_ease-out_forwards] rounded-full bg-[radial-gradient(circle,rgba(245,198,122,0.2)_0%,rgba(152,78,34,0.14)_34%,rgba(0,0,0,0)_74%)]" />
            <div className="absolute inset-[37%_22%_16%_22%] animate-[battle-enemy-attack-ring_700ms_ease-out_forwards] rounded-full border border-[#efc37d]/45" />
            <div className="absolute right-[32%] top-[60%] h-[0.28rem] w-[42%] rotate-[16deg] animate-[battle-enemy-arc-sweep_560ms_cubic-bezier(0.18,0.88,0.32,1)_forwards] rounded-full bg-[linear-gradient(90deg,rgba(255,231,194,0)_0%,rgba(255,231,194,0.34)_18%,rgba(255,192,110,0.98)_52%,rgba(151,58,29,0.92)_78%,rgba(151,58,29,0)_100%)] shadow-[0_0_22px_rgba(238,172,92,0.34)]" />
            <div className="absolute right-[26%] top-[70%] h-[0.22rem] w-[33%] rotate-[25deg] animate-[battle-enemy-arc-sweep_560ms_cubic-bezier(0.18,0.88,0.32,1)_forwards] rounded-full bg-[linear-gradient(90deg,rgba(255,226,186,0)_0%,rgba(255,226,186,0.24)_16%,rgba(214,116,68,0.9)_56%,rgba(118,39,23,0)_100%)] opacity-95" />
            <div className="absolute left-[16%] top-[80%] h-[16%] w-[26%] animate-[battle-enemy-projectile-flare_620ms_ease-out_forwards] rounded-full bg-[radial-gradient(circle,rgba(255,240,209,0.58)_0%,rgba(242,175,93,0.3)_34%,rgba(130,44,22,0)_76%)] blur-[4px]" />
          </>
        ) : null}
        <Image
          src={imagePath}
          alt={`${enemyName} full-body art`}
          fill
          sizes="21vw"
          className={[
            "object-contain object-bottom",
            artDirection.imageClass,
            isDefeated
              ? "drop-shadow-[0_10px_18px_rgba(0,0,0,0.28)]"
              : "drop-shadow-[0_26px_32px_rgba(0,0,0,0.58)]",
            !isDefeated && isHit
              ? hitTier === "burst"
                ? "drop-shadow-[0_0_54px_rgba(255,230,162,0.44)]"
                : "drop-shadow-[0_0_36px_rgba(255,236,196,0.3)]"
              : "",
            !isDefeated && isAttacking
              ? "drop-shadow-[0_0_40px_rgba(233,168,90,0.24)]"
              : "",
            !isDefeated && isBursting
              ? "drop-shadow-[0_0_42px_rgba(232,194,114,0.3)]"
              : "",
          ]
            .filter(Boolean)
            .join(" ")}
          priority
        />
      </div>
      <style jsx>{`
        @keyframes battle-enemy-hit {
          0% {
            transform: translate3d(0, 0, 0) scale(1);
            filter: brightness(1);
          }
          16% {
            transform: translate3d(20px, -6px, 0) scale(1.04);
            filter: brightness(1.22);
          }
          32% {
            transform: translate3d(-14px, 4px, 0) scale(0.99);
          }
          48% {
            transform: translate3d(10px, -1px, 0) scale(1.02);
          }
          100% {
            transform: translate3d(0, 0, 0) scale(1);
            filter: brightness(1);
          }
        }

        @keyframes battle-enemy-burst {
          0%,
          100% {
            transform: translate3d(0, 0, 0) scale(1.01);
            filter: brightness(1);
          }
          50% {
            transform: translate3d(0, -8px, 0) scale(1.05);
            filter: brightness(1.12);
          }
        }

        @keyframes battle-enemy-hit-burst {
          0% {
            transform: translate3d(0, 0, 0) scale(1);
            filter: brightness(1);
          }
          12% {
            transform: translate3d(26px, -10px, 0) scale(1.08);
            filter: brightness(1.3);
          }
          28% {
            transform: translate3d(-20px, 8px, 0) scale(0.98);
          }
          44% {
            transform: translate3d(16px, -3px, 0) scale(1.03);
          }
          62% {
            transform: translate3d(-10px, 2px, 0) scale(1.01);
          }
          100% {
            transform: translate3d(0, 0, 0) scale(1);
            filter: brightness(1);
          }
        }

        @keyframes battle-enemy-defeat {
          0% {
            opacity: 1;
            transform: translate3d(0, 0, 0) scale(1);
            filter: saturate(1) brightness(1);
          }
          24% {
            opacity: 1;
            transform: translate3d(0, 0, 0) scale(1.03);
            filter: saturate(1.08) brightness(1.08);
          }
          52% {
            opacity: 0.72;
            transform: translate3d(0, 0, 0) scale(0.94);
            filter: saturate(0.62) brightness(0.9);
          }
          100% {
            opacity: 0;
            transform: translate3d(0, 0, 0) scale(0.72);
            filter: saturate(0.12) brightness(0.58);
          }
        }

        @keyframes battle-enemy-attack {
          0% {
            transform: translate3d(0, 0, 0) scale(1);
            filter: brightness(1) saturate(1);
          }
          20% {
            transform: translate3d(0, -4px, 0) scale(1.015);
            filter: brightness(1.08) saturate(1.06);
          }
          48% {
            transform: translate3d(0, -8px, 0) scale(1.028);
            filter: brightness(1.14) saturate(1.1);
          }
          72% {
            transform: translate3d(0, -3px, 0) scale(1.01);
            filter: brightness(1.06) saturate(1.04);
          }
          100% {
            transform: translate3d(0, 0, 0) scale(1);
            filter: brightness(1) saturate(1);
          }
        }

        @keyframes battle-enemy-embers {
          0% {
            opacity: 0;
            transform: scale(0.82);
          }
          24% {
            opacity: 1;
            transform: scale(1.02);
          }
          100% {
            opacity: 0;
            transform: scale(1.28);
          }
        }

        @keyframes battle-enemy-hit-sigil {
          0% {
            opacity: 0;
            transform: scale(0.82);
          }
          28% {
            opacity: 1;
            transform: scale(1.08);
          }
          100% {
            opacity: 0;
            transform: scale(1.16);
          }
        }

        @keyframes battle-enemy-attack-halo {
          0% {
            opacity: 0;
            transform: scale(0.82);
          }
          32% {
            opacity: 1;
            transform: scale(1.04);
          }
          100% {
            opacity: 0;
            transform: scale(1.22);
          }
        }

        @keyframes battle-enemy-attack-ring {
          0% {
            opacity: 0;
            transform: scale(0.74);
          }
          24% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            transform: scale(1.16);
          }
        }

        @keyframes battle-enemy-arc-sweep {
          0% {
            opacity: 0;
            transform: translate3d(20px, -10px, 0) scaleX(0.72);
          }
          18% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            transform: translate3d(-26px, 10px, 0) scaleX(1.08);
          }
        }

        @keyframes battle-enemy-projectile-flare {
          0% {
            opacity: 0;
            transform: translate3d(48px, -10px, 0) scale(0.42);
          }
          24% {
            opacity: 0.9;
          }
          100% {
            opacity: 0;
            transform: translate3d(-180px, 38px, 0) scale(1.06);
          }
        }

        @keyframes battle-enemy-ash-halo {
          0% {
            opacity: 0;
            transform: scale(0.88);
          }
          35% {
            opacity: 0.9;
            transform: scale(1.02);
          }
          100% {
            opacity: 0;
            transform: scale(1.24);
          }
        }

      `}</style>
    </div>
  );
}
