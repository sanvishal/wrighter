import {
  Box,
  Button,
  Center,
  Flex,
  Icon,
  IconButton,
  Spinner,
  Text,
  useBreakpointValue,
  useColorMode,
  VStack,
} from "@chakra-ui/react";
import Logo from "./Logo";
import NavLink from "./NavLink";
import Avvvatars from "avvvatars-react";
import { FiBookOpen, FiCloud, FiDatabase, FiLogOut, FiMoon, FiSun } from "react-icons/fi";
import { CustomToolTip } from "./CustomTooltip";
import { useUserContext } from "../contexts/UserContext";
import { useRouter } from "next/router";
import { logout } from "../services/authService";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useQuery, useQueryClient } from "react-query";

export const MobileNav = (): JSX.Element => {
  return <Box w="full" h={14} bg="bgDark" pos="fixed" bottom="0"></Box>;
};

export const Navbar = () => {
  const { user } = useUserContext();
  const router = useRouter();
  const { colorMode, toggleColorMode } = useColorMode();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { isAuthenticated } = useUserContext();
  const queryclient = useQueryClient();
  const isSaving = queryclient.getQueryState("saveWrightQuery")?.isFetching;

  const handleLogOut = async () => {
    setIsLoggingOut(true);
    await logout();
    setIsLoggingOut(false);
    router.push("/signin");
  };

  // useEffect(() => {
  //   console.log(saveQuery);
  // }, [saveQuery]);

  return (
    <Box minH="100vh" top="0" w={14} bg="bgDark" py={2} borderRight="1px solid" borderRightColor="containerBorder" pos="relative">
      <Flex alignItems="center" pos="fixed" w={14} justifyContent="space-between" h="full" flexDirection="column">
        <VStack spacing={4}>
          <Center w="40px" h="40px">
            <Logo />
          </Center>
          <Box w={9} h={0.5} bg="bgLight" borderRadius={10} mb={3} />
          <Box>
            <IconButton
              aria-label="Toggle Mode"
              variant="ghost"
              onClick={() => {
                router.push("/wrights");
              }}
              size="sm"
              role="group"
            >
              <Icon transition="transform 0.2s ease-in-out" as={FiBookOpen} strokeWidth={2.5} />
            </IconButton>
          </Box>
        </VStack>
        <VStack pb={5} spacing={4}>
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
            <IconButton aria-label="Toggle Mode" variant="ghost" onClick={toggleColorMode} size="sm" role="group">
              <Icon
                transition="transform 0.2s ease-in-out"
                _groupActive={{
                  transform: `rotate(${colorMode === "dark" ? "360deg" : "-360deg"}) scale(${colorMode === "dark" ? 0.1 : 1.25})`,
                }}
                as={colorMode === "light" ? FiMoon : FiSun}
                strokeWidth={2.5}
              />
            </IconButton>
          </Box>
          <CustomToolTip label={user?.email || "guest wrighter"} placement="right">
            <Box cursor="pointer">
              <Avvvatars value={user?.email || "wrighter guest"} style="shape" />
            </Box>
          </CustomToolTip>
          <Box>
            <CustomToolTip label="Logout" placement="right">
              <IconButton
                isLoading={isLoggingOut}
                onClick={handleLogOut}
                aria-label="Logout"
                icon={<FiLogOut />}
                size="sm"
                variant="ghost"
                _hover={{ bg: "errorRedTransBg", color: "white" }}
              />
            </CustomToolTip>
          </Box>
        </VStack>
      </Flex>
    </Box>
  );
};
