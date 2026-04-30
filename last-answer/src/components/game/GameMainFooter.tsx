"use client";

import { usePathname, useRouter } from "next/navigation";
import { useMCStore } from "@/store/mcStore";

export default function GameMainFooter() {
  const router = useRouter();
  const pathname = usePathname();
  const player = useMCStore((state) => state.player);
  const backTarget = "/game/mainHub";
  const showBackButton = pathname !== "/game/mainHub";
  const pageQuestCompleted =
    player.completedQuests?.some((quest) => quest.id === "PageFight") ?? false;
  const objectiveText = (() => {
    if (player.level < 5) {
      return "Objective: Reach level 5";
    }

    if (!pageQuestCompleted) {
      return "Objective: talk with barkeeper about Page and reach level 20";
    }

    if (player.level < 20) {
      return "Objective: Reach level 20";
    }

    return "Objective: talk with barkeeper for final challenge";
  })();

  return (
    <footer className="space-y-3">
      <div
        className="relative text-center text-lg md:text-2xl bg-no-repeat bg-center bg-[length:100%_480%] m-[0.1px] p-1 text-amber-100"
        style={{ backgroundImage: "url('/panels/Tavern-bottom.png')" }}
      >
        {showBackButton ? (
          <button
            type="button"
            aria-label="Back to main hub"
            className="absolute left-6 -bottom-2 z-20 inline-flex h-12 w-16 items-center justify-center bg-no-repeat bg-center bg-[length:100%_128%] text-[#fff4cf] drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] transition-[filter,transform,color] duration-150 ease-out hover:-translate-y-0.5 hover:scale-105 hover:text-[#fff8dc] hover:drop-shadow-[0_0_10px_rgba(251,191,36,0.95)] active:translate-y-0.5 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 focus-visible:ring-offset-2 focus-visible:ring-offset-black/70"
            onClick={() => router.push(backTarget)}
          >
            <svg
              aria-hidden="true"
              className="h-7 w-10"
              viewBox="0 0 64 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M28 12 12 24l16 12"
                stroke="currentColor"
                strokeWidth="7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M14 24h40"
                stroke="currentColor"
                strokeWidth="7"
                strokeLinecap="round"
              />
            </svg>
          </button>
        ) : null}
        {objectiveText}
      </div>
    </footer>
  );
}
