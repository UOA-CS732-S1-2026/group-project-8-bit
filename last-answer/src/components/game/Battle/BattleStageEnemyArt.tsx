import Image from "next/image";

type BattleStageEnemyArtProps = {
  isHit?: boolean;
  isBursting?: boolean;
  hitTier?: "normal" | "burst";
  isDefeated?: boolean;
  defeatAnimationMs?: number;
};

export function BattleStageEnemyArt({
  isHit = false,
  isBursting = false,
  hitTier = "normal",
  isDefeated = false,
  defeatAnimationMs = 1800,
}: BattleStageEnemyArtProps) {
  return (
    <div
      className={[
        "absolute z-[8] pointer-events-none",
        isHit
          ? hitTier === "burst"
            ? "animate-[battle-enemy-hit-burst_980ms_ease-out]"
            : "animate-[battle-enemy-hit_860ms_ease-out]"
          : "",
        isBursting ? "animate-[battle-enemy-burst_1.2s_ease-in-out_infinite]" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      style={{
        bottom: "-18%",
        right: "20%",
        height: "clamp(27rem, 60vh, 37rem)",
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
              className="absolute inset-[12%_12%_18%_12%] rounded-full bg-[radial-gradient(circle,rgba(242,183,83,0.18)_0%,rgba(152,72,26,0.12)_34%,rgba(0,0,0,0)_72%)]"
              style={{
                animation: `battle-enemy-embers ${Math.round(defeatAnimationMs * 0.9)}ms ease-out forwards`,
              }}
            />
            <div className="absolute inset-[10%_8%_16%_10%] bg-[linear-gradient(180deg,rgba(90,46,18,0.14)_0%,rgba(0,0,0,0)_46%,rgba(0,0,0,0.08)_100%)]" />
          </>
        ) : null}
        <Image
          src="/battle/monster1.png"
          alt="Enemy full-body art"
          fill
          sizes="21vw"
          className={[
            "object-contain object-bottom drop-shadow-[0_24px_28px_rgba(0,0,0,0.55)]",
            isHit
              ? hitTier === "burst"
                ? "drop-shadow-[0_0_54px_rgba(255,230,162,0.44)]"
                : "drop-shadow-[0_0_36px_rgba(255,236,196,0.3)]"
              : "",
            isBursting ? "drop-shadow-[0_0_42px_rgba(232,194,114,0.3)]" : "",
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
            filter: brightness(1);
          }
          18% {
            opacity: 1;
            transform: translate3d(4px, -10px, 0) scale(1.03);
            filter: brightness(1.16);
          }
          46% {
            opacity: 0.88;
            transform: translate3d(-6px, 10px, 0) scale(0.98);
            filter: brightness(0.92);
          }
          100% {
            opacity: 0;
            transform: translate3d(0, 56px, 0) scale(0.86);
            filter: brightness(0.62) blur(5px);
          }
        }

        @keyframes battle-enemy-embers {
          0% {
            opacity: 0;
            transform: scale(0.86);
          }
          24% {
            opacity: 1;
            transform: scale(1.04);
          }
          100% {
            opacity: 0;
            transform: scale(1.18);
          }
        }
      `}</style>
    </div>
  );
}
