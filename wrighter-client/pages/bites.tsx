import { Box, Center, Container, HStack, Icon, Spinner, Text, VStack } from "@chakra-ui/react";
import { NextPage } from "next";
import dynamic from "next/dynamic";
import Head from "next/head";
import { Content } from "../components/Content";
import { SuspenseFallback } from "../components/SuspenseFallback";
const Bites = dynamic(() => import("../components/Bites/Bites").then((module) => module.Bites) as any, {
  ssr: false,
  loading: () => <SuspenseFallback />,
});

const BitesPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>wrighter • bites</title>
      </Head>
      <Content>
        <Bites />
      </Content>
    </>
  );
};

export default BitesPage;
