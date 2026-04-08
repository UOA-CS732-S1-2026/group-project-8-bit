type BattleLogEntry = {
  id: string;
  kind: "player" | "enemy";
  text: string;
};

type BattleLogPanelProps = {
  entries: BattleLogEntry[];
};

const kindLabelMap: Record<BattleLogEntry["kind"], string> = {
  player: "Hero",
  enemy: "Enemy",
};

const kindToneMap: Record<BattleLogEntry["kind"], string> = {
  player: "border-[#7a5d3f]/80 bg-[rgba(65,42,22,0.55)] text-[#f0d8b0]",
  enemy: "border-[#6a4138]/80 bg-[rgba(60,26,20,0.52)] text-[#efc2b6]",
};

export function BattleLogPanel({ entries }: BattleLogPanelProps) {
  const visibleEntries = entries.slice(-3).reverse();

  return (
    <aside className="relative h-[10.4rem] w-full overflow-hidden rounded-[0.75rem] bg-[linear-gradient(180deg,rgba(36,26,20,0.98)_0%,rgba(12,10,9,0.99)_100%)] shadow-[0_18px_34px_rgba(0,0,0,0.5)] sm:h-[9.8rem] xl:h-[9.6rem]">
      <div className="absolute inset-0 bg-[url('/battle/battle_log_panel_2.png')] bg-[length:100%_100%] bg-center bg-no-repeat opacity-95" />
      <div className="pointer-events-none absolute inset-x-4 top-[2.55rem] h-px bg-[linear-gradient(90deg,rgba(232,205,157,0)_0%,rgba(232,205,157,0.5)_18%,rgba(232,205,157,0.5)_82%,rgba(232,205,157,0)_100%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,224,170,0.12)_0%,rgba(255,224,170,0.04)_24%,rgba(255,224,170,0)_56%)]" />
      <div className="relative flex h-full flex-col px-3 py-3 sm:px-4">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="text-[0.62rem] uppercase tracking-[0.34em] text-[#b89b73]">
              Battle Log
            </div>
            <div className="mt-0.5 font-serif text-[1rem] font-semibold tracking-[0.03em] text-[#f3dfb7]">
              Recent Actions
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2 rounded-full border border-[#8d6a46]/70 bg-[linear-gradient(180deg,rgba(87,63,37,0.44)_0%,rgba(46,31,20,0.4)_100%)] px-2.5 py-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#d9b36a] shadow-[0_0_10px_rgba(217,179,106,0.8)]" />
            <span className="text-[0.58rem] uppercase tracking-[0.2em] text-[#edd8ae]">
              Live
            </span>
          </div>
        </div>

        <div className="grid flex-1 grid-cols-1 gap-2 sm:grid-cols-3">
          {visibleEntries.map((entry, index) => (
            <div
              key={entry.id}
              className={`group relative min-w-0 flex-1 overflow-hidden rounded-[0.65rem] border px-3 py-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_10px_18px_rgba(0,0,0,0.18)] ${
                index === 0
                  ? "border-[#c9a56f]/75 bg-[linear-gradient(180deg,rgba(92,66,39,0.68)_0%,rgba(46,31,21,0.82)_100%)]"
                  : "border-[#82664a]/50 bg-[linear-gradient(180deg,rgba(58,43,31,0.55)_0%,rgba(29,22,18,0.7)_100%)]"
              }`}
            >
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,rgba(255,232,190,0)_0%,rgba(255,232,190,0.38)_50%,rgba(255,232,190,0)_100%)]" />
              {index === 0 ? (
                <div className="pointer-events-none absolute right-[-1.1rem] top-[-1.2rem] h-10 w-10 rounded-full bg-[radial-gradient(circle,rgba(233,191,111,0.24)_0%,rgba(233,191,111,0)_72%)]" />
              ) : null}
              <div className="relative flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div
                    className={`inline-flex rounded-full border px-1.5 py-0.5 text-[0.58rem] uppercase tracking-[0.16em] ${kindToneMap[entry.kind]}`}
                  >
                    {kindLabelMap[entry.kind]}
                  </div>
                  <span className="text-[0.58rem] uppercase tracking-[0.16em] text-[#ad9169]">
                    {index === 0 ? "Latest" : `Log 0${index + 1}`}
                  </span>
                </div>
                {index === 0 ? (
                  <span className="rounded-full border border-[#c8a169]/55 bg-[rgba(98,70,39,0.35)] px-1.5 py-0.5 text-[0.56rem] uppercase tracking-[0.18em] text-[#f3ddb3]">
                    New
                  </span>
                ) : null}
              </div>
              <p className="relative mt-2.5 line-clamp-3 text-[0.8rem] leading-[1.22rem] text-[#ead7b8] drop-shadow-[0_1px_1px_rgba(0,0,0,0.25)]">
                {entry.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
