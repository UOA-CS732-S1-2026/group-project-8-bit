type BattleBurstPanelProps = {
  burstRemainingLabel: string;
  burstRatio: number;
  currentBurstClicks: number;
  onBurstClick: () => void;
};

export function BattleBurstPanel({
  burstRemainingLabel,
  burstRatio,
  currentBurstClicks,
  onBurstClick,
}: BattleBurstPanelProps) {
  return (
    <section className="flex h-full min-h-0 flex-1 flex-col items-center justify-center rounded-3xl border border-stone-200/10 bg-black/40 p-5 text-center shadow-[0_18px_40px_rgba(0,0,0,0.3)] sm:p-6">
      <p className="text-xs uppercase tracking-[0.35em] text-rose-200/80">
        Burst Phase
      </p>
      <h2 className="mt-3 text-3xl font-black text-white sm:text-4xl">
        Mash for bonus damage
      </h2>
      <div className="mt-5 w-full max-w-xl">
        <div className="mb-2 flex items-center justify-between text-xs uppercase tracking-[0.25em] text-stone-400">
          <span>Burst timer</span>
          <span>{burstRemainingLabel}</span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-stone-700/60">
          <div
            className="h-full bg-gradient-to-r from-rose-600 via-orange-400 to-amber-200 transition-all"
            style={{ width: `${Math.round(burstRatio * 100)}%` }}
          />
        </div>
      </div>
      <button
        type="button"
        onClick={onBurstClick}
        className="mt-6 rounded-full border border-rose-200/25 bg-rose-500/15 px-8 py-4 text-lg font-black uppercase tracking-[0.25em] text-rose-50 transition hover:bg-rose-400/25"
      >
        Strike
      </button>
      <div className="mt-4 text-lg font-semibold text-stone-200">
        {currentBurstClicks} clicks this Burst
      </div>
    </section>
  );
}
