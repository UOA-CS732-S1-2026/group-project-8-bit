const FOOTER_LEFT_ASPECT_RATIO = 657 / 359;
const FOOTER_RIGHT_ASPECT_RATIO = 686 / 359;

export const GAME_MAIN_FOOTER_HEIGHT = "clamp(3.1rem, 4vw, 4.1rem)";

export default function GameMainFooter() {
  return (
    <footer className="pointer-events-none fixed inset-x-0 bottom-0 z-20 w-full">
      <div className="relative h-[var(--game-footer-height)] w-full overflow-hidden">
        <div aria-hidden="true" className="flex h-full w-full items-stretch">
          <div
            className="-mr-px h-full shrink-0 bg-[url('/panels/bottom_bar_left.png')] bg-left bg-top bg-no-repeat bg-[length:auto_100%]"
            style={{ aspectRatio: `${FOOTER_LEFT_ASPECT_RATIO}` }}
          />
          <div className="h-full min-w-0 flex-1 bg-[url('/panels/bottom_bar_center.png')] bg-left bg-top bg-repeat-x bg-[length:auto_100%]" />
          <div
            className="-ml-px h-full shrink-0 bg-[url('/panels/bottom_bar_right.png')] bg-right bg-top bg-no-repeat bg-[length:auto_100%]"
            style={{ aspectRatio: `${FOOTER_RIGHT_ASPECT_RATIO}` }}
          />
        </div>
        <div className="absolute inset-0 flex items-center justify-center px-6 text-center text-[clamp(0.68rem,1vw,0.88rem)] font-semibold uppercase tracking-[0.18em] text-amber-50/90 drop-shadow-[0_1px_1px_rgba(0,0,0,0.9)]">
          Copyright Team 8-Bit. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
