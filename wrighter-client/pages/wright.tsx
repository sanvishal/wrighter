import { Box, Center, Container, HStack, Icon, Text, VStack } from "@chakra-ui/react";
import { useLiveQuery } from "dexie-react-hooks";
import { NextPage } from "next";
import dynamic from "next/dynamic";
import Head from "next/head";
import { Content } from "../components/Content";
import { ILocalPreviewProps } from "../components/LocalPreview";
const LocalPreview = dynamic<ILocalPreviewProps>(
  () => import("../components/LocalPreview").then((module) => module.LocalPreview) as any,
  {
    ssr: false,
  }
);

const Wrights: NextPage = () => {
  return (
    <>
      <Head>
        <title>wrighter • wright</title>
      </Head>
      <LocalPreview />
    </>
  );
};

export default Wrights;
