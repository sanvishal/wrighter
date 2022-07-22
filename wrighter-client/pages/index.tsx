import { Box, Button, Container, HStack, Input, Spacer, Text, useDisclosure, VStack } from "@chakra-ui/react";
import axios from "axios";
import { NextPage } from "next";
import { useState } from "react";
import { GuestWarn } from "../components/GuestWarn";
import Logo from "../components/Logo";
import { Navbar } from "../components/Navbar";
import { getUser, login, logout } from "../services/authService";

const Home: NextPage = () => {
  const { isOpen: isGuestWarnOpen, onOpen: onGuestWarnOpen, onClose: onGuestWarnClose } = useDisclosure();

  return (
    <>
      <Box pos="fixed" top="0" left="0" w="full" h="100vh" id="waves-bg-overlay" zIndex="-1"></Box>
      <Box pos="fixed" top="0" left="0" w="full" h="100vh" id="waves-bg" zIndex="-2"></Box>
      <Container maxW="8xl">
        <HStack w="full" justifyContent="space-between" pt={4}>
          <HStack w="50px" h="50px" spacing={3}>
            <Box>
              <Logo />
            </Box>
            <Text fontWeight="800" fontSize="xl">
              wrighter
            </Text>
          </HStack>
          <HStack spacing={4}>
            <Button as="a" fontWeight="800" href="/signin">
              Log In
            </Button>
            <Box bg="bg">
              <Button fontWeight="800" onClick={onGuestWarnOpen} variant="ghost">
                Guest Mode
              </Button>
            </Box>
          </HStack>
        </HStack>
        <VStack mt={24} w="full" textAlign="center" spacing={0}>
          <Text fontSize="x-large" color="textLighter" fontWeight="bold">
            Your new favourite markdown editor
          </Text>
          <Text fontSize="5rem" fontWeight={800}>
            Minimal yet powerful writing app
          </Text>
          <Box h={8} />
          <Button size="lg" as="a" fontWeight="800" href="/signin">
            Start Wrighting!
          </Button>
          <Text fontSize="lg" color="textLighter" pt={8}>
            or
          </Text>
          <Button size="lg" fontWeight="800" variant="ghost" onClick={onGuestWarnOpen}>
            Start as a Guest
          </Button>
          <Text color="textLighter" fontSize="md">
            (no signup required)
          </Text>
        </VStack>
        <GuestWarn isOpen={isGuestWarnOpen} onClose={onGuestWarnClose} />
      </Container>
    </>
  );
};

export default Home;
