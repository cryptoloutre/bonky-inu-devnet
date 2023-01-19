import type { NextPage } from "next";
import Head from "next/head";
import Achievements from "../components/Achievements";

const Home: NextPage = (props) => {
  return (
    <div className=" flex flex-col h-screen justify-between">
      <Head>
        <title>Bonky inu</title>
        <meta name="description" content="Bonky inu is a flappy bird like which allows you to earn $BONK and unlock achievements" />
      </Head>
      <Achievements />
    </div>
  );
};

export default Home;