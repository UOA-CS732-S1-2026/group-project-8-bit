import { DialogueSingle } from "@/components/game/DialogueScene";
import { defaultPlayer, getMCStore } from "@/store/mcStore";

const getPlayerName = () => {
  const player = getMCStore().getState().readPlayer();
  return player.name || defaultPlayer.name;
};

export const beforeStart = (): DialogueSingle[] => {
  const playerName = getPlayerName();

  return [
    {
      character: playerName,
      dialogue: "Have you heard? Page has disappeared.",
    },
    {
      character: "Andrew",
      dialogue:
        "I have. He vanished after stealing the Ashes of Knowledge gathered by hunters and seekers. The Empire wants him badly now.",
    },
    {
      character: playerName,
      dialogue:
        "That much anger over stolen ashes? He must have taken something important.",
    },
    {
      character: "Andrew",
      dialogue:
        "Interesting, isn't it? Men are not hunted that fiercely unless they touch something the Empire truly fears losing.",
    },
    {
      character: playerName,
      dialogue:
        "I am interested in those ashes. I worked hard to gather them. I want to find where they went.",
    },
    {
      character: "Andrew",
      dialogue: "Then you are either determined or foolish. Perhaps both.",
    },
    {
      character: playerName,
      dialogue: "Do you know where to start?",
    },
    {
      character: "Andrew",
      dialogue:
        "I have a clue. But it leads somewhere dangerous. If you follow it too early, you will die before you learn anything.",
    },
    {
      character: playerName,
      dialogue: "Then tell me what I need.",
    },
    {
      character: "Andrew",
      dialogue:
        "Strength. When you are strong enough, come back to me. Then I will show you where to begin.",
    },
  ];
};

export const startChasing = (): DialogueSingle[] => {
  const playerName = getPlayerName();

  return [
    {
      character: playerName,
      dialogue: "Andrew, do you have any clue where Page might have gone?",
    },
    {
      character: "Andrew",
      dialogue:
        "Maybe. There has been a rumor for about a year now. Near the mountain, a group of seekers was attacked by an unusually large number of knowledge fragments.",
    },
    {
      character: playerName,
      dialogue: "That many? In one place?",
    },
    {
      character: "Andrew",
      dialogue:
        "Yes. After that, the area around the mountain was declared forbidden. No one is supposed to go near it now.",
    },
    {
      character: playerName,
      dialogue:
        "That is strange. Knowledge fragments do not usually gather like that... not unless something is drawing them.",
    },
    {
      character: "Andrew",
      dialogue: "My thought exactly.",
    },
    {
      character: playerName,
      dialogue: "You think they were attracted by something in the mountain?",
    },
    {
      character: "Andrew",
      dialogue: "Perhaps. Something like a large store of Ashes of Knowledge.",
    },
    {
      character: playerName,
      dialogue: "...Page's stolen ashes.",
    },
    {
      character: "Andrew",
      dialogue: "It would explain a great deal.",
    },
    {
      character: playerName,
      dialogue: "It is dangerous, but your guess makes sense.",
    },
    {
      character: "Andrew",
      dialogue: "Then we have our first lead.",
    },
    {
      character: playerName,
      dialogue: "So we investigate the mountain.",
    },
    {
      character: "Andrew",
      dialogue: "Carefully. If Page is there, we will need more than luck.",
    },
  ];
};

export const forestSearch = (): DialogueSingle[] => {
  const playerName = getPlayerName();

  return [
    {
      character: null,
      dialogue: "By dawn, the plan was set.",
    },
    {
      character: null,
      dialogue:
        "The mountain lay beyond a wide belt of forest, cut through by old hunter trails and half-swallowed roads. If Page had hidden the stolen ashes anywhere, it would be in a place difficult to reach and easy to guard.",
    },
    {
      character: null,
      dialogue: "Andrew came prepared.",
    },
    {
      character: null,
      dialogue: `He handed the ${playerName} a dark coat the color of wet bark, then produced a pair of small metal tokens, each marked with the same faintly carved symbol.`,
    },
    {
      character: playerName,
      dialogue: "What are these?",
    },
    {
      character: "Andrew",
      dialogue:
        "A matched pair. Blood-bound. If one of us is cornered, we cut a finger, feed the token a drop, and trigger it. The other will feel it at once.",
    },
    {
      character: playerName,
      dialogue: "A warning charm.",
    },
    {
      character: "Andrew",
      dialogue:
        "A crude one. But better than shouting in a forest full of knowledge fragments.",
    },
    {
      character: playerName,
      dialogue: "You planned this quickly.",
    },
    {
      character: "Andrew",
      dialogue: "No. I planned for danger. That is different.",
    },
    {
      character: null,
      dialogue:
        "They entered the forest under a grey sky, moving in silence beneath dripping branches and cold morning mist. The closer they drew to the mountain, the stranger the woods became.",
    },
    {
      character: null,
      dialogue: "There were more knowledge fragments.",
    },
    {
      character: null,
      dialogue: "Not scattered. Not wandering alone.",
    },
    {
      character: null,
      dialogue: "Clustered.",
    },
    {
      character: null,
      dialogue: "Watching.",
    },
    {
      character: null,
      dialogue: "Drifting through the trees in growing numbers.",
    },
    {
      character: playerName,
      dialogue: "There are too many.",
    },
    {
      character: "Andrew",
      dialogue: "Yes.",
    },
    {
      character: playerName,
      dialogue:
        "Your guess was right. The closer we get, the more of them we see.",
    },
    {
      character: "Andrew",
      dialogue: "Which means we stop searching blindly.",
    },
    {
      character: playerName,
      dialogue: "And follow the fragments.",
    },
    {
      character: "Andrew",
      dialogue: "Not them. Their pattern.",
    },
    {
      character: playerName,
      dialogue: "The direction they gather.",
    },
    {
      character: "Andrew",
      dialogue: "Exactly.",
    },
  ];
};

export const foundCave = (): DialogueSingle[] => {
  const playerName = getPlayerName();

  return [
    {
      character: null,
      dialogue:
        "So they changed course, following the densest pockets of fragment activity while keeping low and moving carefully between roots, stones, and wet brush.",
    },
    {
      character: null,
      dialogue:
        "The forest thickened around the mountain slope. Mist clung to the ground. The air felt wrong, heavy, as though something hidden beneath the trees was pulling at the fragments like iron toward a magnet.",
    },
    {
      character: null,
      dialogue: "At last, they found it.",
    },
    {
      character: null,
      dialogue:
        "A cave mouth, half-concealed behind roots and stone, buried deep in the forest.",
    },
    {
      character: null,
      dialogue: "And around it, death.",
    },
    {
      character: null,
      dialogue:
        "Thin wires hidden in the brush. Stakes worked into the ground. Cut marks in stone. Clever traps blended into roots and mud.",
    },
    {
      character: playerName,
      dialogue: "A hiding place.",
    },
    {
      character: "Andrew",
      dialogue: "And a well-defended one.",
    },
    {
      character: playerName,
      dialogue: "You think it is Page's?",
    },
    {
      character: "Andrew",
      dialogue: "I would wager on it.",
    },
    {
      character: playerName,
      dialogue: "Can we get inside?",
    },
    {
      character: "Andrew",
      dialogue: "Not safely.",
    },
    {
      character: playerName,
      dialogue: "So what now?",
    },
    {
      character: "Andrew",
      dialogue: "We wait.",
    },
    {
      character: playerName,
      dialogue: "Wait for Page?",
    },
    {
      character: "Andrew",
      dialogue:
        "If this is his refuge, he will come back to it sooner or later.",
    },
    {
      character: playerName,
      dialogue: "And if he does?",
    },
    {
      character: "Andrew",
      dialogue: "Then one of us follows. The other is warned with the token.",
    },
    {
      character: playerName,
      dialogue: "And until then?",
    },
    {
      character: "Andrew",
      dialogue:
        "We watch the cave in turns. No fires. No wasted movement. No mistakes.",
    },
    {
      character: playerName,
      dialogue: "That could take days.",
    },
    {
      character: "Andrew",
      dialogue: "Then let us hope Page is in a hurry.",
    },
    {
      character: null,
      dialogue:
        "They chose hidden positions overlooking the cave approach, far enough to avoid the traps, close enough to watch the entrance.",
    },
    {
      character: null,
      dialogue: "From there, the hunt changed.",
    },
    {
      character: null,
      dialogue: "No longer a search.",
    },
    {
      character: null,
      dialogue: "A vigil.",
    },
    {
      character: null,
      dialogue:
        "The mountain, the cave, the drifting fragments, and the waiting silence between them.",
    },
    {
      character: null,
      dialogue: "They did not dare approach the cave.",
    },
    {
      character: null,
      dialogue: `The traps around it were too many, too well hidden, and the knowledge fragments drifting through the trees made every careless step a gamble. So Andrew and the ${playerName} chose patience instead.`,
    },
    {
      character: null,
      dialogue:
        "They built a small hidden camp deeper in the forest, far enough from the cave to stay out of immediate danger.",
    },
    {
      character: null,
      dialogue: "One watched.",
    },
    {
      character: null,
      dialogue: "One rested.",
    },
    {
      character: null,
      dialogue: "Every twelve hours, they changed places.",
    },
    {
      character: "Andrew",
      dialogue:
        "No heroics. We keep the cave in sight, we stay hidden, and we wait.",
    },
    {
      character: playerName,
      dialogue: "And if Page returns?",
    },
    {
      character: "Andrew",
      dialogue:
        "Then the one on watch signals with the token. The other comes at once.",
    },
    {
      character: playerName,
      dialogue: "Simple enough.",
    },
    {
      character: "Andrew",
      dialogue: "The plan is simple. The waiting is not.",
    },
    {
      character: null,
      dialogue: "The first day passed in silence.",
    },
    {
      character: null,
      dialogue: "Then the second.",
    },
    {
      character: null,
      dialogue:
        "The forest never truly slept. Wind moved through the branches. Mist clung to the roots. Pale shapes drifted between the trees, always wandering, always searching.",
    },
    {
      character: null,
      dialogue: "On the third day, the forest tested them.",
    },
    {
      character: null,
      dialogue:
        "A pair of knowledge fragments found one of their hiding positions. The fight was brief and ugly. Steel, breath, wet leaves, and torn paper in the dark. They killed the creatures quickly, before the noise could draw more.",
    },
    {
      character: null,
      dialogue: "Then they moved.",
    },
    {
      character: null,
      dialogue: "The next day, it happened again.",
    },
    {
      character: null,
      dialogue:
        "Another hiding place lost. More time wasted. More nerves worn thin.",
    },
    {
      character: playerName,
      dialogue: "This is getting worse.",
    },
    {
      character: "Andrew",
      dialogue: "No. We are simply feeling the cost of patience.",
    },
    {
      character: playerName,
      dialogue: "We have been here for days.",
    },
    {
      character: "Andrew",
      dialogue: "And if we leave too early, all of it is wasted.",
    },
    {
      character: playerName,
      dialogue: "If Page even uses this place.",
    },
    {
      character: "Andrew",
      dialogue: "He does. I would stake more than coin on it.",
    },
    {
      character: null,
      dialogue: "By the fourth day, both of them were exhausted.",
    },
    {
      character: null,
      dialogue:
        "Their sleep came in scraps. Their tempers grew short. Every sound in the forest felt sharper than it should have. Even waiting began to feel like a kind of defeat.",
    },
    {
      character: null,
      dialogue: "That night, at the hidden camp, they made a decision.",
    },
    {
      character: playerName,
      dialogue: "How much longer?",
    },
    {
      character: "Andrew",
      dialogue: "Two more days.",
    },
    {
      character: playerName,
      dialogue: "And if he still does not come?",
    },
    {
      character: "Andrew",
      dialogue:
        "Then we return to the tavern, rethink the trail, and come back better prepared.",
    },
    {
      character: playerName,
      dialogue: "So this is our limit.",
    },
    {
      character: "Andrew",
      dialogue:
        "It is the limit of our patience. Let us hope Page respects it more than we do.",
    },
  ];
};

export const pageAppear = (): DialogueSingle[] => {
  const playerName = getPlayerName();

  return [
    {
      character: null,
      dialogue: "Rain came on the fifth day.",
    },
    {
      character: null,
      dialogue:
        "At first it was only a thin mist, barely more than a dampening of the air. By midday it had thickened into a steady cold rain that soaked cloak, earth, and bark alike.",
    },
    {
      character: null,
      dialogue: `The ${playerName} kept the watch while Andrew rested back at camp.`,
    },
    {
      character: null,
      dialogue:
        "The cave mouth lay ahead through curtains of wet branches and drifting fog.",
    },
    {
      character: null,
      dialogue: "For hours, nothing moved.",
    },
    {
      character: null,
      dialogue: "Then someone came through the trees.",
    },
    {
      character: null,
      dialogue: "Page.",
    },
    {
      character: null,
      dialogue:
        "He emerged from the rain-dark forest like a shadow returning to its proper place, moving without hesitation toward the hidden cave.",
    },
    {
      character: null,
      dialogue: `The ${playerName}'s grip tightened around the token.`,
    },
    {
      character: `${playerName} (thought)`,
      dialogue: "So Andrew was right.",
    },
  ];
};

export const monstersCave = (): DialogueSingle[] => {
  const playerName = getPlayerName();

  return [
    {
      character: null,
      dialogue:
        "He pressed the edge of the token into his palm, drew blood, and triggered the warning.",
    },
    {
      character: null,
      dialogue: "Somewhere beyond the trees, Andrew would feel it.",
    },
    {
      character: null,
      dialogue: "Page was here.",
    },
    {
      character: null,
      dialogue: `But before the ${playerName} could move, another danger drifted near.`,
    },
    {
      character: null,
      dialogue: "Knowledge fragments.",
    },
    {
      character: null,
      dialogue: "One.",
    },
    {
      character: null,
      dialogue: "Then two.",
    },
    {
      character: null,
      dialogue:
        "Then more pale shapes moving between the rain and roots, wandering too close to his hiding place.",
    },
    {
      character: null,
      dialogue: `The ${playerName} froze.`,
    },
    {
      character: null,
      dialogue:
        "His pulse pounded in his ears. Sweat clung cold beneath his wet clothes. He did not dare breathe too deeply, did not dare shift his weight, did not dare blink for long.",
    },
    {
      character: null,
      dialogue: "The fragments came closer.",
    },
    {
      character: null,
      dialogue: "Too close.",
    },
    {
      character: `${playerName} (thought)`,
      dialogue: "Not now... not now...",
    },
    {
      character: null,
      dialogue:
        "One of the creatures drifted past a broken stump only a few steps away. Another turned slightly, its glowing eye lingering in his direction.",
    },
    {
      character: null,
      dialogue: "The pressure tightened around his chest.",
    },
    {
      character: null,
      dialogue: "If one of them noticed him, the others would follow.",
    },
    {
      character: null,
      dialogue: "Then the whole watch would collapse.",
    },
    {
      character: null,
      dialogue: "Then, suddenly...",
    },
    {
      character: null,
      dialogue: "A sharp crack split the rain somewhere deeper in the forest.",
    },
    {
      character: null,
      dialogue: "Then another.",
    },
    {
      character: null,
      dialogue: "A strange snapping burst, loud and deliberate.",
    },
    {
      character: null,
      dialogue: "The fragments turned at once.",
    },
    {
      character: null,
      dialogue: "Near the cave, Page lowered his hand.",
    },
    {
      character: null,
      dialogue: "He had thrown firecrackers into the distant brush.",
    },
    {
      character: `${playerName} (thought)`,
      dialogue: "He came prepared.",
    },
    {
      character: null,
      dialogue:
        "The knowledge fragments drifted toward the noise, drawn away from the cave approach.",
    },
    {
      character: null,
      dialogue: `The pressure around the ${playerName} broke just enough for breath to return.`,
    },
    {
      character: null,
      dialogue: "Page wasted no time.",
    },
    {
      character: null,
      dialogue:
        "He knelt near the cave entrance and began working through the hidden defenses with practiced hands-finding catches beneath roots, disarming mechanisms buried in mud and stone, shutting down the traps one by one.",
    },
    {
      character: null,
      dialogue: "This was no guesswork.",
    },
    {
      character: null,
      dialogue: "He knew the place.",
    },
    {
      character: null,
      dialogue: "He had done this before.",
    },
    {
      character: null,
      dialogue:
        "At last the final mechanism clicked into place, and the concealed entrance gave way.",
    },
    {
      character: null,
      dialogue: "The cave opened.",
    },
    {
      character: null,
      dialogue: "Darkness waited within.",
    },
    {
      character: null,
      dialogue: "Page stepped forward, ready to disappear inside.",
    },
    {
      character: null,
      dialogue: `And the ${playerName} moved.`,
    },
  ];
};

export const confrontPage = (): DialogueSingle[] => {
  const playerName = getPlayerName();

  return [
    {
      character: playerName,
      dialogue: "Page!",
    },
    {
      character: null,
      dialogue:
        "He burst from cover and charged down the slope through the rain, sword in hand, before Page could vanish into the cave.",
    },
  ];
};

export const hiddenTruth = (): DialogueSingle[] => {
  const playerName = getPlayerName();

  return [
    {
      character: null,
      dialogue:
        "Rainwater ran down the stones before the cave mouth. Page had fallen to one knee, wounded and breathing hard, one hand pressed against his side. The fight was over.",
    },
    {
      character: null,
      dialogue: "For a moment, only the rain spoke.",
    },
    {
      character: null,
      dialogue: "Then Page looked up.",
    },
    {
      character: null,
      dialogue: "Not angry.",
    },
    {
      character: null,
      dialogue: "Not afraid.",
    },
    {
      character: null,
      dialogue: "Calculating.",
    },
    {
      character: "Page",
      dialogue: "Wait... wait. Do not kill me.",
    },
    {
      character: playerName,
      dialogue: "You have one reason left to speak.",
    },
    {
      character: "Page",
      dialogue: "Because I am not your enemy. Not truly.",
    },
    {
      character: playerName,
      dialogue:
        "You stole the ashes, vanished, and led us here through traps and monsters. Start explaining.",
    },
    {
      character: "Page",
      dialogue: "I did it for the Aldren Liberators.",
    },
    {
      character: playerName,
      dialogue: "For them?",
    },
    {
      character: "Page",
      dialogue:
        "Yes. You think the Empire wants me for theft alone? No. They want me because I learned something I was never meant to see.",
    },
    {
      character: null,
      dialogue: "The rain seemed colder.",
    },
    {
      character: null,
      dialogue:
        "Page laughed weakly, then lifted his head, his eyes bright with a strange, ugly excitement.",
    },
    {
      character: "Page",
      dialogue:
        "Last month, I entered the palace archives. I found an old book hidden among sealed records. Not a holy text. Not a royal chronicle. Something older.",
    },
    {
      character: playerName,
      dialogue: "What was in it?",
    },
    {
      character: "Page",
      dialogue: "The truth.",
    },
    {
      character: playerName,
      dialogue: "Speak plainly.",
    },
    {
      character: "Page",
      dialogue: "The Precursors are not descendants of God.",
    },
    {
      character: playerName,
      dialogue: "...What?",
    },
    {
      character: "Page",
      dialogue:
        "They came from another continent. They crossed the sea, came here as strangers, conquered Aldren, and built this empire on that conquest.",
    },
    {
      character: playerName,
      dialogue: "No...",
    },
    {
      character: "Page",
      dialogue:
        "Yes. And the First Monolith? It was never a divine gift. They built it to control Aldrens. To guide them. To watch them. To make obedience feel sacred.",
    },
    {
      character: playerName,
      dialogue: "That cannot be true.",
    },
    {
      character: "Page",
      dialogue:
        "And the religion? Another tool. A lie wrapped in ceremony, made to keep Aldrens kneeling before foreign masters.",
    },
    {
      character: null,
      dialogue: "The words struck harder than the battle.",
    },
    {
      character: null,
      dialogue: `The First Monolith. The Empire. The faith that had shaped every road, every law, every prayer the ${playerName} had ever known.`,
    },
    {
      character: null,
      dialogue: "For a moment, the world felt unstable beneath his feet.",
    },
    {
      character: playerName,
      dialogue: "If this is true...",
    },
    {
      character: "Page",
      dialogue: "It is.",
    },
    {
      character: playerName,
      dialogue: "Then everything...",
    },
    {
      character: "Page",
      dialogue: "...was built on a lie. Yes.",
    },
    {
      character: playerName,
      dialogue: "Why tell me this now?",
    },
    {
      character: "Page",
      dialogue: "Because you deserve to know what sort of world you bleed for.",
    },
    {
      character: null,
      dialogue: `The ${playerName} hesitated.`,
    },
    {
      character: null,
      dialogue: "Just for an instant.",
    },
    {
      character: null,
      dialogue: "And Page moved.",
    },
    {
      character: null,
      dialogue:
        "With a burst of desperate speed, he lunged from the ground and struck.",
    },
  ];
};

export const trick = (): DialogueSingle[] => {
  const playerName = getPlayerName();

  return [
    {
      character: playerName,
      dialogue: "...",
    },
    {
      character: null,
      dialogue: `The blow came fast and dirty, meant for confusion, not honor. The ${playerName} staggered back, pain flaring through his side.`,
    },
    {
      character: null,
      dialogue: "Shock hurt almost as much as the wound.",
    },
    {
      character: playerName,
      dialogue: "You... Why? Why attack me now? We are both Aldren!",
    },
    {
      character: "Page",
      dialogue: "Aldren?",
    },
    {
      character: null,
      dialogue: "Page's face twisted into a smug, bitter grin.",
    },
    {
      character: "Page",
      dialogue:
        "Do you still not understand? I do not care about Aldren liberty.",
    },
    {
      character: playerName,
      dialogue: "What?",
    },
    {
      character: "Page",
      dialogue:
        "The Liberators, the Empire, the priests, the lords... they are all tools if used properly. I care about profit. Survival. Advantage.",
    },
    {
      character: playerName,
      dialogue: "Then all that talk...",
    },
    {
      character: "Page",
      dialogue: "Was useful.",
    },
    {
      character: playerName,
      dialogue: "You filthy...",
    },
    {
      character: "Page",
      dialogue:
        "Do not look so wounded. If your death buys me time, then your sacrifice may still benefit both my future... and Aldren's. More than you ever will alive.",
    },
    {
      character: null,
      dialogue: "He raised his weapon again.",
    },
    {
      character: null,
      dialogue: "But before he could strike...",
    },
    {
      character: null,
      dialogue: "A shadow moved through the rain.",
    },
    {
      character: null,
      dialogue: "Steel flashed.",
    },
    {
      character: null,
      dialogue: "Andrew.",
    },
    {
      character: null,
      dialogue:
        "He came in from the forest side and hit Page hard enough to throw him off balance.",
    },
  ];
};

export const endQuest = (): DialogueSingle[] => {
  const playerName = getPlayerName();

  return [
    {
      character: "Andrew",
      dialogue: "Get away from him.",
    },
    {
      character: "Page",
      dialogue: "You...",
    },
    {
      character: null,
      dialogue:
        "Page barely managed to turn before Andrew's second blow drove him back toward the open cave mouth.",
    },
    {
      character: null,
      dialogue:
        "The rain, the mud, the roots, the darkness behind him-everything closed in at once.",
    },
    {
      character: null,
      dialogue: `The ${playerName} tried to steady himself, but the wound and the shock had drained the strength from his legs.`,
    },
    {
      character: null,
      dialogue: "Andrew glanced back only once.",
    },
    {
      character: "Andrew",
      dialogue: "Can you stand?",
    },
    {
      character: playerName,
      dialogue: "...Barely.",
    },
    {
      character: "Andrew",
      dialogue: "Then do not waste what is left. Move.",
    },
    {
      character: playerName,
      dialogue: "Page...",
    },
    {
      character: "Andrew",
      dialogue: "Later. If there is a later.",
    },
    {
      character: null,
      dialogue:
        "The journey back blurred into fragments of rain, pain, and broken steps. Andrew half-led, half-dragged the MC through the forest until the mountain was behind them and the trees began to thin. By the time they reached the city, night had deepened.",
    },
    {
      character: null,
      dialogue:
        "The tavern was quiet when they entered through the back. Andrew shut the door, barred it, and helped the MC into a chair near the hearth. For a long moment, neither of them spoke. Recovery would take time.",
    },
  ];
};

export const theEndPre = (): DialogueSingle[] => {
  const playerName = getPlayerName();

  return [
    {
      character: null,
      dialogue: `After resting, the ${playerName} was led through a narrow passage behind the tavern hall and into a small hidden room. It was quiet there. No voices from the common floor. No footsteps beyond the wall. Only the low glow of candlelight and the smell of old wood, ash, and dust.`,
    },
    {
      character: null,
      dialogue:
        "Andrew closed the door behind them and set several objects on the table. A small bag of Ashes of Knowledge. An old book, worn with age. And a rusty key.",
    },
    {
      character: null,
      dialogue: `The ${playerName} stared at them in silence for a moment.`,
    },
    {
      character: playerName,
      dialogue: "So... this is what you brought back?",
    },
    {
      character: "Andrew",
      dialogue: "What was left of it, yes.",
    },
    {
      character: playerName,
      dialogue: "Page?",
    },
    {
      character: "Andrew",
      dialogue: "Dead.",
    },
    {
      character: playerName,
      dialogue: "You killed him?",
    },
    {
      character: "Andrew",
      dialogue:
        "No. The knowledge fragments found him before he got far. The forest finished what we began.",
    },
    {
      character: playerName,
      dialogue: "And these?",
    },
    {
      character: "Andrew",
      dialogue:
        "I searched his body and found the book. Back in the cave, I found more ashes than I expected. The key was hidden inside the book, in an inner compartment.",
    },
    {
      character: playerName,
      dialogue: "A hidden compartment?",
    },
    {
      character: "Andrew",
      dialogue:
        "Page either never found it... or never understood what it meant.",
    },
    {
      character: null,
      dialogue: `The ${playerName} reached for the book and opened it carefully. The pages were brittle, the writing old but still legible.`,
    },
    {
      character: null,
      dialogue:
        "He read in silence at first. Then more slowly. Then with growing disbelief.",
    },
    {
      character: null,
      dialogue:
        "The book was not a prayer text, nor a royal chronicle. It was a record of the Precursors.",
    },
    {
      character: null,
      dialogue:
        "It told of a people who had come from another continent, bringing with them knowledge, tools, and a civilization far beyond anything the natives of this land had known.",
    },
    {
      character: null,
      dialogue:
        "Here, they found tribes still living in what the author described as a crude stone age. The natives called themselves Aldrens. So the Precursors conquered them. They founded a kingdom.",
    },
    {
      character: null,
      dialogue:
        'And to better govern the land, they built the First Monolith. It was meant to guide the Aldrens - telling them what to do, what not to do, and how to live what the author called a "civilized life."',
    },
    {
      character: null,
      dialogue:
        "But the Monolith failed in its first year. It collapsed into disorder. To save it, many Precursors offered up parts of their own knowledge to repair the system. For a time, the repair held.",
    },
    {
      character: null,
      dialogue:
        "The Monolith worked for five years. Then the first king died. And the Monolith fell out of control again.",
    },
    {
      character: null,
      dialogue:
        "That was when Owen, builder of the First Monolith, gathered Precursor warriors and went down to the source itself. There, they fought and defeated the contaminated core.",
    },
    {
      character: null,
      dialogue:
        "Afterward, Owen changed the source. He made it capable of learning by itself. This time, the repair succeeded.",
    },
    {
      character: null,
      dialogue:
        "The Monolith did more than enforce order. It watched the Aldrens, corrected their minds, pushed them into cities, and shaped them into the people the Precursors wanted them to become.",
    },
    {
      character: null,
      dialogue:
        "But the book did not celebrate this victory. Its tone changed. The author warned that many Precursors had begun adding their own selfish desires into the source - ambition, fear, pride, hunger for control. The system was no longer pure.",
    },
    {
      character: null,
      dialogue: "And if that continued, it might one day lose control again.",
    },
    {
      character: playerName,
      dialogue: "...This changes everything.",
    },
    {
      character: "Andrew",
      dialogue: "Yes.",
    },
    {
      character: playerName,
      dialogue:
        "The Monolith was never divine. It was built. Shaped. Broken. Repaired.",
    },
    {
      character: "Andrew",
      dialogue: "And used.",
    },
    {
      character: playerName,
      dialogue:
        "Then the corruption we see now... it is not new. It is the same sickness returning.",
    },
    {
      character: "Andrew",
      dialogue: "Or perhaps the old sickness finally ripening.",
    },
    {
      character: null,
      dialogue: `The ${playerName} turned more pages, but soon the record thinned. Then stopped. Abruptly.`,
    },
    {
      character: playerName,
      dialogue: "That is all?",
    },
    {
      character: "Andrew",
      dialogue: "What do you mean?",
    },
    {
      character: playerName,
      dialogue:
        "The book ends too early. There is nothing here about the second king. Nothing about the third.",
    },
    {
      character: "Andrew",
      dialogue: "Then Owen never lived to write more.",
    },
    {
      character: playerName,
      dialogue:
        "Or whoever kept this record did not survive long after the repair.",
    },
    {
      character: "Andrew",
      dialogue: "Either way, the silence tells its own story.",
    },
    {
      character: playerName,
      dialogue:
        "If the source has been corrupted again... then there is only one answer, is there not?",
    },
    {
      character: "Andrew",
      dialogue: "Say it.",
    },
    {
      character: playerName,
      dialogue:
        "We have to enter the source of the First Monolith. And destroy the dark part of the core, just as Owen did before.",
    },
    {
      character: "Andrew",
      dialogue: "That is my conclusion as well.",
    },
    {
      character: playerName,
      dialogue: "Then the real question is simple. How do we get there?",
    },
    {
      character: null,
      dialogue: "Andrew's eyes shifted to the key on the table.",
    },
    {
      character: "Andrew",
      dialogue: "That part, I may know.",
    },
    {
      character: playerName,
      dialogue: "You do?",
    },
    {
      character: "Andrew",
      dialogue:
        "Years ago, I heard a Precursor noble speak of an abandoned ruin. A sealed place tied to the Monolith's deeper workings. He said the path could not be opened without a magic key.",
    },
    {
      character: playerName,
      dialogue: "You think this is it?",
    },
    {
      character: "Andrew",
      dialogue:
        "I do. Why else hide it inside this book? Owen must have known that one day someone might need to walk the same road again.",
    },
    {
      character: playerName,
      dialogue: "You think he left it there for another savior.",
    },
    {
      character: "Andrew",
      dialogue: "Or for anyone desperate enough to try.",
    },
    {
      character: playerName,
      dialogue: "It just looks like old iron.",
    },
    {
      character: "Andrew",
      dialogue: "Because it is dead.",
    },
    {
      character: playerName,
      dialogue: "Dead?",
    },
    {
      character: "Andrew",
      dialogue:
        "Magic tools wear down. Sleep. Crack. Fade. But they can be restored.",
    },
    {
      character: playerName,
      dialogue: "And you know how?",
    },
    {
      character: "Andrew",
      dialogue:
        "I have read enough old things to learn what should not be remembered. Ashes of Knowledge can be used to refresh a key like this.",
    },
    {
      character: playerName,
      dialogue: "So that is why you kept the ashes from the cave.",
    },
    {
      character: "Andrew",
      dialogue:
        "Yes. With enough of them, I may be able to awaken the key again.",
    },
    {
      character: playerName,
      dialogue: "Then do it.",
    },
    {
      character: "Andrew",
      dialogue: "I will.",
    },
    {
      character: playerName,
      dialogue: "And when the key is restored?",
    },
    {
      character: "Andrew",
      dialogue:
        "Then we go to the ruin. Then we open the way. Then we see whether Owen's path still exists.",
    },
    {
      character: playerName,
      dialogue: "And if it does?",
    },
    {
      character: "Andrew",
      dialogue:
        "Then you will walk into the source of the First Monolith... and perhaps never return.",
    },
    {
      character: null,
      dialogue: `Andrew rested one hand on the old book and looked at the ${playerName} steadily across the candlelit table.`,
    },
    {
      character: "Andrew",
      dialogue:
        "Do not mistake this for another hunt. What lies ahead is worse than Page. Worse than the cave. Worse than the forest.",
    },
    {
      character: playerName,
      dialogue: "I know.",
    },
    {
      character: "Andrew",
      dialogue: "No. Not yet, you do not.",
    },
    {
      character: playerName,
      dialogue: "...",
    },
    {
      character: "Andrew",
      dialogue:
        "I will repair the key. You gather your strength. Make up your mind. When you are ready to face what waits beneath the Monolith, come back to me.",
    },
    {
      character: playerName,
      dialogue: "And then?",
    },
    {
      character: "Andrew",
      dialogue: "Then we finish what Owen could not.",
    },
  ];
};
