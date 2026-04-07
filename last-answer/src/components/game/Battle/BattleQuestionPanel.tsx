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
    <div className="-mt-8 relative z-[20] w-full space-y-0">
      <div
        className="mb-2"
        style={{
          width: "32rem",
          maxWidth: "calc(100vw - 2rem)",
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
      <div className="-mt-px">
        <BattleAnswerGrid answers={answers} />
      </div>
    </div>
  );
}
