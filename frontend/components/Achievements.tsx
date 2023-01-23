import { AnchorProvider, Program } from "@project-serum/anchor";
import {
  Keypair,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import { useEffect, useMemo, useState } from "react";
import { BonkyInu, IDL } from "../idl/bony_inu";
import {
  AnchorWallet,
  useAnchorWallet,
  useConnection,
} from "@solana/wallet-adapter-react";
import { getAssociatedTokenAddress } from "@solana/spl-token";
import Navbar from "./Navbar";

interface AchievementUnlockedEvent {
  a1_is_unlocked: boolean;
  a2_is_unlocked: boolean;
  a3_is_unlocked: boolean;
  a4_is_unlocked: boolean;
  a5_is_unlocked: boolean;
  a6_is_unlocked: boolean;
  a7_is_unlocked: boolean;
  a8_is_unlocked: boolean;
  a9_is_unlocked: boolean;
  a10_is_unlocked: boolean;
  a11_is_unlocked: boolean;
  a12_is_unlocked: boolean;
}

export default function Achievements() {

  const { connection } = useConnection();
  const [playerInfo, setPlayerInfo] = useState(undefined);

  const programId = new PublicKey(
    "HMvhKYe2diFwk8NgtZPvPWTTFBZq9UyLw6876J3L8Edh"
  );

  const TOKEN_METADATA_PROGRAM_ID = new PublicKey(
    "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
  );

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

  const anchorProgram: Program<BonkyInu> | undefined = useMemo(() => {
    if (anchorProvider) {
      return new Program(IDL, programId, anchorProvider);
    } else {
      return undefined;
    }
  }, [anchorProvider]);

  const fetchPlayerAccountsInfo = async () => {
    if (anchorProgram) {
      try {
        const playerAccounts = await anchorProgram.account.player.fetch(
          getPlayerAddress()
        );
        setPlayerInfo(playerAccounts);
        console.log("info", playerAccounts);
      } catch (error) {
        const err = (error as any).message;
        if (err.includes("Account does not exist")) {
          setPlayerInfo(undefined);
        }
      }
    }
  };

  useEffect(() => {
    fetchPlayerAccountsInfo();
  }, [anchorProgram]);

  // Listen to AchievementUnlocked events
  useEffect(() => {
    if (!anchorProgram) return;

    const listener = anchorProgram.addEventListener(
      "AchievementUnlocked",
      async (event, _slot, _sig) => {
        const e = event as AchievementUnlockedEvent;
        console.log("player unlocked an achievement");
        // Get the latest data from Anchor
        const playerAccounts = await anchorProgram.account.player.fetch(
          getPlayerAddress()
        );
        setPlayerInfo(playerAccounts);
        console.log("info", playerAccounts);
      }
    );

    return () => {
      anchorProgram.removeEventListener(listener);
    };
  }, [anchorProgram]);

  const getPlayerAddress = () => {
    const [playerPublicKey] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("player"),
        Buffer.from("season1"),
        anchorProgram.provider.publicKey.toBuffer(),
      ],
      anchorProgram.programId
    );
    return playerPublicKey;
  };

  const getVaultAddress = () => {
    const [vaultPublicKey] = PublicKey.findProgramAddressSync(
      [Buffer.from("vault")],
      anchorProgram.programId
    );
    return vaultPublicKey;
  };

  const getUpdateAuthorityAddress = () => {
    const [updateAuthPublicKey] = PublicKey.findProgramAddressSync(
      [Buffer.from("update_authority")],
      anchorProgram.programId
    );
    return updateAuthPublicKey;
  };

  const getStateAddress = () => {
    const [statePublicKey] = PublicKey.findProgramAddressSync(
      [Buffer.from("statepda")],
      anchorProgram.programId
    );
    return statePublicKey;
  };

  const getTokenVaultAddress = () => {
    const [tokenVaultPublicKey] = PublicKey.findProgramAddressSync(
      [Buffer.from("tokenVault")],
      anchorProgram.programId
    );
    return tokenVaultPublicKey;
  };

  const unlock = async (achievement) => {
    const Tx = new Transaction();
    const mintKeypair: Keypair = Keypair.generate();
    const tokenAddress = await getAssociatedTokenAddress(
      mintKeypair.publicKey,
      anchorProgram.provider.publicKey
    );
    const metadataAddress = (
      await PublicKey.findProgramAddress(
        [
          Buffer.from("metadata"),
          TOKEN_METADATA_PROGRAM_ID.toBuffer(),
          mintKeypair.publicKey.toBuffer(),
        ],
        TOKEN_METADATA_PROGRAM_ID
      )
    )[0];
    const masterEditionAddress = (
      await PublicKey.findProgramAddress(
        [
          Buffer.from("metadata"),
          TOKEN_METADATA_PROGRAM_ID.toBuffer(),
          mintKeypair.publicKey.toBuffer(),
          Buffer.from("edition"),
        ],
        TOKEN_METADATA_PROGRAM_ID
      )
    )[0];
    const playerAddress = getPlayerAddress();
    const unlockIx = await anchorProgram.methods
      .unlockAchievement(achievement)
      .accounts({
        vault: getVaultAddress(),
        updateAuthority: getUpdateAuthorityAddress(),
        player: playerAddress,
        owner: anchorProgram.provider.publicKey,
        mint: mintKeypair.publicKey,
        tokenAccount: tokenAddress,
        masterEdition: masterEditionAddress,
        metadata: metadataAddress,
        systemProgram: SystemProgram.programId,
        tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
      })
      .signers([mintKeypair])
      .rpc();
    console.log("success: ", unlockIx);
  };

  return (
    <div className="flex flex-col items-stretch gap-8 px-4 pt-16 mx-auto max-w-max w-[60%]">
      <main className="flex flex-col gap-4">

        <Navbar />

        <div className="flex justify-center mt-4">
          <div className="font-bold sm:text-3xl uppercase">
            Play and score to unlock (mint) achievements!
          </div>
        </div>
        <div className="flex justify-center">
          <div className="flex flex-wrap gap-6 mb-4">
            <div className="card bg-[#15263F] sm:w-60 sm:h-[26rem] rounded-xl p-6 space-y-4">
              <a
                href="https://arweave.net/VW6JY66bew5i3r5pyH0oUyIOWBOSgvoAQSD3ran_WCQ?ext=png"
                rel="noreferrer"
                target="_blank"
              >
                <img
                  className="w-full sm:h-48 rounded-md  "
                  src="https://arweave.net/VW6JY66bew5i3r5pyH0oUyIOWBOSgvoAQSD3ran_WCQ?ext=png"
                  alt=""
                ></img>
              </a>
              <div id="description" className="space-y-4">
                <h2 className="text-white font-semibold text-xl  ">
                  Welcome To The Bonkers!
                </h2>
                <p className="text-white opacity-90 text-base select-none">
                  You have played your first game!
                </p>
                <div className="flex justify-center">
                  {playerInfo != undefined &&
                    playerInfo.gamePlayed > 0 &&
                    !playerInfo.a1IsUnlocked && (
                      <button
                        onClick={() => unlock("welcome")}
                        className="text-white bg-[#149414] px-2 py-2 rounded-xl font-bold"
                      >
                        Unlock Achievement
                      </button>
                    )}
                  {playerInfo != undefined && playerInfo.a1IsUnlocked && (
                    <div className="text-white bg-[#083B32] px-2 py-2 rounded-xl font-bold">
                      Unlocked
                    </div>
                  )}
                  {playerInfo == undefined && (
                    <div className="text-white bg-[#606060] px-2 py-2 rounded-xl font-bold">
                      Play to unlock
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="card bg-[#15263F] sm:w-60 sm:h-[26rem] rounded-xl p-6 space-y-4">
              <a
                href="https://arweave.net/3NTTF-JNC_OKMqjci5Yb3_rk3DRJfox6Ylt_rpKTBUQ?ext=png"
                rel="noreferrer"
                target="_blank"
              >
                <img
                  className="w-full sm:h-48 rounded-md  "
                  src="https://arweave.net/3NTTF-JNC_OKMqjci5Yb3_rk3DRJfox6Ylt_rpKTBUQ?ext=png"
                  alt=""
                ></img>
              </a>
              <div id="description" className="space-y-4">
                <h2 className="text-white font-semibold text-xl  ">
                  Casual Player
                </h2>
                <p className="text-white opacity-90 text-base select-none">
                  You have played 5 games.
                </p>
                <div className="flex justify-center">
                  {playerInfo != undefined &&
                    playerInfo.gamePlayed >= 5 &&
                    !playerInfo.a2IsUnlocked && (
                      <button
                        onClick={() => unlock("casual")}
                        className="text-white bg-[#149414] px-2 py-2 rounded-xl font-bold"
                      >
                        Unlock Achievement
                      </button>
                    )}
                  {playerInfo != undefined && playerInfo.a2IsUnlocked && (
                    <div className="text-white bg-[#083B32] px-2 py-2 rounded-xl font-bold">
                      Unlocked
                    </div>
                  )}
                  {(playerInfo == undefined ||
                    (playerInfo != undefined &&
                      playerInfo.gamePlayed < 5 &&
                      !playerInfo.a2IsUnlocked)) && (
                    <div className="text-white bg-[#606060] px-2 py-2 rounded-xl font-bold">
                      Play to unlock
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="card bg-[#15263F] sm:w-60 sm:h-[26rem] rounded-xl p-6 space-y-4">
              <a
                href="https://arweave.net/e--sdhjKjkoQcnnwBV0Nj4AyIFxZJVbPudsEi-4DQgg?ext=png"
                rel="noreferrer"
                target="_blank"
              >
                <img
                  className="w-full sm:h-48 rounded-md  "
                  src="https://arweave.net/e--sdhjKjkoQcnnwBV0Nj4AyIFxZJVbPudsEi-4DQgg?ext=png"
                  alt=""
                ></img>
              </a>
              <div id="description" className="space-y-4">
                <h2 className="text-white font-semibold text-xl  ">
                  Regular Player
                </h2>
                <p className="text-white opacity-90 text-base select-none">
                  You have played 25 games.
                </p>
                <div className="flex justify-center">
                  {playerInfo != undefined &&
                    playerInfo.gamePlayed >= 25 &&
                    !playerInfo.a3IsUnlocked && (
                      <button
                        onClick={() => unlock("regular")}
                        className="text-white bg-[#149414] px-2 py-2 rounded-xl font-bold"
                      >
                        Unlock Achievement
                      </button>
                    )}
                  {playerInfo != undefined && playerInfo.a3IsUnlocked && (
                    <div className="text-white bg-[#083B32] px-2 py-2 rounded-xl font-bold">
                      Unlocked
                    </div>
                  )}
                  {(playerInfo == undefined ||
                    (playerInfo != undefined &&
                      playerInfo.gamePlayed < 25 &&
                      !playerInfo.a2IsUnlocked)) && (
                    <div className="text-white bg-[#606060] px-2 py-2 rounded-xl font-bold">
                      Play to unlock
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="card bg-[#15263F] sm:w-60 sm:h-[26rem] rounded-xl p-6 space-y-4">
              <a
                href="https://arweave.net/aYjI58cOYpL069mEZ8oRqBvu6AWTDsavYz0mIZelIB0?ext=png"
                rel="noreferrer"
                target="_blank"
              >
                <img
                  className="w-full sm:h-48 rounded-md  "
                  src="https://arweave.net/aYjI58cOYpL069mEZ8oRqBvu6AWTDsavYz0mIZelIB0?ext=png"
                  alt=""
                ></img>
              </a>
              <div id="description" className="space-y-4">
                <h2 className="text-white font-semibold text-xl  ">
                  Hardcore Player
                </h2>
                <p className="text-white opacity-90 text-base select-none">
                  You have played 50 games.
                </p>
                <div className="flex justify-center">
                  {playerInfo != undefined &&
                    playerInfo.gamePlayed >= 50 &&
                    !playerInfo.a4IsUnlocked && (
                      <button
                        onClick={() => unlock("hardcore")}
                        className="text-white bg-[#149414] px-2 py-2 rounded-xl font-bold"
                      >
                        Unlock Achievement
                      </button>
                    )}
                  {playerInfo != undefined && playerInfo.a4IsUnlocked && (
                    <div className="text-white bg-[#083B32] px-2 py-2 rounded-xl font-bold">
                      Unlocked
                    </div>
                  )}
                  {(playerInfo == undefined ||
                    (playerInfo != undefined &&
                      playerInfo.gamePlayed < 50 &&
                      !playerInfo.a4IsUnlocked)) && (
                    <div className="text-white bg-[#606060] px-2 py-2 rounded-xl font-bold">
                      Play to unlock
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="card bg-[#15263F] sm:w-60 sm:h-[26rem] rounded-xl p-6 space-y-4">
              <a
                href="https://arweave.net/5k7P1Ok5HUdyazKtj-Y8-2yX80xQ_IkkYuUl1jT1Iyg?ext=png"
                rel="noreferrer"
                target="_blank"
              >
                <img
                  className="w-full sm:h-48 rounded-md  "
                  src="https://arweave.net/5k7P1Ok5HUdyazKtj-Y8-2yX80xQ_IkkYuUl1jT1Iyg?ext=png"
                  alt=""
                ></img>
              </a>
              <div id="description" className="space-y-4">
                <h2 className="text-white font-semibold text-xl  ">
                  Addict Player
                </h2>
                <p className="text-white opacity-90 text-base select-none">
                  You have played 100 games.
                </p>
                <div className="flex justify-center">
                  {playerInfo != undefined &&
                    playerInfo.gamePlayed >= 100 &&
                    !playerInfo.a5IsUnlocked && (
                      <button
                        onClick={() => unlock("addict")}
                        className="text-white bg-[#149414] px-2 py-2 rounded-xl font-bold"
                      >
                        Unlock Achievement
                      </button>
                    )}
                  {playerInfo != undefined && playerInfo.a5IsUnlocked && (
                    <div className="text-white bg-[#083B32] px-2 py-2 rounded-xl font-bold">
                      Unlocked
                    </div>
                  )}
                  {(playerInfo == undefined ||
                    (playerInfo != undefined &&
                      playerInfo.gamePlayed < 100 &&
                      !playerInfo.a5IsUnlocked)) && (
                    <div className="text-white bg-[#606060] px-2 py-2 rounded-xl font-bold">
                      Play to unlock
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="card bg-[#15263F] sm:w-60 sm:h-[26rem] rounded-xl p-6 space-y-4">
              <a
                href="https://arweave.net/48J1W4LRcAKE6tMOsmENgQl4aWatq72qbVnIGfVeaM8?ext=png"
                rel="noreferrer"
                target="_blank"
              >
                <img
                  className="w-full sm:h-48 rounded-md  "
                  src="https://arweave.net/48J1W4LRcAKE6tMOsmENgQl4aWatq72qbVnIGfVeaM8?ext=png"
                  alt=""
                ></img>
              </a>
              <div id="description" className="space-y-4">
                <h2 className="text-white font-semibold text-xl  ">
                  Come on, man!
                </h2>
                <p className="text-white opacity-90 text-base select-none">
                  You have played 500 games! Buy yourself a life!
                </p>
                <div className="flex justify-center">
                  {playerInfo != undefined &&
                    playerInfo.gamePlayed >= 500 &&
                    !playerInfo.a6IsUnlocked && (
                      <button
                        onClick={() => unlock("comeon")}
                        className="text-white bg-[#149414] px-2 py-2 rounded-xl font-bold"
                      >
                        Unlock Achievement
                      </button>
                    )}
                  {playerInfo != undefined && playerInfo.a6IsUnlocked && (
                    <div className="text-white bg-[#083B32] px-2 py-2 rounded-xl font-bold">
                      Unlocked
                    </div>
                  )}
                  {(playerInfo == undefined ||
                    (playerInfo != undefined &&
                      playerInfo.gamePlayed < 500 &&
                      !playerInfo.a6IsUnlocked)) && (
                    <div className="text-white bg-[#606060] px-2 py-2 rounded-xl font-bold">
                      Play to unlock
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="card bg-[#15263F] sm:w-60 sm:h-[26rem] rounded-xl p-6 space-y-4">
              <a
                href="https://arweave.net/Jh0Uq33v41GQSdsoqLZMH05Wxfifso0z5h2n6Li8TUE?ext=png"
                rel="noreferrer"
                target="_blank"
              >
                <img
                  className="w-full sm:h-48 rounded-md  "
                  src="https://arweave.net/Jh0Uq33v41GQSdsoqLZMH05Wxfifso0z5h2n6Li8TUE?ext=png"
                  alt=""
                ></img>
              </a>
              <div id="description" className="space-y-4">
                <h2 className="text-white font-semibold text-xl  ">
                  Aspiring Bonker
                </h2>
                <p className="text-white opacity-90 text-base select-none">
                  You have scored your first points!
                </p>
                <div className="flex justify-center">
                  {playerInfo != undefined &&
                    playerInfo.highscore > 0 &&
                    !playerInfo.a7IsUnlocked && (
                      <button
                        onClick={() => unlock("aspiring")}
                        className="text-white bg-[#149414] px-2 py-2 rounded-xl font-bold"
                      >
                        Unlock Achievement
                      </button>
                    )}
                  {playerInfo != undefined && playerInfo.a7IsUnlocked && (
                    <div className="text-white bg-[#083B32] px-2 py-2 rounded-xl font-bold">
                      Unlocked
                    </div>
                  )}
                  {(playerInfo == undefined ||
                    (playerInfo != undefined &&
                      playerInfo.highscore == 0 &&
                      !playerInfo.a7IsUnlocked)) && (
                    <div className="text-white bg-[#606060] px-2 py-2 rounded-xl font-bold">
                      Play to unlock
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="card bg-[#15263F] sm:w-60 sm:h-[26rem] rounded-xl p-6 space-y-4">
              <a
                href="https://arweave.net/vaJ75mExU_4yDcdfMQ_cv2D-t_3jlKPKkynGVE20wEU?ext=png"
                rel="noreferrer"
                target="_blank"
              >
                <img
                  className="w-full sm:h-48 rounded-md  "
                  src="https://arweave.net/vaJ75mExU_4yDcdfMQ_cv2D-t_3jlKPKkynGVE20wEU?ext=png"
                  alt=""
                ></img>
              </a>
              <div id="description" className="space-y-4">
                <h2 className="text-white font-semibold text-xl  ">
                  Pro Bonker
                </h2>
                <p className="text-white opacity-90 text-base select-none">
                  You have scored 50 points.
                </p>
                <div className="flex justify-center">
                  {playerInfo != undefined &&
                    playerInfo.highscore >= 50 &&
                    !playerInfo.a8IsUnlocked && (
                      <button
                        onClick={() => unlock("pro")}
                        className="text-white bg-[#149414] px-2 py-2 rounded-xl font-bold"
                      >
                        Unlock Achievement
                      </button>
                    )}
                  {playerInfo != undefined && playerInfo.a8IsUnlocked && (
                    <div className="text-white bg-[#083B32] px-2 py-2 rounded-xl font-bold">
                      Unlocked
                    </div>
                  )}
                  {(playerInfo == undefined ||
                    (playerInfo != undefined &&
                      playerInfo.highscore < 50 &&
                      !playerInfo.a8IsUnlocked)) && (
                    <div className="text-white bg-[#606060] px-2 py-2 rounded-xl font-bold">
                      Play to unlock
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="card bg-[#15263F] sm:w-60 sm:h-[26rem] rounded-xl p-6 space-y-4">
              <a
                href="https://arweave.net/Q7URmv0glCZLshAuAhkPr3QMOK6C8Xcqk_YD9rDevFE?ext=png"
                rel="noreferrer"
                target="_blank"
              >
                <img
                  className="w-full sm:h-48 rounded-md  "
                  src="https://arweave.net/Q7URmv0glCZLshAuAhkPr3QMOK6C8Xcqk_YD9rDevFE?ext=png"
                  alt=""
                ></img>
              </a>
              <div id="description" className="space-y-4">
                <h2 className="text-white font-semibold text-xl  ">
                  Elite Bonker
                </h2>
                <p className="text-white opacity-90 text-base select-none">
                  You have scored 100 points.
                </p>
                <div className="flex justify-center">
                  {playerInfo != undefined &&
                    playerInfo.highscore >= 100 &&
                    !playerInfo.a9IsUnlocked && (
                      <button
                        onClick={() => unlock("elite")}
                        className="text-white bg-[#149414] px-2 py-2 rounded-xl font-bold"
                      >
                        Unlock Achievement
                      </button>
                    )}
                  {playerInfo != undefined && playerInfo.a9IsUnlocked && (
                    <div className="text-white bg-[#083B32] px-2 py-2 rounded-xl font-bold">
                      Unlocked
                    </div>
                  )}
                  {(playerInfo == undefined ||
                    (playerInfo != undefined &&
                      playerInfo.highscore < 100 &&
                      !playerInfo.a9IsUnlocked)) && (
                    <div className="text-white bg-[#606060] px-2 py-2 rounded-xl font-bold">
                      Play to unlock
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="card bg-[#15263F] sm:w-60 sm:h-[26rem] rounded-xl p-6 space-y-4">
              <a
                href="https://arweave.net/56Hlw9M9g0u6aj5v5GRj6F0UFwMcUHqLlbWkVCTvGLA?ext=png"
                rel="noreferrer"
                target="_blank"
              >
                <img
                  className="w-full sm:h-48 rounded-md  "
                  src="https://arweave.net/56Hlw9M9g0u6aj5v5GRj6F0UFwMcUHqLlbWkVCTvGLA?ext=png"
                  alt=""
                ></img>
              </a>
              <div id="description" className="space-y-4">
                <h2 className="text-white font-semibold text-xl  ">
                  Legendary Bonker
                </h2>
                <p className="text-white opacity-90 text-base select-none">
                  You have scored 150 points.
                </p>
                <div className="flex justify-center">
                  {playerInfo != undefined &&
                    playerInfo.highscore >= 150 &&
                    !playerInfo.a10IsUnlocked && (
                      <button
                        onClick={() => unlock("legendary")}
                        className="text-white bg-[#149414] px-2 py-2 rounded-xl font-bold"
                      >
                        Unlock Achievement
                      </button>
                    )}
                  {playerInfo != undefined && playerInfo.a10IsUnlocked && (
                    <div className="text-white bg-[#083B32] px-2 py-2 rounded-xl font-bold">
                      Unlocked
                    </div>
                  )}
                  {(playerInfo == undefined ||
                    (playerInfo != undefined &&
                      playerInfo.highscore < 150 &&
                      !playerInfo.a10IsUnlocked)) && (
                    <div className="text-white bg-[#606060] px-2 py-2 rounded-xl font-bold">
                      Play to unlock
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="card bg-[#15263F] sm:w-60 sm:h-[26rem] rounded-xl p-6 space-y-4">
              <a
                href="https://arweave.net/B5soACJKVW-2hWfHe0aT1PpPfpo_rLSK6xNYpM1LlNs?ext=png"
                rel="noreferrer"
                target="_blank"
              >
                <img
                  className="w-full sm:h-48 rounded-md  "
                  src="https://arweave.net/B5soACJKVW-2hWfHe0aT1PpPfpo_rLSK6xNYpM1LlNs?ext=png"
                  alt=""
                ></img>
              </a>
              <div id="description" className="space-y-4">
                <h2 className="text-white font-semibold text-xl  ">
                  Holy Bonker
                </h2>
                <p className="text-white opacity-90 text-base select-none">
                  You have scored 200 points.
                </p>
                <div className="flex justify-center">
                  {playerInfo != undefined &&
                    playerInfo.highscore >= 200 &&
                    !playerInfo.a11IsUnlocked && (
                      <button
                        onClick={() => unlock("holy")}
                        className="text-white bg-[#149414] px-2 py-2 rounded-xl font-bold"
                      >
                        Unlock Achievement
                      </button>
                    )}
                  {playerInfo != undefined && playerInfo.a11IsUnlocked && (
                    <div className="text-white bg-[#083B32] px-2 py-2 rounded-xl font-bold">
                      Unlocked
                    </div>
                  )}
                  {(playerInfo == undefined ||
                    (playerInfo != undefined &&
                      playerInfo.highscore < 200 &&
                      !playerInfo.a11IsUnlocked)) && (
                    <div className="text-white bg-[#606060] px-2 py-2 rounded-xl font-bold">
                      Play to unlock
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="card bg-[#15263F] sm:w-60 sm:h-[26rem] rounded-xl p-6 space-y-4">
              <a
                href="https://arweave.net/U3YTYqTTXcZ0GljJvRqdsduYunyF4UHDrCwk36lHKPs?ext=png"
                rel="noreferrer"
                target="_blank"
              >
                <img
                  className="w-full sm:h-48 rounded-md  "
                  src="https://arweave.net/U3YTYqTTXcZ0GljJvRqdsduYunyF4UHDrCwk36lHKPs?ext=png"
                  alt=""
                ></img>
              </a>
              <div id="description" className="space-y-4">
                <h2 className="text-white font-semibold text-xl  ">
                  The Bonk Master
                </h2>
                <p className="text-white opacity-90 text-base select-none">
                  You have unlocked all the achievements.
                </p>
                <div className="flex justify-center">
                  {playerInfo != undefined &&
                    playerInfo.a1IsUnlocked &&
                    playerInfo.a2IsUnlocked &&
                    playerInfo.a3IsUnlocked &&
                    playerInfo.a4IsUnlocked &&
                    playerInfo.a5IsUnlocked &&
                    playerInfo.a6IsUnlocked &&
                    playerInfo.a7IsUnlocked &&
                    playerInfo.a8IsUnlocked &&
                    playerInfo.a9IsUnlocked &&
                    playerInfo.a10IsUnlocked &&
                    playerInfo.a11IsUnlocked && (
                      <button
                        onClick={() => unlock("master")}
                        className="text-white bg-[#149414] px-2 py-2 rounded-xl font-bold"
                      >
                        Unlock Achievement
                      </button>
                    )}
                  {playerInfo != undefined && playerInfo.a12IsUnlocked && (
                    <div className="text-white bg-[#083B32] px-2 py-2 rounded-xl font-bold">
                      Unlocked
                    </div>
                  )}
                  {(playerInfo == undefined ||
                    (playerInfo != undefined &&
                      (!playerInfo.a1IsUnlocked ||
                        !playerInfo.a2IsUnlocked ||
                        !playerInfo.a3IsUnlocked ||
                        !playerInfo.a4IsUnlocked ||
                        !playerInfo.a5IsUnlocked ||
                        !playerInfo.a6IsUnlocked ||
                        !playerInfo.a7IsUnlocked ||
                        !playerInfo.a8IsUnlocked ||
                        !playerInfo.a9IsUnlocked ||
                        !playerInfo.a10IsUnlocked ||
                        !playerInfo.a11IsUnlocked))) && (
                    <div className="text-white bg-[#606060] px-2 py-2 rounded-xl font-bold">
                      Play to unlock
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
