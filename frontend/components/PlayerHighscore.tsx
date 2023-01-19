import { Program } from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js";
import { useEffect, useState } from "react";
import { BonkyInu } from "../idl/bony_inu";

interface Props {
  program?: Program<BonkyInu>;
}

interface NewHighscoreSetEvent {
    highscore: number;
  }

export default function PlayerHighscore({ program }: Props) {
  const [highscore, setHighscore] = useState<number>(0);

  const getPlayerAddress = () => {
    const [playerPublicKey] = PublicKey.findProgramAddressSync(
      [Buffer.from("player"), Buffer.from("season1"), program.provider.publicKey.toBuffer()],
      program.programId
    );
    return playerPublicKey;
  };
  const fetchPlayerInfo = async () => {
    if (program) {
      const playerAddress = getPlayerAddress();
      const playerInfo = await program.account.player.fetch(playerAddress);
      setHighscore(playerInfo.highscore);
    } else {
        setHighscore(0);
    }
  };

  useEffect(() => {
    fetchPlayerInfo();
  }, [program]);

    // Listen to NewHighscoreSet events
    useEffect(() => {
        if (!program) return;
    
        const listener = program.addEventListener(
          "NewHighscoreSet",
          async (event, _slot, _sig) => {
            const e = event as NewHighscoreSetEvent;
            console.log("player set a new highscore");
            // Get the latest data from Anchor for this player
            const playerAddress = getPlayerAddress();
            const playerInfo = await program.account.player.fetch(playerAddress);
            setHighscore(playerInfo.highscore);
    
          }
        );
    
        return () => {
          program.removeEventListener(listener);
        };
      }, [program]);

  return (
    <div>
      <h2 className="text-xl uppercase text-[#FA6E00] font-extrabold">
        Highscore: <strong>{highscore}</strong>
      </h2>
    </div>
  );
}
