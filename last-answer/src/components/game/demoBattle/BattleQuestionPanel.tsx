import type { BattleSession, Question } from "@/game/core/types";

type BattleQuestionPanelProps = {
  battle: BattleSession;
  question: Question | null;
  timeLabel: string;
  timeRatio: number;
  onAnswer: (choiceIndex: number) => void;
};

export function BattleQuestionPanel({
  battle,
  question,
  timeLabel,
  timeRatio,
  onAnswer,
}: BattleQuestionPanelProps) {
  return (
    <section className="flex min-h-0 flex-1 flex-col rounded-3xl border border-stone-200/10 bg-black/40 p-1 shadow-[0_18px_40px_rgba(0,0,0,0.3)] sm:p-1">
      <div className="flex shrink-0 flex-wrap items-start justify-between gap-1">
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-[0.35em] text-sky-200/80">
            Current Question
          </p>
          <h2 className="mt-1 text-xl font-bold text-white sm:text-2xl">
            {question?.prompt}
          </h2>
          <p className="mt-1 text-sm text-stone-400">
            {question?.category ?? "Battle Quiz"} - Turn {battle.turnsUsed + 1}{" "}
            of {battle.turnLimit}
          </p>
        </div>

        <div className="w-full max-w-xs rounded-2xl border border-sky-200/15 bg-sky-100/5 p-1">
          <div className="mb-1 flex items-center justify-between text-xs uppercase tracking-[0.25em] text-stone-400">
            <span>Answer Clock</span>
            <span>{timeLabel}</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-stone-700/60">
            <div
              className="h-full bg-gradient-to-r from-sky-500 via-cyan-300 to-emerald-200 transition-all"
              style={{ width: `${Math.round(timeRatio * 100)}%` }}
            />
          </div>
          <div className="mt-1 text-xs uppercase tracking-[0.2em] text-stone-400">
            {battle.isTimerPaused
              ? "Timer paused for support selection"
              : "Clock is live"}
          </div>
        </div>
      </div>

      <div className=" grid min-h-0 flex-1 grid-cols-1 gap-1 overflow-y-auto pr-1 sm:grid-cols-2">
        {question?.options.map((option, index) => {
          const eliminated = battle.eliminatedOptionIndices.includes(index);

          return (
            <button
              key={`${question.id}-${index}`}
              type="button"
              onClick={() => onAnswer(index)}
              disabled={eliminated}
              className={[
                "flex min-h-[6rem] flex-col rounded-3xl border px-4 py-1 text-left transition sm:min-h-[7rem]",
                eliminated
                  ? "cursor-not-allowed border-stone-800/90 bg-stone-900/90 text-stone-500 line-through"
                  : "border-stone-200/10 bg-stone-900/70 hover:border-emerald-200/40 hover:bg-emerald-300/10",
              ].join(" ")}
            >
              <div className="text-xs uppercase tracking-[0.28em] text-stone-400">
                Option {index + 1}
              </div>
              <div className="mt-1 text-base font-semibold text-inherit sm:text-lg">
                {option}
              </div>
              <div className="mt-auto pt-1 text-sm text-stone-400">
                {eliminated
                  ? "Removed by Analyze"
                  : "Choose before the timer ends"}
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
