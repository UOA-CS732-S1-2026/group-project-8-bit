import type { BattleSession, Player } from "@/game/core/types";
import HPBar from "../HPBar";

type BattleHudPanelProps = {
  battle: BattleSession;
  player: Player;
};

export function BattleHudPanel({ battle, player }: BattleHudPanelProps) {
  return (
    <section className="grid shrink-0 gap-3 xl:grid-cols-[1.1fr_0.9fr]">
      <div className="rounded-3xl border border-emerald-200/15 bg-black/35 p-1 shadow-[0_18px_40px_rgba(0,0,0,0.35)]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[11px] uppercase tracking-[0.32em] text-emerald-200/80">
              Enemy
            </p>
            <h1 className="mt-1 text-2xl font-black text-stone-50">
              {battle.enemy.name}
            </h1>
            <p className="mt-1 text-sm text-stone-300">
              Level {battle.enemy.level}{" "}
              {battle.enemy.isBoss ? "Boss" : battle.enemy.tier}
            </p>
          </div>
          <div className="rounded-2xl border border-stone-200/10 bg-stone-900/80 px-4 py-3 text-right">
            <div className="text-[11px] uppercase tracking-[0.24em] text-stone-400">
              Turns Left
            </div>
            <div className="mt-1 text-3xl font-black text-white">
              {battle.turnsRemaining}
            </div>
          </div>
        </div>

        <div className="mt-4">
          <HPBar
            currentHp={battle.enemy.hp}
            maxHp={battle.enemy.maxHp}
            label="Enemy HP"
          />
        </div>

        <div className="mt-4 grid gap-2 sm:grid-cols-3">
          <div className="rounded-2xl border border-stone-700/80 bg-stone-900/80 p-3">
            <div className="text-[11px] uppercase tracking-[0.22em] text-stone-400">
              Combo
            </div>
            <div className="mt-1 text-xl font-bold text-white">
              x{battle.correctStreak}
            </div>
          </div>
          <div className="rounded-2xl border border-stone-700/80 bg-stone-900/80 p-3">
            <div className="text-[11px] uppercase tracking-[0.22em] text-stone-400">
              Best
            </div>
            <div className="mt-1 text-xl font-bold text-white">
              {battle.bestCombo}
            </div>
          </div>
          <div className="rounded-2xl border border-stone-700/80 bg-stone-900/80 p-3">
            <div className="text-[11px] uppercase tracking-[0.22em] text-stone-400">
              Correct
            </div>
            <div className="mt-1 text-xl font-bold text-white">
              {battle.correctAnswers}/{battle.turnsUsed}
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-stone-200/10 bg-stone-950/75 p-1 shadow-[0_18px_40px_rgba(0,0,0,0.35)]">
        <div className="flex items-start justify-between gap-1">
          <div>
            <p className="text-[11px] uppercase tracking-[0.32em] text-amber-300/80">
              Player
            </p>
            <h2 className="mt-1 text-2xl font-bold text-stone-50">
              {player.name}
            </h2>
          </div>
          <div className="rounded-2xl border border-stone-700/80 bg-stone-900/80 px-3 py-2 text-right">
            <div className="text-[11px] uppercase tracking-[0.22em] text-stone-400">
              Level
            </div>
            <div className="mt-1 text-2xl font-black text-white">
              {player.level}
            </div>
          </div>
        </div>

        <div className="mt-1">
          <HPBar currentHp={player.hp} maxHp={player.maxHp} />
        </div>

        <div className="mt-1 grid gap-1 sm:grid-cols-3">
          <div className="rounded-2xl border border-stone-700/80 bg-stone-900/80 p-1">
            <div className="text-[11px] uppercase tracking-[0.22em] text-stone-400">
              Attack
            </div>
            <div className="mt-1 text-xl font-bold text-white">
              {player.attack}
            </div>
          </div>
          <div className="rounded-2xl border border-stone-700/80 bg-stone-900/80 p-1">
            <div className="text-[11px] uppercase tracking-[0.22em] text-stone-400">
              Defense
            </div>
            <div className="mt-1 text-xl font-bold text-white">
              {player.defense}
            </div>
          </div>
          <div className="rounded-2xl border border-stone-700/80 bg-stone-900/80 p-1">
            <div className="text-[11px] uppercase tracking-[0.22em] text-stone-400">
              Coins
            </div>
            <div className="mt-1 text-xl font-bold text-white">
              {player.coins}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
