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
      ? "scale-[1.03] ring-4 ring-[#e3b86d] shadow-[0_0_38px_rgba(97,55,18,0.28)]"
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
  const subtitleToneClass =
    tone === "correct"
      ? "text-[#e7cb96]"
      : tone === "wrong"
        ? "text-[#cf9d92]"
        : "text-[#cdb590]";
  const showSeal = tone === "correct" || tone === "selected";
  const showSlash = tone === "wrong";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={[
        "group relative block min-h-[5.5rem] w-full overflow-hidden bg-[linear-gradient(180deg,rgba(25,20,17,0.97)_0%,rgba(11,10,10,0.99)_100%)] px-3 py-3 text-[#e6cfaa] shadow-[0_10px_20px_rgba(0,0,0,0.42)] transition duration-200 sm:min-h-[6.2rem] sm:px-4 sm:py-3.5 xl:min-h-[7.3rem] xl:px-5 xl:py-4",
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
              ? "bg-[radial-gradient(circle_at_center,rgba(120,76,28,0.58)_0%,rgba(66,40,16,0.46)_48%,rgba(22,16,12,0.24)_100%)]"
              : tone === "wrong"
                ? "bg-[linear-gradient(180deg,rgba(78,31,24,0.7)_0%,rgba(42,18,14,0.56)_100%)]"
                : tone === "selected"
                  ? "bg-[linear-gradient(180deg,rgba(90,66,35,0.42)_0%,rgba(45,32,18,0.26)_100%)]"
                  : "bg-transparent",
          ].join(" ")}
        />
      ) : null}
      {showSeal ? (
        <div className="pointer-events-none absolute right-3 top-3 z-20">
          <div
            className={[
              "flex h-8 w-8 items-center justify-center rounded-full border shadow-[0_8px_18px_rgba(0,0,0,0.24)]",
              tone === "correct"
                ? "animate-[battle-answer-seal_360ms_ease-out_forwards] border-[#d7af67]/80 bg-[radial-gradient(circle,rgba(118,71,25,0.96)_0%,rgba(70,42,17,0.94)_100%)]"
                : "border-[#c59e68]/72 bg-[radial-gradient(circle,rgba(94,60,27,0.9)_0%,rgba(54,35,16,0.88)_100%)]",
            ].join(" ")}
          >
            <div className="h-2.5 w-2.5 rounded-full border border-[#f1ddb4]/70" />
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
            "font-serif text-[clamp(1rem,1.9vw,1.72rem)] font-semibold leading-none tracking-[0.01em] transition duration-200 group-hover:text-[#eeddb9]",
            titleToneClass,
          ].join(" ")}
        >
          {answer.key} {answer.title}
        </div>
        <div
          className={[
            "mt-2 max-w-[16rem] text-[0.7rem] leading-4 sm:text-[0.78rem] sm:leading-[1.1rem]",
            subtitleToneClass,
          ].join(" ")}
        >
          {isEliminated ? "Eliminated by support tool" : answer.subtitle}
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
      `}</style>
    </button>
  );
}
