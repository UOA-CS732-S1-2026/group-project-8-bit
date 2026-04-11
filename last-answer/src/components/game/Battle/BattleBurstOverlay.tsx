import Image from "next/image";

type BattleBurstOverlayProps = {
  comboCount: number;
  remainingMs: number;
  durationMs: number;
  currentBurstClicks: number;
  timerStarted?: boolean;
  resolving?: boolean;
  introActive?: boolean;
  outroActive?: boolean;
  outroDamage?: number | null;
  onBurstClick: () => void;
};

export function BattleBurstOverlay({
  comboCount,
  remainingMs,
  durationMs,
  currentBurstClicks,
  timerStarted = false,
  resolving = false,
  introActive = false,
  outroActive = false,
  outroDamage = null,
  onBurstClick,
}: BattleBurstOverlayProps) {
  const safeDuration = Math.max(1, durationMs);
  const ratio = timerStarted
    ? Math.max(0, Math.min(1, remainingMs / safeDuration))
    : 1;
  const showActivePanel = !outroActive;
  const showIntroCopy = !timerStarted && !resolving;
  const showActiveHud = timerStarted && !resolving;
  const clickIntensity = Math.min(1, currentBurstClicks / 24);
  const imageScale = timerStarted ? 1 + Math.min(0.24, currentBurstClicks * 0.015) : 1;

  return (
    <div className="absolute inset-0 z-[34] flex items-center justify-center px-4">
      {introActive ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-[battle-burst-title_820ms_ease-out_forwards] text-center">
            <div className="text-[0.9rem] font-black uppercase tracking-[0.6em] text-[#f6dfad] sm:text-[1.05rem]">
              Overdrive
            </div>
            <div className="mt-2 font-serif text-[4rem] font-semibold leading-none text-[#fff1c8] drop-shadow-[0_0_24px_rgba(255,222,153,0.46)] sm:text-[5.5rem]">
              BURST
            </div>
          </div>
        </div>
      ) : null}

      {outroActive ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-[battle-burst-outro_1500ms_ease-out_forwards] rounded-[1.25rem] bg-[radial-gradient(circle_at_center,rgba(31,18,10,0.42)_0%,rgba(15,10,8,0.18)_60%,rgba(0,0,0,0)_100%)] px-10 py-8 text-center">
            <div className="text-[0.82rem] font-black uppercase tracking-[0.5em] text-[#f4d99f] drop-shadow-[0_0_16px_rgba(244,201,108,0.26)] sm:text-[0.92rem]">
              Burst Settled
            </div>
            <div className="mt-3 font-serif text-[3rem] font-semibold leading-none text-[#fff3d6] drop-shadow-[0_0_28px_rgba(255,221,151,0.3)] sm:text-[4rem]">
              {outroDamage ? `-${outroDamage}` : "Burst End"}
            </div>
            <div className="mt-3 text-[1rem] font-semibold uppercase tracking-[0.28em] text-[#ffe8bc] drop-shadow-[0_0_14px_rgba(244,201,108,0.22)] sm:text-[1.08rem]">
              {outroDamage ? "Final Burst Damage" : "Combo Converted"}
            </div>
          </div>
        </div>
      ) : null}

      {showActivePanel ? (
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-[41.5%] -translate-x-1/2 -translate-y-1/2">
            <button
              type="button"
              onClick={onBurstClick}
              aria-label="Tap the burning sigil to build burst hits"
              className={[
                "relative h-[15rem] w-[15rem] rounded-full sm:h-[18rem] sm:w-[18rem]",
                resolving ? "pointer-events-none" : "pointer-events-auto",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <div
                className="absolute inset-[12%] rounded-full blur-[14px] transition duration-150"
                style={{
                  background: `radial-gradient(circle, rgba(243,145,56,${timerStarted ? 0.22 + clickIntensity * 0.22 : 0.13}) 0%, rgba(192,91,28,${timerStarted ? 0.14 + clickIntensity * 0.22 : 0.06}) 30%, rgba(0,0,0,0) 72%)`,
                  transform: `scale(${resolving ? 1.12 : timerStarted ? 1 + clickIntensity * 0.14 : 0.9})`,
                }}
              />
              <Image
                key={timerStarted ? currentBurstClicks : -1}
                src="/battle/burst-effect.png"
                alt=""
                fill
                priority
                sizes="18rem"
                className={[
                  "object-contain mix-blend-screen transition duration-150",
                  resolving
                    ? "animate-[battle-burst-resolve_920ms_ease-in-out_forwards]"
                    : "",
                  timerStarted && currentBurstClicks > 0
                    ? "animate-[battle-burst-click-pop_180ms_ease-out_forwards]"
                    : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                style={{
                  opacity: resolving ? 1 : timerStarted ? 0.96 + clickIntensity * 0.04 : 0.86,
                  transform: `scale(${resolving ? 0.96 : imageScale})`,
                  filter: `saturate(${resolving ? 2.05 : timerStarted ? 1.06 + clickIntensity * 0.54 : 0.92}) brightness(${resolving ? 1.35 : timerStarted ? 1 + clickIntensity * 0.22 : 0.95}) sepia(${resolving ? 0.52 : timerStarted ? 0.14 + clickIntensity * 0.34 : 0.08})`,
                }}
              />
            </button>
          </div>

          {showIntroCopy ? (
            <div className="absolute left-1/2 top-[63.5%] flex w-full max-w-[34rem] -translate-x-1/2 -translate-y-1/2 flex-col items-center px-6 text-center">
              <div className="text-[0.68rem] font-black uppercase tracking-[0.4em] text-[#f0d7a0]">
                Burst Mode
              </div>
              <h2 className="mt-2 font-serif text-[2rem] font-semibold leading-none text-[#fff0cd] sm:text-[2.5rem]">
                Combo x{comboCount}
              </h2>
              <p className="mt-3 max-w-[27rem] text-[0.92rem] leading-7 text-[#ecd8b1] sm:text-[1rem]">
                Tap the burning sigil to awaken burst. Time will only begin
                after your first strike.
              </p>
              <div className="mt-4 rounded-full border border-[#e4c68b]/40 bg-[rgba(99,61,24,0.22)] px-4 py-2 text-[0.72rem] font-bold uppercase tracking-[0.2em] text-[#f8e3b8] shadow-[0_0_18px_rgba(243,188,97,0.1)]">
                Tap The Image To Start Burst
              </div>
            </div>
          ) : null}

          <div
            className={[
              "absolute left-1/2 w-full max-w-[25rem] -translate-x-1/2 px-4 transition duration-200",
              showIntroCopy ? "top-[77.5%] -translate-y-1/2" : "top-[67.5%] -translate-y-1/2",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            <div className="mb-2 flex items-center justify-between text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-[#e8d1a5]">
              <span>Burst Timer</span>
              <span>
                {resolving
                  ? "Resolving"
                  : timerStarted
                    ? `${(remainingMs / 1000).toFixed(1)}s`
                    : "Tap To Start"}
              </span>
            </div>
            <div className="h-4 overflow-hidden rounded-full border border-[#7a5530]/70 bg-[rgba(20,13,10,0.7)] p-[3px] shadow-[inset_0_3px_8px_rgba(0,0,0,0.28)]">
              <div
                className="h-full rounded-full bg-[linear-gradient(90deg,#f5e1af_0%,#e8b55d_30%,#d17536_68%,#7b2818_100%)] shadow-[0_0_16px_rgba(236,176,83,0.28)] transition-[width] duration-100 ease-linear"
                style={{ width: `${resolving ? 0 : ratio * 100}%` }}
              />
            </div>
          </div>

          <div
            className={[
              "absolute left-1/2 -translate-x-1/2 -translate-y-1/2 text-center",
              showIntroCopy ? "top-[85.5%]" : "top-[76.5%]",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            {resolving ? (
              <>
                <div className="text-[0.66rem] font-black uppercase tracking-[0.38em] text-[#f3d9a4]">
                  Total Burst Hits
                </div>
                <div className="mt-2 font-serif text-[2rem] font-semibold leading-none text-[#fff0ca] drop-shadow-[0_0_18px_rgba(247,206,128,0.28)] sm:text-[2.5rem]">
                  {currentBurstClicks}
                </div>
              </>
            ) : (
              <div className="text-[0.76rem] font-bold uppercase tracking-[0.24em] text-[#f7e2b9]">
                {showActiveHud ? `${currentBurstClicks} Burst Hits` : `${currentBurstClicks} Burst Hits`}
              </div>
            )}
          </div>
        </div>
      ) : null}

      <style jsx>{`
        @keyframes battle-burst-click-pop {
          0% {
            transform: scale(0.96);
          }
          38% {
            transform: scale(1.12);
          }
          100% {
            transform: scale(1);
          }
        }

        @keyframes battle-burst-title {
          0% {
            opacity: 0;
            transform: scale(0.72);
            filter: blur(10px);
          }
          24% {
            opacity: 1;
            transform: scale(1.08);
            filter: blur(0);
          }
          62% {
            opacity: 1;
            transform: scale(1);
            filter: blur(0);
          }
          100% {
            opacity: 0;
            transform: scale(1.12);
            filter: blur(8px);
          }
        }

        @keyframes battle-burst-outro {
          0% {
            opacity: 0;
            transform: scale(0.92);
            filter: blur(8px);
          }
          10% {
            opacity: 1;
            transform: scale(1);
            filter: blur(0);
          }
          58% {
            opacity: 1;
            transform: scale(1);
            filter: blur(0);
          }
          82% {
            opacity: 1;
            transform: scale(1.02);
            filter: blur(0);
          }
          100% {
            opacity: 0;
            transform: scale(1.06);
            filter: blur(5px);
          }
        }

        @keyframes battle-burst-resolve {
          0% {
            opacity: 1;
            transform: scale(1);
            filter: brightness(1) saturate(1.2);
          }
          34% {
            opacity: 1;
            transform: scale(0.68);
            filter: brightness(0.9) saturate(1.45);
          }
          52% {
            opacity: 1;
            transform: scale(0.5);
            filter: brightness(1.42) saturate(1.95);
          }
          74% {
            opacity: 1;
            transform: scale(1.4);
            filter: brightness(1.92) saturate(2.15);
          }
          100% {
            opacity: 0;
            transform: scale(1.76);
            filter: brightness(2.18) saturate(2.32);
          }
        }
      `}</style>
    </div>
  );
}
