import { DialogueSingle } from "@/components/game/DialogueScene";
import { defaultPlayer, getMCStore } from "@/store/mcStore";

const getPlayerName = () => {
  const player = getMCStore().getState().readPlayer();
  return player.name || defaultPlayer.name;
};

export const prepareTheEnd = (): DialogueSingle[] => {
  const playerName = getPlayerName();

  return [
    {
      character: null,
      dialogue: `The tavern was quiet when the ${playerName} returned.`,
    },
    {
      character: null,
      dialogue:
        "No hesitation remained in his steps now. No uncertainty. The truth hidden beneath the city, the Monolith, and the long ruin of the world had narrowed into a single path.",
    },
    {
      character: null,
      dialogue: `Andrew looked up from the table as the ${playerName} entered. For a moment, neither of them spoke. Then Andrew gave a small, tired nod.`,
    },
    {
      character: "Andrew",
      dialogue: "So. You have decided.",
    },
    {
      character: playerName,
      dialogue: "I have.",
    },
    {
      character: "Andrew",
      dialogue: "Good. There is no room left for half-measures.",
    },
    {
      character: playerName,
      dialogue:
        "It is time to end this. The chaos. The monsters. The deaths. All of it.",
    },
    {
      character: "Andrew",
      dialogue: "You sound like a man who understands the cost.",
    },
    {
      character: playerName,
      dialogue: "I sound like a man who has seen enough.",
    },
    {
      character: null,
      dialogue:
        "Andrew studied him quietly, as if weighing not just his strength, but his resolve. Then the older man rose and began laying things out across the table. Weapons. Travel gear. Small useful items wrapped in cloth. And the restored key.",
    },
    {
      character: null,
      dialogue:
        "Its rust was gone now. Faint lines of power shimmered beneath the metal, subtle but unmistakable.",
    },
    {
      character: playerName,
      dialogue: "Before we go... there is something I still do not understand.",
    },
    {
      character: "Andrew",
      dialogue: "Ask it.",
    },
    {
      character: playerName,
      dialogue:
        "Why do we do this alone? If what we know is true, should we not bring this to the government? To the officers? If the Monolith threatens everything, then this is larger than the two of us.",
    },
    {
      character: "Andrew",
      dialogue: "In a better world, yes.",
    },
    {
      character: playerName,
      dialogue: "But not this one.",
    },
    {
      character: "Andrew",
      dialogue: "No.",
    },
    {
      character: playerName,
      dialogue: "You think they would stop us?",
    },
    {
      character: "Andrew",
      dialogue:
        "Some would. Some would try to use it. Some would sell it by nightfall.",
    },
    {
      character: playerName,
      dialogue: "Because of corruption.",
    },
    {
      character: "Andrew",
      dialogue:
        "Because this city is full of listening ears and divided loyalties. The officers are not clean. The court is not clean. The streets are not clean.",
    },
    {
      character: playerName,
      dialogue: "Page.",
    },
    {
      character: "Andrew",
      dialogue:
        "Page was only one example. There are spies among the Aldren Liberators. There are spies among the Precursor rebels. There are men who wear the Empire's colors by day and betray it by dark.",
    },
    {
      character: playerName,
      dialogue: "And if we tell the wrong person...",
    },
    {
      character: "Andrew",
      dialogue:
        "Then word spreads. The wrong hands move first. The door is opened by fools, zealots, or opportunists... and whatever chance remains is lost.",
    },
    {
      character: playerName,
      dialogue: "So if we ask for help, we ruin our own plan.",
    },
    {
      character: "Andrew",
      dialogue: "Exactly.",
    },
    {
      character: null,
      dialogue: `The room fell silent again. The key glinted faintly in the candlelight. At last, the ${playerName} reached out and took it into his hand. It felt heavier than iron should have.`,
    },
    {
      character: playerName,
      dialogue: "Then we save the world by ourselves.",
    },
    {
      character: "Andrew",
      dialogue: "It seems so.",
    },
  ];
};

export const wayToRuin = (): DialogueSingle[] => {
  return [
    {
      character: null,
      dialogue:
        "They packed in silence after that. Steel was checked and wrapped. Straps were tightened. The restored key was secured carefully.",
    },
    {
      character: null,
      dialogue:
        "No grand speeches followed. No prayers. No illusions. Only preparation.",
    },
    {
      character: null,
      dialogue: "Then, before dawn, they stepped out into the dark.",
    },
    {
      character: null,
      dialogue: "The road was long and empty.",
    },
    {
      character: null,
      dialogue:
        "They traveled beyond the city's safer paths, through ruined land and broken stone, with the First Monolith always somewhere in the distance like a black accusation against the sky.",
    },
    {
      character: null,
      dialogue: "Andrew led without hesitation. He knew where he was going.",
    },
    {
      character: null,
      dialogue:
        "By the time the sun had sunk and the light turned cold, the land had changed. The old road gave way to cracked stone and ancient foundations buried beneath moss and earth.",
    },
    {
      character: null,
      dialogue: "Then the ruin appeared.",
    },
  ];
};

export const ancientRuin = (): DialogueSingle[] => {
  const playerName = getPlayerName();

  return [
    {
      character: null,
      dialogue:
        "It stood on a rise of broken rock, half-swallowed by time. From there, the Monolith could still be seen in the far distance - dark, immense, and watching.",
    },
    {
      character: null,
      dialogue:
        "The ruin itself was older than the city below. Older, perhaps, than the kings who claimed descent from its builders. Shattered pillars leaned beneath dead ivy. Weathered stone blocks lay split by roots. Faded carvings watched from the dark.",
    },
    {
      character: null,
      dialogue: "At the ruin's center, a staircase descended into the earth.",
    },
    {
      character: playerName,
      dialogue: "This is the place?",
    },
    {
      character: "Andrew",
      dialogue: "It must be.",
    },
    {
      character: playerName,
      dialogue: "It feels older than everything above it.",
    },
    {
      character: "Andrew",
      dialogue: "That is because it is.",
    },
    {
      character: null,
      dialogue:
        "They moved down the staircase slowly, the air growing colder with every step. The world above faded behind them.",
    },
    {
      character: null,
      dialogue:
        "At the bottom waited an old door of blackened metal and stone, sealed into the passage like the end of a tomb. Its surface was marked with worn lines and forgotten symbols. Locked.",
    },
    {
      character: playerName,
      dialogue: "So this is where the key is meant to lead.",
    },
    {
      character: "Andrew",
      dialogue: "Yes.",
    },
    {
      character: playerName,
      dialogue: "And once we pass through?",
    },
    {
      character: "Andrew",
      dialogue: "There will be no easy road back.",
    },
    {
      character: null,
      dialogue: `Andrew turned to the ${playerName} in the dim underground light.`,
    },
    {
      character: "Andrew",
      dialogue: "Last chance.",
    },
    {
      character: playerName,
      dialogue: "To run?",
    },
    {
      character: "Andrew",
      dialogue: "To choose.",
    },
    {
      character: playerName,
      dialogue: "I chose already.",
    },
    {
      character: "Andrew",
      dialogue: "Good.",
    },
    {
      character: playerName,
      dialogue: "Then let us see what Owen buried beneath the world.",
    },
  ];
};

export const sealedPath = (): DialogueSingle[] => {
  const playerName = getPlayerName();

  return [
    {
      character: null,
      dialogue:
        "The old door stood at the end of the buried stair like the lid of a tomb.",
    },
    {
      character: null,
      dialogue:
        "Black stone. Faded carvings. Metal bands gone dark with age. It had not moved in centuries, and yet the air around it felt tense, expectant, as if the ruin itself had been waiting for someone to return.",
    },
    {
      character: null,
      dialogue:
        "Andrew stepped forward first. Without a word, he drew a knife across his palm and pressed his bleeding hand against the center of the seal.",
    },
    {
      character: null,
      dialogue:
        "For a moment, nothing happened. Then the door drank the blood. Golden lines awakened beneath the stone, spreading through the carved patterns like veins of light.",
    },
    {
      character: playerName,
      dialogue: "It accepted you...",
    },
    {
      character: "Andrew",
      dialogue: "Not me. The blood.",
    },
    {
      character: playerName,
      dialogue: "So the seal was alive this whole time.",
    },
    {
      character: "Andrew",
      dialogue: "Alive enough to remember its purpose.",
    },
    {
      character: null,
      dialogue: "Andrew withdrew his hand and took the restored key.",
    },
    {
      character: null,
      dialogue:
        "The metal no longer looked dead or rusted. In the golden light of the seal, faint hidden lines shimmered across its surface.",
    },
    {
      character: null,
      dialogue:
        "He set it into the ancient lock. There was a deep grinding sound, like stone remembering how to move.",
    },
    {
      character: null,
      dialogue: "Then the door began to open. Slowly. Heavily.",
    },
    {
      character: null,
      dialogue:
        "A breath of dry, stale air rolled out from the darkness beyond, carrying the smell of dust, old stone, and a place untouched by the living world for far too long.",
    },
    {
      character: playerName,
      dialogue: "So this is the way down.",
    },
    {
      character: "Andrew",
      dialogue: "Yes.",
    },
    {
      character: playerName,
      dialogue: "Still time to turn back.",
    },
    {
      character: "Andrew",
      dialogue: "Do you want to?",
    },
    {
      character: playerName,
      dialogue: "No.",
    },
  ];
};

export const intoTheDeep = (): DialogueSingle[] => {
  const playerName = getPlayerName();

  return [
    {
      character: null,
      dialogue: "They lit candles and stepped through the opening.",
    },
    {
      character: null,
      dialogue:
        "The door groaned shut behind them, and the world narrowed to flame, stone, and shadow. The path beyond was long and oppressively dark.",
    },
    {
      character: null,
      dialogue:
        "Their candlelight touched only fragments of it at a time - the old stone road beneath their feet, the rough walls pressing in at either side, and the shifting darkness ahead that seemed to retreat only as they advanced.",
    },
    {
      character: null,
      dialogue:
        "No wind moved there. No voices echoed. Only footsteps. Only breathing. Only the slow hiss of candle flame.",
    },
    {
      character: null,
      dialogue:
        "Time became strange underground. Minutes stretched. Distance lost meaning. The dark swallowed everything beyond the reach of their hands.",
    },
    {
      character: playerName,
      dialogue: "How much farther?",
    },
    {
      character: "Andrew",
      dialogue: "Farther than I would like.",
    },
    {
      character: playerName,
      dialogue: "You sound almost surprised.",
    },
    {
      character: "Andrew",
      dialogue:
        "I knew it would be hidden. I did not expect it to feel this... deep.",
    },
    {
      character: playerName,
      dialogue: "As if the whole world is above us.",
    },
    {
      character: "Andrew",
      dialogue: "It is.",
    },
  ];
};

export const greatChamber = (): DialogueSingle[] => {
  const playerName = getPlayerName();

  return [
    {
      character: null,
      dialogue: "At last, the tunnel widened.",
    },
    {
      character: null,
      dialogue:
        "The narrow buried road opened into a vast chamber, so large the candlelight could not hold its full shape at once.",
    },
    {
      character: null,
      dialogue:
        "Statues stood along the walls - tall, ancient, and half-lost in shadow. Their faces were worn by time, their eyes empty, their forms severe and watchful.",
    },
    {
      character: null,
      dialogue:
        "Far ahead, in the depth of the chamber, a strange dark light flickered. Not warm. Not holy. Something colder. Something wrong.",
    },
    {
      character: null,
      dialogue: "The two men stopped at once.",
    },
    {
      character: playerName,
      dialogue: "Do you see it?",
    },
    {
      character: "Andrew",
      dialogue: "Yes.",
    },
    {
      character: playerName,
      dialogue: "That must be it.",
    },
    {
      character: "Andrew",
      dialogue: "The source... or something guarding it.",
    },
    {
      character: null,
      dialogue:
        "Their pace quickened. Candlelight shook across stone as they moved faster through the chamber, toward that distant pulse of darkness.",
    },
    {
      character: null,
      dialogue:
        "The air grew heavier with every step. The light became clearer. Then it moved.",
    },
    {
      character: null,
      dialogue:
        "The darkness ahead rose like a living wound in the air, unfolding into shape. A huge monster emerged from the shadows.",
    },
    {
      character: null,
      dialogue:
        "Its body seemed made of corruption given form - twisted knowledge, ruined purpose, and black radiance. A dark light spilled from it, not illuminating the chamber, but staining it.",
    },
    {
      character: null,
      dialogue:
        "The statues vanished behind its presence. The air itself felt poisoned. The final truth of the buried path stood before them.",
    },
    {
      character: playerName,
      dialogue: "...So that is what waits at the heart of it.",
    },
    {
      character: "Andrew",
      dialogue: "Be careful. That is no ordinary creature.",
    },
    {
      character: playerName,
      dialogue: "What is it?",
    },
    {
      character: "Andrew",
      dialogue: "The dark side of knowledge.",
    },
    {
      character: playerName,
      dialogue: "The corruption in the core.",
    },
    {
      character: "Andrew",
      dialogue: "Yes. And our target.",
    },
    {
      character: null,
      dialogue: "The candlelight trembled in their hands. Steel came free.",
    },
    {
      character: null,
      dialogue:
        "No more questions remained. No more road stretched ahead. Only the last trial.",
    },
    {
      character: playerName,
      dialogue: "Then let us finish this.",
    },
    {
      character: "Andrew",
      dialogue: "At last.",
    },
  ];
};

export const darksideFalls = (): DialogueSingle[] => {
  const playerName = getPlayerName();

  return [
    {
      character: null,
      dialogue: "The final blow landed.",
    },
    {
      character: null,
      dialogue:
        "The Darkside of Knowledge shuddered, twisted inward, and dissolved into fragments of blackened light. For a moment the great chamber shook, as if the ruin itself had been holding its breath.",
    },
    {
      character: null,
      dialogue: "Then the source changed. The corrupted glow faded.",
    },
    {
      character: null,
      dialogue:
        "In its place rose a clear golden light - warm, steady, almost gentle. The vast chamber, once buried in shadow, seemed suddenly older and calmer, as though an ancient wound had finally begun to close.",
    },
    {
      character: null,
      dialogue: `The ${playerName} stood frozen, breathing hard, weapon lowered. He could barely believe it.`,
    },
    {
      character: playerName,
      dialogue: "...We did it.",
    },
    {
      character: "Andrew",
      dialogue: "Yes.",
    },
    {
      character: playerName,
      dialogue: "I thought... I thought it would never end.",
    },
    {
      character: "Andrew",
      dialogue: "And yet here we are.",
    },
    {
      character: null,
      dialogue:
        "Andrew stepped toward the cleansed source, his face lit by its golden radiance.",
    },
    {
      character: null,
      dialogue: `For the first time since the ${playerName} had met him, his expression was not guarded.`,
    },
    {
      character: null,
      dialogue: "It was almost peaceful. Almost relieved.",
    },
    {
      character: "Andrew",
      dialogue: "I have waited a very long time for this day.",
    },
    {
      character: playerName,
      dialogue: "You sound as if you have known this place all your life.",
    },
    {
      character: "Andrew",
      dialogue: "Not all my life.",
    },
    {
      character: "Andrew",
      dialogue: "Only since I lost it.",
    },
    {
      character: playerName,
      dialogue: "Lost it?",
    },
  ];
};

export const revelation = (): DialogueSingle[] => {
  const playerName = getPlayerName();

  return [
    {
      character: null,
      dialogue:
        "Andrew turned back slowly. The light touched the lines of his face, the grey in his hair, the weariness in his eyes.",
    },
    {
      character: null,
      dialogue: "When he spoke again, his voice was quieter than before.",
    },
    {
      character: "Andrew",
      dialogue: "Fifteen years ago, I was banished by the second king.",
    },
    {
      character: playerName,
      dialogue: "Banished?",
    },
    {
      character: "Andrew",
      dialogue: "I lost a political struggle. A decisive one.",
    },
    {
      character: playerName,
      dialogue: "Who were you?",
    },
    {
      character: null,
      dialogue:
        "A long silence followed. Then Andrew gave the answer like a blade finally being drawn.",
    },
    {
      character: "Andrew",
      dialogue: "I am Owen.",
    },
    {
      character: playerName,
      dialogue: "...What?",
    },
    {
      character: "Andrew",
      dialogue: "Owen, builder of the First Monolith.",
    },
    {
      character: "Andrew",
      dialogue: "The same Owen who wrote the book.",
    },
    {
      character: playerName,
      dialogue: "No...",
    },
    {
      character: "Andrew",
      dialogue: "Yes.",
    },
    {
      character: "Andrew",
      dialogue:
        "I wrote it so that one day, if the source fell into corruption again, someone would be able to open this path and finish what I began.",
    },
    {
      character: "Andrew",
      dialogue: "I hid the key in the book for that very reason.",
    },
    {
      character: null,
      dialogue: `The ${playerName} said nothing.`,
    },
    {
      character: null,
      dialogue:
        "His mind moved, but the words would not come. The tavern. The clues. The book. The key. The years of waiting. All of it shifted into a shape he had not seen before.",
    },
    {
      character: null,
      dialogue: "At last, he looked up.",
    },
    {
      character: playerName,
      dialogue:
        "So that is why you came back to the capital after the Great Silence.",
    },
    {
      character: "Andrew",
      dialogue: "Yes.",
    },
    {
      character: playerName,
      dialogue: "It was the perfect chance to begin again.",
    },
    {
      character: playerName,
      dialogue: "To gather information. To move without being noticed.",
    },
    {
      character: "Andrew",
      dialogue: "Go on.",
    },
    {
      character: playerName,
      dialogue:
        "You opened the tavern so people would come to you. Aldrens. Officers. Precursors. Merchants. Drunks. Informers. Everyone.",
    },
    {
      character: playerName,
      dialogue: "You listened. You watched.",
    },
    {
      character: playerName,
      dialogue:
        "And when you saw how weak the Empire had become... you began to move.",
    },
    {
      character: "Andrew",
      dialogue: "That is true.",
    },
    {
      character: playerName,
      dialogue: "You chose me because I was useful.",
    },
    {
      character: playerName,
      dialogue: "Because I could help you finish your revenge.",
    },
    {
      character: playerName,
      dialogue: "And that is why you never wanted to tell the government.",
    },
    {
      character: "Andrew",
      dialogue: "Yes.",
    },
  ];
};

export const ideologicalConfrontation = (): DialogueSingle[] => {
  const playerName = getPlayerName();

  return [
    {
      character: null,
      dialogue: "The answer did not come with anger. Only clarity.",
    },
    {
      character: null,
      dialogue: `The ${playerName} looked at the golden source, then at Andrew, and understood - perhaps for the first time - just how small he had been inside someone else's design.`,
    },
    {
      character: playerName,
      dialogue: "So I was only a piece in your plan.",
    },
    {
      character: "Andrew",
      dialogue: "Not only a piece.",
    },
    {
      character: playerName,
      dialogue: "Then what was I?",
    },
    {
      character: "Andrew",
      dialogue: "My best chance.",
    },
    {
      character: "Andrew",
      dialogue: "And perhaps... my best friend.",
    },
    {
      character: playerName,
      dialogue: "Friend?",
    },
    {
      character: "Andrew",
      dialogue: "Do not look so surprised.",
    },
    {
      character: "Andrew",
      dialogue: "We are more alike than you think.",
    },
    {
      character: "Andrew",
      dialogue:
        "We love music. We love books. We hunger for knowledge. We pity suffering when others step over it.",
    },
    {
      character: "Andrew",
      dialogue:
        "You are brave, open-minded, and wise - more than most Aldrens, more than most Precursors.",
    },
    {
      character: "Andrew",
      dialogue: "That is rare.",
    },
    {
      character: null,
      dialogue: "Andrew spoke without mockery.",
    },
    {
      character: null,
      dialogue:
        "Without hesitation. That only made it harder to hear what came next.",
    },
    {
      character: playerName,
      dialogue: "Then tell me plainly.",
    },
    {
      character: playerName,
      dialogue: "What do you intend to do now?",
    },
    {
      character: "Andrew",
      dialogue: "I will use the Monolith.",
    },
    {
      character: playerName,
      dialogue: "Use it?",
    },
    {
      character: "Andrew",
      dialogue:
        "To control the Precursor nobles. To end their games. To reclaim the authority stolen from me.",
    },
    {
      character: "Andrew",
      dialogue: "I will return to power.",
    },
    {
      character: "Andrew",
      dialogue: "I will become the new lord of this government.",
    },
    {
      character: "Andrew",
      dialogue:
        "And you - if you choose wisely - will stand at my side as my most important assistant.",
    },
    {
      character: playerName,
      dialogue: "You would rule through the Monolith.",
    },
    {
      character: "Andrew",
      dialogue: "I would rule fairly.",
    },
    {
      character: "Andrew",
      dialogue:
        "There would be justice for Aldren and Precursor alike. No more chaos. No more petty factions. No more rotting state devouring itself from within.",
    },
    {
      character: playerName,
      dialogue: "And how would you govern this new world?",
    },
    {
      character: "Andrew",
      dialogue: "I would repair the Monolith completely.",
    },
    {
      character: "Andrew",
      dialogue:
        "This time no one will be allowed to poison it with private desire.",
    },
    {
      character: "Andrew",
      dialogue: "No pride. No ambition. No selfishness hidden in the source.",
    },
    {
      character: "Andrew",
      dialogue: "I will keep it pure.",
    },
    {
      character: "Andrew",
      dialogue: "It will guide both Precursors and Aldrens.",
    },
    {
      character: playerName,
      dialogue: "And the truth?",
    },
    {
      character: "Andrew",
      dialogue: "What truth?",
    },
    {
      character: playerName,
      dialogue:
        "About the Monolith. About the Precursors. About how this country began.",
    },
    {
      character: playerName,
      dialogue: "Will you tell the Aldrens?",
    },
    {
      character: null,
      dialogue: "Andrew's expression hardened. Only slightly. But enough.",
    },
    {
      character: "Andrew",
      dialogue: "No.",
    },
    {
      character: playerName,
      dialogue: "No?",
    },
    {
      character: "Andrew",
      dialogue: "They are not ready.",
    },
    {
      character: playerName,
      dialogue: "That is not your decision to make.",
    },
    {
      character: "Andrew",
      dialogue:
        "It is exactly my decision to make, if I mean to save this land from itself.",
    },
    {
      character: "Andrew",
      dialogue:
        "The Aldrens are not knowledgeable enough to bear that truth without tearing everything apart. They cannot govern themselves yet.",
    },
    {
      character: "Andrew",
      dialogue: "They still need guidance.",
    },
    {
      character: playerName,
      dialogue: "Guidance... or control?",
    },
    {
      character: "Andrew",
      dialogue:
        "Call it what you like. The result is the same: order, survival, civilization.",
    },
  ];
};

export const agreeAndrew = (): DialogueSingle[] => {
  const playerName = getPlayerName();

  return [
    {
      character: playerName,
      dialogue: "...Perhaps you are right.",
    },
    {
      character: "Andrew",
      dialogue: "You mean that?",
    },
    {
      character: playerName,
      dialogue:
        "I do not trust the old nobles. I do not trust the officers. I do not trust the mobs in the streets.",
    },
    {
      character: playerName,
      dialogue:
        "If there is to be a future, perhaps it must begin with one hand strong enough to hold it together.",
    },
    {
      character: "Andrew",
      dialogue: "Then stand with me.",
    },
    {
      character: playerName,
      dialogue: "On one condition.",
    },
    {
      character: "Andrew",
      dialogue: "Name it.",
    },
    {
      character: playerName,
      dialogue:
        "You keep your promise. Fairness for Aldren and Precursor alike.",
    },
    {
      character: playerName,
      dialogue: "No more old chains under a new name.",
    },
    {
      character: "Andrew",
      dialogue: "You have my word.",
    },
  ];
};

export const endAGoldenOrder = (): DialogueSingle[] => {
  return [
    {
      character: null,
      dialogue:
        "The golden light of the source rose around them like dawn through buried stone.",
    },
    {
      character: null,
      dialogue: "Together, they began the work of remaking the Monolith.",
    },
    {
      character: null,
      dialogue:
        "And when they returned to the world above, the old order broke more quickly than anyone expected.",
    },
    {
      character: null,
      dialogue:
        "Andrew rose. His enemies bent, fled, or vanished. A new government followed.",
    },
    {
      character: null,
      dialogue:
        "The roads became safer. Hunger eased. Law returned. Aldrens stood higher than they had in generations. Precursors lost much of their old untouchable power.",
    },
    {
      character: null,
      dialogue:
        "And for a time, it seemed the world had truly been saved. It almost resembled the sweet old days people still whispered about.",
    },
    {
      character: null,
      dialogue: "But time moves slowly around systems built on obedience.",
    },
    {
      character: null,
      dialogue:
        "And deep beneath peace, one question remained: Was this a new beginning...",
    },
    {
      character: null,
      dialogue: "Or only another cycle, polished until it looked like mercy?",
    },
  ];
};

export const refuseAndrew = (): DialogueSingle[] => {
  const playerName = getPlayerName();

  return [
    {
      character: playerName,
      dialogue: "No.",
    },
    {
      character: "Andrew",
      dialogue: "No?",
    },
    {
      character: playerName,
      dialogue: "The Aldrens deserve the truth.",
    },
    {
      character: playerName,
      dialogue: "Everyone does.",
    },
    {
      character: playerName,
      dialogue:
        "No one should hold that power again - not you, not the nobles, not anyone.",
    },
    {
      character: playerName,
      dialogue: "The Monolith should be destroyed.",
    },
    {
      character: "Andrew",
      dialogue: "You would cast the world into chaos for the sake of an ideal?",
    },
    {
      character: playerName,
      dialogue: "Better chaos than another lie forced upon the living.",
    },
    {
      character: "Andrew",
      dialogue: "You are a fool.",
    },
    {
      character: playerName,
      dialogue: "Maybe.",
    },
    {
      character: playerName,
      dialogue: "But no one can be trusted to rule through that thing.",
    },
    {
      character: null,
      dialogue:
        "The two men stood facing one another in the renewed golden light. For a moment, neither moved.",
    },
    {
      character: null,
      dialogue:
        "When Andrew spoke again, his voice was colder than the chamber stone.",
    },
    {
      character: "Andrew",
      dialogue: "I had hoped you would understand.",
    },
    {
      character: playerName,
      dialogue: "I do understand.",
    },
    {
      character: playerName,
      dialogue: "That is why I cannot follow you.",
    },
    {
      character: "Andrew",
      dialogue: "Then you leave me no choice.",
    },
  ];
};

export const finalFight = (): DialogueSingle[] => {
  const playerName = getPlayerName();

  return [
    {
      character: null,
      dialogue:
        "Andrew turned toward the source and reached into its light. The chamber answered him.",
    },
    {
      character: null,
      dialogue:
        "Golden radiance surged up his arms, across his body, around his face, until he seemed to stand inside a second skin of living fire.",
    },
    {
      character: null,
      dialogue: "He looked terrible. Magnificent. Broken.",
    },
    {
      character: "Andrew",
      dialogue: "Give up.",
    },
    {
      character: "Andrew",
      dialogue: "I will not kill you if I do not have to.",
    },
    {
      character: playerName,
      dialogue: "I will not kneel to another king.",
    },
    {
      character: "Andrew",
      dialogue: "Then die defending a world too foolish to deserve you.",
    },
  ];
};

export const andrewFalls = (): DialogueSingle[] => {
  const playerName = getPlayerName();

  return [
    {
      character: null,
      dialogue:
        "When it was over, Andrew staggered backward toward the source.",
    },
    {
      character: null,
      dialogue:
        "The golden light that had obeyed him now turned hungry. The core opened. Its brilliance folded around him.",
    },
    {
      character: null,
      dialogue: `For one terrible instant, the ${playerName} thought Andrew might speak again.`,
    },
    {
      character: null,
      dialogue: "Instead, he was pulled into the light and absorbed. Gone.",
    },
    {
      character: playerName,
      dialogue: "...Andrew.",
    },
    {
      character: null,
      dialogue: "The chamber was silent.",
    },
    {
      character: null,
      dialogue: `The ${playerName} stood alone before the source, grief and exhaustion hollowing him from within. Whatever Andrew had become in the end - friend, manipulator, savior, tyrant - he had still once been the man who opened a tavern door and offered him a chair by the fire.`,
    },
    {
      character: null,
      dialogue: `At last, the ${playerName} stepped forward. He placed his hand against the core. The light trembled.`,
    },
    {
      character: playerName,
      dialogue: "Then listen.",
    },
    {
      character: playerName,
      dialogue: "Tell the truth.",
    },
    {
      character: playerName,
      dialogue: "Tell them what the Precursors were.",
    },
    {
      character: playerName,
      dialogue: "Tell them what the Monolith was made for.",
    },
    {
      character: playerName,
      dialogue: "Tell them everything.",
    },
    {
      character: null,
      dialogue: "The source answered. Not with a voice, but with obedience.",
    },
    {
      character: null,
      dialogue: "Far above, through the Monolith, truth began to spread.",
    },
    {
      character: null,
      dialogue:
        "Visions. Records. Buried memories. Hidden history made visible at last.",
    },
    {
      character: null,
      dialogue:
        "Across the land, people learned what had been done to them and in whose name.",
    },
    {
      character: null,
      dialogue: `The ${playerName} closed his eyes, then gave the second order.`,
    },
    {
      character: playerName,
      dialogue: "Now destroy yourself.",
    },
    {
      character: null,
      dialogue: "The core obeyed again.",
    },
    {
      character: null,
      dialogue:
        "Light fractured. Stone screamed. The chamber began to collapse.",
    },
    {
      character: null,
      dialogue: `The ${playerName} turned and ran.`,
    },
    {
      character: null,
      dialogue:
        "Up the long road. Through the tunnel. Past the opened gate. Up the buried stair. Into wind and sky and the raw world above.",
    },
  ];
};

export const lastAnswer = (): DialogueSingle[] => {
  const playerName = getPlayerName();

  return [
    {
      character: null,
      dialogue: "He reached the mountain and turned in time to see it happen.",
    },
    {
      character: null,
      dialogue: "Far away, above the city, the First Monolith cracked.",
    },
    {
      character: null,
      dialogue:
        "Golden light burst through its black body like sunlight through rotten glass.",
    },
    {
      character: null,
      dialogue:
        "Then the great tower broke. It fell with the sound of an age ending.",
    },
    {
      character: null,
      dialogue:
        "Below, people watched in terror, grief, anger, awe, relief. Some wept. Some cursed. Some rejoiced. Some did not know what to feel at all.",
    },
    {
      character: null,
      dialogue:
        "The truth had come too late to comfort them, and too suddenly to guide them.",
    },
    {
      character: null,
      dialogue: "The future was uncertain now. Wild. Unpromised.",
    },
    {
      character: null,
      dialogue: `The ${playerName} stood in the cold air and watched the ruins burn with the last light of the old order. He had not saved the world. Not in the simple way stories liked to promise.`,
    },
    {
      character: null,
      dialogue:
        "But perhaps there had never been a savior waiting in the dark.",
    },
    {
      character: null,
      dialogue:
        "Perhaps Aldrens could only become free by standing without one.",
    },
    {
      character: null,
      dialogue: "Perhaps people could only be saved by themselves.",
    },
  ];
};
