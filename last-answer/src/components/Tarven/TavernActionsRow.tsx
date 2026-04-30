"use client";

import { useEffect, useRef, useState } from "react";
import BarkeeperMenu from "./BarkeeperMenu";
import { useMCStore } from "@/store/mcStore";
import DialogueScene, { DialogueSingle } from "../game/DialogueScene";
import { tavernCrowdDialogues } from "@/game/dialogues/tavernCrowd";

export function TavernActionsRow() {
  const [openBarkeeperMenu, setOpenBarkeeperMenu] = useState(false);
  const healSfxRef = useRef<HTMLAudioElement | null>(null);
  const [openDialogueMenu, setOpenDialogueMenu] = useState(false);
  const [dialogues, setDialogues] = useState<DialogueSingle[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const restoreHpToFull = useMCStore((state) => state.restoreHpToFull);
  const actionBtnClass =
    "w-full min-h-[5.5rem] bg-[length:100%_100%] bg-no-repeat bg-center px-4 py-3 m-[0.1px] flex flex-col justify-center items-center text-center transform transition-transform duration-150 ease-out hover:scale-105 active:scale-95";

  const panelImage = "url('/panels/interact-panel.png')";
  const tavernBackground = "url('/backgrounds/tavern-background.png')";

  useEffect(() => {
    if (!toastMessage) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setToastMessage(null);
    }, 2000);

    return () => window.clearTimeout(timeoutId);
  }, [toastMessage]);

  function crowdClickHandler() {
    const randomIndex = Math.floor(Math.random() * tavernCrowdDialogues.length);

    setDialogues(tavernCrowdDialogues[randomIndex]);
    setOpenDialogueMenu(true);
  }

  function sleepClickHandler() {
    restoreHpToFull();
    setToastMessage("HP is full.");
  }

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
    restoreHpToFull();
  };

  return (
    <main>
      {openBarkeeperMenu && (
        <BarkeeperMenu onClose={() => setOpenBarkeeperMenu(false)} />
      )}
      {openDialogueMenu && (
        <DialogueScene
          dialogues={dialogues}
          backgroundImage={tavernBackground}
          onFinish={() => setOpenDialogueMenu(false)}
        />
      )}
      {toastMessage && (
        <div className="pointer-events-none fixed left-1/2 top-6 z-[60] -translate-x-1/2 bg-[url('/panels/interact-panel.png')] bg-[length:100%_100%] bg-center bg-no-repeat px-8 py-4 text-center text-lg font-semibold text-amber-100 shadow-[0_18px_45px_rgba(0,0,0,0.55)]">
          {toastMessage}
        </div>
      )}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <button
          className={actionBtnClass}
          style={{ backgroundImage: panelImage }}
          onClick={() => setOpenBarkeeperMenu(true)}
        >
          <div className="text-2xl ">Talk to the Barkeeper</div>
          <div className="text-sm text-amber-200/80">
            Trade at property shop
          </div>
        </button>
        <button
          className={actionBtnClass}
          style={{ backgroundImage: panelImage }}
          onClick={crowdClickHandler}
        >
          <div className="text-2xl">Listen to the Crowd</div>
          <div className="text-sm text-amber-200/80">
            Whispers hide in drunken words
          </div>
        </button>
        <button
          className={actionBtnClass}
          // When you click the button, it will play someting interesting hahaha from Steven :D
          style={{ backgroundImage: panelImage }}
          onClick={handleDeepSleep}
        >
          <div className="text-2xl">Have a deep sleep</div>
          <div className="text-sm text-amber-200/80">
            For a moment, restore your physical strength
          </div>
        </button>
      </div>
    </main>
  );
}
