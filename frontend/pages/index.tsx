import Link from "next/link";
import Title from "../components/Title";
import { useMemo, useState } from "react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
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
            <Title />

            <div className="basis-1/4 flex justify-around items-center">
              <Link href="/">
                <div className="text-xl uppercase font-bold hover:cursor-pointer">Game</div>
              </Link>
              <Link href="/leaderboard">
              <div className="text-xl uppercase font-bold hover:cursor-pointer">Leaderboard</div>
              </Link>
              <Link href="/achievements">
              <div className="text-xl uppercase font-bold hover:cursor-pointer">Achievements</div>
              </Link>
              <WalletMultiButton className="!bg-gray-900 hover:scale-105" />
            </div>
            <div className="flex justify-around">
              <PlayerGamePlayedCounter program={anchorProgram} />
              <PlayerHighscore program={anchorProgram} />
              <BurnCounter program={anchorProgram} />
            </div>

        {/* <Footer /> */}
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
