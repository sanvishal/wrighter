import { Box, Button, Container, Flex, useBreakpointValue } from "@chakra-ui/react";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import { Editor } from "../components/Editor/Editor";
import { MobileNav, Navbar } from "../components/Navbar";
import { useUserContext } from "../contexts/UserContext";

const Home: NextPage = () => {
  const mobileCheck = useBreakpointValue({ base: { isMobile: true }, md: { isMobile: false } });
  const { fetchUser } = useUserContext();

  useEffect(() => {
    fetchUser();
  }, []);

  return mobileCheck?.isMobile ? (
    <Box h="100vh">
      <Container maxW="full" p={0}>
        <Editor />
      </Container>
      <MobileNav />
    </Box>
  ) : (
    <Flex>
      <Navbar />
      <Container maxW="8xl" pt={2}>
        <Editor />
      </Container>
    </Flex>
  );
};

export default Home;
