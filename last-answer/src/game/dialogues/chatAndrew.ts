import { DialogueSingle } from "@/components/game/DialogueScene";
import { defaultPlayer, getMCStore } from "@/store/mcStore";

const getPlayerName = () => {
  const player = getMCStore().getState().readPlayer();
  return player.name || defaultPlayer.name;
};

const Greeting: DialogueSingle[] = [
  {
    character: "Andrew",
    dialogue: "Good to see you again, my friend.",
  },
  {
    character: "Andrew",
    dialogue:
      "I still miss the old days, you know. You working in this tavern, playing your lute, singing for the guests... and reading the little scripts I wrote between songs.",
  },
  {
    character: "Andrew",
    dialogue:
      "For a while, this place almost felt untouched by the world outside.",
  },
];

const AboutMonsters: DialogueSingle[] = [
  {
    character: "Andrew",
    dialogue: "Be careful when you travel beyond the walls.",
  },
  {
    character: getPlayerName(),
    dialogue: "The knowledge fragments?",
  },
  {
    character: "Andrew",
    dialogue: "Yes. People call them monsters, but that word is too simple.",
  },
  {
    character: "Andrew",
    dialogue:
      "They do not merely kill. They reach into the mind. They take memory, judgment, fear, desire... everything that makes a person themselves.",
  },
  {
    character: "Andrew",
    dialogue:
      "Those who survive are sometimes worse than dead. Empty-eyed. Obedient. Innocent, in the most terrible way.",
  },
  {
    character: getPlayerName(),
    dialogue: "Then I will avoid them when I can.",
  },
  {
    character: "Andrew",
    dialogue: "Good. Bravery is useful. Carelessness is not.",
  },
];

const AboutSecondKing: DialogueSingle[] = [
  {
    character: "Andrew",
    dialogue: "Many people now say they miss the days of the Second King.",
  },
  {
    character: getPlayerName(),
    dialogue: "Because life was safer then?",
  },
  {
    character: "Andrew",
    dialogue: "Safer, richer, quieter. Yes.",
  },
  {
    character: "Andrew",
    dialogue:
      "But silence has a price. In those days, people could not criticize the government. They could not question the Precursors. They could not speak freely about the Monolith.",
  },
  {
    character: "Andrew",
    dialogue: "Many were arrested. Some never returned.",
  },
  {
    character: getPlayerName(),
    dialogue: "And now?",
  },
  {
    character: "Andrew",
    dialogue: "Now most of those prisoners are free.",
  },
  {
    character: "Andrew",
    dialogue:
      "And many of them have joined the Aldren Liberators, fighting against the Third King - the very king who opened their prison doors.",
  },
  {
    character: "Andrew",
    dialogue:
      "A tragic joke, is it not? Freedom gave them the chance to hate the man who freed them.",
  },
];

const AboutThirdKing: DialogueSingle[] = [
  {
    character: getPlayerName(),
    dialogue: "What do you think about the Third King?",
  },
  {
    character: "Andrew",
    dialogue: "I think he is a good man placed in an impossible age.",
  },
  {
    character: "Andrew",
    dialogue:
      "He allowed people to criticize the government. He cancelled many old privileges of the Precursors. He tried to make the law fairer.",
  },
  {
    character: getPlayerName(),
    dialogue: "And that caused the civil war.",
  },
  {
    character: "Andrew",
    dialogue:
      "It helped ignite it, yes. Many Precursor nobles would rather burn the country than lose their special status.",
  },
  {
    character: "Andrew",
    dialogue: "But the bitter part is this: many Aldrens oppose him too.",
  },
  {
    character: getPlayerName(),
    dialogue: "Because they only see the chaos.",
  },
  {
    character: "Andrew",
    dialogue:
      "Exactly. Unsafe roads. broken markets. rebel attacks. hungry families. They blame the king because he is the face of the present.",
  },
  {
    character: "Andrew",
    dialogue:
      "They do not understand that he inherited a rotten house, and the beams are breaking while he tries to repair it.",
  },
];

const AboutGreatSilence: DialogueSingle[] = [
  {
    character: "Andrew",
    dialogue: "The Great Silence came without warning.",
  },
  {
    character: getPlayerName(),
    dialogue: "Nobody was prepared.",
  },
  {
    character: "Andrew",
    dialogue: "No. One day the Monolith spoke. The next day, it did not.",
  },
  {
    character: "Andrew",
    dialogue:
      "Many people could not bear it. They had lived their whole lives with its guidance. When that voice vanished, something inside them collapsed.",
  },
  {
    character: getPlayerName(),
    dialogue: "They became mindless.",
  },
  {
    character: "Andrew",
    dialogue: "Some did. Others fled and recovered.",
  },
  {
    character: getPlayerName(),
    dialogue: "Why them?",
  },
  {
    character: "Andrew",
    dialogue: "I have thought about that often.",
  },
  {
    character: "Andrew",
    dialogue:
      "I believe the people who recovered were those who had already learned to think without the Monolith. Doubters. readers. wanderers. stubborn fools. Independent minds.",
  },
  {
    character: "Andrew",
    dialogue:
      "They relied less on its voice, so when the voice disappeared, they still had something left inside themselves.",
  },
  {
    character: "Andrew",
    dialogue: "However, elders are not so lucky.",
  },
  {
    character: "Andrew",
    dialogue:
      "Most of them grew up under its shadow. They obeyed it for too long. Independence is harder to learn when obedience has become a habit.",
  },
];

const AboutMCLeavingGovernmentWork: DialogueSingle[] = [
  {
    character: "Andrew",
    dialogue:
      "Tell me honestly. Do you regret resigning from government service?",
  },
  {
    character: getPlayerName(),
    dialogue: "No.",
  },
  {
    character: "Andrew",
    dialogue:
      "Even now? Seekers have less and less proper work. Most hunting is done by the hunters. Many seekers sit around all day, lazy and useless, but still receive their fixed salary every month.",
  },
  {
    character: getPlayerName(),
    dialogue: "That is exactly why I left.",
  },
  {
    character: "Andrew",
    dialogue: "Because of the officers?",
  },
  {
    character: getPlayerName(),
    dialogue: "Because of one officer in particular.",
  },
  {
    character: getPlayerName(),
    dialogue:
      "He kept forcing fresh recruits into dangerous tasks. He knew nothing about the field, but acted as if every life under him was replaceable.",
  },
  {
    character: getPlayerName(),
    dialogue:
      "I could not stand someone so irresponsible. He did not understand danger, and he did not respect the people who faced it.",
  },
  {
    character: "Andrew",
    dialogue: "So you would make the same choice again?",
  },
  {
    character: getPlayerName(),
    dialogue: "Yes.",
  },
  {
    character: getPlayerName(),
    dialogue:
      "My life now is not easy, but it is mine. I earn more than before, and I work with people I can trust.",
  },
  {
    character: "Andrew",
    dialogue: "Good.",
  },
  {
    character: getPlayerName(),
    dialogue: "Good?",
  },
  {
    character: "Andrew",
    dialogue: "Yes. I am glad to see you recovering.",
  },
  {
    character: "Andrew",
    dialogue:
      "A man who leaves a cage often spends a long time wondering whether the cage was shelter. It is good that you no longer think so.",
  },
];

export const chatAndrewDialogues: DialogueSingle[][] = [
  Greeting,
  AboutMonsters,
  AboutSecondKing,
  AboutThirdKing,
  AboutGreatSilence,
  AboutMCLeavingGovernmentWork,
];
