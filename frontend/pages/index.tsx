import { useMemo, useState } from "react";
import {
  AnchorWallet,
  useAnchorWallet,
  useConnection,
} from "@solana/wallet-adapter-react";
import { AnchorProvider, Program } from "@project-serum/anchor";
import { BonkyInu, IDL } from "../idl/bony_inu";
import { PublicKey } from "@solana/web3.js";
import PlayerGamePlayedCounter from "../components/PlayerGamePlayedCounter";
import WaitingGame from "../components/WaitingGame";
import PlayerHighscore from "../components/PlayerHighscore";
import BurnCounter from "../components/BurnCounter";
import Navbar from "../components/Navbar";

export default function Home() {
  const { connection } = useConnection();
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const anchorWallet: AnchorWallet | undefined = useAnchorWallet();

  const anchorProvider: AnchorProvider | undefined = useMemo(() => {
    if (anchorWallet) {
      return new AnchorProvider(connection, anchorWallet, {
        commitment: "confirmed",
      });
    } else {
      return undefined;
    }
  }, [connection, anchorWallet]);

  const programId = new PublicKey(
    "HMvhKYe2diFwk8NgtZPvPWTTFBZq9UyLw6876J3L8Edh"
  );

  const anchorProgram: Program<BonkyInu> | undefined = useMemo(() => {
    if (anchorProvider) {
      return new Program(IDL, programId, anchorProvider);
    } else {
      return undefined;
    }
  }, [anchorProvider]);

  return (
    <div>
      {!isPlaying && (
        <div className="flex flex-col items-stretch gap-8 px-4 pt-16 mx-auto w-[60%]">
          <main className="flex flex-col gap-4">

            <Navbar />

            <div className="flex justify-around">
              <PlayerGamePlayedCounter program={anchorProgram} />
              <PlayerHighscore program={anchorProgram} />
              <BurnCounter program={anchorProgram} />
            </div>
          </main>
        </div>
      )}
      <div className="flex justify-center">
        <WaitingGame
          program={anchorProgram}
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
        />
      </div>
    </div>
  );
}
