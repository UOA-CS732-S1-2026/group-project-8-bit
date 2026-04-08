import { BattleAnswerGrid } from "./BattleAnswerGrid";
import { BattleQuestionHeader } from "./BattleQuestionHeader";
import { BattleTimerBar } from "./BattleTimerBar";

export type BattleAnswerOption = {
  key: string;
  title: string;
  subtitle: string;
};

type BattleQuestionPanelProps = {
  question: string;
  answers: BattleAnswerOption[];
  duration: number;
  remainingTime: number;
  warningThreshold?: number;
};

export function BattleQuestionPanel({
  question,
  answers,
  duration,
  remainingTime,
  warningThreshold,
}: BattleQuestionPanelProps) {
  return (
    <div className="relative z-[20] -mt-8 w-full space-y-0 sm:-mt-12 lg:-mt-16 xl:-mt-20">
      <div
        className="mb-[-1.5rem]"
        style={{
          width: "min(26rem, calc(100vw - 1rem))",
          marginLeft: "auto",
        }}
      >
        <div className="w-full">
          <BattleTimerBar
            duration={duration}
            remainingTime={remainingTime}
            warningThreshold={warningThreshold}
          />
        </div>
      </div>
      <div className="-mt-px">
        <BattleQuestionHeader question={question} />
      </div>
      <div className="mt-3 sm:mt-4">
        <BattleAnswerGrid answers={answers} />
      </div>
    </div>
  );
}
