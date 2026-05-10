import { DialogueSingle } from "@/components/game/DialogueScene";
import { defaultPlayer, getMCStore } from "@/store/mcStore";

const getPlayerName = () => {
  const player = getMCStore().getState().readPlayer();
  return player.name || defaultPlayer.name;
};

const playerCharacter = "__PLAYER__";

const BasicWorkDialogue: DialogueSingle[] = [
  {
    character: "Officer",
    dialogue: "You again. Good.",
  },
  {
    character: playerCharacter,
    dialogue: "Do you have work?",
  },
  {
    character: "Officer",
    dialogue: "Always. Bring me Ashes of Knowledge, and you will be paid.",
  },
  {
    character: playerCharacter,
    dialogue: "Same rate as before?",
  },
  {
    character: "Officer",
    dialogue: "Same rate. More if the ashes are stable and properly sealed.",
  },
  {
    character: playerCharacter,
    dialogue: "And if they are damaged?",
  },
  {
    character: "Officer",
    dialogue:
      "Then they are still useful, just less valuable. The Empire cannot afford to waste anything now.",
  },
];

const AboutPagesBetrayal: DialogueSingle[] = [
  {
    character: playerCharacter,
    dialogue: "I heard Page disappeared.",
  },
  {
    character: "Officer",
    dialogue: "Disappeared? No. He betrayed the Empire.",
  },
  {
    character: playerCharacter,
    dialogue: "What did he do?",
  },
  {
    character: "Officer",
    dialogue:
      "He stole a large stock of Ashes of Knowledge and fled before the transfer could be completed.",
  },
  {
    character: playerCharacter,
    dialogue: "That explains the wanted notices.",
  },
  {
    character: "Officer",
    dialogue: "It explains only part of them.",
  },
  {
    character: playerCharacter,
    dialogue: "There is more?",
  },
  {
    character: "Officer",
    dialogue:
      "That is not your concern. What matters is this: Page is wanted by the Empire. Whoever brings him back, dead or alive, will receive a large reward.",
  },
  {
    character: playerCharacter,
    dialogue: "How large?",
  },
  {
    character: "Officer",
    dialogue: "Large enough to make most men forget their fear.",
  },
];

const AboutStolenAshes: DialogueSingle[] = [
  {
    character: playerCharacter,
    dialogue: "Why does the Empire care so much about the ashes?",
  },
  {
    character: "Officer",
    dialogue: "Because ashes are not common monster remains.",
  },
  {
    character: "Officer",
    dialogue:
      "They are collected, measured, sealed, and sent where they are needed.",
  },
  {
    character: playerCharacter,
    dialogue: "To the First Monolith?",
  },
  {
    character: "Officer",
    dialogue: "You ask too many questions.",
  },
  {
    character: playerCharacter,
    dialogue: "That sounds like a yes.",
  },
  {
    character: "Officer",
    dialogue: "It sounds like a warning.",
  },
];

const AboutGovernmentSupport: DialogueSingle[] = [
  {
    character: playerCharacter,
    dialogue: "If Page is so dangerous, will the Empire send soldiers?",
  },
  {
    character: "Officer",
    dialogue: "No.",
  },
  {
    character: playerCharacter,
    dialogue: "No?",
  },
  {
    character: "Officer",
    dialogue:
      "The Empire is fighting a civil war. Precursor rebels in one province, Aldren rebels in another, deserters on the roads, and monsters everywhere between.",
  },
  {
    character: "Officer",
    dialogue:
      "We do not have spare men to chase one traitor through the forest.",
  },
  {
    character: playerCharacter,
    dialogue: "So hunters and seekers are expected to do it?",
  },
  {
    character: "Officer",
    dialogue: "Hunters, seekers, mercenaries, anyone willing to take the risk.",
  },
  {
    character: playerCharacter,
    dialogue: "And if we need help?",
  },
  {
    character: "Officer",
    dialogue: "Then survive without it.",
  },
];

const chatOfficerDialogues: DialogueSingle[][] = [
  BasicWorkDialogue,
  AboutPagesBetrayal,
  AboutStolenAshes,
  AboutGovernmentSupport,
];
export const getChatOfficerDialogues = (): DialogueSingle[][] => {
  const playerName = getPlayerName();

  return chatOfficerDialogues.map((dialogueGroup) =>
    dialogueGroup.map((dialogue) =>
      dialogue.character === playerCharacter
        ? { ...dialogue, character: playerName }
        : dialogue,
    ),
  );
};
