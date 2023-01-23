import { Program } from "@project-serum/anchor";
import { PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { BonkyInu } from "../idl/bony_inu";
import { useConnection } from "@solana/wallet-adapter-react";
import Game from "./Game";
import { getAssociatedTokenAddress } from "@solana/spl-token";

interface Props {
  program?: Program<BonkyInu>;
  isPlaying: boolean;
  setIsPlaying: Dispatch<SetStateAction<boolean>>;
}

interface NewGamePlayedEvent {
  game_played: number;
}

export default function WaitingGame({
  program,
  isPlaying,
  setIsPlaying,
}: Props) {
  const { connection } = useConnection();

  const getPlayerAddress = () => {
    const [playerPublicKey] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("player"),
        Buffer.from("season1"),
        program.provider.publicKey.toBuffer(),
      ],
      program.programId
    );
    return playerPublicKey;
  };

  const getStateAddress = () => {
    const [statePublicKey] = PublicKey.findProgramAddressSync(
      [Buffer.from("statepda")],
      program.programId
    );
    return statePublicKey;
  };

  const getBurnCounterAddress = () => {
    const [burnCounterPublicKey] = PublicKey.findProgramAddressSync(
      [Buffer.from("burn_counter")],
      program.programId
    );
    return burnCounterPublicKey;
  };

  const getTokenVaultAddress = () => {
    const [tokenVaultPublicKey] = PublicKey.findProgramAddressSync(
      [Buffer.from("bonkVault")],
      program.programId
    );
    return tokenVaultPublicKey;
  };

  const mint = new PublicKey("4rbzs6LKeu2B68fL1DdPNdWCrEjbR25KeMYXcrU8FKnC"); // to change with bonk mint

  // Listen to NewGamePlayed events
  useEffect(() => {
    if (!program) return;

    const listener = program.addEventListener(
      "NewGamePlayed",
      async (event, _slot, _sig) => {
        const e = event as NewGamePlayedEvent;
        console.log("user played a new game");
        setIsPlaying(true);
      }
    );

    return () => {
      program.removeEventListener(listener);
    };
  }, [program]);

  const newGame = async () => {
    const Tx = new Transaction();
    const tokenAddress = await getAssociatedTokenAddress(
      mint,
      program.provider.publicKey
    );
    const playerAddress = getPlayerAddress();
    const playerAccountInfo = await connection.getAccountInfo(playerAddress);
    if (playerAccountInfo == null) {
      const initPlayerIx = await program.methods
        .initializePlayer()
        .accounts({
          owner: program.provider.publicKey,
          player: playerAddress,
          systemProgram: SystemProgram.programId,
        })
        .instruction();
      Tx.add(initPlayerIx);
    }
    const playNewGameIx = await program.methods
      .newGame()
      .accounts({
        owner: program.provider.publicKey,
        tokenpda: getTokenVaultAddress(),
        statepda: getStateAddress(),
        burncounter: getBurnCounterAddress(),
        player: playerAddress,
        mint: mint,
        systemProgram: SystemProgram.programId,
      })
      .instruction();
    Tx.add(playNewGameIx);
    const signature = await program.provider.sendAndConfirm(Tx);
    console.log("success: ", signature);
  };

  return (
    <div>
      {isPlaying ? (
        <Game program={program} setIsPlaying={setIsPlaying} />
      ) : (
        <div
        style={{
          backgroundImage: "url(https://arweave.net/0wWSdKYoBLyu5HZmIcNPO0xr9S2F-i12HKvphwIy6J8)",
          backgroundSize: "cover",
         }} className="h-[180px] w-[425px] md:h-[360px] md:w-[770px] lg:h-[720px] lg:w-[1080px] flex justify-center">
          <div className="mt-[50px] md:mt-[150px] lg:mt-[360px]">
            {program ? (
              <div>
                <div className="flex justify-center">
                  <button
                    className="bg-[#223333] px-2 py-2 text-white rounded-xl uppercase font-bold shadow-xl"
                    onClick={newGame}
                  >
                    New Game
                  </button>
                </div>
                <div className="mt-4 text-white text-xl font-bold">
                  Click to jump and score your best!
                </div>
              </div>
            ) : (
              <div className="text-white text-xl font-bold">
                Please, connect your wallet!
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
