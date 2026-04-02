type BattleLobbyPanelProps = {
  onStartSkirmish: () => void;
  onStartBoss: () => void;
};

export function BattleLobbyPanel({
  onStartSkirmish,
  onStartBoss,
}: BattleLobbyPanelProps) {
  return (
    <section className="flex-1 rounded-3xl border border-amber-200/15 bg-black/35 p-6 shadow-[0_30px_80px_rgba(0,0,0,0.45)] backdrop-blur">
      <p className="text-sm uppercase tracking-[0.35em] text-amber-300/80">
        Quiz Battle Arena
      </p>
      <h1 className="mt-3 text-4xl font-black tracking-tight text-stone-50">
        Quiz-first combat is live
      </h1>
      <p className="mt-4 max-w-2xl text-sm leading-7 text-stone-300">
        Answer within 12 seconds, build combos, trigger Burst finishers, and
        use support tools without spending the turn. A battle lasts 10
        questions, and the enemy counterattacks on mistakes.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <button
          type="button"
          onClick={onStartSkirmish}
          className="rounded-2xl border border-emerald-300/30 bg-emerald-400/15 px-5 py-4 text-left transition hover:border-emerald-200/60 hover:bg-emerald-300/20"
        >
          <div className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-200">
            Skirmish
          </div>
          <div className="mt-2 text-lg font-bold text-white">
            Battle a Forest Wisp
          </div>
          <div className="mt-1 text-sm text-stone-300">
            Equal-level enemy tuned for 6-8 strong answers.
          </div>
        </button>

        <button
          type="button"
          onClick={onStartBoss}
          className="rounded-2xl border border-rose-300/30 bg-rose-400/15 px-5 py-4 text-left transition hover:border-rose-200/60 hover:bg-rose-300/20"
        >
          <div className="text-sm font-semibold uppercase tracking-[0.25em] text-rose-200">
            Boss Battle
          </div>
          <div className="mt-2 text-lg font-bold text-white">
            Challenge the Forest Lord
          </div>
          <div className="mt-1 text-sm text-stone-300">
            Harder enemy with Burst available on every 5-hit streak.
          </div>
        </button>
      </div>
    </section>
  );
}
