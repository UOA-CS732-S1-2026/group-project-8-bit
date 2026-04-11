type BattleStateStripProps = {
  turn: number;
  turnLimit: number;
  combo: number;
  burstReady: boolean;
  isBossBattle: boolean;
  muted?: boolean;
};

function getBurstState(args: {
  combo: number;
  burstReady: boolean;
  isBossBattle: boolean;
}) {
  const { combo, burstReady, isBossBattle } = args;

  if (burstReady) {
    return { label: "Ready", activeRunes: 5 };
  }

  const nextTarget = isBossBattle
    ? Math.max(5, Math.ceil((combo + 1) / 5) * 5)
    : 5;
  const remaining = Math.max(0, nextTarget - combo);
  const cycleProgress = isBossBattle
    ? combo > 0
      ? combo % 5
      : 0
    : Math.min(combo, 5);

  return {
    label: `${remaining} Left`,
    activeRunes: Math.max(0, Math.min(5, cycleProgress)),
  };
}

export function BattleStateStrip({
  turn,
  turnLimit,
  combo,
  burstReady,
  isBossBattle,
  muted = false,
}: BattleStateStripProps) {
  const burstState = getBurstState({ combo, burstReady, isBossBattle });
  const runeAngles = [-120, -150, 180, 150, 120];
  const mutedClasses = "opacity-40 blur-[3px] saturate-[0.78]";

  return (
    <div
      className={[
        "pointer-events-none px-3 transition duration-300",
        muted ? mutedClasses : "",
      ]
        .filter(Boolean)
        .join(" ")}
      style={{
        position: "fixed",
        top: "0.35rem",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 30,
      }}
      >
      <section
        className="relative overflow-hidden rounded-[0.85rem] bg-[linear-gradient(180deg,rgba(30,22,17,0.76)_0%,rgba(11,10,9,0.84)_100%)] shadow-[0_12px_28px_rgba(0,0,0,0.28)]"
        style={{ width: "min(17rem, calc(100vw - 1.5rem))" }}
      >
        <div className="absolute inset-0 bg-[url('/panels/interact-panel.png')] bg-[length:100%_100%] bg-center bg-no-repeat opacity-[0.72]" />
        <div className="relative flex flex-col gap-1.5 px-4 py-2">
          <div className="rounded-[0.65rem] border border-white/6 bg-black/8 px-3 py-1.5 text-center">
            <div className="text-[0.54rem] font-semibold uppercase tracking-[0.28em] text-[#c6a172]">
              Turn
            </div>
            <div className="mt-0.5 font-serif text-[1.12rem] font-semibold leading-none text-[#f2dfbd]">
              {turn}/{turnLimit}
            </div>
          </div>
          <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-2">
            <div className="rounded-[0.65rem] border border-white/6 bg-black/8 px-3 py-1.5 text-center">
              <div className="text-[0.54rem] font-semibold uppercase tracking-[0.28em] text-[#c6a172]">
                Combo
              </div>
              <div className="mt-0.5 font-serif text-[1.12rem] font-semibold leading-none text-[#f2dfbd]">
                x{combo}
              </div>
            </div>
            <div
              className={[
                "min-w-[6.25rem] rounded-[0.65rem] border px-2.5 py-1.5 text-center transition",
                burstReady
                  ? "border-[#f1d596]/35 bg-[linear-gradient(180deg,rgba(118,78,24,0.28)_0%,rgba(56,33,15,0.22)_100%)] shadow-[0_0_14px_rgba(238,186,92,0.12)]"
                  : "border-white/6 bg-black/8",
              ].join(" ")}
            >
              <div className="text-[0.5rem] font-semibold uppercase tracking-[0.24em] text-[#c6a172]">
                Burst
              </div>
              <div className="mt-0.5 flex justify-center">
                <div className="relative h-8 w-[4.3rem]">
                  {runeAngles.map((angle, index) => {
                    const isActive = index < burstState.activeRunes;
                    const radius = 1.25;
                    const radians = (angle * Math.PI) / 180;
                    const x = Math.sin(radians) * radius;
                    const y = Math.cos(radians) * radius;

                    return (
                      <div
                        key={index}
                        className={[
                          "absolute left-1/2 top-[0.1rem] h-[0.62rem] w-[0.62rem] -translate-x-1/2 rounded-full border transition",
                          isActive
                            ? "border-[#eccd8d]/75 bg-[radial-gradient(circle,#f9e7c0_0%,#d99646_56%,#8b4f1d_100%)] shadow-[0_0_12px_rgba(236,186,92,0.28)]"
                            : "border-[#6b5238]/55 bg-[rgba(30,21,15,0.68)]",
                        ].join(" ")}
                        style={{
                          transform: `translate(calc(-50% + ${x}rem), ${1.5 + y}rem) scale(${isActive ? 1 : 0.9})`,
                        }}
                      />
                    );
                  })}
                  <div className="absolute left-1/2 top-[1.95rem] h-px w-[3.1rem] -translate-x-1/2 bg-[linear-gradient(90deg,rgba(236,205,141,0)_0%,rgba(236,205,141,0.24)_50%,rgba(236,205,141,0)_100%)]" />
                </div>
              </div>
              <div
                className={[
                  "mt-1 text-[0.52rem] font-bold uppercase leading-tight tracking-[0.16em]",
                  burstReady ? "text-[#ffeab8]" : "text-[#d9c19a]",
                ].join(" ")}
              >
                {burstState.label}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
