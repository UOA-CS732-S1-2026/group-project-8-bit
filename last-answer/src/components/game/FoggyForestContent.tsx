"use client";
import { useEffect } from "react";
import { useMCStore } from "@/store/mcStore";
import InteractBtn from "./InteractBtn";

export default function FoggyForestContent() {
  const setLocation = useMCStore((state) => state.setLocation);

  useEffect(() => {
    setLocation("foggyForest");
  }, [setLocation]);

  const handleClick1 = () => {
    console.log("First button was clicked!");
  };
  const btnClass = "w-full max-w-[25%] min-h-[3rem] max-h-[6rem]";
  return (
    <div className="p-4">
      <InteractBtn
        className={btnClass}
        onPress={handleClick1}
        title="Explore"
        content="You venture deeper into the forest, the fog thickening around you."
      />
    </div>
  );
}
