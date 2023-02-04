import { PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import { createBurnInstruction, getAssociatedTokenAddress } from "@solana/spl-token";
import React, { useEffect } from "react";

interface revivedEvent {
}

const GameOverBox = ({
  width,
  height,
  gameOverBoxHeight,
  gameOverBoxWidth,
  currentScore,
  highscore,
  setIsPlaying,
  playerAddress,
  program,
  revived,
  setRevived,
  setIsGameOver,
  setInuBottom,
  setObstaclesLeft,
  setObstaclesLeftTwo
}) => {
  const setNewHighscore = async () => {
    const playerInfo = await program.account.player.fetch(playerAddress);
    const playerHighscore = playerInfo.highscore;
    if (playerHighscore < currentScore) {
      const Tx = new Transaction();
      const setHighScore = await program.methods
        .newHighscore(currentScore)
        .accounts({
          owner: program.provider.publicKey,
          player: playerAddress,
          systemProgram: SystemProgram.programId,
        })
        .instruction();
      Tx.add(setHighScore);
      const signature = await program.provider.sendAndConfirm(Tx);
      console.log("success: ", signature);
      setIsPlaying(false);
    }
  };

  const playAgain = () => {
    console.log("start");
    setIsPlaying(false);
  };

  const getTokenVaultAddress = () => {
    const [tokenVaultPublicKey] = PublicKey.findProgramAddressSync(
      [Buffer.from("bonkVault")],
      program.programId
    );
    return tokenVaultPublicKey;
  };

  const getBurnCounterAddress = () => {
    const [burnCounterPublicKey] = PublicKey.findProgramAddressSync(
      [Buffer.from("burn_counter")],
      program.programId
    );
    return burnCounterPublicKey;
  };

  const mint = new PublicKey("4rbzs6LKeu2B68fL1DdPNdWCrEjbR25KeMYXcrU8FKnC");

  const revive = async () => {
    const Tx = new Transaction()
    const tokenAddress = await getAssociatedTokenAddress(
      mint,
      program.provider.publicKey
    );
    const reviveInstruction = await program.methods
    .revive()
    .accounts({
      owner: program.provider.publicKey,
      tokenpda: getTokenVaultAddress(),
      burncounter: getBurnCounterAddress(),
      player: playerAddress,
      mint: mint,
    })
    .instruction();
    Tx.add(reviveInstruction)
    const signature = await program.provider.sendAndConfirm(Tx);
    console.log("revive success: ", signature);

  };

    // Listen to Revived events
    useEffect(() => {
      if (!program) return;
  
      const listener = program.addEventListener(
        "Revived",
        async (event, _slot, _sig) => {
          const e = event as revivedEvent;
          console.log("user revived");
          setObstaclesLeftTwo(width / 2 - 150 / 2);
          setObstaclesLeft(width - 150);
          setInuBottom(height/2);
          setRevived(true);
          setIsGameOver(false);
        }
      );
  
      return () => {
        program.removeEventListener(listener);
      };
    }, [program]);

  return (
    <div
      className="rounded-3xl border-4 shadow-xl"
      style={{
        position: "absolute",
        backgroundColor: "#c85800",
        zIndex: 1,
        left: width / 2 - gameOverBoxWidth / 2,
        top: height / 2 - gameOverBoxHeight / 2,
        height: gameOverBoxHeight,
        width: gameOverBoxWidth,
      }}
    >
      <div className="mt-4 text-center text-white text-4xl font-bold w-full">
        Game Over
      </div>
      <div className="mt-6 ml-[30px] text-white text-2xl w-full font-semibold">
        Score: {currentScore}
      </div>
      {currentScore > highscore ? (
        <div>
          <div className="ml-[30px] text-[#03CC19] font-bold mt-6">NEW</div>
          <div className="ml-[30px] text-[#03CC19] text-2xl w-full font-semibold">
            Highscore: {currentScore}
          </div>
        </div>
      ) : (
        <div className="mt-6 ml-[30px] text-white text-2xl w-full font-semibold">
          Highscore: {highscore}
        </div>
      )}
      <div className="flex justify-center">
        {currentScore > highscore ? (
          <div className="flex justify-center">
            {!revived ? (
              <button
                className="bg-[#223333] px-2 py-2 text-white rounded-xl uppercase font-bold shadow-xl"
                style={{
                  position: "absolute",
                  bottom: gameOverBoxHeight / 2.6,
                }}
                onClick={revive}
              >
                Revive
              </button>
            ) : (
              <button
                className="bg-[#657171] px-2 py-2 text-white rounded-xl uppercase font-bold shadow-xl hover:cursor-not-allowed"
                style={{
                  position: "absolute",
                  bottom: gameOverBoxHeight / 2.6,
                }}
              >
                revived already used
              </button>
            )}
            <button
              className="bg-[#223333] px-2 py-2 text-white rounded-xl uppercase font-bold shadow-xl"
              style={{
                position: "absolute",
                bottom: (2 * gameOverBoxHeight) / 8.5,
              }}
              onClick={setNewHighscore}
            >
              Save Highscore
            </button>
            <button
              className="bg-[#223333] px-2 py-2 text-white rounded-xl uppercase font-bold shadow-xl"
              style={{
                position: "absolute",
                bottom: gameOverBoxHeight / 10.5,
              }}
              onClick={playAgain}
            >
              Play New Game
            </button>
          </div>
        ) : (
          <div className="flex justify-center">
            {!revived ? (
              <button
                className="bg-[#223333] px-2 py-2 text-white rounded-xl uppercase font-bold shadow-xl"
                style={{
                  position: "absolute",
                  bottom: gameOverBoxHeight / 2.6,
                }}
                onClick={revive}
              >
                Revive
              </button>
            ) : (
              <button
                className="bg-[#657171] px-2 py-2 text-white rounded-xl uppercase font-bold shadow-xl hover:cursor-not-allowed"
                style={{
                  position: "absolute",
                  bottom: gameOverBoxHeight / 2.6,
                }}
              >
                revived already used
              </button>
            )}
            <button
              className="bg-[#223333] px-2 py-2 text-white rounded-xl uppercase font-bold shadow-xl"
              style={{
                position: "absolute",
                bottom: (2 * gameOverBoxHeight) / 9,
              }}
              onClick={playAgain}
            >
              Play New Game
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GameOverBox;
