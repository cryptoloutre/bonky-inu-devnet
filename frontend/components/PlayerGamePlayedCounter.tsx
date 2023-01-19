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

export default function PlayerGamePlayedCounter({ program }: Props) {
  const [countGamePlayed, setCountGamePlayed] = useState<number>(0);

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
      setCountGamePlayed(playerInfo.gamePlayed);
    } else {
      setCountGamePlayed(0);
    }
  };

  useEffect(() => {
    fetchPlayerInfo();
  }, [program]);

  // Listen to NewGamePlayed events
  useEffect(() => {
    if (!program) return;

    const listener = program.addEventListener(
      "NewGamePlayed",
      async (event, _slot, _sig) => {
        const e = event as NewGamePlayedEvent;
        console.log("player played a new game");
        // Get the latest data from Anchor for this player
        const playerAddress = getPlayerAddress();
        const playerInfo = await program.account.player.fetch(playerAddress);
        console.log(playerInfo.gamePlayed)
        setCountGamePlayed(playerInfo.gamePlayed);
      }
    );

    return () => {
      program.removeEventListener(listener);
    };
  }, [program]);

  return (
    <div>
      <h2 className="text-xl uppercase text-[#FA6E00] font-extrabold">
        Game played: <strong>{countGamePlayed}</strong>
      </h2>
    </div>
  );
}
