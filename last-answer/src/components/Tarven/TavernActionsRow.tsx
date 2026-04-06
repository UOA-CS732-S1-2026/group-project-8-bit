"use client";

import { useState } from "react";
import { BattleProperty } from "@/components/game/demoBattle/BattleProperty";
import { useMCStore } from "@/store/mcStore";

export function TavernActionsRow() {

const [openShop, setOpenShop] = useState(false);
const player = useMCStore((state) => state.player);



const actionBtnClass =
  "w-full min-h-[5.5rem] bg-[length:100%_100%] bg-no-repeat bg-center px-4 py-3 m-[0.1px] flex flex-col justify-center items-center text-center transform transition-transform duration-150 ease-out hover:scale-105 active:scale-95";

  const backgroundImage = "url('/panels/interact-panel.png')";



    return(
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <button className={actionBtnClass} style={{ backgroundImage}} onClick={()=> setOpenShop(true)}>
              <div className="text-2xl ">Talk to the Barkeeper</div>
              <div className="text-sm text-amber-200/80">Trade at property shop</div>
            </button>
            <button className={actionBtnClass} style={{ backgroundImage}}>
              <div className="text-2xl">Listen to the Crowd</div>
              <div className="text-sm text-amber-200/80">Whispers hide in drunken words</div>
            </button>
            <button className={actionBtnClass} style={{ backgroundImage}}>
              <div className="text-2xl">Have a deep sleep</div>
              <div className="text-sm text-amber-200/80">For a moment, restore your physical strength</div>
            </button>

            {openShop && (
            <BattleProperty
                player={player}
                onClose={() => setOpenShop(false)}
                />
        )}
          </div>    
    )}