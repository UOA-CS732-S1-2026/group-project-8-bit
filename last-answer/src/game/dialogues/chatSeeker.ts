import { DialogueSingle } from "@/components/game/DialogueScene";
import { defaultPlayer, getMCStore } from "@/store/mcStore";

const getPlayerName = () => {
  const player = getMCStore().getState().readPlayer();
  return player.name || defaultPlayer.name;
};

const SeekerRespect: DialogueSingle[] = [
  {
    character: "Seeker",
    dialogue: "Good to see you again.",
  },
  {
    character: "Seeker",
    dialogue: "You may not think much of it, but many of us still respect you.",
  },
  {
    character: getPlayerName(),
    dialogue: "Respect me?",
  },
  {
    character: "Seeker",
    dialogue: "Of course. We remember what you did.",
  },
  {
    character: "Seeker",
    dialogue:
      "When the previous officer kept throwing fresh recruits into dangerous work, you stood against him.",
  },
  {
    character: "Seeker",
    dialogue:
      "Not many people would risk their position for people below them.",
  },
  {
    character: getPlayerName(),
    dialogue: "I only did what should have been done.",
  },
  {
    character: "Seeker",
    dialogue: "Maybe. But that is exactly why people remember it.",
  },
];

const SeekerRest: DialogueSingle[] = [
  {
    character: "Seeker",
    dialogue: "Enjoy the quiet while it lasts.",
  },
  {
    character: getPlayerName(),
    dialogue: "You make it sound like peace is dangerous.",
  },
  {
    character: "Seeker",
    dialogue: "Peace is rare. That makes it dangerous.",
  },
  {
    character: "Seeker",
    dialogue:
      "Do not push yourself too hard. You have already carried more than most.",
  },
  {
    character: getPlayerName(),
    dialogue: "I am fine.",
  },
  {
    character: "Seeker",
    dialogue: "That is what exhausted people always say.",
  },
];

const SeekerCards: DialogueSingle[] = [
  {
    character: "Seeker",
    dialogue: "We are going to play cards in the camp later. Want to join us?",
  },
  {
    character: getPlayerName(),
    dialogue: "Cards?",
  },
  {
    character: "Seeker",
    dialogue:
      "Yes. Nothing serious. Just a few rounds, some cheap drink, and arguments over rules no one remembers properly.",
  },
  {
    character: getPlayerName(),
    dialogue: "Sounds peaceful.",
  },
  {
    character: "Seeker",
    dialogue: "That is the point. Come if you need a break.",
  },
];

const SeekerBoredom: DialogueSingle[] = [
  {
    character: "Seeker",
    dialogue: "I hate days like this.",
  },
  {
    character: getPlayerName(),
    dialogue: "Quiet days?",
  },
  {
    character: "Seeker",
    dialogue: "Empty days.",
  },
  {
    character: "Seeker",
    dialogue:
      "We trained to serve the Empire. To explore, investigate, protect people, find answers.",
  },
  {
    character: "Seeker",
    dialogue:
      "Now look at us. Sitting around the camp, waiting for orders that never come.",
  },
  {
    character: getPlayerName(),
    dialogue: "At least no one is dying today.",
  },
  {
    character: "Seeker",
    dialogue: "Maybe. But wasting away is not much better.",
  },
  {
    character: "Seeker",
    dialogue:
      "I want to contribute to something. Not rot beside lazy fools who only care about their monthly salary.",
  },
];

const SeekerMountainRumor: DialogueSingle[] = [
  {
    character: "Seeker",
    dialogue: "Have you heard about the mountain in the forest?",
  },
  {
    character: getPlayerName(),
    dialogue: "Only rumors.",
  },
  {
    character: "Seeker",
    dialogue: "Then listen carefully. People have been attacked there.",
  },
  {
    character: getPlayerName(),
    dialogue: "By bandits?",
  },
  {
    character: "Seeker",
    dialogue: "No. Monsters.",
  },
  {
    character: "Seeker",
    dialogue:
      "Knowledge fragments, and many of them. More than anyone should see in one place.",
  },
  {
    character: getPlayerName(),
    dialogue: "That is strange.",
  },
  {
    character: "Seeker",
    dialogue: "Strange is one word for it. Terrifying is another.",
  },
  {
    character: "Seeker",
    dialogue:
      "Some say the mountain is forbidden now. Others say the government is hiding something there.",
  },
  {
    character: getPlayerName(),
    dialogue: "And what do you think?",
  },
  {
    character: "Seeker",
    dialogue:
      "I think places do not become forbidden unless someone has something to fear.",
  },
];

export const chatSeekerDialogues: DialogueSingle[][] = [
  SeekerRespect,
  SeekerRest,
  SeekerCards,
  SeekerBoredom,
  SeekerMountainRumor,
];
