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
        {isAttacking ? (
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-[43%] top-[12%] h-[56%] w-[66%] animate-[battle-player-moon-slash_620ms_cubic-bezier(0.2,0.9,0.24,1)_forwards] opacity-0">
              <div className="absolute inset-0 rounded-[50%] border-t-[5px] border-r-[5px] border-[#fff1c5] blur-[0.2px]" />
              <div className="absolute inset-[8%] rounded-[50%] border-t-[3px] border-r-[3px] border-[#f1c970]/90" />
              <div className="absolute inset-[18%] rounded-[50%] border-t-[2px] border-r-[2px] border-[#fff6dd]/80" />
            </div>
            <div className="absolute left-[56%] top-[24%] h-[0.7rem] w-[44%] rotate-[-18deg] animate-[battle-player-sword-trail_620ms_cubic-bezier(0.2,0.9,0.24,1)_forwards] rounded-full bg-[linear-gradient(90deg,rgba(255,243,214,0)_0%,rgba(255,243,214,0.3)_14%,rgba(255,249,235,1)_44%,rgba(244,205,132,0.96)_66%,rgba(244,205,132,0)_100%)] shadow-[0_0_26px_rgba(244,205,132,0.68)]" />
            <div className="absolute left-[66%] top-[25%] h-[18%] w-[18%] animate-[battle-player-impact-star_420ms_ease-out_forwards] opacity-0">
              <div className="absolute left-1/2 top-1/2 h-[0.28rem] w-full -translate-x-1/2 -translate-y-1/2 rounded-full bg-[linear-gradient(90deg,rgba(255,246,224,0)_0%,rgba(255,246,224,1)_50%,rgba(255,246,224,0)_100%)] shadow-[0_0_16px_rgba(255,233,176,0.72)]" />
              <div className="absolute left-1/2 top-1/2 h-full w-[0.28rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[linear-gradient(180deg,rgba(255,246,224,0)_0%,rgba(255,246,224,1)_50%,rgba(255,246,224,0)_100%)] shadow-[0_0_16px_rgba(255,233,176,0.72)]" />
            </div>
          </div>
        ) : null}
        {isHit ? (
          <>
            <div className="absolute inset-[18%_18%_10%_18%] animate-[battle-player-bruise_360ms_ease-out_forwards] rounded-full bg-[radial-gradient(circle,rgba(68,15,12,0.38)_0%,rgba(36,10,9,0.24)_42%,rgba(0,0,0,0)_72%)] blur-[8px]" />
            <div className="absolute left-[24%] top-[42%] h-[0.2rem] w-[42%] rotate-[18deg] animate-[battle-player-hit-mark_420ms_ease-out_forwards] rounded-full bg-[linear-gradient(90deg,rgba(255,214,203,0)_0%,rgba(255,214,203,0.96)_46%,rgba(214,103,84,0.9)_54%,rgba(214,103,84,0)_100%)] shadow-[0_0_16px_rgba(214,103,84,0.34)]" />
          </>
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

        @keyframes battle-player-hit-mark {
          0% {
            opacity: 0;
            transform: scale(0.9) rotate(18deg);
          }
          30% {
            opacity: 1;
            transform: scale(1.08) rotate(18deg);
          }
          100% {
            opacity: 0;
            transform: scale(1.14) rotate(18deg);
          }
        }

        @keyframes battle-player-sword-trail {
          0% {
            opacity: 0;
            transform: translate3d(-24px, 18px, 0) rotate(-18deg) scaleX(0.42);
          }
          30% {
            opacity: 1;
            transform: translate3d(12px, -8px, 0) rotate(-18deg) scaleX(1.08);
          }
          100% {
            opacity: 0;
            transform: translate3d(70px, -26px, 0) rotate(-18deg) scaleX(1.2);
          }
        }

        @keyframes battle-player-moon-slash {
          0% {
            opacity: 0;
            transform: translate3d(-18px, 10px, 0) rotate(-14deg) scale(0.74);
          }
          24% {
            opacity: 1;
            transform: translate3d(4px, -8px, 0) rotate(-4deg) scale(1.02);
          }
          100% {
            opacity: 0;
            transform: translate3d(38px, -22px, 0) rotate(8deg) scale(1.16);
          }
        }

        @keyframes battle-player-impact-star {
          0% {
            opacity: 0;
            transform: scale(0.4);
          }
          36% {
            opacity: 1;
            transform: scale(1.08);
          }
          100% {
            opacity: 0;
            transform: scale(1.28);
          }
        }
      `}</style>
    </div>
  );
}
