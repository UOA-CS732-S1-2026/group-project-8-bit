type BattleTimerBarProps = {
  duration: number;
  remainingTime: number;
  warningThreshold?: number;
};

const clampProgress = (duration: number, remainingTime: number) => {
  if (duration <= 0) {
    return 0;
  }

  return Math.max(0, Math.min(remainingTime / duration, 1));
};

const clampFlamePercent = (progress: number) => {
  const percent = progress * 100;
  return `${Math.max(6, Math.min(percent, 94))}%`;
};

export function BattleTimerBar({
  duration,
  remainingTime,
  warningThreshold = 3,
}: BattleTimerBarProps) {
  const progress = clampProgress(duration, remainingTime);
  const progressPercent = `${progress * 100}%`;
  const flamePosition = clampFlamePercent(progress);
  const roundedSeconds = Math.max(0, Math.ceil(remainingTime));
  const isWarning = remainingTime <= warningThreshold;
  const segmentCount = Math.max(8, Math.min(Math.round(duration), 16));
  const litSegments = Math.ceil(progress * segmentCount);
  const flameGlow = isWarning
    ? "0 0 18px rgba(255,138,61,0.75), 0 0 36px rgba(255,92,24,0.38)"
    : "0 0 12px rgba(255,184,88,0.45), 0 0 24px rgba(255,122,43,0.18)";

  return (
    <div
      className="relative ml-auto"
      style={{ width: "32rem", maxWidth: "calc(100vw - 2rem)" }}
    >
      <section
        className={[
          "relative overflow-hidden rounded-[0.75rem] border border-[#6c4a2a] bg-[linear-gradient(180deg,rgba(39,27,20,0.98)_0%,rgba(13,10,9,1)_100%)] shadow-[0_14px_28px_rgba(0,0,0,0.5)]",
          isWarning
            ? "shadow-[0_0_22px_rgba(220,94,38,0.24),0_10px_22px_rgba(0,0,0,0.5)]"
            : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,228,168,0.12)_0%,rgba(255,156,64,0.06)_24%,rgba(0,0,0,0)_56%,rgba(0,0,0,0.22)_100%)]" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-[radial-gradient(circle_at_right,rgba(255,177,74,0.18)_0%,rgba(255,103,27,0.08)_36%,rgba(255,103,27,0)_72%)]" />
        <div className="relative flex items-center gap-4 px-4 py-2">
          <div className="flex shrink-0 items-center gap-2.5">
            <div className="relative h-10 w-7" style={{ filter: `drop-shadow(${flameGlow})` }}>
              <div className="absolute bottom-[1px] left-1/2 h-4 w-4 -translate-x-1/2 rounded-[0.35rem] border border-[#704326] bg-[linear-gradient(180deg,#5a3620_0%,#26140d_100%)]" />
              <div className="absolute bottom-[5px] left-1/2 h-5.5 w-[8px] -translate-x-1/2 rounded-t-[0.35rem] rounded-b-[0.15rem] bg-[linear-gradient(180deg,#f3e0b1_0%,#dfc48a_52%,#a5784e_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.28)]" />
              <div className="absolute bottom-[9px] left-1/2 h-2 w-[2px] -translate-x-1/2 rounded-full bg-[#28120c]" />
              <div className="absolute bottom-[10px] left-1/2 h-6 w-5 -translate-x-1/2 rounded-[999px_999px_999px_999px/82%_82%_38%_38%] bg-[radial-gradient(circle_at_50%_24%,rgba(255,254,243,1)_0%,rgba(255,236,169,0.98)_18%,rgba(255,176,75,0.96)_50%,rgba(232,92,27,0.86)_78%,rgba(232,92,27,0)_100%)]" />
              <div className="absolute bottom-[14px] left-1/2 h-3 w-2 -translate-x-1/2 rounded-[999px_999px_999px_999px/72%_72%_28%_28%] bg-[radial-gradient(circle_at_50%_30%,rgba(255,255,247,0.98)_0%,rgba(255,242,202,0.9)_60%,rgba(255,242,202,0)_100%)]" />
            </div>
            <div className="text-[0.66rem] font-semibold uppercase tracking-[0.28em] text-[#c6a06e]">
              Candle
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <div
              role="progressbar"
              aria-label="Battle timer"
              aria-valuemin={0}
              aria-valuemax={Math.max(duration, 0)}
              aria-valuenow={Math.max(remainingTime, 0)}
              className={[
                "relative overflow-hidden rounded-[0.45rem] border border-[#6b4a31] bg-[#090606] p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_8px_16px_rgba(0,0,0,0.38)]",
                isWarning ? "border-[#b04d2c]" : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <div className="relative h-5 overflow-hidden rounded-[0.3rem] border border-[#2e1a13] bg-gradient-to-b from-[#23130d] via-[#140a08] to-[#090505] shadow-[inset_0_2px_8px_rgba(0,0,0,0.65)]">
                <div
                  className={[
                    "absolute inset-y-0 left-0 transition-[width] duration-500 ease-out",
                    isWarning
                      ? "animate-pulse shadow-[0_0_16px_rgba(248,146,71,0.55)]"
                      : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  style={{
                    width: progressPercent,
                    backgroundImage: isWarning
                      ? "linear-gradient(180deg, #ffe08d 0%, #ffb54e 18%, #f27c2f 48%, #c4461b 72%, #5f130d 100%)"
                      : "linear-gradient(180deg, #f4cf87 0%, #df9b45 26%, #b45b24 58%, #762416 84%, #41100d 100%)",
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-white/32 via-[#fff3d4]/10 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-black/22 to-black/55" />
                  <div className="absolute inset-y-0 right-0 w-16 bg-[linear-gradient(90deg,rgba(255,247,229,0),rgba(255,230,164,0.95))]" />
                  <div className="absolute inset-y-[1px] right-0 w-10 rounded-full bg-[radial-gradient(circle_at_right,rgba(255,246,205,0.98)_0%,rgba(255,198,98,0.9)_34%,rgba(255,112,33,0.55)_62%,rgba(255,112,33,0)_100%)]" />
                </div>

                <div className="pointer-events-none absolute inset-0 grid grid-cols-12 gap-[3px] px-[3px] py-[3px]">
                  {Array.from({ length: segmentCount }).map((_, index) => {
                    const isLit = index < litSegments;

                    return (
                      <div
                        key={`segment-${index}`}
                        className="rounded-[0.12rem] transition-colors duration-300"
                        style={{
                          background: isLit
                            ? isWarning
                              ? "linear-gradient(180deg, rgba(255,226,153,0.95) 0%, rgba(244,129,50,0.88) 50%, rgba(147,45,20,0.78) 100%)"
                              : "linear-gradient(180deg, rgba(255,236,179,0.8) 0%, rgba(225,151,76,0.62) 50%, rgba(103,45,25,0.55) 100%)"
                            : "linear-gradient(180deg, rgba(64,34,22,0.4) 0%, rgba(18,10,8,0.72) 100%)",
                          boxShadow: isLit
                            ? isWarning
                              ? "0 0 10px rgba(255,118,48,0.34)"
                              : "0 0 6px rgba(255,183,87,0.14)"
                            : "none",
                        }}
                      />
                    );
                  })}
                </div>

                {isWarning ? (
                  <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(255,173,91,0.06)_0%,rgba(255,89,0,0.18)_50%,rgba(255,173,91,0.06)_100%)]" />
                ) : null}

                <div
                  className={[
                    "pointer-events-none absolute top-1/2 -translate-y-1/2 transition-[left] duration-500 ease-out",
                    isWarning ? "animate-pulse" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  style={{
                    left: flamePosition,
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  <div
                    className="relative h-11 w-9"
                    style={{ filter: `drop-shadow(${flameGlow})` }}
                  >
                    <div className="absolute bottom-[1px] left-1/2 h-5.5 w-[2px] -translate-x-1/2 rounded-full bg-[#2d160e]" />
                    <div className="absolute bottom-[3px] left-1/2 h-7 w-6 -translate-x-1/2 rounded-[999px_999px_999px_999px/86%_86%_40%_40%] bg-[radial-gradient(circle_at_50%_22%,rgba(255,254,241,1)_0%,rgba(255,238,172,0.98)_18%,rgba(255,181,79,0.98)_46%,rgba(235,96,29,0.9)_74%,rgba(235,96,29,0)_100%)]" />
                    <div className="absolute bottom-[9px] left-1/2 h-4 w-3 -translate-x-1/2 rounded-[999px_999px_999px_999px/80%_80%_28%_28%] bg-[radial-gradient(circle_at_50%_30%,rgba(255,255,248,1)_0%,rgba(255,241,201,0.95)_58%,rgba(255,241,201,0)_100%)]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            className={[
              "shrink-0 text-right",
              isWarning ? "animate-pulse" : "",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            <div className="text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-[#c6a06e]">
              Burn
            </div>
            <div className="mt-0.5 text-[1rem] font-semibold leading-none text-stone-100">
              {roundedSeconds}s
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
