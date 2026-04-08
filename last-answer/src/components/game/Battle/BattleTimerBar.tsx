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
  const flameGlow = isWarning
    ? "0 0 12px rgba(235,123,57,0.42), 0 0 24px rgba(150,55,18,0.16)"
    : "0 0 8px rgba(215,162,89,0.28), 0 0 18px rgba(126,74,28,0.12)";

  return (
    <div
      className="relative ml-auto"
      style={{ width: "min(26rem, calc(100vw - 1rem))" }}
    >
      <section
        className={[
          "relative overflow-hidden bg-transparent shadow-none",
          isWarning
            ? ""
            : "",
        ]
          .filter(Boolean)
          .join(" ")}
        style={{ minHeight: "clamp(4rem, 10vw, 4.9rem)" }}
      >
        <div className="relative flex items-center gap-2 px-3 py-2.5 sm:gap-3 sm:px-4 sm:py-3">
          <div className="min-w-0 flex-1">
            <div
              role="progressbar"
              aria-label="Battle timer"
              aria-valuemin={0}
              aria-valuemax={Math.max(duration, 0)}
              aria-valuenow={Math.max(remainingTime, 0)}
              className={[
                "relative overflow-hidden rounded-[0.35rem] bg-transparent p-[4px] shadow-none",
                isWarning ? "" : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <div className="relative h-3 overflow-hidden rounded-[0.22rem] border border-[#2b180f] bg-[linear-gradient(180deg,#1b110d_0%,#0f0807_100%)] shadow-[inset_0_2px_6px_rgba(0,0,0,0.54)] sm:h-3.5">
                <div className="pointer-events-none absolute inset-x-[2%] top-1/2 h-[1px] -translate-y-1/2 bg-[linear-gradient(90deg,rgba(117,76,46,0)_0%,rgba(117,76,46,0.22)_18%,rgba(117,76,46,0.22)_82%,rgba(117,76,46,0)_100%)]" />
                <div
                  className={[
                    "absolute inset-y-0 left-0 transition-[width] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
                    isWarning
                      ? "shadow-[0_0_10px_rgba(193,97,42,0.34)]"
                      : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  style={{
                    width: progressPercent,
                    backgroundImage: isWarning
                      ? "linear-gradient(180deg,#f1cb89 0%,#d0914d 32%,#9b4d22 68%,#4a180d 100%)"
                      : "linear-gradient(180deg,#d7b277 0%,#b77a40 36%,#7f4323 72%,#3a140d 100%)",
                  }}
                >
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,242,208,0.2)_0%,rgba(255,242,208,0)_48%,rgba(0,0,0,0.14)_100%)]" />
                  <div
                    className={[
                      "absolute inset-y-0 right-0 w-8 rounded-full bg-[radial-gradient(circle_at_right,rgba(255,231,179,0.72)_0%,rgba(255,210,138,0.34)_42%,rgba(255,210,138,0)_100%)] transition-opacity duration-500",
                      isWarning ? "animate-pulse opacity-100" : "opacity-70",
                    ].join(" ")}
                  />
                </div>
                {isWarning ? (
                  <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(177,94,41,0)_0%,rgba(177,94,41,0.16)_50%,rgba(177,94,41,0)_100%)]" />
                ) : null}

                <div
                  className={[
                    "pointer-events-none absolute top-1/2 -translate-y-1/2 transition-[left] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
                    isWarning ? "" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  style={{
                    left: flamePosition,
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  <div
                    className="relative h-9 w-7"
                    style={{ filter: `drop-shadow(${flameGlow})` }}
                  >
                    <div
                      className={[
                        "absolute bottom-[4px] left-1/2 h-4 w-4 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(244,175,96,0.34)_0%,rgba(244,175,96,0.12)_48%,rgba(244,175,96,0)_100%)]",
                        isWarning ? "animate-pulse" : "",
                      ].join(" ")}
                      style={{
                        animation: "candle-glow-flicker 1.6s ease-in-out infinite",
                      }}
                    />
                    <div className="absolute bottom-[2px] left-1/2 h-5 w-[3px] -translate-x-1/2 rounded-full bg-[linear-gradient(180deg,#1a0d09_0%,#2d160e_34%,#4a2818_72%,rgba(74,40,24,0)_100%)] opacity-92" />
                    <div className="absolute bottom-[5px] left-1/2 h-2.5 w-[1px] -translate-x-1/2 rounded-full bg-[linear-gradient(180deg,rgba(255,236,187,0.18)_0%,rgba(255,236,187,0)_100%)]" />
                    <div
                      className="absolute bottom-[3px] left-1/2 h-6 w-5 -translate-x-1/2 rounded-[999px_999px_999px_999px/84%_84%_40%_40%] bg-[radial-gradient(circle_at_50%_24%,rgba(255,249,230,0.98)_0%,rgba(244,214,144,0.95)_22%,rgba(214,137,62,0.88)_54%,rgba(146,67,27,0.66)_82%,rgba(146,67,27,0)_100%)]"
                      style={{
                        animation: "candle-flame-flicker 1.35s ease-in-out infinite",
                        transformOrigin: "50% 90%",
                      }}
                    />
                    <div
                      className={[
                        "absolute bottom-[8px] left-1/2 h-3 w-2 -translate-x-1/2 rounded-[999px_999px_999px_999px/80%_80%_28%_28%] bg-[radial-gradient(circle_at_50%_30%,rgba(255,253,245,0.95)_0%,rgba(255,241,201,0.78)_58%,rgba(255,241,201,0)_100%)]",
                        isWarning ? "animate-pulse" : "",
                      ].join(" ")}
                      style={{
                        animation: "candle-flame-flicker 1.1s ease-in-out infinite reverse",
                        transformOrigin: "50% 90%",
                      }}
                    />
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
            <div className="text-[1rem] font-semibold leading-none text-[#ecd7b7] sm:text-[1.18rem]">
              {roundedSeconds}s
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
