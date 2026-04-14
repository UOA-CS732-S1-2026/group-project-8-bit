type BattleComboTrackerProps = {
  combo: number;
  isBossBattle: boolean;
  burstReady: boolean;
};

function getNextBurstTarget(combo: number, isBossBattle: boolean): number {
  if (!isBossBattle) {
    return 5;
  }

  return Math.max(5, Math.ceil((combo + 1) / 5) * 5);
}

export function BattleComboTracker({
  combo,
  isBossBattle,
  burstReady,
}: BattleComboTrackerProps) {
  const nextTarget = getNextBurstTarget(combo, isBossBattle);
  const remaining = Math.max(0, nextTarget - combo);

  return (
    <div
      className="pointer-events-none px-3"
      style={{
        position: "fixed",
        top: "4.6rem",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 30,
      }}
    >
      <div className="relative min-w-[11rem] overflow-hidden rounded-[0.65rem] bg-[linear-gradient(180deg,rgba(36,26,20,0.98)_0%,rgba(12,10,9,0.99)_100%)] shadow-[0_14px_28px_rgba(0,0,0,0.42)]">
        <div className="absolute inset-0 bg-[url('/panels/interact-panel.png')] bg-[length:100%_100%] bg-center bg-no-repeat opacity-88" />
        <div className="relative px-4 py-2.5 text-center">
          <div className="text-[0.56rem] font-semibold uppercase tracking-[0.32em] text-[#c5a073]">
            Combo
          </div>
          <div className="mt-1 font-serif text-[1.35rem] font-semibold leading-none text-[#f4dfb9]">
            x{combo}
          </div>
          <div className="mt-1 text-[0.58rem] uppercase tracking-[0.18em] text-[#ead5ac]">
            {burstReady
              ? "Burst ready"
              : isBossBattle
                ? `${remaining} to next burst`
                : `${remaining} to burst`}
          </div>
        </div>
      </div>
    </div>
  );
}
