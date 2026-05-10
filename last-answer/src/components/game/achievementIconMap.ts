const ACHIEVEMENT_ICON_VERSION = "20260510-ash-fix";

export const ACHIEVEMENT_ICON_SRC: Record<string, string> = {
  level_3: "/icons/achievements/level_3.png",
  level_5: "/icons/achievements/level_5.png",
  level_10: "/icons/achievements/level_10.png",
  battle_win_1: "/icons/achievements/battle_win_1.png",
  battle_win_5: "/icons/achievements/battle_win_5.png",
  battle_win_20: "/icons/achievements/battle_win_20.png",
  battle_loss_1: "/icons/achievements/battle_loss_1.png",
  combo_5: "/icons/achievements/combo_5.png",
  combo_10: "/icons/achievements/combo_10.png",
  combo_15: "/icons/achievements/combo_15.png",
  tools_5: "/icons/achievements/tools_5.png",
  tools_20: "/icons/achievements/tools_20.png",
  strong_tools_10: "/icons/achievements/strong_tools_10.png",
  coins_300: "/icons/achievements/coins_300.png",
  coins_1000: "/icons/achievements/coins_1000.png",
  wallet_200: "/icons/achievements/wallet_200.png",
  quest_1: "/icons/achievements/quest_1.png",
  quest_5: "/icons/achievements/quest_5.png",
  ending_golden: "/icons/achievements/ending_golden.png",
  ending_ashes: "/icons/achievements/ending_ashes.png",
  ending_dual_truth: "/icons/achievements/ending_dual_truth.png",
};

export function getAchievementIconSrc(achievementId: string) {
  const src = ACHIEVEMENT_ICON_SRC[achievementId] ?? "/icons/menu-icon.png";
  return `${src}?v=${ACHIEVEMENT_ICON_VERSION}`;
}
