import { Box, Button, Container, Flex, useBreakpointValue } from "@chakra-ui/react";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import { Content } from "../components/Content";
import { Editor } from "../components/Editor/Editor";
import { MobileNav, Navbar } from "../components/Navbar";
import { useUserContext } from "../contexts/UserContext";

const Home: NextPage = () => {
  const { fetchUser } = useUserContext();

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <Content isWide>
      <Editor />
    </Content>
  );
};

export default Home;
