"use client";

import { useCallback, useEffect, useRef, useState } from "react";

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
  const [isPressed, setIsPressed] = useState(false);
  const currentDialogue = dialogues[currentIndex];
  const wheelThrottleRef = useRef<number>(0);
  const keyThrottleRef = useRef<number>(0);

  useEffect(() => {
    if (dialogues.length === 0) {
      onFinish();
    }
  }, [dialogues, onFinish]);

  const showNextDialogue = useCallback(() => {
    if (currentIndex < dialogues.length - 1) {
      setCurrentIndex((i) => i + 1);
      return;
    }
    onFinish();
  }, [currentIndex, dialogues.length, onFinish]);

  const showPrevDialogue = useCallback(() => {
    setCurrentIndex((i) => Math.max(0, i - 1));
  }, []);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const now = Date.now();
      if (now - wheelThrottleRef.current < 300) return;
      wheelThrottleRef.current = now;
      if (e.deltaY > 0) showNextDialogue();
      else showPrevDialogue();
    };
    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [showNextDialogue, showPrevDialogue]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
      e.preventDefault();
      const now = Date.now();
      if (now - keyThrottleRef.current < 150) return;
      keyThrottleRef.current = now;
      if (e.key === "ArrowDown") showNextDialogue();
      else showPrevDialogue();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [showNextDialogue, showPrevDialogue]);

  if (!currentDialogue) {
    return null;
  }

  const isNarration = currentDialogue.character === null;
  const dialoguePositionClass = "items-end px-4 pb-6 sm:px-8 sm:pb-8";
  const dialogueTextClass = isNarration ? "px-6 text-center" : "pr-10 text-left";
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === dialogues.length - 1;

  return (
    <div
      className="absolute inset-0 z-50 flex cursor-pointer bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage }}
      onClick={showNextDialogue}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
    >
      <div className="absolute inset-0 bg-black/20" />

      <div className={`relative flex min-h-full w-full ${dialoguePositionClass}`}>
        <div
          className={`relative mx-auto w-full max-w-5xl bg-[url('/panels/state-panel3.png')] bg-[length:100%_100%] bg-center bg-no-repeat px-12 py-5 text-amber-100 shadow-[0_24px_70px_rgba(0,0,0,0.65)] transition hover:brightness-110 sm:px-14 sm:py-6 ${isPressed ? "scale-[0.99]" : ""}`}
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

          {!isFirst && (
            <span
              aria-hidden="true"
              className="pointer-events-none absolute top-5 right-10 h-0 w-0 border-b-[10px] border-l-[8px] border-r-[8px] border-b-amber-100/85 border-l-transparent border-r-transparent drop-shadow-[0_1px_2px_rgba(0,0,0,0.75)] animate-bounce sm:top-6 sm:right-18"
            />
          )}
          {!isLast && (
            <span
              aria-hidden="true"
              className="pointer-events-none absolute bottom-4 right-10 h-0 w-0 border-l-[8px] border-r-[8px] border-t-[10px] border-l-transparent border-r-transparent border-t-amber-100/85 drop-shadow-[0_1px_2px_rgba(0,0,0,0.75)] animate-bounce sm:bottom-5 sm:right-18"
            />
          )}
        </div>
      </div>
    </div>
  );
}
