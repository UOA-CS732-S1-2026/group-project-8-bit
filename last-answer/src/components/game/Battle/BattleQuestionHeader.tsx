type BattleQuestionHeaderProps = {
  question: string;
};

export function BattleQuestionHeader({ question }: BattleQuestionHeaderProps) {
  return (
    <section
      className="relative flex items-center justify-center overflow-hidden rounded-[0.6rem] border border-[#5d4530] bg-[linear-gradient(180deg,rgba(30,22,17,0.96)_0%,rgba(12,10,9,0.98)_100%)] px-8 py-7 text-stone-100 shadow-[0_10px_24px_rgba(0,0,0,0.45)]"
      style={{ minHeight: "clamp(7rem, 12vh, 8.8rem)" }}
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "url('/panels/question_panel.png')",
          backgroundSize: "100% 100%",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />
      <p className="relative max-w-full text-center font-serif text-[clamp(1.2rem,1.6vw,1.82rem)] font-semibold leading-[1.45] tracking-[0.01em] text-[#ead4b4]">
        {question}
      </p>
    </section>
  );
}
