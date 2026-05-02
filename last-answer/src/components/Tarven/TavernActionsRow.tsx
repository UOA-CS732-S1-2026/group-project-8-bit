"use client";

import { useEffect, useRef, useState } from "react";
import BarkeeperMenu from "./BarkeeperMenu";
import { useMCStore } from "@/store/mcStore";
import DialogueScene, { DialogueSingle } from "../game/DialogueScene";
import InteractBtn from "../game/InteractBtn";
import { tavernCrowdDialogues } from "@/game/dialogues/tavernCrowd";

export function TavernActionsRow() {
  const [openBarkeeperMenu, setOpenBarkeeperMenu] = useState(false);
  const healSfxRef = useRef<HTMLAudioElement | null>(null);
  const [openDialogueMenu, setOpenDialogueMenu] = useState(false);
  const [dialogues, setDialogues] = useState<DialogueSingle[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const restoreHpToFull = useMCStore((state) => state.restoreHpToFull);
  const btnClass = "w-full max-w-[33.333%] min-h-[3rem] max-h-[6rem]";
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
      <div className="flex flex-row gap-2">
        <InteractBtn
          className={btnClass}
          onPress={() => setOpenBarkeeperMenu(true)}
          title="Talk to the Barkeeper"
          content="Trade at property shop"
        />
        <InteractBtn
          className={btnClass}
          onPress={crowdClickHandler}
          title="Listen to the Crowd"
          content="Whispers hide in drunken words"
        />
        <InteractBtn
          className={btnClass}
          onPress={handleDeepSleep}
          title="Have a Deep Sleep"
          content="For a moment, restore your physical strength"
        />
      </div>
    </main>
  );
}
