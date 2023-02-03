import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Navbar() {
    const [toggleMenu, setToggleMenu] = useState(false);
    const [width, setWidth] = useState(undefined);

    useEffect(() => {
      setWidth(window.innerWidth);
    })

    const toggle = () => {
        setToggleMenu(!toggleMenu);
      };
    
      useEffect(() => {
        const changeWidth = () => {
          setWidth(window.innerWidth);
    
          if (window.innerWidth >= 758) {
            setToggleMenu(false);
          }
        };
    
        window.addEventListener("resize", changeWidth);
    
        return () => {
          window.removeEventListener("resize", changeWidth);
        };
      }, []);

    return (
        <nav className="bg-white border-gray-200 px-2 sm:px-4 py-2.5 rounded">
        <div className="container flex flex-wrap items-center justify-between mx-auto">
          <Link href="/">
            <div className="flex items-center">
              <span className="self-center text-xl hover:cursor-pointer font-bold whitespace-nowrap uppercase">
                Bonky Inu
              </span>
            </div>
          </Link>
          <button
            onClick={toggle}
            type="button"
            className="inline-flex navbar-toggler items-center p-2 ml-3 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="w-6 h-6"
              aria-hidden="true"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clipRule="evenodd"
              ></path>
            </svg>
          </button>
          <div className="w-full md:block md:w-auto">
            {(toggleMenu || width >= 768) && (
              <ul className="flex items-center flex-col p-4 mt-4 md:flex-row md:space-x-8 md:mt-0 md:text-xl">
                <li>
                  <Link href="/">
                    <div className="block py-2 pl-3 hover:cursor-pointer font-bold pr-4 text-black md:p-0 uppercase">
                      Game
                    </div>
                  </Link>
                </li>
                <li>
                  <Link href="/leaderboard">
                    <div className="block py-2 pl-3 hover:cursor-pointer font-bold pr-4 text-black md:p-0 uppercase">
                      Leaderboard
                    </div>
                  </Link>
                </li>
                <li>
                  <Link href="/achievements">
                    <div className="block py-2 pl-3 hover:cursor-pointer font-bold pr-4 text-black md:p-0 uppercase">
                      Achievements
                    </div>
                  </Link>
                </li>
                <li>
                  <WalletMultiButton className="!bg-gray-900 hover:scale-105" />
                </li>
              </ul>
            )}
          </div>
        </div>
      </nav>
    )
  }