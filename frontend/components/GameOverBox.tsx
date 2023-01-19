import { SystemProgram, Transaction } from "@solana/web3.js";
import React from "react";

const GameOverBox = ({
  width,
  height,
  gameOverBoxHeight,
  gameOverBoxWidth,
  currentScore,
  highscore,
  setIsPlaying,
  playerAddress,
  program
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
    console.log("start")
    setIsPlaying(false);
  }
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
            <button
              className="bg-[#223333] px-2 py-2 text-white rounded-xl uppercase font-bold shadow-xl"
              style={{
                position: "absolute",
                bottom: gameOverBoxHeight / 3,
              }}
              onClick={setNewHighscore}
            >
              Save Highscore
            </button>
            <button
              className="bg-[#223333] px-2 py-2 text-white rounded-xl uppercase font-bold shadow-xl"
              style={{
                position: "absolute",
                bottom: gameOverBoxHeight / 9,
              }}
              onClick={playAgain}
            >
              Play New Game
            </button>
          </div>
        ) : (
          <div className="flex justify-center">
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
