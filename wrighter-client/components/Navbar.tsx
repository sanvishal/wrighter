import {
  Box,
  Center,
  Flex,
  HStack,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Spinner,
  useColorMode,
  useDisclosure,
  useOutsideClick,
  VStack,
} from "@chakra-ui/react";
import Avvvatars from "avvvatars-react";
import { useKBar } from "kbar";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { FiBookOpen, FiCloud, FiCommand, FiDatabase, FiHash, FiKey, FiLogOut, FiMoon, FiSun } from "react-icons/fi";
import { TbBulb } from "react-icons/tb";
import { useQueryClient } from "react-query";
import { useUserContext } from "../contexts/UserContext";
import { logout } from "../services/authService";
import { CustomToolTip } from "./CustomTooltip";
import Logo from "./Logo";
import { TagTree } from "./TagTree";

export const MobileNav = (): JSX.Element => {
  const { user } = useUserContext();
  const router = useRouter();
  const { isAuthenticated } = useUserContext();
  const { colorMode, toggleColorMode } = useColorMode();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const queryclient = useQueryClient();
  const isSaving = queryclient.getQueryState("saveWrightQuery")?.isFetching;
  const { query } = useKBar();
  const { isOpen: isTagTreeOpen, onOpen: onTagTreeOpen, onClose: onTagTreeClose, onToggle: onTagTreeToggle } = useDisclosure();

  const handleLogOut = async () => {
    setIsLoggingOut(true);
    await logout();
    // fake timeout cuz logout cuz cookie clearing is not consistent
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoggingOut(false);
    router.push("/signin");
  };

  return (
    <>
      <Box w="full" h={14} bg="bgDark" pos="fixed" bottom="0" borderTopRadius={10} zIndex={2}>
        <Flex alignItems="center" justifyContent="space-between" w="full" flexDirection="row" px={2} h="full">
          <HStack spacing={4} h="full">
            <Center w="40px" h="40px">
              <Logo />
            </Center>
            <Box w={0.5} h={9} bg="bgLight" borderRadius={10} ml={3} />
            <Box>
              <IconButton
                aria-label="go to bites"
                variant="ghost"
                onClick={() => {
                  router.push("/bites", undefined, { shallow: true });
                }}
                size="sm"
                role="group"
              >
                <Icon as={TbBulb} strokeWidth={2.5} fontSize="lg" />
              </IconButton>
            </Box>
            <Box>
              <IconButton
                aria-label="go to wrights"
                variant="ghost"
                onClick={() => {
                  router.push("/wrights", undefined, { shallow: true });
                }}
                size="sm"
                role="group"
              >
                <Icon as={FiBookOpen} strokeWidth={2.5} />
              </IconButton>
            </Box>
            <Box>
              <IconButton
                aria-label="open tags"
                variant="ghost"
                onClick={() => {
                  onTagTreeToggle();
                }}
                _hover={{ bg: "successGreenTransBg", color: "successGreen" }}
                _focus={{ bg: "successGreenTransBg", color: "successGreen" }}
                size="sm"
                role="group"
              >
                <Icon as={FiHash} strokeWidth={2.5} fontSize="lg" />
              </IconButton>
            </Box>
          </HStack>
          <HStack spacing={4}>
            <Box>
              <IconButton
                aria-label="open command bar (cmd or ctrl + shift + p)"
                variant="ghost"
                icon={<Icon as={FiCommand} strokeWidth={2.5} />}
                size="sm"
                onClick={() => {
                  query.toggle();
                }}
              />
            </Box>
            <Box pos="relative" style={{ marginTop: "5px" }}>
              {isSaving ? (
                <Spinner
                  sx={{
                    "--spinner-size": "1rem",
                    borderBottomColor: "textLighter",
                    borderLeftColor: "textLighter",
                    borderTopColor: "transparent",
                    borderRightColor: "transparent",
                  }}
                />
              ) : (
                <>
                  <Box w="5px" h="5px" bg="green.400" borderRadius={100} pos="absolute" bottom="8px" right="0px"></Box>
                  <Icon as={isAuthenticated() ? FiCloud : FiDatabase} strokeWidth={2.5} color="textLighter" />
                </>
              )}
            </Box>
            <Box>
              <Menu placement="top-start">
                <MenuButton>
                  <Box cursor="pointer">
                    <Avvvatars value={user?.email || "wrighter guest"} style="shape" />
                  </Box>
                </MenuButton>
                <MenuList minWidth="190px">
                  <MenuItem isDisabled fontSize="sm">
                    {user?.name || "wrighter guest"}
                  </MenuItem>
                  <MenuDivider borderColor="containerBorder" opacity={1} my={1.5} />
                  <MenuItem
                    role="group"
                    closeOnSelect={false}
                    onClick={toggleColorMode}
                    icon={<Icon as={colorMode === "light" ? FiMoon : FiSun} strokeWidth={2.5} mt={1} />}
                  >
                    Toggle theme
                  </MenuItem>
                  {isAuthenticated() ? (
                    <MenuItem
                      closeOnSelect={false}
                      icon={
                        !isLoggingOut ? (
                          <Icon as={FiLogOut} strokeWidth={2.5} mt={1} />
                        ) : (
                          <Spinner
                            mt={0.5}
                            sx={{
                              "--spinner-size": "0.7rem",
                              borderBottomColor: "textLighter",
                              borderLeftColor: "textLighter",
                              borderTopColor: "transparent",
                              borderRightColor: "transparent",
                            }}
                          />
                        )
                      }
                      onClick={handleLogOut}
                      aria-label="Logout"
                      _hover={{ bg: "errorRedTransBg" }}
                    >
                      Logout
                    </MenuItem>
                  ) : (
                    <MenuItem
                      closeOnSelect={false}
                      icon={<Icon as={FiKey} strokeWidth={2.5} mt={1} />}
                      onClick={() => router.push("/signin")}
                      aria-label="signin"
                    >
                      Signin
                    </MenuItem>
                  )}
                </MenuList>
              </Menu>
            </Box>
          </HStack>
        </Flex>
      </Box>
      <TagTree isOpen={isTagTreeOpen} onOpen={onTagTreeOpen} onClose={onTagTreeClose} isMobile />
    </>
  );
};

export const Navbar = () => {
  const { user } = useUserContext();
  const router = useRouter();
  const { colorMode, toggleColorMode } = useColorMode();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { isAuthenticated } = useUserContext();
  const queryclient = useQueryClient();
  const isSaving = queryclient.getQueryState("saveWrightQuery")?.isFetching;
  const { query } = useKBar();
  const { isOpen: isTagTreeOpen, onOpen: onTagTreeOpen, onClose: onTagTreeClose, onToggle: onTagTreeToggle } = useDisclosure();

  const handleLogOut = async () => {
    setIsLoggingOut(true);
    await logout();
    setIsLoggingOut(false);
    router.push("/signin");
  };

  return (
    <>
      <Box
        minH="100vh"
        top="0"
        w={14}
        bg="bgDark"
        py={2}
        borderRight="1px solid"
        borderRightColor="containerBorder"
        pos="relative"
        zIndex={9}
        id="navbar"
      >
        <Flex alignItems="center" pos="fixed" w={14} justifyContent="space-between" h="full" flexDirection="column">
          <VStack spacing={4}>
            <Center w="40px" h="40px">
              <Logo />
            </Center>
            <Box w={9} h={0.5} bg="bgLight" borderRadius={10} mb={3} />
            <Box>
              <CustomToolTip label="go to bites" placement="right">
                <IconButton
                  aria-label="go to bites"
                  variant="ghost"
                  onClick={() => {
                    router.push("/bites", undefined, { shallow: true });
                  }}
                  _hover={{ bg: "biteAccentColorTrans", color: "biteAccentColor" }}
                  _focus={{ bg: "biteAccentColorTrans", color: "biteAccentColor" }}
                  size="sm"
                  role="group"
                >
                  <Icon as={TbBulb} strokeWidth={2.5} fontSize="lg" />
                </IconButton>
              </CustomToolTip>
            </Box>
            <Box>
              <CustomToolTip label="go to wrights" placement="right">
                <IconButton
                  aria-label="go to wrights"
                  variant="ghost"
                  _hover={{ bg: "accentColorTrans", color: "accentColor" }}
                  _focus={{ bg: "accentColorTrans", color: "accentColor" }}
                  onClick={() => {
                    router.push("/wrights", undefined, { shallow: true });
                  }}
                  size="sm"
                  role="group"
                >
                  <Icon as={FiBookOpen} strokeWidth={2.5} />
                </IconButton>
              </CustomToolTip>
            </Box>
            <Box>
              <CustomToolTip label="show tags" placement="right">
                <IconButton
                  aria-label="open tags"
                  variant="ghost"
                  onClick={() => {
                    onTagTreeToggle();
                  }}
                  onKeyDown={(e: any) => {
                    if (e.key === "Escape") {
                      onTagTreeClose();
                    }
                  }}
                  _hover={{ bg: "successGreenTransBg", color: "successGreen" }}
                  _focus={{ bg: "successGreenTransBg", color: "successGreen" }}
                  size="sm"
                  role="group"
                >
                  <Icon as={FiHash} strokeWidth={2.5} fontSize="lg" />
                </IconButton>
              </CustomToolTip>
            </Box>
          </VStack>
          <VStack pb={5} spacing={4}>
            <CustomToolTip label="open command bar (cmd or ctrl + shift + p)" placement="right">
              <Box>
                <IconButton
                  aria-label="open command bar (cmd or ctrl + shift + p)"
                  variant="ghost"
                  icon={<Icon as={FiCommand} strokeWidth={2.5} />}
                  size="sm"
                  onClick={() => {
                    query.toggle();
                  }}
                />
              </Box>
            </CustomToolTip>
            <CustomToolTip
              label={
                !isSaving
                  ? isAuthenticated()
                    ? "data synced to cloud"
                    : "data synced to local database"
                  : isAuthenticated()
                  ? "syncing to cloud"
                  : "syncing to local database"
              }
              placement="right"
            >
              <Box pos="relative">
                {isSaving ? (
                  <Spinner
                    sx={{
                      "--spinner-size": "1rem",
                      borderBottomColor: "textLighter",
                      borderLeftColor: "textLighter",
                      borderTopColor: "transparent",
                      borderRightColor: "transparent",
                    }}
                  />
                ) : (
                  <>
                    <Box w="5px" h="5px" bg="green.400" borderRadius={100} pos="absolute" bottom="8px" right="0px"></Box>
                    <Icon as={isAuthenticated() ? FiCloud : FiDatabase} strokeWidth={2.5} color="textLighter" />
                  </>
                )}
              </Box>
            </CustomToolTip>
            <Box>
              <Menu placement="right">
                <MenuButton>
                  <Box cursor="pointer">
                    <Avvvatars value={user?.email || "wrighter guest"} style="shape" />
                  </Box>
                </MenuButton>
                <MenuList minWidth="190px">
                  <MenuItem isDisabled fontSize="sm">
                    {user?.name || "wrighter guest"}
                  </MenuItem>
                  <MenuDivider borderColor="containerBorder" opacity={1} my={1.5} />
                  <MenuItem
                    role="group"
                    closeOnSelect={false}
                    onClick={toggleColorMode}
                    icon={<Icon as={colorMode === "light" ? FiMoon : FiSun} strokeWidth={2.5} mt={1} />}
                  >
                    Toggle theme
                  </MenuItem>
                  {isAuthenticated() ? (
                    <MenuItem
                      closeOnSelect={false}
                      icon={
                        !isLoggingOut ? (
                          <Icon as={FiLogOut} strokeWidth={2.5} mt={1} />
                        ) : (
                          <Spinner
                            mt={0.5}
                            sx={{
                              "--spinner-size": "0.7rem",
                              borderBottomColor: "textLighter",
                              borderLeftColor: "textLighter",
                              borderTopColor: "transparent",
                              borderRightColor: "transparent",
                            }}
                          />
                        )
                      }
                      onClick={handleLogOut}
                      aria-label="Logout"
                      _hover={{ bg: "errorRedTransBg" }}
                    >
                      Logout
                    </MenuItem>
                  ) : (
                    <MenuItem
                      closeOnSelect={false}
                      icon={<Icon as={FiKey} strokeWidth={2.5} mt={1} />}
                      onClick={() => router.push("/signin")}
                      aria-label="signin"
                    >
                      Signin
                    </MenuItem>
                  )}
                </MenuList>
              </Menu>
            </Box>
          </VStack>
        </Flex>
      </Box>
      <TagTree isOpen={isTagTreeOpen} onOpen={onTagTreeOpen} onClose={onTagTreeClose} isMobile={false} />
    </>
  );
};
