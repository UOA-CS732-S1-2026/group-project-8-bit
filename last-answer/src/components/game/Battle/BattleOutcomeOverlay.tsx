import type { BattleReward } from "@/game/core/types";

type BattleOutcomeOverlayProps = {
  status: "won" | "lost";
  reward: BattleReward | null;
  summary: {
    enemyName: string;
    turnsUsed: number;
    turnLimit: number;
    correctAnswers: number;
    bestCombo: number;
    burstClicks: number;
  } | null;
  onRetry: () => void;
  onChallengeBoss: () => void;
};

function formatAvgTime(ms: number): string {
  return `${(ms / 1000).toFixed(2)}s`;
}

export function BattleOutcomeOverlay({
  status,
  reward,
  summary,
  onRetry,
  onChallengeBoss,
}: BattleOutcomeOverlayProps) {
  const isVictory = status === "won";
  const accuracy =
    summary && summary.turnsUsed > 0
      ? Math.round((summary.correctAnswers / summary.turnsUsed) * 100)
      : null;

  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/52 px-3 backdrop-blur-[4px]">
      <section className="relative w-[min(92vw,52rem)] overflow-hidden rounded-[1rem] bg-[linear-gradient(180deg,rgba(33,23,17,0.98)_0%,rgba(12,10,9,0.99)_100%)] shadow-[0_24px_60px_rgba(0,0,0,0.58)] animate-[battle-outcome-settle_360ms_cubic-bezier(0.18,0.9,0.22,1)_forwards]">
        <div className="absolute inset-0 bg-[url('/panels/interact-panel.png')] bg-[length:100%_100%] bg-center bg-no-repeat opacity-90" />
        <div className="relative p-6 sm:p-7">
          <div className="rounded-[0.9rem] border border-[#7b5e40]/45 bg-black/5 px-6 py-6 sm:px-8 sm:py-8">
          <div className="text-[0.68rem] uppercase tracking-[0.3em] text-[#c8ab7f]">
            {isVictory ? "Battle Complete" : "Battle Failed"}
          </div>
          <h2 className="mt-2 font-serif text-[1.6rem] font-semibold text-[#f2ddb8] sm:text-[1.75rem]">
            {isVictory
              ? `${reward?.enemyName ?? "Enemy"} Defeated`
              : "The Enemy Endured"}
          </h2>

          {isVictory && reward ? (
            <div className="mt-4 space-y-3 text-[#ead7b8]">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-[0.8rem] border border-[#7b5e40]/60 bg-black/20 px-3 py-2.5">
                  <div className="text-[0.62rem] uppercase tracking-[0.2em] text-[#bb9f77]">
                    XP
                  </div>
                  <div className="mt-1 text-[1.35rem] font-semibold text-[#f5e3be]">
                    {reward.finalXp}
                  </div>
                </div>
                <div className="rounded-[0.8rem] border border-[#7b5e40]/60 bg-black/20 px-3 py-2.5">
                  <div className="text-[0.62rem] uppercase tracking-[0.2em] text-[#bb9f77]">
                    Coins
                  </div>
                  <div className="mt-1 text-[1.35rem] font-semibold text-[#f5e3be]">
                    {reward.finalCoins}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-[0.8rem] leading-5 text-[#ddc7a0]">
                <div>Best combo: {reward.bestCombo}</div>
                <div>Burst clicks: {reward.burstClicks}</div>
                <div>Avg. answer time: {formatAvgTime(reward.avgAnswerTimeMs)}</div>
                <div>
                  Assist uses: {reward.assistBreakdown.standardUses} /{" "}
                  {reward.assistBreakdown.strongUses}
                </div>
              </div>
              {summary ? (
                <div className="rounded-[0.8rem] border border-[#7b5e40]/55 bg-black/15 px-4 py-3 text-[0.78rem] leading-5 text-[#e0caa1]">
                  {summary.enemyName} fell in {summary.turnsUsed}/{summary.turnLimit} turns with{" "}
                  {summary.correctAnswers} clean answers and {accuracy}% accuracy.
                </div>
              ) : null}
            </div>
          ) : (
            <div className="mt-4 space-y-3">
              <p className="text-[0.84rem] leading-5 text-[#e0ca9f]">
                You ran out of turns or HP before the enemy fell. Try again with
                cleaner answers, better combo timing, and smarter item usage.
              </p>
              {summary ? (
                <div className="rounded-[0.8rem] border border-[#7b5e40]/55 bg-black/15 px-4 py-3 text-[0.8rem] leading-5 text-[#e0caa1]">
                  <div>Turns used: {summary.turnsUsed}/{summary.turnLimit}</div>
                  <div>Correct answers: {summary.correctAnswers}</div>
                  <div>Best combo: {summary.bestCombo}</div>
                  <div>Burst hits: {summary.burstClicks}</div>
                  <div>Accuracy: {accuracy ?? 0}%</div>
                </div>
              ) : null}
            </div>
          )}

          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={onRetry}
              className="rounded-[0.8rem] border border-[#d3b07b]/65 bg-[rgba(87,59,31,0.5)] px-4 py-2 text-sm font-semibold text-[#f3e0bb] transition hover:bg-[rgba(115,79,43,0.62)]"
            >
              Retry Skirmish
            </button>
            <button
              type="button"
              onClick={onChallengeBoss}
              className="rounded-[0.8rem] border border-[#8d6a46]/65 bg-[rgba(42,29,19,0.6)] px-4 py-2 text-sm font-semibold text-[#e6d0a6] transition hover:bg-[rgba(72,50,33,0.72)]"
            >
              Challenge Boss
            </button>
          </div>
          </div>
        </div>
        <style jsx>{`
          @keyframes battle-outcome-settle {
            0% {
              opacity: 0;
              transform: scale(0.94);
            }
            60% {
              opacity: 1;
              transform: scale(1.025);
            }
            100% {
              opacity: 1;
              transform: scale(1);
            }
          }
        `}</style>
      </section>
    </div>
  );
}
