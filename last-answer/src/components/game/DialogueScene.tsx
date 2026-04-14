"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export interface DialogSingle {
  character: string;
  dialogue: string;
}

interface DialogProps {
  dialogues: DialogSingle[];
  backgroundImage: string;
  onFinish: () => void;
}

export default function DialogScene({
  dialogues,
  backgroundImage,
  onFinish,
}: DialogProps) {
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

  return (
    <div
      className="absolute inset-0 z-50 flex bg-[length:100%_100%] bg-center bg-no-repeat"
      style={{ backgroundImage }}
    >
      <div className="absolute inset-0 bg-black/20" />

      <div className="relative flex min-h-full w-full items-end px-4 pb-6 sm:px-8 sm:pb-8">
        {/* TODO: Use better background image */}
        <button
          type="button"
          onClick={showNextDialogue}
          className="relative mx-auto w-full max-w-5xl bg-[url('/panels/state-panel3.png')] bg-[length:100%_100%] bg-center bg-no-repeat px-7 py-6 text-left text-amber-100 shadow-[0_24px_70px_rgba(0,0,0,0.65)] transition hover:brightness-110 active:scale-[0.99] sm:px-10 sm:py-8"
          aria-label="Show next dialogue"
        >
          <div className="text-lg font-semibold text-stone-100 sm:text-2xl">
            {currentDialogue.character}
          </div>
          <p className="mt-3 min-h-16 pr-10 text-base leading-7 text-amber-100/90 sm:text-xl sm:leading-8">
            {currentDialogue.dialogue}
          </p>
          {/* TODO: Change the click icon to better indicate progression */}
          <Image
            src="/next.svg"
            alt=""
            width={28}
            height={28}
            className="absolute bottom-5 right-7 animate-pulse invert"
            aria-hidden="true"
          />
        </button>
      </div>
    </div>
  );
}
