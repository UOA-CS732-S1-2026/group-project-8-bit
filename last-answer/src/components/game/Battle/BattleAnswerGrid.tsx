import { BattleAnswerButton } from "./BattleAnswerButton";

type BattleAnswerGridProps = {
  answers: Array<{
    key: string;
    title: string;
    subtitle: string;
  }>;
};

export function BattleAnswerGrid({ answers }: BattleAnswerGridProps) {
  return (
    <section className="grid grid-cols-2 gap-4 md:gap-6 xl:grid-cols-4 xl:gap-10">
      {answers.map((answer) => (
        <div key={answer.key} className="min-w-0">
          <BattleAnswerButton answer={answer} />
        </div>
      ))}
    </section>
  );
}
