import { AnchorProvider, Program } from "@project-serum/anchor";
import { Connection, PublicKey } from "@solana/web3.js";
import { useEffect, useMemo, useState } from "react";
import { BonkyInu, IDL } from "../idl/bony_inu";
import {
  AnchorWallet,
  useAnchorWallet,
  useConnection,
} from "@solana/wallet-adapter-react";
import { getFavoriteDomain } from "@bonfida/spl-name-service";
import Navbar from "./Navbar";

export default function Leaderboard() {
  const { connection } = useConnection();
  let users = [];
  const [usersInfo, setUsersInfo] = useState([]);
  const [fetchingLeaderboard, setFetchingLeaderboard] =
    useState<boolean>(false);
  const [leaderboardFetched, setLeaderboardFetched] = useState<boolean>(false);
  const [userPosition, setUserPosition] = useState<number>(0);
  const anchorWallet: AnchorWallet | undefined = useAnchorWallet();
  const mainnet = new Connection(
    "https://rpc.helius.xyz/?api-key=cc778adb-f9ab-45da-ba44-b4096f663c16"
  );

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

  const fetchPlayerAccountsInfo = async () => {
    if (anchorProgram) {
      setFetchingLeaderboard(true);
      const playerAccounts = await anchorProgram.account.player.all();
      console.log(playerAccounts);
      if (playerAccounts[0] == undefined) {
        setUsersInfo([]);
      } else {
        for (let i = 0; i < playerAccounts.length; i++) {
          let owner: PublicKey | string = playerAccounts[i].account.owner;
          const favoriteDomain = await getFavoriteDomainName(owner);
          if (favoriteDomain != null) {
            owner = favoriteDomain + ".sol";
          } else {
            owner = owner.toBase58().slice(0,5) + "..." + owner.toBase58().slice(-5);
          }
          users.push({
            owner: owner,
            highscore: playerAccounts[i].account.highscore,
            gameplayed: playerAccounts[i].account.gamePlayed,
          });
        }
        users.sort(function (a, b) {
          if (a.highscore > b.highscore) {
            return -1;
          }
          if (a.highscore < b.highscore) {
            return 1;
          }
          return 0;
        });
        console.log(users);
        setUsersInfo(users);
        fetchUserPosition(users);
        setLeaderboardFetched(true);
        setFetchingLeaderboard(false);
      }
    }
  };

  useEffect(() => {
    fetchPlayerAccountsInfo();
  }, [anchorProgram]);

  const fetchUserPosition = async (users) => {
    setUserPosition(0);
    for (let i = 0; i < users.length; i++) {
      let owner: PublicKey | string = anchorWallet.publicKey;
      const favoriteDomain = await getFavoriteDomainName(owner);
      if (favoriteDomain != null) {
        owner = favoriteDomain + ".sol";
      } else {
        owner = owner.toBase58().slice(0,5) + "..." + owner.toBase58().slice(-5);
      }
      if (users[i]["owner"] == owner) {
        setUserPosition(i + 1);
      }
    }
  };

  const getFavoriteDomainName = async (ownerAddress) => {
    try {
      const { domain, reverse } = await getFavoriteDomain(
        mainnet,
        ownerAddress
      ); // modifier mainnet par connection
      return reverse;
    } catch (error) {
      return null;
    }
  };

  return (
    <div className="flex flex-col items-stretch gap-8 px-4 pt-16 mx-auto w-[60%]">
      <main className="flex flex-col gap-4">
        
        <Navbar />

        <div className="flex justify-center">
          <div className="font-bold uppercase text-5xl mt-10 text-[#FA6E00] underline">
            Leaderboard
          </div>
        </div>
        {anchorProgram && leaderboardFetched && !fetchingLeaderboard && (
          <div>
            {userPosition == 0 ? (
              <div className="flex justify-center mt-4 text-xl">
                Play at least one game to get a ranking
              </div>
            ) : (
              <div className="flex justify-center mt-4 text-xl">
                Your actual ranking is #{userPosition}
              </div>
            )}
            <div className="flex justify-center mt-6">
              <table className="border-2 border-gray-300 table-fixed sm:w-[600px] ">
                <thead className="text-xl">
                  <tr>
                    <th className="px-2 py-2">Position</th>
                    <th className="px-2 py-2">Player</th>
                    <th className="px-2 py-2">Highscore</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-300">
                  {usersInfo.map((value, index) => {
                    const position = index + 1;
                    const player = value.owner;
                    const highscore = value.highscore;
                    return (
                      <tr
                        className="divide-x divide-gray-300 text-center"
                        key={index}
                      >
                        <td className="px-2 py-2">#{position}</td>
                        <td className="px-2 py-2">{player}</td>
                        <td className="px-2 py-2">{highscore}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {!anchorProgram && (
          <div className="text-center mt-[25%] text-3xl font-bold text-[#FA6E00]">
            Please connect your wallet to see your ranking!
          </div>
        )}

        {fetchingLeaderboard && anchorProgram && (
          <div className="flex justify-center mt-[25%]">
            <div className="font-bold text-xl">
              <svg
                role="status"
                className="inline mr-3 w-4 h-4 text-black animate-spin"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="#E5E7EB"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentColor"
                />
              </svg>
              Fetching ranking
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
