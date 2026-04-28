type BattleQuestionHeaderProps = {
  question: string;
  eyebrow?: string;
};

export function BattleQuestionHeader({
  question,
  eyebrow,
}: BattleQuestionHeaderProps) {
  void eyebrow;

  return (
    <div className="flex justify-center px-1 sm:px-3">
      <section className="relative flex min-h-[clamp(4.75rem,10.5vw,6.8rem)] w-[min(90rem,100%)] items-center justify-center overflow-visible px-4 py-2.5 text-stone-100 sm:px-5 sm:py-3 xl:px-7 xl:py-3.5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "url('/panels/question_panel_2.png')",
            backgroundSize: "100% 100%",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        />
        <div className="relative flex max-w-full flex-col items-center justify-center">
          <p
            className="max-w-full text-center font-serif text-[clamp(0.96rem,2vw,1.6rem)] font-semibold leading-[1.24] tracking-[0.01em] text-[#4f240b] drop-shadow-[0_1px_0_rgba(255,240,211,0.38)]"
            dangerouslySetInnerHTML={{ __html: question }}
          ></p>
        </div>
      </section>
    </div>
  );
}
