"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createEnemy } from "@/game/core/battleCore";
import type { BattleOutcome } from "@/game/core/types";
import {
  pauseSceneryMusic,
  resumeSceneryMusic,
} from "@/lib/sceneryMusic";
import { BattlePage } from "../Battle/BattlePage";
import DialogueScene from "../DialogueScene";
import type { DialogueSingle } from "../DialogueScene";
import {
  confrontPage,
  endQuest,
  forestSearch,
  foundCave,
  hiddenTruth,
  monstersCave,
  pageAppear,
  startChasing,
  theEndPre,
  trick,
} from "@/game/dialogues/questPage";

type PageTargetProps = {
  onFinish: () => void;
};

type PageTargetPhase =
  | "startChasing"
  | "forestSearch"
  | "foundCave"
  | "pageAppear"
  | "monstersCave"
  | "confrontPage"
  | "battle"
  | "hiddenTruth"
  | "trick"
  | "endQuest"
  | "theEndPre";

type PageTargetDialoguePhase = Exclude<PageTargetPhase, "battle">;

type PageTargetPhaseConfig = {
  dialogues: () => DialogueSingle[];
  backgroundImage: string;
  nextPhase: PageTargetPhase | null;
};

const barkeeperTalkBackground = "url('/quests/ashFind/barkeeper-talk.png')";
const searchForestBackground = "url('/quests/ashFind/search-forest.png')";
const caveFindBackground = "url('/quests/ashFind/cave-find.png')";
const pageAppearBackground = "url('/quests/ashFind/page-appear.png')";
const pageEnemyBackground = "url('/quests/ashFind/monster-cave.png')";
const confrontPageBackground = "url('/quests/ashFind/confront-page.png')";
const mercyPageBackground = "url('/quests/ashFind/mercy-page.png')";
const betrayBackground = "url('/quests/ashFind/betray.png')";
const savedMCBackground = "url('/quests/ashFind/saved-MC.png')";
const theEndPreBackground = "url('/quests/ashFind/the-end-pre.png')";

const pageTargetPhaseConfigs: Record<
  PageTargetDialoguePhase,
  PageTargetPhaseConfig
> = {
  startChasing: {
    dialogues: startChasing,
    backgroundImage: barkeeperTalkBackground,
    nextPhase: "forestSearch",
  },
  forestSearch: {
    dialogues: forestSearch,
    backgroundImage: searchForestBackground,
    nextPhase: "foundCave",
  },
  foundCave: {
    dialogues: foundCave,
    backgroundImage: caveFindBackground,
    nextPhase: "pageAppear",
  },
  pageAppear: {
    dialogues: pageAppear,
    backgroundImage: pageAppearBackground,
    nextPhase: "monstersCave",
  },
  monstersCave: {
    dialogues: monstersCave,
    backgroundImage: pageEnemyBackground,
    nextPhase: "confrontPage",
  },
  confrontPage: {
    dialogues: confrontPage,
    backgroundImage: confrontPageBackground,
    nextPhase: "battle",
  },
  hiddenTruth: {
    dialogues: hiddenTruth,
    backgroundImage: mercyPageBackground,
    nextPhase: "trick",
  },
  trick: {
    dialogues: trick,
    backgroundImage: betrayBackground,
    nextPhase: "endQuest",
  },
  endQuest: {
    dialogues: endQuest,
    backgroundImage: savedMCBackground,
    nextPhase: "theEndPre",
  },
  theEndPre: {
    dialogues: theEndPre,
    backgroundImage: theEndPreBackground,
    nextPhase: null,
  },
};

function getBackgroundImageUrl(backgroundImage: string): string | null {
  const match = backgroundImage.trim().match(/^url\((['"]?)(.+?)\1\)$/);

  return match?.[2] ?? null;
}

export function PageTarget({ onFinish }: PageTargetProps) {
  const [phase, setPhase] = useState<PageTargetPhase>("startChasing");
  const [isLoadingDialogue, setIsLoadingDialogue] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [deathRedirectActive, setDeathRedirectActive] = useState(false);
  const transitionIdRef = useRef(0);
  const router = useRouter();
  const pageEnemy = useMemo(() => {
    const enemy = createEnemy({
      id: "Page",
      name: "Page",
      level: 15,
      tier: "boss",
      isBoss: true,
    });

    return {
      ...enemy,
      portraitPath: "/portraits/page-portrait.png",
      imagePath: "/quests/ashFind/page-enemy.png",
      artPreset: "page" as const,
    };
  }, []);

  useEffect(() => {
    if (!deathRedirectActive) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      router.push("/");
    }, 1200);

    return () => window.clearTimeout(timeoutId);
  }, [deathRedirectActive, router]);

  const showLoadingScreenBeforePhase = useCallback(
    (nextPhase: PageTargetDialoguePhase) => {
      const nextPhaseConfig = pageTargetPhaseConfigs[nextPhase];
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

  const handleDialogueFinish = () => {
    const phaseConfig =
      pageTargetPhaseConfigs[phase as PageTargetDialoguePhase];

    if (!phaseConfig.nextPhase) {
      onFinish();
      return;
    }

    if (phaseConfig.nextPhase !== "battle") {
      showLoadingScreenBeforePhase(phaseConfig.nextPhase);
      return;
    }

    pauseSceneryMusic();
    setPhase(phaseConfig.nextPhase);
  };

  const handleBattleFinish = (outcome: BattleOutcome) => {
    if (outcome === "lost") {
      setToastMessage("You died.");
      setDeathRedirectActive(true);
      return;
    }

    resumeSceneryMusic();
    showLoadingScreenBeforePhase("hiddenTruth");
  };

  if (isLoadingDialogue) {
    return (
      <div className="absolute inset-0 z-[90] flex items-center justify-center bg-black text-xl font-semibold text-stone-100">
        Loading
      </div>
    );
  }

  if (phase === "battle") {
    return (
      <>
        <BattlePage
          enemy={pageEnemy}
          backgroundImage="/backgrounds/cave-background.png"
          label="cave"
          onFinish={handleBattleFinish}
        />
        {toastMessage && (
          <div className="pointer-events-none fixed left-1/2 top-6 z-[80] -translate-x-1/2 bg-[url('/panels/interact-panel.png')] bg-[length:100%_100%] bg-center bg-no-repeat px-8 py-4 text-center text-lg font-semibold text-amber-100 shadow-[0_18px_45px_rgba(0,0,0,0.55)]">
            {toastMessage}
          </div>
        )}
      </>
    );
  }

  const phaseConfig = pageTargetPhaseConfigs[phase];

  return (
    <DialogueScene
      key={phase}
      dialogues={phaseConfig.dialogues()}
      backgroundImage={phaseConfig.backgroundImage}
      onFinish={handleDialogueFinish}
    />
  );
}
