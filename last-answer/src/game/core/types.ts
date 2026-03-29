export type QuestId = string;

export type Player = {
  name: string;
  hp: number;
  attack: number;
  defense: number;
  exp: number;
  coins: number;
};

export type GameMode = "hub" | "dialogue" | "battle" | "reward";

export type Question = {
  id: string;
  prompt: string;
  options: string[];
  answerIndex: number;
};

export type Quest = {
  id: string;
  title: string;
  description: string;
  component: React.ComponentType;
};
