import { Program } from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js";
import { useEffect, useState } from "react";
import { BonkyInu } from "../idl/bony_inu";

interface Props {
  program?: Program<BonkyInu>;
}

interface NewGamePlayedEvent {
  game_played: number;
}

export default function BurnCounter({ program }: Props) {
  const [burnCounter, setBurnCounter] = useState<number>(0);

  const getBurnCounterAddress = () => {
    const [burnCounterPublicKey] = PublicKey.findProgramAddressSync(
      [Buffer.from("burn_counter")],
      program.programId
    );
    return burnCounterPublicKey;
  };

  const fetchCounterInfo = async () => {
    if (program) {
      const burnCounterAddress = getBurnCounterAddress();
      const counterInfo = await program.account.burnCounter.fetch(burnCounterAddress);
      const counter = counterInfo.counter.toNumber() / 1000000
      setBurnCounter(counter);
    } else {
        setBurnCounter(0);
    }
  };

  useEffect(() => {
    fetchCounterInfo();
  }, [program]);

  // Listen to NewGamePlayed events
  useEffect(() => {
    if (!program) return;

    const listener = program.addEventListener(
      "NewGamePlayed",
      async (event, _slot, _sig) => {
        const e = event as NewGamePlayedEvent;
        console.log("player played a new game");
        // Get the latest data from Anchor
        const burnCounterAddress = getBurnCounterAddress();
        const counterInfo = await program.account.burnCounter.fetch(burnCounterAddress);
        const counter = counterInfo.counter.toNumber() / 1000000
        setBurnCounter(counter);
      }
    );

    return () => {
      program.removeEventListener(listener);
    };
  }, [program]);

  return (
    <div>
      <h2 className="text-xs sm:text-sm md:text-xl mx-2 uppercase text-[#FA6E00] font-bold">
        Total $BONK Burned: <strong>{burnCounter}</strong>
      </h2>
    </div>
  );
}