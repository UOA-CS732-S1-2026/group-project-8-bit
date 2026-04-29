"use client";

import { usePathname, useRouter } from "next/navigation";

export default function GameMainFooter() {
  const router = useRouter();
  const pathname = usePathname();
  const backgroundImage = "url('/assets/button/button-pannel.png')";
  const backTarget = pathname === "/game/mainHub" ? "/game" : "/game/mainHub";
  const showBackButton = pathname !== "/game/foggyForest";

  return (
    <footer className="space-y-3">
      <div
        className="relative text-center text-lg md:text-2xl bg-no-repeat bg-center bg-[length:100%_480%] m-[0.1px] p-1 text-amber-100"
        style={{ backgroundImage: "url('/panels/Tavern-bottom.png')" }}
      >
        {showBackButton ? (
          <button
            className="absolute left-4 -bottom-4.5 z-20 inline-flex w-fit items-center justify-center whitespace-nowrap bg-no-repeat bg-center bg-[length:100%_128%] px-10 py-5 text-black transition-transform duration-150 ease-out hover:scale-105 active:scale-95"
            style={{ backgroundImage }}
            onClick={() => router.push(backTarget)}
          >
            Back
          </button>
        ) : null}
        Objective: Reach level 5
      </div>
    </footer>
  );
}
