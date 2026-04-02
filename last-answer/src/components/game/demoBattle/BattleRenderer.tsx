"use client";

import { BURST_DURATION_MS } from "@/game/core/battleCore";
import { useBattleSession } from "@/game/useBattleSession";
import { maxLevel, xpIntoCurrentLevel, xpToNextLevel } from "@/game/core/level";
import { useMCStore } from "@/store/mcStore";
import { BattleBurstPanel } from "./BattleBurstPanel";
import { BattleHudPanel } from "./BattleHudPanel";
import { BattleLobbyPanel } from "./BattleLobbyPanel";
import { BattleProfilePanel } from "./BattleProfilePanel";
import { BattleQuestionPanel } from "./BattleQuestionPanel";
import { BattleResultPanel } from "./BattleResultPanel";
import { BattleSupportPanel } from "./BattleSupportPanel";

function formatMs(ms: number): string {
  return `${(Math.max(0, ms) / 1000).toFixed(1)}s`;
}

function formatAvgTime(ms: number): string {
  return `${(ms / 1000).toFixed(2)}s`;
}

export function BattleRenderer() {
  const player = useMCStore((state) => state.player);
  const restoreHpToFull = useMCStore((state) => state.restoreHpToFull);
  const {
    battle,
    currentQuestion,
    reward: battleReward,
    startSkirmishBattle,
    startBossBattle,
    setSupportMenuOpen,
    activateSupportTool,
    answerQuestion,
    registerBurstClick,
    clearBattleOutcome,
  } = useBattleSession();

  const isMaxLevel = player.level >= maxLevel;
  const xpCurrent = xpIntoCurrentLevel(player.exp, player.level);
  const xpNeeded = isMaxLevel ? 1 : xpToNextLevel(player.level);

  // Lobby and post-battle results share the same outer shell and player summary.
  if (!battle || battle.status === "won" || battle.status === "lost") {
    return (
      <main className="flex h-full w-full flex-col justify-center bg-[radial-gradient(circle_at_top,#1b3d26_0%,#0f1e16_45%,#090c0b_100%)] px-4 text-stone-100">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 lg:flex-row">
          <BattleLobbyPanel
            onStartSkirmish={startSkirmishBattle}
            onStartBoss={startBossBattle}
          />

          <aside className="w-full max-w-xl">
            <BattleProfilePanel
              player={player}
              xpCurrent={xpCurrent}
              xpNeeded={xpNeeded}
              isMaxLevel={isMaxLevel}
              onRestoreHp={restoreHpToFull}
            />
            {battle?.status === "won" || battle?.status === "lost" ? (
              <BattleResultPanel
                status={battle.status}
                reward={battleReward}
                avgAnswerTimeLabel={
                  battleReward
                    ? formatAvgTime(battleReward.avgAnswerTimeMs)
                    : undefined
                }
                onClose={clearBattleOutcome}
              />
            ) : null}
          </aside>
        </div>
      </main>
    );
  }

  const timeRatio = Math.max(
    0,
    Math.min(1, battle.timeRemainingMs / battle.timeLimitMs),
  );
  const burstRatio =
    battle.status === "burst"
      ? Math.max(0, Math.min(1, battle.burstRemainingMs / BURST_DURATION_MS))
      : 0;

  // The active battle view is a fixed-height flex layout so the answer list stays inside the frame.
  return (
    <main className="h-full min-h-0 w-full overflow-hidden bg-[radial-gradient(circle_at_top,#1a3a2d_0%,#11171b_40%,#090b10_100%)] text-stone-100">
      <div className="mx-auto flex h-full max-w-6xl min-h-0 flex-col gap-3 px-3 sm:gap-4 sm:px-4 sm:pb-2">
        <BattleHudPanel battle={battle} player={player} />

        <div className="flex min-h-0 flex-1 flex-col gap-3 lg:grid lg:grid-cols-[minmax(0,1.45fr)_20rem]">
          {battle.status === "burst" ? (
            <BattleBurstPanel
              burstRemainingLabel={formatMs(battle.burstRemainingMs)}
              burstRatio={burstRatio}
              currentBurstClicks={battle.currentBurstClicks}
              onBurstClick={registerBurstClick}
            />
          ) : (
            <BattleQuestionPanel
              battle={battle}
              question={currentQuestion}
              timeLabel={formatMs(battle.timeRemainingMs)}
              timeRatio={timeRatio}
              onAnswer={answerQuestion}
            />
          )}

          <BattleSupportPanel
            battle={battle}
            onToggle={() => setSupportMenuOpen(!battle.supportMenuOpen)}
            onActivateTool={activateSupportTool}
          />
        </div>
      </div>
    </main>
  );
}
