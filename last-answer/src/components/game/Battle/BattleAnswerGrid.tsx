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
    <section
      className="grid gap-0"
      style={{ gridTemplateColumns: "repeat(4, minmax(0, 1fr))" }}
    >
      {answers.map((answer, index) => (
        <div
          key={answer.key}
          className="min-w-0"
          style={{ marginLeft: index === 0 ? "0" : "-1px" }}
        >
          <BattleAnswerButton answer={answer} />
        </div>
      ))}
    </section>
  );
}
