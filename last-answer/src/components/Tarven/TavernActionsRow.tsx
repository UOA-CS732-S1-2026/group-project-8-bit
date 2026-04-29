"use client";

import { useEffect, useRef, useState } from "react";
import BarkeeperMenu from "./BarkeeperMenu";
import { useMCStore } from "@/store/mcStore";


export function TavernActionsRow() {
  const [openBarkeeperMenu, setOpenBarkeeperMenu] = useState(false);
  const addHp = useMCStore((state) => state.addHp);
  const healSfxRef = useRef<HTMLAudioElement | null>(null);

  const actionBtnClass =
    "w-full min-h-[5.5rem] bg-[length:100%_100%] bg-no-repeat bg-center px-4 py-3 m-[0.1px] flex flex-col justify-center items-center text-center transform transition-transform duration-150 ease-out hover:scale-105 active:scale-95";

  const backgroundImage = "url('/panels/interact-panel.png')";

  useEffect(() => {
    const audio = new Audio("/sfx/heal-chime-sfx.wav");
    audio.preload = "auto";
    audio.volume = 0.7;
    healSfxRef.current = audio;

    return () => {
      audio.pause();
      healSfxRef.current = null;
    };
  }, []);

  const handleDeepSleep = () => {
    const audio = healSfxRef.current;
    if (audio) {
      audio.currentTime = 0;
      void audio.play().catch(() => {});
    }
    addHp(100);
  };

  return (
    <main>
      {openBarkeeperMenu && (
        <BarkeeperMenu onClose={() => setOpenBarkeeperMenu(false)} />
      )}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <button
          className={actionBtnClass}
          style={{ backgroundImage }}
          onClick={() => setOpenBarkeeperMenu(true)}
        >
          <div className="text-2xl ">Talk to the Barkeeper</div>
          <div className="text-sm text-amber-200/80">
            Trade at property shop
          </div>
        </button>
        <button className={actionBtnClass} style={{ backgroundImage }}>
          <div className="text-2xl">Listen to the Crowd</div>
          <div className="text-sm text-amber-200/80">
            Whispers hide in drunken words
          </div>
        </button>
        <button className={actionBtnClass} 
        // When you click the button, it will play someting interesting hahaha from Steven :D
        style={{ backgroundImage }}
        onClick={handleDeepSleep}>
          <div className="text-2xl">Have a deep sleep</div>
          <div className="text-sm text-amber-200/80">
            For a moment, restore your physical strength
          </div>
        </button>
      </div>
    </main>
  );
}
