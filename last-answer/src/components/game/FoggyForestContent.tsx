"use client";
import { useEffect, useState } from "react";
import { createEnemy } from "@/game/core/battleCore";
import type { Enemy } from "@/game/core/types";
import { useMCStore } from "@/store/mcStore";
import InteractBtn from "./InteractBtn";
import DialogueScene, { type DialogueSingle } from "./DialogueScene";
import { BattlePage } from "./Battle/BattlePage";

const defaultDialogues: DialogueSingle[] = [
  { character: "Officer", dialogue: "Stay alert, the forest is dangerous." },
  {
    character: "Hunter",
    dialogue: "I've seen some strange creatures lately.",
  },
];

export default function FoggyForestContent() {
  const setLocation = useMCStore((state) => state.setLocation);
  const player = useMCStore((state) => state.player);
  const [showExplorePanel, setShowExplorePanel] = useState(false);
  const [battleEnemy, setBattleEnemy] = useState<Enemy | null>(null);
  const [showDialogue, setShowDialogue] = useState(false);
  const [dialogues, setDialogues] =
    useState<DialogueSingle[]>(defaultDialogues);
  const [dialogBackgroundImage, setDialogBackgroundImage] = useState(
    "url('/backgrounds/the-opening.png')",
  );

  useEffect(() => {
    setLocation("foggyForest");
  }, [setLocation]);

  const explore = () => {
    setShowExplorePanel(true);
  };

  const startRimAreaBattle = () => {
    const enemyLevel = Math.min(player.level, 10);

    setBattleEnemy(
      createEnemy({
        id: "forest-rim-wisp",
        name: "Rim Forest Wisp",
        level: enemyLevel,
        tier: "normal",
        isBoss: false,
      }),
    );
    setShowExplorePanel(false);
    setShowDialogue(false);
  };

  const startDeepForestBattle = () => {
    const enemyLevel = Math.min(Math.max(player.level, 10), 20);

    setBattleEnemy(
      createEnemy({
        id: "deep-forest-wisp",
        name: "Deep Forest Wisp",
        level: enemyLevel,
        tier: "normal",
        isBoss: false,
      }),
    );
    setShowExplorePanel(false);
    setShowDialogue(false);
  };

  const handleClick1 = () => {
    setDialogues([
      { character: "Explorer", dialogue: "I will brave the unknown!" },
    ]);
    setDialogBackgroundImage("url('/backgrounds/city-hub.png')");
    setShowDialogue(true);
  };

  const talkOfficer = () => {
    setShowDialogue(true);
  };
  const btnClass = "w-full max-w-[25%] min-h-[3rem] max-h-[6rem]";
  return (
    <main>
      {battleEnemy && (
        <div className="fixed inset-0 z-50">
          <BattlePage
            enemy={battleEnemy}
            backgroundImage="/backgrounds/foggy-forest.png"
            label="forest"
            onFinish={() => {
              setBattleEnemy(null);
            }}
          />
        </div>
      )}
      {showDialogue && (
        <DialogueScene
          dialogues={dialogues}
          backgroundImage={dialogBackgroundImage}
          onFinish={() => setShowDialogue(false)}
        />
      )}
      {showExplorePanel && (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/45 px-4"
          onClick={() => setShowExplorePanel(false)}
        >
          <div
            className="w-full max-w-md rounded-md border border-amber-200/35 bg-black/80 bg-[url('/panels/menu-panel.png')] bg-[length:100%_100%] bg-center bg-no-repeat p-6 text-stone-100 shadow-[0_20px_60px_rgba(0,0,0,0.65)]"
            role="dialog"
            aria-modal="true"
            aria-label="Choose forest area"
            onClick={(event) => event.stopPropagation()}
          >
            <h2 className="text-center font-serif text-2xl font-semibold text-amber-100">
              Choose Forest Path
            </h2>
            <div className="mt-6 grid gap-3">
              <button
                type="button"
                className="rounded-md border border-amber-200/35 bg-black/50 px-5 py-4 text-left text-lg font-semibold text-stone-100 transition hover:border-amber-100/70 hover:bg-amber-200/15 active:scale-[0.98]"
                onClick={startRimAreaBattle}
              >
                Rim Area (&lt;10lv)
              </button>
              <button
                type="button"
                className="rounded-md border border-amber-200/35 bg-black/50 px-5 py-4 text-left text-lg font-semibold text-stone-100 transition hover:border-amber-100/70 hover:bg-amber-200/15 active:scale-[0.98]"
                onClick={startDeepForestBattle}
              >
                Deep Forest (&gt;10lv)
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="flex flex-row gap-2">
        <InteractBtn
          className={btnClass}
          onPress={explore}
          title="Explore"
          content="Venture deeper into the forest with unknown dangers."
        />
        <InteractBtn
          className={btnClass}
          onPress={talkOfficer}
          title="Talk to Officer"
          content="Talk to the officer of the Empire."
        />
        <InteractBtn
          className={btnClass}
          onPress={handleClick1}
          title="Talk to Seekers"
          content="The people work for the Empire to hunt monsters."
        />
        <InteractBtn
          className={btnClass}
          onPress={handleClick1}
          title="Talk to Hunters"
          content="The people hunt monsters for money."
        />
      </div>
    </main>
  );
}
