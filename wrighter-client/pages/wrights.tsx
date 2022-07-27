import { Box, Center, Container, HStack, Icon, Text, VStack } from "@chakra-ui/react";
import { useLiveQuery } from "dexie-react-hooks";
import { NextPage } from "next";
import dynamic from "next/dynamic";
import Head from "next/head";
import { useEffect } from "react";
import { FiBookOpen } from "react-icons/fi";
import { Content } from "../components/Content";
import { SuspenseFallback } from "../components/SuspenseFallback";
import { useUserContext } from "../contexts/UserContext";
const WrightsList = dynamic(() => import("../components/Wrights/WrightsList").then((module) => module.WrightsList) as any, {
  ssr: false,
  loading: () => <SuspenseFallback message="scanning your wrights..." />,
});

const Wrights: NextPage = () => {
  return (
    <Content>
      <Head>
        <title>wrighter • wrights</title>
      </Head>
      <WrightsList />
    </Content>
  );
};

export default Wrights;
