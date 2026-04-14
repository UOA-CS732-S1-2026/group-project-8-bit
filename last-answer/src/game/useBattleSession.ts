"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getBattleTurnLimit } from "@/game/core/battleCore";
import {
  activateSupportTool as handleSupportToolActivation,
  createBattle,
  resolveAnswer,
  resolveBurst,
  resolveTimeout,
} from "@/game/core/battleHandler";
import { applyBattleCompletion } from "@/game/core/battleResultHandler";
import {
  createDemoEnemy,
  getCurrentQuestion,
  pickBattleQuestions,
} from "@/game/core/battleUtil";
import type {
  BattleReward,
  BattleSession,
  BattleTransitionResult,
  Question,
  SupportToolId,
} from "@/game/core/types";
import { getMCStore } from "@/store/mcStore";

type BattleSessionControls = {
  battle: BattleSession | null;
  currentQuestion: Question | null;
  reward: BattleReward | null;
  startSkirmishBattle: () => void;
  startBossBattle: () => void;
  resumeQuestionTimer: () => void;
  setSupportMenuOpen: (isOpen: boolean) => void;
  activateSupportTool: (toolId: SupportToolId) => void;
  answerQuestion: (choiceIndex: number) => void;
  registerBurstClick: () => void;
  clearBattleOutcome: () => void;
};

export function useBattleSession(): BattleSessionControls {
  const BURST_RESOLVE_DELAY_MS = 920;
  const [battle, setBattle] = useState<BattleSession | null>(null);
  const [battleReward, setBattleReward] = useState<BattleReward | null>(null);
  const battleRef = useRef<BattleSession | null>(battle);
  const burstResolveTimeoutRef = useRef<number | null>(null);

  const syncBattle = useCallback((nextBattle: BattleSession | null) => {
    battleRef.current = nextBattle;
    setBattle(nextBattle);
  }, []);

  const commitTransition = useCallback(
    (transition: BattleTransitionResult | null) => {
      if (!transition) {
        return;
      }

      syncBattle(transition.battle);

      const playerStore = getMCStore().getState();

      if (transition.enemyDamage > 0) {
        playerStore.applyDamage(transition.enemyDamage);
      }

      applyBattleCompletion(playerStore, transition.completion);

      if (transition.completion) {
        setBattleReward(transition.completion.reward);
      }
    },
    [syncBattle],
  );

  useEffect(() => {
    battleRef.current = battle;
  }, [battle]);

  useEffect(() => {
    return () => {
      if (burstResolveTimeoutRef.current !== null) {
        window.clearTimeout(burstResolveTimeoutRef.current);
      }
    };
  }, []);

  const currentQuestion = battle ? getCurrentQuestion(battle) : null;
  const battleStatus = battle?.status;
  const isTimerPaused = battle?.isTimerPaused;

  useEffect(() => {
    if (battleStatus !== "question" || isTimerPaused) {
      return;
    }

    const timerId = window.setInterval(() => {
      const currentBattle = battleRef.current;

      if (
        !currentBattle ||
        currentBattle.status !== "question" ||
        currentBattle.isTimerPaused ||
        currentBattle.timeRemainingMs <= 0
      ) {
        return;
      }

      const nextRemaining = Math.max(0, currentBattle.timeRemainingMs - 100);

      if (nextRemaining > 0) {
        syncBattle({
          ...currentBattle,
          timeRemainingMs: nextRemaining,
        });
        return;
      }

      const player = getMCStore().getState().readPlayer();
      commitTransition(resolveTimeout(currentBattle, player));
    }, 100);

    return () => window.clearInterval(timerId);
  }, [battleStatus, commitTransition, isTimerPaused, syncBattle]);

  useEffect(() => {
    if (battleStatus !== "burst") {
      return;
    }

    const timerId = window.setInterval(() => {
      const currentBattle = battleRef.current;

      if (
        !currentBattle ||
        currentBattle.status !== "burst" ||
        !currentBattle.burstTimerStarted ||
        currentBattle.burstResolving ||
        currentBattle.burstRemainingMs <= 0
      ) {
        return;
      }

      const nextRemaining = Math.max(0, currentBattle.burstRemainingMs - 100);

      if (nextRemaining > 0) {
        syncBattle({
          ...currentBattle,
          burstRemainingMs: nextRemaining,
        });
        return;
      }

      syncBattle({
        ...currentBattle,
        burstRemainingMs: 0,
        burstTimerStarted: false,
        burstResolving: true,
      });

      if (burstResolveTimeoutRef.current !== null) {
        window.clearTimeout(burstResolveTimeoutRef.current);
      }

      burstResolveTimeoutRef.current = window.setTimeout(() => {
        const resolvingBattle = battleRef.current;

        if (!resolvingBattle || resolvingBattle.status !== "burst") {
          return;
        }

        const player = getMCStore().getState().readPlayer();
        const transition = resolveBurst(resolvingBattle, player);

        if (transition.battle.status === "question" && !transition.completion) {
          syncBattle({
            ...transition.battle,
            isTimerPaused: true,
          });
        } else {
          commitTransition(transition);
        }

        burstResolveTimeoutRef.current = null;
      }, BURST_RESOLVE_DELAY_MS);
    }, 100);

    return () => window.clearInterval(timerId);
  }, [battleStatus, commitTransition, syncBattle]);

  function startBattle(isBoss: boolean) {
    if (burstResolveTimeoutRef.current !== null) {
      window.clearTimeout(burstResolveTimeoutRef.current);
      burstResolveTimeoutRef.current = null;
    }

    const player = getMCStore().getState().readPlayer();
    const questionCount = getBattleTurnLimit(isBoss);
    const questions = pickBattleQuestions(questionCount);
    const enemy = createDemoEnemy(player, isBoss);

    syncBattle(createBattle({ enemy, questions, player }));
    setBattleReward(null);
  }

  function startSkirmishBattle() {
    startBattle(false);
  }

  function startBossBattle() {
    startBattle(true);
  }

  function setSupportMenuOpen(isOpen: boolean) {
    const currentBattle = battleRef.current;

    if (!currentBattle || currentBattle.status !== "question") {
      return;
    }

    syncBattle({
      ...currentBattle,
      supportMenuOpen: isOpen,
      isTimerPaused: isOpen,
    });
  }

  function activateSupportTool(toolId: SupportToolId) {
    const currentBattle = battleRef.current;

    if (!currentBattle) {
      return;
    }

    const nextTransition = handleSupportToolActivation(currentBattle, toolId);
    const nextBattle = nextTransition.battle;
    const toolWasConsumed =
      nextBattle.supportTools[toolId] === currentBattle.supportTools[toolId] - 1;

    syncBattle(nextBattle);

    if (toolWasConsumed) {
      getMCStore().getState().reduceProperty(toolId, 1);
    }
  }

  function answerQuestion(choiceIndex: number) {
    const currentBattle = battleRef.current;

    if (!currentBattle) {
      return;
    }

    const player = getMCStore().getState().readPlayer();
    commitTransition(
      resolveAnswer({
        battle: currentBattle,
        player,
        choiceIndex,
      }),
    );
  }

  function registerBurstClick() {
    const currentBattle = battleRef.current;

    if (!currentBattle || currentBattle.status !== "burst") {
      return;
    }

    if (currentBattle.burstResolving) {
      return;
    }

    syncBattle({
      ...currentBattle,
      burstTimerStarted: true,
      currentBurstClicks: currentBattle.currentBurstClicks + 1,
    });
  }

  function resumeQuestionTimer() {
    const currentBattle = battleRef.current;

    if (
      !currentBattle ||
      currentBattle.status !== "question" ||
      !currentBattle.isTimerPaused
    ) {
      return;
    }

    syncBattle({
      ...currentBattle,
      isTimerPaused: false,
    });
  }

  function clearBattleOutcome() {
    syncBattle(null);
    setBattleReward(null);
  }

  return {
    battle,
    currentQuestion,
    reward: battleReward,
    startSkirmishBattle,
    startBossBattle,
    resumeQuestionTimer,
    setSupportMenuOpen,
    activateSupportTool,
    answerQuestion,
    registerBurstClick,
    clearBattleOutcome,
  };
}
