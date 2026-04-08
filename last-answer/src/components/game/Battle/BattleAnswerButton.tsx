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
      className="group relative block min-h-[5.5rem] w-full overflow-hidden bg-[linear-gradient(180deg,rgba(25,20,17,0.97)_0%,rgba(11,10,10,0.99)_100%)] px-3 py-3 text-[#e6cfaa] shadow-[0_10px_20px_rgba(0,0,0,0.42)] transition duration-200 hover:-translate-y-0.5 hover:brightness-[1.02] hover:shadow-[0_12px_22px_rgba(0,0,0,0.46),0_0_6px_rgba(214,154,84,0.08)] sm:min-h-[6.2rem] sm:px-4 sm:py-3.5 xl:min-h-[7.3rem] xl:px-5 xl:py-4"
    >
      <div className="absolute inset-0 bg-[url('/panels/buttons-panel2.png')] bg-[length:100%_100%] bg-center bg-no-repeat opacity-82" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,223,162,0.08)_0%,rgba(255,223,162,0.03)_34%,rgba(255,223,162,0)_72%)] opacity-0 transition duration-200 group-hover:opacity-100" />
      <div className="relative z-10 flex h-full flex-col items-center justify-center text-center">
        <div className="font-serif text-[clamp(1rem,1.9vw,1.72rem)] font-semibold leading-none tracking-[0.01em] text-[#ead8b8] transition duration-200 group-hover:text-[#eeddb9]">
          {answer.key} {answer.title}
        </div>
      </div>
    </button>
  );
}
