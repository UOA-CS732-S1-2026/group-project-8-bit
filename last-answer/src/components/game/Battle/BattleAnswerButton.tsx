type BattleAnswerButtonProps = {
  answer: {
    key: string;
    title: string;
    subtitle: string;
  };
};

export function BattleAnswerButton({ answer }: BattleAnswerButtonProps) {
  return (
    <button
      type="button"
      className="relative block min-h-[7.3rem] w-full overflow-hidden border border-[#624a34] bg-[linear-gradient(180deg,rgba(25,20,17,0.97)_0%,rgba(11,10,10,0.99)_100%)] px-5 py-4 text-[#e6cfaa] shadow-[0_10px_20px_rgba(0,0,0,0.45)] transition duration-150 hover:brightness-110"
    >
      <div className="absolute inset-0 bg-[url('/panels/buttons-panel2.png')] bg-[length:100%_100%] bg-center bg-no-repeat opacity-82" />
      <div className="relative z-10 flex h-full flex-col items-center justify-center text-center">
        <div className="font-serif text-[clamp(1.45rem,1.7vw,2rem)] font-semibold leading-none tracking-[0.01em] text-[#ead8b8]">
          {answer.key} {answer.title}
        </div>
        <div className="mt-3 max-w-[14rem] font-serif text-[0.92rem] leading-[1.35] text-[#cbb695]">
          {answer.subtitle}
        </div>
      </div>
    </button>
  );
}
