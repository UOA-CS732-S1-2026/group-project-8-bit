type BattleAnswerButtonProps = {
  answer: {
    key: string;
    title: string;
    subtitle: string;
  };
  onClick?: () => void;
  disabled?: boolean;
  isEliminated?: boolean;
  tone?: "idle" | "selected" | "correct" | "wrong" | "dim";
};

export function BattleAnswerButton({
  answer,
  onClick,
  disabled = false,
  isEliminated = false,
  tone = "idle",
}: BattleAnswerButtonProps) {
  const toneClasses =
    tone === "correct"
      ? "scale-[1.045] ring-4 ring-[#f1d08a] shadow-[0_0_42px_rgba(179,123,42,0.42),0_0_80px_rgba(126,74,23,0.18)]"
      : tone === "wrong"
        ? "scale-[0.982] ring-4 ring-[#8c4637] shadow-[0_0_30px_rgba(71,23,18,0.34)]"
        : tone === "selected"
          ? "scale-[1.02] ring-2 ring-[#c49b62] shadow-[0_0_24px_rgba(104,68,28,0.22)]"
          : tone === "dim"
            ? "scale-[0.985] opacity-25 saturate-[0.5]"
            : "";
  const titleToneClass =
    tone === "correct"
      ? "text-[#f8e7be]"
      : tone === "wrong"
        ? "text-[#efc5bc]"
        : "text-[#ead8b8]";
  const showSeal = tone === "correct" || tone === "selected";
  const showSlash = tone === "wrong";
  const showCorrectBurst = tone === "correct";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={[
        "group relative block min-h-[4.2rem] w-full overflow-hidden bg-[linear-gradient(180deg,rgba(25,20,17,0.97)_0%,rgba(11,10,10,0.99)_100%)] px-2.5 py-2 text-[#e6cfaa] shadow-[0_10px_20px_rgba(0,0,0,0.42)] transition duration-200 sm:min-h-[4.8rem] sm:px-3 sm:py-2.5 xl:min-h-[5.5rem] xl:px-4 xl:py-3",
        disabled
          ? "cursor-not-allowed opacity-50"
          : "hover:-translate-y-0.5 hover:brightness-[1.02] hover:shadow-[0_12px_22px_rgba(0,0,0,0.46),0_0_6px_rgba(214,154,84,0.08)]",
        isEliminated ? "grayscale-[0.35]" : "",
        toneClasses,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="absolute inset-0 bg-[url('/panels/buttons-panel2.png')] bg-[length:100%_100%] bg-center bg-no-repeat opacity-82" />
      {tone !== "idle" ? (
        <div
          className={[
            "pointer-events-none absolute inset-0",
            tone === "correct"
              ? "bg-[radial-gradient(circle_at_center,rgba(188,131,45,0.5)_0%,rgba(108,66,24,0.46)_40%,rgba(22,16,12,0.2)_100%)]"
              : tone === "wrong"
                ? "bg-[linear-gradient(180deg,rgba(78,31,24,0.7)_0%,rgba(42,18,14,0.56)_100%)]"
                : tone === "selected"
                  ? "bg-[linear-gradient(180deg,rgba(90,66,35,0.42)_0%,rgba(45,32,18,0.26)_100%)]"
                  : "bg-transparent",
          ].join(" ")}
        />
      ) : null}
      {showCorrectBurst ? (
        <>
          <div className="pointer-events-none absolute inset-0 z-[8] animate-[battle-answer-correct-flare_560ms_ease-out_forwards] bg-[radial-gradient(circle_at_center,rgba(255,239,191,0.62)_0%,rgba(234,184,89,0.32)_28%,rgba(234,184,89,0)_64%)]" />
          <div className="pointer-events-none absolute inset-y-0 left-[-20%] z-[9] w-[42%] rotate-[18deg] animate-[battle-answer-correct-sweep_760ms_cubic-bezier(0.22,1,0.36,1)_forwards] bg-[linear-gradient(90deg,rgba(255,241,214,0)_0%,rgba(255,241,214,0.08)_24%,rgba(255,241,214,0.78)_52%,rgba(255,214,142,0.22)_76%,rgba(255,214,142,0)_100%)] mix-blend-screen" />
          <div className="pointer-events-none absolute inset-x-[8%] top-[12%] z-[9] h-px animate-[battle-answer-correct-flare_480ms_ease-out_forwards] bg-[linear-gradient(90deg,rgba(255,233,182,0)_0%,rgba(255,233,182,0.95)_50%,rgba(255,233,182,0)_100%)]" />
        </>
      ) : null}
      {showSeal ? (
        <div className="pointer-events-none absolute right-2.5 top-2.5 z-20">
          <div
            className={[
              "flex h-6 w-6 items-center justify-center rounded-full border shadow-[0_8px_18px_rgba(0,0,0,0.24)] sm:h-7 sm:w-7",
              tone === "correct"
                ? "animate-[battle-answer-seal_360ms_ease-out_forwards] border-[#f0d08f]/88 bg-[radial-gradient(circle,rgba(161,110,31,0.98)_0%,rgba(88,53,19,0.95)_100%)]"
                : "border-[#c59e68]/72 bg-[radial-gradient(circle,rgba(94,60,27,0.9)_0%,rgba(54,35,16,0.88)_100%)]",
            ].join(" ")}
          >
            {tone === "correct" ? (
              <div className="text-[0.6rem] font-black leading-none text-[#fff2cc] sm:text-[0.72rem]">
                +
              </div>
            ) : (
              <div className="h-2 w-2 rounded-full border border-[#f1ddb4]/70 sm:h-2.5 sm:w-2.5" />
            )}
          </div>
        </div>
      ) : null}
      {showSlash ? (
        <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
          <div className="absolute left-[14%] top-[24%] h-[0.18rem] w-[72%] rotate-[-16deg] rounded-full bg-[linear-gradient(90deg,rgba(86,28,23,0)_0%,rgba(147,61,48,0.95)_18%,rgba(228,171,151,0.9)_52%,rgba(119,46,34,0.96)_82%,rgba(86,28,23,0)_100%)] shadow-[0_0_12px_rgba(122,53,44,0.28)]" />
          <div className="absolute left-[18%] top-[39%] h-[0.12rem] w-[55%] rotate-[-16deg] rounded-full bg-[linear-gradient(90deg,rgba(83,31,25,0)_0%,rgba(144,57,45,0.82)_36%,rgba(101,37,29,0.94)_100%)] opacity-78" />
        </div>
      ) : null}
      <div
        className={[
          "pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,223,162,0.08)_0%,rgba(255,223,162,0.03)_34%,rgba(255,223,162,0)_72%)] transition duration-200",
          disabled ? "opacity-0" : "opacity-0 group-hover:opacity-100",
        ].join(" ")}
      />
      <div className="relative z-10 flex h-full flex-col items-center justify-center text-center">
        <div
          className={[
            "font-serif text-[clamp(0.94rem,1.45vw,1.36rem)] font-semibold leading-[1.05] tracking-[0.01em] transition duration-200 group-hover:text-[#eeddb9]",
            titleToneClass,
          ].join(" ")}
        >
          {answer.key} {answer.title}
        </div>
      </div>
      <style jsx>{`
        @keyframes battle-answer-seal {
          0% {
            opacity: 0;
            transform: scale(1.4) rotate(-12deg);
            filter: blur(3px);
          }
          55% {
            opacity: 1;
            transform: scale(0.92) rotate(2deg);
            filter: blur(0);
          }
          100% {
            opacity: 1;
            transform: scale(1) rotate(0);
            filter: blur(0);
          }
        }

        @keyframes battle-answer-correct-flare {
          0% {
            opacity: 0;
            transform: scale(0.92);
          }
          35% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            transform: scale(1.08);
          }
        }

        @keyframes battle-answer-correct-sweep {
          0% {
            transform: translateX(-18%) rotate(18deg);
            opacity: 0;
          }
          20% {
            opacity: 1;
          }
          100% {
            transform: translateX(270%) rotate(18deg);
            opacity: 0;
          }
        }
      `}</style>
    </button>
  );
}
