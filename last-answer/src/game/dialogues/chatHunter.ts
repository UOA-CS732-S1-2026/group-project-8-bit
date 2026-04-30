import { DialogueSingle } from "@/components/game/DialogueScene";
import { defaultPlayer, getMCStore } from "@/store/mcStore";

const getPlayerName = () => {
  const player = getMCStore().getState().readPlayer();
  return player.name || defaultPlayer.name;
};

const HunterStartOfWork: DialogueSingle[] = [
  {
    character: "Hunter",
    dialogue: "Another day, another hunt.",
  },
  {
    character: getPlayerName(),
    dialogue: "You sound tired already.",
  },
  {
    character: "Hunter",
    dialogue: "Tired? No. Just realistic.",
  },
  {
    character: "Hunter",
    dialogue:
      "Come on. Let's get to work before the monsters find someone softer than us.",
  },
];

const HunterProtectingCity: DialogueSingle[] = [
  {
    character: "Hunter",
    dialogue: "People complain about us, but they sleep because of us.",
  },
  {
    character: getPlayerName(),
    dialogue: "Because we keep the monsters away?",
  },
  {
    character: "Hunter",
    dialogue: "Exactly.",
  },
  {
    character: "Hunter",
    dialogue:
      "We protect this city from knowledge fragments, and the government pays us for every danger we drag back from the dark.",
  },
  {
    character: getPlayerName(),
    dialogue: "So it is duty and business.",
  },
  {
    character: "Hunter",
    dialogue: "That is the cleanest way to put it.",
  },
];

const HunterRespectForMC: DialogueSingle[] = [
  {
    character: "Hunter",
    dialogue: "You are good at this. Better than most.",
  },
  {
    character: getPlayerName(),
    dialogue: "At hunting?",
  },
  {
    character: "Hunter",
    dialogue: "At surviving.",
  },
  {
    character: "Hunter",
    dialogue:
      "I saw how many Ashes of Knowledge you brought to the officer last time. That was not luck.",
  },
  {
    character: getPlayerName(),
    dialogue: "Luck helped.",
  },
  {
    character: "Hunter",
    dialogue: "Luck helps once. Skill keeps helping.",
  },
];

const HunterTeamLeader: DialogueSingle[] = [
  {
    character: "Hunter",
    dialogue: "You know, you are a good team leader.",
  },
  {
    character: getPlayerName(),
    dialogue: "That sounds unlike you. Are you praising me?",
  },
  {
    character: "Hunter",
    dialogue: "Do not get used to it.",
  },
  {
    character: "Hunter",
    dialogue:
      "But it is true. With you leading, we bring back more ashes and fewer people get hurt.",
  },
  {
    character: getPlayerName(),
    dialogue: "That matters more than the reward.",
  },
  {
    character: "Hunter",
    dialogue: "To you, maybe. To me, both matter.",
  },
];

const HunterMountainWarning: DialogueSingle[] = [
  {
    character: "Hunter",
    dialogue: "Be careful if your work takes you near the mountain.",
  },
  {
    character: getPlayerName(),
    dialogue: "The one beyond the forest?",
  },
  {
    character: "Hunter",
    dialogue: "Yes. Stay away from it if you can.",
  },
  {
    character: getPlayerName(),
    dialogue: "You heard something?",
  },
  {
    character: "Hunter",
    dialogue: "People have been attacked there. Not by wolves. Not by bandits.",
  },
  {
    character: "Hunter",
    dialogue: "Knowledge fragments. Too many of them.",
  },
  {
    character: getPlayerName(),
    dialogue: "A cluster?",
  },
  {
    character: "Hunter",
    dialogue: "More like a warning from the world itself.",
  },
];

const HunterDrinksAfterWork: DialogueSingle[] = [
  {
    character: "Hunter",
    dialogue: "After today's hunt, we should take a break.",
  },
  {
    character: getPlayerName(),
    dialogue: "A break?",
  },
  {
    character: "Hunter",
    dialogue: "Drinks. My treat.",
  },
  {
    character: getPlayerName(),
    dialogue: "That generous?",
  },
  {
    character: "Hunter",
    dialogue: "Do not make me regret it.",
  },
  {
    character: "Hunter",
    dialogue:
      "We will go to the tavern. It is a good place. Warm fire, decent drink, and the barkeeper knows how to keep people coming back.",
  },
  {
    character: getPlayerName(),
    dialogue: "Andrew?",
  },
  {
    character: "Hunter",
    dialogue: "Yes. The old man with the sharp eyes.",
  },
  {
    character: "Hunter",
    dialogue:
      "He plays music sometimes, too. Not loudly. Not like a drunk trying to impress a girl. Proper music.",
  },
  {
    character: getPlayerName(),
    dialogue: "He knows how to manage a room.",
  },
  {
    character: "Hunter",
    dialogue:
      "That he does. Half the city seems to pass through his door sooner or later.",
  },
];

const HunterEndlessWork: DialogueSingle[] = [
  {
    character: "Hunter",
    dialogue: "Sometimes I wonder if this work will ever end.",
  },
  {
    character: getPlayerName(),
    dialogue: "The monsters?",
  },
  {
    character: "Hunter",
    dialogue: "Yes.",
  },
  {
    character: "Hunter",
    dialogue:
      "We kill them, burn what remains, collect the ashes, report to the officer... and the next day there are more.",
  },
  {
    character: getPlayerName(),
    dialogue: "It feels endless.",
  },
  {
    character: "Hunter",
    dialogue: "It is endless.",
  },
  {
    character: "Hunter",
    dialogue:
      "Or maybe it only feels that way because no one understands where they truly come from.",
  },
  {
    character: getPlayerName(),
    dialogue: "You think there is a source?",
  },
  {
    character: "Hunter",
    dialogue: "I think every wound has a place where it first opened.",
  },
];

export const chatHunterDialogues: DialogueSingle[][] = [
  HunterStartOfWork,
  HunterProtectingCity,
  HunterRespectForMC,
  HunterTeamLeader,
  HunterMountainWarning,
  HunterDrinksAfterWork,
  HunterEndlessWork,
];
