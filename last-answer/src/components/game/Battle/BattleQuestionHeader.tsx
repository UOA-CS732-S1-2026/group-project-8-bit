type BattleQuestionHeaderProps = {
  question: string;
  eyebrow?: string;
};

export function BattleQuestionHeader({
  question,
  eyebrow,
}: BattleQuestionHeaderProps) {
  return (
    <div className="flex justify-center px-2 sm:px-4">
      <section className="relative flex min-h-[clamp(6.2rem,14vw,8.8rem)] w-[min(90rem,100%)] items-center justify-center overflow-visible px-4 py-3 text-stone-100 sm:px-6 sm:py-4 xl:px-8 xl:py-5">
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
          {eyebrow ? (
            <div className="mb-2 text-center text-[0.62rem] font-semibold uppercase tracking-[0.28em] text-[#835231] sm:text-[0.68rem]">
              {eyebrow}
            </div>
          ) : null}
          <p
            className="max-w-full text-center font-serif text-[clamp(1rem,2.4vw,1.92rem)] font-semibold leading-[1.35] tracking-[0.01em] text-[#4f240b] drop-shadow-[0_1px_0_rgba(255,240,211,0.38)]"
            dangerouslySetInnerHTML={{ __html: question }}
          ></p>
        </div>
      </section>
    </div>
  );
}
