import type { Player } from "@/game/core/types";
import HPBar from "../HPBar";

type BattleProfilePanelProps = {
  player: Player;
  xpCurrent: number;
  xpNeeded: number;
  isMaxLevel: boolean;
  onRestoreHp: () => void;
};

export function BattleProfilePanel({
  player,
  xpCurrent,
  xpNeeded,
  isMaxLevel,
  onRestoreHp,
}: BattleProfilePanelProps) {
  return (
    <div className="rounded-3xl border border-stone-200/10 bg-stone-950/75 p-6 shadow-[0_24px_60px_rgba(0,0,0,0.4)]">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.25em] text-amber-300/80">
            Seeker Status
          </p>
          <h2 className="mt-2 text-2xl font-bold text-stone-50">
            {player.name}
          </h2>
        </div>
        <button
          type="button"
          onClick={onRestoreHp}
          className="rounded-full border border-stone-200/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-stone-200 transition hover:border-stone-100/40 hover:bg-stone-100/10"
        >
          Restore HP
        </button>
      </div>

      <div className="mt-5 space-y-4">
        <HPBar currentHp={player.hp} maxHp={player.maxHp} />
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-stone-700/80 bg-stone-900/80 p-4">
            <div className="text-xs uppercase tracking-[0.25em] text-stone-400">
              Level
            </div>
            <div className="mt-2 text-2xl font-bold text-white">
              {player.level}
            </div>
          </div>
          <div className="rounded-2xl border border-stone-700/80 bg-stone-900/80 p-4">
            <div className="text-xs uppercase tracking-[0.25em] text-stone-400">
              Attack
            </div>
            <div className="mt-2 text-2xl font-bold text-white">
              {player.attack}
            </div>
          </div>
          <div className="rounded-2xl border border-stone-700/80 bg-stone-900/80 p-4">
            <div className="text-xs uppercase tracking-[0.25em] text-stone-400">
              Defense
            </div>
            <div className="mt-2 text-2xl font-bold text-white">
              {player.defense}
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-stone-700/80 bg-stone-900/80 p-4">
          <div className="flex items-center justify-between text-xs uppercase tracking-[0.25em] text-stone-400">
            <span>XP Progress</span>
            <span>{isMaxLevel ? "MAX" : `${xpCurrent} / ${xpNeeded}`}</span>
          </div>
          <div className="mt-3 h-3 overflow-hidden rounded-full bg-stone-700/60">
            <div
              className="h-full bg-gradient-to-r from-amber-500 via-yellow-300 to-amber-200"
              style={{
                width: `${isMaxLevel ? 100 : Math.min(100, Math.round((xpCurrent / xpNeeded) * 100))}%`,
              }}
            />
          </div>
          <div className="mt-3 text-sm text-stone-300">{player.coins} coins</div>
        </div>
      </div>
    </div>
  );
}
