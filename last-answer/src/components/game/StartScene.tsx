"use client";

import { useState } from "react";
import { getMCStore } from "@/store/mcStore";

export default function StartScene({ onClose }: { onClose: () => void }) {
  const [sceneIndex, setSceneIndex] = useState(0);
  const name = getMCStore().getState().readPlayer().name || "Bruce";
  const startImg1 = "/backgrounds/the-opening.png";
  const startText1 = `many years later, when ${name} faces the final choice that will decide the fate of the Aldren, he remembers the distant afternoon when people first discovered that Heaven had gone silent. Bells rang across the land. Mothers carried children into chapels. Old men fell to their knees in the streets. The preachers lifted their voices until they broke, begging for one sign that God had not abandoned His people. No answer came. And when fear had exhausted prayer, the first monsters emerged.`;
  const startImg2 = "/backgrounds/the-opening2.png";
  const startText2 = `Three years later, ${name} wakes in a narrow bed above the tavern. Though the days have passed, the catastrophe still lingers like a wound from yesterday. Time flies, memories dim, and the old world slips further away. Now begins your new life as a hunter of knowledge fragments.`;
  const scenes = [
    { image: startImg1, text: startText1 },
    { image: startImg2, text: startText2 },
  ];
  const scene = scenes[sceneIndex];
  const handleAdvance = () => {
    if (sceneIndex === scenes.length - 1) {
      onClose();
      return;
    }

    setSceneIndex((currentSceneIndex) => currentSceneIndex + 1);
  };

  return (
    <button
      type="button"
      className="absolute inset-0 z-50 flex h-full w-full cursor-pointer items-end overflow-hidden bg-cover bg-center bg-no-repeat p-4 text-left text-stone-100 sm:p-6"
      style={{ backgroundImage: `url('${scene.image}')` }}
      onClick={handleAdvance}
      aria-label="Continue opening scene"
    >
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.08)_0%,rgba(0,0,0,0.22)_45%,rgba(0,0,0,0.78)_100%)]" />
      <div className="relative w-full rounded-md border border-amber-100/25 bg-black/60 px-5 py-4 shadow-[0_18px_45px_rgba(0,0,0,0.55)] backdrop-blur-sm sm:px-6 sm:py-5">
        <p className="text-sm leading-6 text-stone-100 sm:text-base sm:leading-7">
          {scene.text}
        </p>
        <p className="mt-3 text-xs font-semibold uppercase tracking-[0.18em] text-amber-200/80">
          Click to continue
        </p>
      </div>
    </button>
  );
}
