import type { BattleReward } from "@/game/core/types";

type BattleResultPanelProps = {
  status: "won" | "lost";
  reward: BattleReward | null;
  avgAnswerTimeLabel?: string;
  onClose: () => void;
};

export function BattleResultPanel({
  status,
  reward,
  avgAnswerTimeLabel,
  onClose,
}: BattleResultPanelProps) {
  if (status === "won" && reward) {
    return (
      <div className="mt-6 rounded-2xl border border-emerald-300/25 bg-emerald-400/10 p-5">
        <p className="text-xs uppercase tracking-[0.28em] text-emerald-200">
          Victory Reward
        </p>
        <h3 className="mt-2 text-2xl font-bold text-white">
          {reward.enemyName} defeated
        </h3>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl bg-black/25 p-4">
            <div className="text-xs uppercase tracking-[0.25em] text-stone-400">
              XP
            </div>
            <div className="mt-2 text-2xl font-bold text-white">
              {reward.finalXp}
            </div>
            <div className="text-sm text-stone-400">Base {reward.baseXp}</div>
          </div>
          <div className="rounded-2xl bg-black/25 p-4">
            <div className="text-xs uppercase tracking-[0.25em] text-stone-400">
              Coins
            </div>
            <div className="mt-2 text-2xl font-bold text-white">
              {reward.finalCoins}
            </div>
            <div className="text-sm text-stone-400">
              Base {reward.baseCoins}
            </div>
          </div>
        </div>
        <div className="mt-4 grid gap-3 text-sm text-stone-300 sm:grid-cols-2">
          <div>Best combo: {reward.bestCombo}</div>
          <div>Burst clicks: {reward.burstClicks}</div>
          <div>Avg. answer time: {avgAnswerTimeLabel}</div>
          <div>
            Assist uses: {reward.assistBreakdown.standardUses} standard /{" "}
            {reward.assistBreakdown.strongUses} strong
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="mt-5 rounded-full border border-emerald-200/35 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-100 transition hover:bg-emerald-200/10"
        >
          Back to Hub
        </button>
      </div>
    );
  }

  return (
    <div className="mt-6 rounded-2xl border border-rose-300/25 bg-rose-400/10 p-5">
      <p className="text-xs uppercase tracking-[0.28em] text-rose-200">
        Defeat
      </p>
      <h3 className="mt-2 text-2xl font-bold text-white">
        The enemy survived the 10-turn limit
      </h3>
      <p className="mt-3 text-sm text-stone-300">
        Restore your HP and try again with cleaner answers, stronger combos, or
        smarter support timing.
      </p>
      <button
        type="button"
        onClick={onClose}
        className="mt-5 rounded-full border border-rose-200/35 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-rose-100 transition hover:bg-rose-200/10"
      >
        Back to Hub
      </button>
    </div>
  );
}
