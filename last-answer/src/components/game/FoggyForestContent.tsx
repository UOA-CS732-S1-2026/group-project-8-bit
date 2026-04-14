"use client";
import { useEffect, useState } from "react";
import { useMCStore } from "@/store/mcStore";
import InteractBtn from "./InteractBtn";
import DialogScene, { type DialogSingle } from "./DialogueScene";

const defaultDialogues: DialogSingle[] = [
  { character: "Officer", dialogue: "Stay alert, the forest is dangerous." },
  {
    character: "Hunter",
    dialogue: "I've seen some strange creatures lately.",
  },
];

export default function FoggyForestContent() {
  const setLocation = useMCStore((state) => state.setLocation);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogues, setDialogues] = useState<DialogSingle[]>(defaultDialogues);
  const [dialogBackgroundImage, setDialogBackgroundImage] = useState(
    "url('/backgrounds/the-opening.png')",
  );

  useEffect(() => {
    setLocation("foggyForest");
  }, [setLocation]);

  const handleClick1 = () => {
    setDialogues([
      { character: "Explorer", dialogue: "I will brave the unknown!" },
    ]);
    setDialogBackgroundImage("url('/backgrounds/city-hub.png')");
    setShowDialog(true);
  };

  const talkOfficer = () => {
    setShowDialog(true);
  };
  const btnClass = "w-full max-w-[25%] min-h-[3rem] max-h-[6rem]";
  return (
    <main>
      {showDialog && (
        <DialogScene
          dialogues={dialogues}
          backgroundImage={dialogBackgroundImage}
          onFinish={() => setShowDialog(false)}
        />
      )}
      <div className="flex flex-row gap-2">
        <InteractBtn
          className={btnClass}
          onPress={handleClick1}
          title="Explore"
          content="Venture deeper into the forest with unknown dangers."
        />
        <InteractBtn
          className={btnClass}
          onPress={talkOfficer}
          title="Talk to Officer"
          content="Talk to the officer of the Empire."
        />
        <InteractBtn
          className={btnClass}
          onPress={handleClick1}
          title="Talk to Seekers"
          content="The people work for the Empire to hunt monsters."
        />
        <InteractBtn
          className={btnClass}
          onPress={handleClick1}
          title="Talk to Hunters"
          content="The people hunt monsters for money."
        />
      </div>
    </main>
  );
}
