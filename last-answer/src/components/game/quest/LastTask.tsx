"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createEnemy } from "@/game/core/battleCore";
import type { BattleOutcome } from "@/game/core/types";
import { BattlePage } from "@/components/game/Battle/BattlePage";
import DialogueScene from "@/components/game/DialogueScene";
import type { DialogueSingle } from "@/components/game/DialogueScene";
import { stopSceneryMusicNow } from "@/lib/sceneryMusic";
import { stopTavernMusicNow } from "@/lib/tavernMusic";
import {
  agreeAndrew,
  ancientRuin,
  andrewFalls,
  darksideFalls,
  endAGoldenOrder,
  finalFight,
  greatChamber,
  ideologicalConfrontation,
  intoTheDeep,
  lastAnswer,
  prepareTheEnd,
  refuseAndrew,
  revelation,
  sealedPath,
  wayToRuin,
} from "@/game/dialogues/theEnd";
import EndAshes from "./EndAshes";
import EndGoldenOrder from "./EndGoldenOrder";

type LastTaskDialoguePhase =
  | "prepareTheEnd"
  | "wayToRuin"
  | "ancientRuin"
  | "sealedPath"
  | "intoTheDeep"
  | "greatChamber"
  | "darksideFalls"
  | "revelation"
  | "ideologicalConfrontation"
  | "agreeAndrew"
  | "endAGoldenOrder"
  | "refuseAndrew"
  | "finalFight"
  | "andrewFalls"
  | "lastAnswer";

type LastTaskPhase =
  | LastTaskDialoguePhase
  | "darksideBattle"
  | "andrewBattle"
  | "goldenEnding"
  | "ashesEnding";

type LastTaskPhaseConfig = {
  dialogues: () => DialogueSingle[];
  backgroundImage: string;
  nextPhase: LastTaskPhase | "andrewChoice";
};

const prepareTheEndBackground = "url('/quests/theEnd/prepareTheEnd.png')";
const wayToRuinBackground = "url('/quests/theEnd/wayToRuin.png')";
const ancientRuinBackground = "url('/quests/theEnd/ancientRuin.png')";
const sealedPathBackground = "url('/quests/theEnd/sealedPath.png')";
const intoTheDeepBackground = "url('/quests/theEnd/intoTheDeep.png')";
const greatChamberBackground = "url('/quests/theEnd/greatChamber.png')";
const darksideFallsBackground = "url('/quests/theEnd/darkside-falls.png')";
const andrewRevelationBackground =
  "url('/quests/theEnd/andrew-revelation.png')";
const ideologicalConfrontationBackground =
  "url('/quests/theEnd/ideological-confrontation.png')";
const endABackground = "url('/quests/theEnd/endA.png')";
const empoweredAndrewBackground = "url('/quests/theEnd/empoweredAndrew.png')";
const theLostTruthBackground = "url('/quests/theEnd/theLostTruth.png')";
const endBBackground = "url('/quests/theEnd/endB.png')";

const lastTaskPhaseConfigs: Record<LastTaskDialoguePhase, LastTaskPhaseConfig> =
  {
    prepareTheEnd: {
      dialogues: prepareTheEnd,
      backgroundImage: prepareTheEndBackground,
      nextPhase: "wayToRuin",
    },
    wayToRuin: {
      dialogues: wayToRuin,
      backgroundImage: wayToRuinBackground,
      nextPhase: "ancientRuin",
    },
    ancientRuin: {
      dialogues: ancientRuin,
      backgroundImage: ancientRuinBackground,
      nextPhase: "sealedPath",
    },
    sealedPath: {
      dialogues: sealedPath,
      backgroundImage: sealedPathBackground,
      nextPhase: "intoTheDeep",
    },
    intoTheDeep: {
      dialogues: intoTheDeep,
      backgroundImage: intoTheDeepBackground,
      nextPhase: "greatChamber",
    },
    greatChamber: {
      dialogues: greatChamber,
      backgroundImage: greatChamberBackground,
      nextPhase: "darksideBattle",
    },
    darksideFalls: {
      dialogues: darksideFalls,
      backgroundImage: darksideFallsBackground,
      nextPhase: "revelation",
    },
    revelation: {
      dialogues: revelation,
      backgroundImage: andrewRevelationBackground,
      nextPhase: "ideologicalConfrontation",
    },
    ideologicalConfrontation: {
      dialogues: ideologicalConfrontation,
      backgroundImage: ideologicalConfrontationBackground,
      nextPhase: "andrewChoice",
    },
    agreeAndrew: {
      dialogues: agreeAndrew,
      backgroundImage: ideologicalConfrontationBackground,
      nextPhase: "endAGoldenOrder",
    },
    endAGoldenOrder: {
      dialogues: endAGoldenOrder,
      backgroundImage: endABackground,
      nextPhase: "goldenEnding",
    },
    refuseAndrew: {
      dialogues: refuseAndrew,
      backgroundImage: ideologicalConfrontationBackground,
      nextPhase: "finalFight",
    },
    finalFight: {
      dialogues: finalFight,
      backgroundImage: empoweredAndrewBackground,
      nextPhase: "andrewBattle",
    },
    andrewFalls: {
      dialogues: andrewFalls,
      backgroundImage: theLostTruthBackground,
      nextPhase: "lastAnswer",
    },
    lastAnswer: {
      dialogues: lastAnswer,
      backgroundImage: endBBackground,
      nextPhase: "ashesEnding",
    },
  };

function getBackgroundImageUrl(backgroundImage: string): string | null {
  const match = backgroundImage.trim().match(/^url\((['"]?)(.+?)\1\)$/);

  return match?.[2] ?? null;
}

function isDialoguePhase(phase: LastTaskPhase): phase is LastTaskDialoguePhase {
  return phase in lastTaskPhaseConfigs;
}

export default function LastTask() {
  const [phase, setPhase] = useState<LastTaskPhase>("prepareTheEnd");
  const [isLoadingDialogue, setIsLoadingDialogue] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const transitionIdRef = useRef(0);
  const router = useRouter();

  useEffect(() => {
    stopTavernMusicNow();
    stopSceneryMusicNow();
  }, []);

  const darksideEnemy = useMemo(() => {
    const enemy = createEnemy({
      id: "darkside-of-knowledge",
      name: "Darkside of Knowledge",
      level: 25,
      tier: "boss",
      isBoss: true,
    });

    return {
      ...enemy,
      portraitPath: "/portraits/boss-portrait.png",
      imagePath: "/quests/theEnd/darkside-monster.png",
      artPreset: "darkside" as const,
    };
  }, []);

  const andrewEnemy = useMemo(() => {
    const enemy = createEnemy({
      id: "andrew",
      name: "Andrew",
      level: 30,
      tier: "boss",
      isBoss: true,
    });

    return {
      ...enemy,
      portraitPath: "/portraits/andwer-portrait.png",
      imagePath: "/quests/theEnd/bossAndrew.png",
      artPreset: "andrew" as const,
    };
  }, []);

  const returnHome = useCallback(() => {
    router.push("/");
  }, [router]);

  const showDeathToastAndReturnHome = useCallback(() => {
    setToastMessage("You died.");

    window.setTimeout(() => {
      router.push("/");
    }, 1200);
  }, [router]);

  const showLoadingScreenBeforePhase = useCallback(
    (nextPhase: LastTaskDialoguePhase) => {
      const nextPhaseConfig = lastTaskPhaseConfigs[nextPhase];
      const backgroundUrl = getBackgroundImageUrl(
        nextPhaseConfig.backgroundImage,
      );
      const transitionId = transitionIdRef.current + 1;

      transitionIdRef.current = transitionId;
      setIsLoadingDialogue(true);

      const finishTransition = () => {
        if (transitionIdRef.current !== transitionId) {
          return;
        }

        setPhase(nextPhase);
        setIsLoadingDialogue(false);
      };

      if (!backgroundUrl) {
        window.setTimeout(finishTransition, 0);
        return;
      }

      const image = new window.Image();
      image.onload = finishTransition;
      image.onerror = finishTransition;
      image.src = backgroundUrl;
    },
    [],
  );

  const moveToPhase = useCallback(
    (nextPhase: LastTaskPhase) => {
      if (isDialoguePhase(nextPhase)) {
        showLoadingScreenBeforePhase(nextPhase);
        return;
      }

      setPhase(nextPhase);
    },
    [showLoadingScreenBeforePhase],
  );

  const [showAndrewChoice, setShowAndrewChoice] = useState(false);

  const handleDialogueFinish = () => {
    if (!isDialoguePhase(phase)) {
      return;
    }

    const phaseConfig = lastTaskPhaseConfigs[phase];

    if (phaseConfig.nextPhase === "andrewChoice") {
      setShowAndrewChoice(true);
      return;
    }

    moveToPhase(phaseConfig.nextPhase);
  };

  const handleDarksideBattleFinish = (outcome: BattleOutcome) => {
    if (outcome === "lost") {
      showDeathToastAndReturnHome();
      return;
    }

    showLoadingScreenBeforePhase("darksideFalls");
  };

  const handleAndrewBattleFinish = (outcome: BattleOutcome) => {
    if (outcome === "lost") {
      showDeathToastAndReturnHome();
      return;
    }

    showLoadingScreenBeforePhase("andrewFalls");
  };

  const toast = toastMessage ? (
    <div className="pointer-events-none fixed left-1/2 top-6 z-[100] -translate-x-1/2 bg-[url('/panels/interact-panel.png')] bg-[length:100%_100%] bg-center bg-no-repeat px-8 py-4 text-center text-lg font-semibold text-amber-100 shadow-[0_18px_45px_rgba(0,0,0,0.55)]">
      {toastMessage}
    </div>
  ) : null;

  if (isLoadingDialogue) {
    return (
      <>
        <div className="absolute inset-0 z-[90] flex items-center justify-center bg-black text-xl font-semibold text-stone-100">
          Loading
        </div>
        {toast}
      </>
    );
  }

  if (phase === "darksideBattle") {
    return (
      <>
        <BattlePage
          enemy={darksideEnemy}
          backgroundImage="/backgrounds/theDarkSource.jpg"
          label="dark source"
          onFinish={handleDarksideBattleFinish}
        />
        {toast}
      </>
    );
  }

  if (phase === "andrewBattle") {
    return (
      <>
        <BattlePage
          enemy={andrewEnemy}
          backgroundImage="/backgrounds/theGoldenSource.jpg"
          label="golden source"
          onFinish={handleAndrewBattleFinish}
        />
        {toast}
      </>
    );
  }

  if (phase === "goldenEnding") {
    return <EndGoldenOrder onClose={returnHome} />;
  }

  if (phase === "ashesEnding") {
    return <EndAshes onClose={returnHome} />;
  }

  const phaseConfig = lastTaskPhaseConfigs[phase];

  return (
    <>
      <DialogueScene
        key={phase}
        dialogues={phaseConfig.dialogues()}
        backgroundImage={phaseConfig.backgroundImage}
        onFinish={handleDialogueFinish}
      />
      {showAndrewChoice && (
        <div
          className="game-modal-backdrop fixed inset-0 z-50 flex items-center justify-center bg-black/55 px-4 backdrop-blur-sm"
          onClick={(e) => e.stopPropagation()}
        >
          <section
            className="game-modal-panel relative flex w-[min(88vw,26rem)] flex-col items-center bg-[url('/panels/menu-panel6.png')] bg-[length:100%_100%] bg-center bg-no-repeat px-10 py-9 text-center text-amber-100 shadow-[0_24px_70px_rgba(0,0,0,0.65)]"
            role="alertdialog"
            aria-modal="true"
            aria-label="Andrew's choice"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-serif text-2xl font-bold tracking-wide text-amber-950">
              Do You Agree with Andrew?
            </h3>
            <p className="mt-4 text-sm italic leading-relaxed text-amber-950">
              Your answer will shape the path ahead.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <button
                type="button"
                className="rounded border border-stone-600/55 bg-stone-800/70 px-5 py-2 text-sm font-semibold uppercase tracking-[0.18em] text-amber-100 transition duration-150 hover:border-stone-500/65 hover:bg-stone-700/75 active:translate-y-[1px] active:scale-[0.98]"
                onClick={() => {
                  setShowAndrewChoice(false);
                  moveToPhase("agreeAndrew");
                }}
              >
                Yes
              </button>
              <button
                type="button"
                className="rounded border border-stone-600/55 bg-stone-800/70 px-5 py-2 text-sm font-semibold uppercase tracking-[0.18em] text-amber-100 transition duration-150 hover:border-stone-500/65 hover:bg-stone-700/75 active:translate-y-[1px] active:scale-[0.98]"
                onClick={() => {
                  setShowAndrewChoice(false);
                  moveToPhase("refuseAndrew");
                }}
              >
                No
              </button>
            </div>
          </section>
        </div>
      )}
    </>
  );
}
