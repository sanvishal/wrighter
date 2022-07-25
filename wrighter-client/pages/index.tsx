import {
  Box,
  Button,
  Center,
  Container,
  HStack,
  Icon,
  IconButton,
  Text,
  useColorMode,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { NextPage } from "next";
import Head from "next/head";
import { FaICursor } from "react-icons/fa";
import { FiCornerRightDown, FiMoon, FiMousePointer, FiSun } from "react-icons/fi";
import { GrainyTexture } from "../components/GrainyTexture";
import { GuestWarn } from "../components/GuestWarn";
import Logo from "../components/Logo";

const Home: NextPage = () => {
  const { isOpen: isGuestWarnOpen, onOpen: onGuestWarnOpen, onClose: onGuestWarnClose } = useDisclosure();
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <>
      <Head>
        <title>wrighter</title>
      </Head>
      <GrainyTexture />
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
            <IconButton
              variant="ghost"
              icon={colorMode === "dark" ? <FiSun /> : <FiMoon />}
              aria-label="theme toggle"
              onClick={toggleColorMode}
            />
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
        <Center w="full" role="group" pos="relative" className="landing-img-cont">
          <Text
            display={{ base: "none", md: "block" }}
            fontSize="6rem"
            pos="absolute"
            fontWeight="800"
            color="textLighter"
            opacity={0.15}
            zIndex={-1}
            top="-20px"
            right="-40%"
            w="full"
            transform="rotate(-90deg)"
          >
            The Wrighter
          </Text>
          <Box _groupHover={{ opacity: "0" }} opacity="1" pos="absolute" top="0" mt={10} transition="opacity 0.17s ease-in-out">
            <HStack w="full" justifyContent="space-between">
              <HStack>
                <Text fontSize="xx-large" fontWeight="800" color="textLight">
                  Editor
                </Text>
                <Icon as={FiCornerRightDown} />
              </HStack>
              <HStack opacity={0.6}>
                <Text color="textLighter">(hover me)</Text>
                <Icon as={FiMousePointer} color="textLighter" width="0.9em" height="0.9em" />
              </HStack>
            </HStack>
            <img
              src={colorMode === "dark" ? "editor-d.png" : "editor-l.png"}
              alt="wrighter editor"
              style={{ borderRadius: "10px", zIndex: 1, boxShadow: "var(--chakra-shadows-lg)" }}
            />
          </Box>
          <Box _groupHover={{ opacity: "1" }} opacity="0" pos="absolute" top="0" mt={10} transition="opacity 0.17s ease-in-out">
            <HStack w="full" justifyContent="space-between">
              <HStack>
                <Text fontSize="xx-large" fontWeight="800" color="textLight">
                  Viewer
                </Text>
                <Icon as={FiCornerRightDown} />
              </HStack>
              <HStack opacity={0.6}>
                <Text color="textLighter">(hover me)</Text>
                <Icon as={FiMousePointer} color="textLighter" width="0.9em" height="0.9em" />
              </HStack>
            </HStack>
            <img
              src={colorMode === "dark" ? "viewer-d.png" : "viewer-l.png"}
              alt="wrighter viewer"
              style={{ borderRadius: "10px", zIndex: 1, boxShadow: "var(--chakra-shadows-lg)" }}
            />
          </Box>
        </Center>
        <VStack mt={5} alignItems="flex-start" pos="relative">
          <Text>
            <Text fontWeight="bold" fontSize="xxx-large" lineHeight={1}>
              Your <span style={{ opacity: 0.25 }}>**</span>
              <span style={{ fontWeight: "900" }}>next writing companion,</span>
              <span style={{ opacity: 0.25 }}>**</span>
            </Text>
            <Text fontSize="xxx-large" fontWeight="bold">
              feature packed!
            </Text>
          </Text>
          <Text
            display={{ base: "none", md: "block" }}
            fontSize="6rem"
            pos="absolute"
            fontWeight="800"
            color="textLighter"
            opacity={0.15}
            zIndex={-1}
            bottom="110px"
            left="-57%"
            w="full"
            transform="rotate(-270deg)"
          >
            The Features
          </Text>
          <Box h="800px"></Box>
        </VStack>
        <GuestWarn isOpen={isGuestWarnOpen} onClose={onGuestWarnClose} />
      </Container>
    </>
  );
};

export default Home;
