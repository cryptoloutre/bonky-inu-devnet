import { Program } from "@project-serum/anchor";
import { PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { BonkyInu } from "../idl/bony_inu";
import { useConnection } from "@solana/wallet-adapter-react";
import Inu from "./Inu";
import Obstacles from "./Obstacles";
import useWindowDimensions from "../utils/useWindowDimensions";
import GameOverBox from "./GameOverBox";

interface Props {
  program?: Program<BonkyInu>;
  setIsPlaying: Dispatch<SetStateAction<boolean>>;
}

export default function Game({ program, setIsPlaying }: Props) {
  const { connection } = useConnection();
  const [highscore, setHighscore] = useState<number>(0);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const { height, width } = useWindowDimensions();
  console.log("height", height, "width", width)
  const [currentScore, setCurrentScore] = useState<number>(0);
  const InuLeft = 10;
  const InuHeight = 60;
  const InuWidth = 50;
  const gravity = height / 134.5;
  const obstacleSpeed = width / 132
  let obstacleWidth = 150;
  let gap = 200;
  const [obstacleHeight, setObstacleHeight] = useState<number>(Math.random() * (height - gap - height / 6 - height / 6) + height / 6);
  const [obstacleHeightTwo, setObstacleHeightTwo] = useState<number>(
    Math.random() * (height - gap - height / 6 - height / 6) + height / 6
  );
  const [inuBottom, setInuBottom] = useState(height / 2);
  let gameTimerId;
  let obstaclesTimerId;
  let obstaclesTimerIdTwo;
  const [obstaclesLeft, setObstaclesLeft] = useState(width - obstacleWidth);
  const [obstaclesLeftTwo, setObstaclesLeftTwo] = useState(width / 2 - obstacleWidth / 2);
  const gameOverBoxHeight = height / 2.5;
  const gameOverBoxWidth = width / 5;

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

  useEffect(() => {
    if (inuBottom > -InuHeight / 2) {
      gameTimerId = setInterval(() => {
        setInuBottom((inuBottom) => inuBottom - gravity);
      }, 30);

      return () => {
        clearInterval(gameTimerId);
      };
    }
    //if i dont have inuBottom as a dependecy, it wont stop
  }, [inuBottom]);
  console.log(inuBottom);

  // //start first obstacle
  useEffect(() => {
    if (obstaclesLeft > -obstacleWidth) {
      obstaclesTimerId = setInterval(() => {
        setObstaclesLeft((obstaclesLeft) => obstaclesLeft - obstacleSpeed);
      }, 30);
      return () => {
        clearInterval(obstaclesTimerId);
      };
    } else {
      setCurrentScore((currentScore) => currentScore + 1);
      setObstaclesLeft(width - obstacleWidth);
      setObstacleHeight(
        Math.random() * (height - gap - height / 6 - height / 6) + height / 6
      );
    }
  }, [obstaclesLeft]);

  // //start second obstacle
  useEffect(() => {
    if (obstaclesLeftTwo > -obstacleWidth) {
      obstaclesTimerIdTwo = setInterval(() => {
        setObstaclesLeftTwo((obstaclesLeftTwo) => obstaclesLeftTwo - obstacleSpeed);
      }, 30);
      return () => {
        clearInterval(obstaclesTimerIdTwo);
      };
    } else {
      setCurrentScore((currentScore) => currentScore + 1);
      setObstaclesLeftTwo(width - obstacleWidth);
      setObstacleHeightTwo(
        Math.random() * (height - gap - height / 6 - height / 6) + height / 6
      );
    }
  }, [obstaclesLeftTwo]);

  //check for collisions
  useEffect(() => {
    if (
      ((inuBottom < obstacleHeight - InuHeight / 2 ||
        inuBottom > obstacleHeight - (3 * InuHeight) / 2 + gap) &&
        obstaclesLeft > InuLeft - obstacleWidth &&
        obstaclesLeft < InuLeft + 55) ||
      ((inuBottom < obstacleHeightTwo - InuHeight / 2 ||
        inuBottom > obstacleHeightTwo - (3 * InuHeight) / 2 + gap) &&
        obstaclesLeftTwo > InuLeft - obstacleWidth &&
        obstaclesLeftTwo < InuLeft + 55) ||
      inuBottom <= -InuHeight / 2
    ) {
      console.log("game over");
      gameOver();
    }
  });

  const gameOver = () => {
    clearInterval(gameTimerId);
    clearInterval(obstaclesTimerId);
    clearInterval(obstaclesTimerIdTwo);
    setIsGameOver(true);
  };

  const jump = () => {
    if (!isGameOver && inuBottom < height) {
      setInuBottom((inuBottom) => inuBottom + 70);
      console.log("jumped");
    }
  };

  return (
    <div>
      <div
        className="bg-[#454545]"
        style={{
          height: height,
          width: width,
        }}
      >
        {!isGameOver ? (
          <button
            style={{
              height: height,
              width: width,
            }}
            onClick={jump}
          >
            <div
              className="text-6xl text-white font-extrabold"
              style={{
                position: "absolute",
                zIndex: 1,
                left: width / 2,
                top: 30,
              }}
            >
              {currentScore}
            </div>
            <Inu
              InuBottom={inuBottom}
              InuLeft={InuLeft}
              InuHeight={InuHeight}
              InuWidth={InuWidth}
            />
            <Obstacles
              obstacleHeight={obstacleHeight}
              obstacleWidth={obstacleWidth}
              obstaclesLeft={obstaclesLeft}
              gap={gap}
              height={height}
            />
            <Obstacles
              obstacleHeight={obstacleHeightTwo}
              obstacleWidth={obstacleWidth}
              obstaclesLeft={obstaclesLeftTwo}
              gap={gap}
              height={height}
            />
          </button>
        ) : (
          <div
            style={{
              height: height,
              width: width,
            }}
          >
            <GameOverBox
              height={height}
              width={width}
              gameOverBoxHeight={gameOverBoxHeight}
              gameOverBoxWidth={gameOverBoxWidth}
              currentScore={currentScore}
              highscore={highscore}
              setIsPlaying={setIsPlaying}
              playerAddress = {getPlayerAddress()}
              program= {program}
            />
            <Inu
              InuBottom={inuBottom}
              InuLeft={InuLeft}
              InuHeight={InuHeight}
              InuWidth={InuWidth}
            />
            <Obstacles
              obstacleHeight={obstacleHeight}
              obstacleWidth={obstacleWidth}
              obstaclesLeft={obstaclesLeft}
              gap={gap}
              height={height}
            />
            <Obstacles
              obstacleHeight={obstacleHeightTwo}
              obstacleWidth={obstacleWidth}
              obstaclesLeft={obstaclesLeftTwo}
              gap={gap}
              height={height}
            />
          </div>
        )}
      </div>
    </div>
  );
}
