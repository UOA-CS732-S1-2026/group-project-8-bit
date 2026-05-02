"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export interface DialogueSingle {
  character: string | null;
  dialogue: string;
}

interface DialogueProps {
  dialogues: DialogueSingle[];
  backgroundImage: string;
  onFinish: () => void;
}

export default function DialogueScene({
  dialogues,
  backgroundImage,
  onFinish,
}: DialogueProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentDialogue = dialogues[currentIndex];

  useEffect(() => {
    if (dialogues.length === 0) {
      onFinish();
    }
  }, [dialogues, onFinish]);

  const showNextDialogue = () => {
    if (currentIndex < dialogues.length - 1) {
      setCurrentIndex((index) => index + 1);
      return;
    }

    onFinish();
  };

  if (!currentDialogue) {
    return null;
  }

  const isNarration = currentDialogue.character === null;
  const dialoguePositionClass = "items-end px-4 pb-6 sm:px-8 sm:pb-8";
  const dialogueButtonClass = isNarration ? "text-center" : "text-left";
  const dialogueTextClass = isNarration ? "px-6" : "pr-10";

  return (
    <div
      className="absolute inset-0 z-50 flex bg-[length:100%_100%] bg-center bg-no-repeat"
      style={{ backgroundImage }}
    >
      <div className="absolute inset-0 bg-black/20" />

      <div
        className={`relative flex min-h-full w-full ${dialoguePositionClass}`}
      >
        {/* TODO: Use better background image */}
        <button
          type="button"
          onClick={showNextDialogue}
          className={`relative mx-auto w-full max-w-5xl bg-[url('/panels/state-panel3.png')] bg-[length:100%_100%] bg-center bg-no-repeat px-12 py-5 ${dialogueButtonClass} text-amber-100 shadow-[0_24px_70px_rgba(0,0,0,0.65)] transition hover:brightness-110 active:scale-[0.99] sm:px-14 sm:py-6`}
          aria-label="Show next dialogue"
        >
          {!isNarration ? (
            <div className="text-lg font-semibold text-stone-100 sm:text-2xl">
              {currentDialogue.character}
            </div>
          ) : null}
          <p
            className={`min-h-16 ${isNarration ? "" : "mt-3"} ${dialogueTextClass} text-base leading-7 text-amber-100/90 sm:text-xl sm:leading-8`}
          >
            {currentDialogue.dialogue}
          </p>
          <span
            aria-hidden="true"
            className="pointer-events-none absolute bottom-6 right-10 h-0 w-0 border-l-[8px] border-r-[8px] border-t-[10px] border-l-transparent border-r-transparent border-t-amber-100/85 drop-shadow-[0_1px_2px_rgba(0,0,0,0.75)] animate-bounce sm:bottom-7 sm:right-18"
          />
        </button>
      </div>
    </div>
  );
}
