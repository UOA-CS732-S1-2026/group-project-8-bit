export type GameState = {
  activeQuestId: string | null;
};

export const initialGameState: GameState = {
  activeQuestId: null,
};
