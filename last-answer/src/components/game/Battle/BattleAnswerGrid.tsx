import { BattleAnswerButton } from "./BattleAnswerButton";

type BattleAnswerGridProps = {
  answers: Array<{
    key: string;
    title: string;
    subtitle: string;
    onClick?: () => void;
    disabled?: boolean;
    isEliminated?: boolean;
    tone?: "idle" | "selected" | "correct" | "wrong" | "dim";
  }>;
};

export function BattleAnswerGrid({ answers }: BattleAnswerGridProps) {
  return (
    <section className="grid grid-cols-2 gap-2.5 sm:gap-3 lg:gap-4 xl:grid-cols-4 xl:gap-5">
      {answers.map((answer) => (
        <div key={answer.key} className="min-w-0">
          <BattleAnswerButton
            answer={answer}
            onClick={answer.onClick}
            disabled={answer.disabled}
            isEliminated={answer.isEliminated}
            tone={answer.tone}
          />
        </div>
      ))}
    </section>
  );
}
