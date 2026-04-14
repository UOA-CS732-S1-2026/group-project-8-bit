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
  questionMeta?: string;
  answers: BattleAnswerOption[];
  duration: number;
  remainingTime: number;
  warningThreshold?: number;
  isTensionActive?: boolean;
};

export function BattleQuestionPanel({
  question,
  questionMeta,
  answers,
  duration,
  remainingTime,
  warningThreshold,
  isTensionActive = false,
}: BattleQuestionPanelProps) {
  return (
    <div
      className={[
        "relative z-[20] -mt-8 w-full space-y-0 sm:-mt-12 lg:-mt-16 xl:-mt-20",
        isTensionActive ? "animate-[battle-tension-breathe_1.2s_ease-in-out_infinite]" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
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
        <BattleQuestionHeader question={question} eyebrow={questionMeta} />
      </div>
      <div className="mt-3 sm:mt-4">
        <BattleAnswerGrid answers={answers} />
      </div>
      <style jsx>{`
        @keyframes battle-tension-breathe {
          0%,
          100% {
            transform: translateY(0);
            filter: saturate(1);
          }
          50% {
            transform: translateY(-2px);
            filter: saturate(1.08);
          }
        }
      `}</style>
    </div>
  );
}
