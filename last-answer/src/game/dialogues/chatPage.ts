import { DialogueSingle } from "@/components/game/DialogueScene";
import { defaultPlayer, getMCStore } from "@/store/mcStore";

const getPlayerName = () => {
  const player = getMCStore().getState().readPlayer();
  return player.name || defaultPlayer.name;
};

const Greeting: DialogueSingle[] = [
  {
    character: "Page",
    dialogue: "Happy hunting, boy.",
  },
  {
    character: getPlayerName(),
    dialogue: "You sound cheerful today.",
  },
  {
    character: "Page",
    dialogue:
      "Why not? You are still alive, and you brought work back with you. That is more than many hunters manage.",
  },
];

const AboutMCHuntingSkill: DialogueSingle[] = [
  {
    character: "Page",
    dialogue: "I saw the ashes you handed in last time.",
  },
  {
    character: "Page",
    dialogue: "That was quite a lot.",
  },
  {
    character: getPlayerName(),
    dialogue: "The fragments were clustered near the old road.",
  },
  {
    character: "Page",
    dialogue: "Even so, not everyone could return with that much.",
  },
  {
    character: "Page",
    dialogue:
      "You have a talent for hunting them. Careful hands, sharp eyes, and enough sense not to die for pride.",
  },
  {
    character: getPlayerName(),
    dialogue: "That almost sounds like praise.",
  },
  {
    character: "Page",
    dialogue: "Take it while it lasts.",
  },
];

const AboutAshesOfKnowledge: DialogueSingle[] = [
  {
    character: getPlayerName(),
    dialogue: "What happens to the ashes after we hand them over?",
  },
  {
    character: "Page",
    dialogue:
      "They are collected, recorded, sealed, and sent back to the First Monolith.",
  },
  {
    character: getPlayerName(),
    dialogue: "Back to the Monolith?",
  },
  {
    character: "Page",
    dialogue:
      "Yes. The ashes still carry remnants of knowledge. Broken, unstable, dangerous - but useful.",
  },
  {
    character: getPlayerName(),
    dialogue: "Useful for what?",
  },
  {
    character: "Page",
    dialogue: "To slow the Monolith's decay.",
  },
  {
    character: getPlayerName(),
    dialogue: "So the government uses monster remains to repair it.",
  },
  {
    character: "Page",
    dialogue:
      "A crude way to say it, but not wrong. Actually, no one knows how to repair it. They smeared the ash on the surface of the monolith, which would automatically absorb it and slow its decay.",
  },
  {
    character: "Page",
    dialogue:
      "The Monolith is wounded. Every sack of ashes helps keep it standing a little longer.",
  },
];

const PageHiddenAttitude: DialogueSingle[] = [
  {
    character: "Page",
    dialogue: "People think hunters only earn coin by killing monsters.",
  },
  {
    character: "Page",
    dialogue: "But in truth, you are feeding the heart of the Empire.",
  },
  {
    character: getPlayerName(),
    dialogue: "That does not sound comforting.",
  },
  {
    character: "Page",
    dialogue: "It is not meant to be comforting. It is meant to be true.",
  },
];

const PageMountainWarning: DialogueSingle[] = [
  {
    character: "Page",
    dialogue: "You have been hunting well lately.",
  },
  {
    character: getPlayerName(),
    dialogue: "That sounds like a warning, not praise.",
  },
  {
    character: "Page",
    dialogue: "Perhaps both.",
  },
  {
    character: getPlayerName(),
    dialogue: "What is it?",
  },
  {
    character: "Page",
    dialogue: "Stay away from the mountain beyond the forest.",
  },
  {
    character: getPlayerName(),
    dialogue: "The mountain?",
  },
  {
    character: "Page",
    dialogue:
      "Yes. Do not go near it. Do not follow rumors. Do not accept work that leads you there.",
  },
  {
    character: getPlayerName(),
    dialogue: "Why?",
  },
  {
    character: "Page",
    dialogue: "Because people who go there do not always return.",
  },
  {
    character: getPlayerName(),
    dialogue: "Knowledge fragments?",
  },
  {
    character: "Page",
    dialogue: "Too many of them. More than any hunter should face at once.",
  },
  {
    character: getPlayerName(),
    dialogue: "Fragments do not usually gather like that.",
  },
  {
    character: "Page",
    dialogue: "And that is exactly why you should avoid the place.",
  },
  {
    character: getPlayerName(),
    dialogue: "You sound certain.",
  },
  {
    character: "Page",
    dialogue:
      "I read the reports. Seekers were attacked there. Hunters too. Some died. Some came back empty-eyed.",
  },
  {
    character: getPlayerName(),
    dialogue: "Then why has no one cleared it?",
  },
  {
    character: "Page",
    dialogue: "Because some wounds should not be touched with bare hands.",
  },
  {
    character: getPlayerName(),
    dialogue: "That does not answer the question.",
  },
  {
    character: "Page",
    dialogue: "It answers enough.",
  },
  {
    character: getPlayerName(),
    dialogue: "You are telling me not to investigate.",
  },
  {
    character: "Page",
    dialogue:
      "I am telling you not to waste your life on a place already marked as forbidden.",
  },
  {
    character: getPlayerName(),
    dialogue: "Forbidden by the government?",
  },
  {
    character: "Page",
    dialogue: "By common sense.",
  },
  {
    character: getPlayerName(),
    dialogue: "Those are not always the same thing.",
  },
  {
    character: "Page",
    dialogue: "No. But in this case, listen to either one.",
  },
  {
    character: getPlayerName(),
    dialogue: "And if I do not?",
  },
  {
    character: "Page",
    dialogue:
      "Then bring a strong team, a sharper blade, and a prayer you still believe in.",
  },
  {
    character: "Page",
    dialogue: "But my advice remains the same: do not approach the mountain.",
  },
];

export const chatPageDialogues: DialogueSingle[][] = [
  Greeting,
  AboutMCHuntingSkill,
  AboutAshesOfKnowledge,
  PageHiddenAttitude,
  PageMountainWarning,
];
