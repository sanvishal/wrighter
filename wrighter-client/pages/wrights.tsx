import { Box, Center, Container, HStack, Icon, Text, VStack } from "@chakra-ui/react";
import { useLiveQuery } from "dexie-react-hooks";
import { NextPage } from "next";
import dynamic from "next/dynamic";
import { useEffect } from "react";
import { FiBookOpen } from "react-icons/fi";
import { Content } from "../components/Content";
import { useUserContext } from "../contexts/UserContext";
const WrightsList = dynamic(() => import("../components/WrightsList").then((module) => module.WrightsList) as any, {
  ssr: false,
});

const Wrights: NextPage = () => {
  return (
    <Content>
      <WrightsList />
    </Content>
  );
};

export default Wrights;
