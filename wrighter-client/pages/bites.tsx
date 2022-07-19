import { Box, Center, Container, HStack, Icon, Text, VStack } from "@chakra-ui/react";
import { NextPage } from "next";
import dynamic from "next/dynamic";
import { Content } from "../components/Content";
const Bites = dynamic(() => import("../components/Bites/Bites").then((module) => module.Bites) as any, {
  ssr: false,
});

const BitesPage: NextPage = () => {
  return (
    <Content>
      <Bites />
    </Content>
  );
};

export default BitesPage;
