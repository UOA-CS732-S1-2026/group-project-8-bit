import Image from "next/image";

type BattleStagePlayerArtProps = {
  isHit?: boolean;
  isAttacking?: boolean;
  isDefeated?: boolean;
  defeatAnimationMs?: number;
};

export function BattleStagePlayerArt({
  isHit = false,
  isAttacking = false,
  isDefeated = false,
  defeatAnimationMs = 1800,
}: BattleStagePlayerArtProps) {
  return (
    <div
      className={[
        "absolute z-[8] pointer-events-none",
        isHit ? "animate-[battle-player-hit_820ms_ease-out]" : "",
        isAttacking ? "animate-[battle-player-attack_700ms_ease-out]" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      style={{
        bottom: "-49%",
        left: "22%",
        height: "clamp(16rem, 50vh, 24rem)",
        aspectRatio: "706 / 900",
        animation: isDefeated
          ? `battle-player-defeat ${defeatAnimationMs}ms ease-out forwards`
          : undefined,
      }}
    >
      <div className="relative h-full w-full">
        {isHit ? (
          <div className="absolute inset-[18%_18%_10%_18%] animate-[battle-player-bruise_360ms_ease-out_forwards] rounded-full bg-[radial-gradient(circle,rgba(68,15,12,0.38)_0%,rgba(36,10,9,0.24)_42%,rgba(0,0,0,0)_72%)] blur-[8px]" />
        ) : null}
        {isDefeated ? (
          <div
            className="absolute inset-[12%_14%_6%_14%] rounded-full bg-[radial-gradient(circle,rgba(46,16,14,0.34)_0%,rgba(18,10,9,0.22)_34%,rgba(0,0,0,0)_72%)] blur-[12px]"
            style={{
              animation: `battle-player-fade-veil ${Math.round(defeatAnimationMs * 0.9)}ms ease-out forwards`,
            }}
          />
        ) : null}
        <Image
          src="/battle/human1.png"
          alt="Player full-body art"
          fill
          sizes="20vw"
          className={[
            "object-contain object-bottom drop-shadow-[0_28px_30px_rgba(0,0,0,0.6)]",
            isHit ? "drop-shadow-[0_0_32px_rgba(210,109,91,0.36)]" : "",
            isAttacking ? "drop-shadow-[0_0_28px_rgba(224,196,128,0.28)]" : "",
          ]
            .filter(Boolean)
            .join(" ")}
          priority
        />
      </div>
      <style jsx>{`
        @keyframes battle-player-hit {
          0% {
            transform: translate3d(0, 0, 0) scale(1);
            filter: brightness(1);
          }
          14% {
            transform: translate3d(-18px, -4px, 0) scale(1.02);
            filter: brightness(1.18);
          }
          28% {
            transform: translate3d(12px, 2px, 0) scale(0.995);
          }
          42% {
            transform: translate3d(-10px, 0, 0) scale(1.01);
          }
          100% {
            transform: translate3d(0, 0, 0) scale(1);
            filter: brightness(1);
          }
        }

        @keyframes battle-player-attack {
          0% {
            transform: translate3d(0, 0, 0) scale(1);
          }
          22% {
            transform: translate3d(22px, -8px, 0) scale(1.03);
          }
          38% {
            transform: translate3d(30px, -10px, 0) scale(1.05);
          }
          58% {
            transform: translate3d(-7px, 2px, 0) scale(0.992);
          }
          72% {
            transform: translate3d(4px, -1px, 0) scale(1.01);
          }
          100% {
            transform: translate3d(0, 0, 0) scale(1);
          }
        }

        @keyframes battle-player-bruise {
          0% {
            opacity: 0;
            transform: scale(0.82);
          }
          25% {
            opacity: 1;
            transform: scale(1.04);
          }
          100% {
            opacity: 0;
            transform: scale(1.1);
          }
        }

        @keyframes battle-player-defeat {
          0% {
            opacity: 1;
            transform: translate3d(0, 0, 0) scale(1);
            filter: brightness(1);
          }
          18% {
            opacity: 1;
            transform: translate3d(10px, 6px, 0) rotate(4deg) scale(1.01);
            filter: brightness(0.96);
          }
          44% {
            opacity: 0.92;
            transform: translate3d(28px, 26px, 0) rotate(10deg) scale(0.98);
            filter: brightness(0.82);
          }
          100% {
            opacity: 0;
            transform: translate3d(44px, 78px, 0) rotate(16deg) scale(0.88);
            filter: brightness(0.54) blur(5px);
          }
        }

        @keyframes battle-player-fade-veil {
          0% {
            opacity: 0;
            transform: scale(0.86);
          }
          28% {
            opacity: 1;
            transform: scale(1.02);
          }
          100% {
            opacity: 0;
            transform: scale(1.12);
          }
        }
      `}</style>
    </div>
  );
}
