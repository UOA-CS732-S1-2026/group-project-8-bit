import { supportToolConfigs } from "@/game/core/battleCore";
import type { BattleSession, SupportToolId } from "@/game/core/types";

type BattleSupportPanelProps = {
  battle: BattleSession;
  onToggle: () => void;
  onActivateTool: (toolId: SupportToolId) => void;
};

export function BattleSupportPanel({
  battle,
  onToggle,
  onActivateTool,
}: BattleSupportPanelProps) {
  const supportEntries = Object.entries(supportToolConfigs);

  return (
    <aside className="rounded-3xl border border-stone-200/10 bg-stone-950/75 p-1 shadow-[0_18px_40px_rgba(0,0,0,0.35)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.32em] text-amber-300/80">
            Support
          </p>
          <h2 className="mt-1 text-lg font-bold text-stone-50">
            Tactical Tools
          </h2>
        </div>
        <button
          type="button"
          onClick={onToggle}
          disabled={battle.status !== "question"}
          className="rounded-full border border-amber-200/25 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-100 transition hover:bg-amber-100/10 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {battle.supportMenuOpen ? "Close" : "Open"}
        </button>
      </div>

      {battle.supportMenuOpen ? (
        <div className="mt-1 grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
          {supportEntries.map(([toolId, tool]) => {
            const typedToolId = toolId as SupportToolId;
            const remainingUses = battle.supportTools[typedToolId];

            return (
              <button
                key={toolId}
                type="button"
                onClick={() => onActivateTool(typedToolId)}
                disabled={remainingUses <= 0 || battle.toolUsedThisTurn}
                className="rounded-2xl border border-stone-200/10 bg-black/20 p-1 text-left transition hover:border-amber-200/35 hover:bg-amber-100/10 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="font-semibold text-white">{tool.name}</span>
                  <span className="text-[11px] uppercase tracking-[0.2em] text-stone-400">
                    {remainingUses} usable
                  </span>
                </div>
                <p className="mt-1 text-sm leading-5 text-stone-300">
                  {tool.description}
                </p>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="mt-1 rounded-2xl border border-stone-700/80 bg-stone-900/80 p-1 text-sm text-stone-300">
          Barrier {battle.barrierActive ? "ready" : "inactive"}. Chain Guard{" "}
          {battle.chainGuardActive ? "ready" : "inactive"}. Each question allows
          one support action without spending the turn.
        </div>
      )}
    </aside>
  );
}
