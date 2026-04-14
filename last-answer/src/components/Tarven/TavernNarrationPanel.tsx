export function TavernNarrationPanel() {
  const backgroundImage = "url('/panels/question_panel_2.png') ";

  return (
    <section className="mt-auto mb-4 md:mb-6">
      <div
        className="mx-auto w-full max-w-5xl min-h-[120px] bg-no-repeat bg-center bg-[length:100%_100%] brightness-100 px-6 py-5 text-xl text-stone-900 md:text-2xl text-align-left flex items-center justify-center "
        style={{ backgroundImage }}
      >
        The tavern breathes with low voices and flickering firelight.
      </div>
    </section>
  );
}
