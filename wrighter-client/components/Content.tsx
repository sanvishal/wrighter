import { Box, Container, Flex, useBreakpointValue } from "@chakra-ui/react";
import { useEffect } from "react";
import { useUserContext } from "../contexts/UserContext";
import { MobileNav, Navbar } from "./Navbar";

export const Content = ({
  children,
  isWide = false,
}: {
  children: JSX.Element | JSX.Element[];
  isWide?: boolean;
}): JSX.Element => {
  const mobileCheck = useBreakpointValue({ base: { isMobile: true }, md: { isMobile: false } });

  const { fetchUser } = useUserContext();

  useEffect(() => {
    fetchUser();
  }, []);

  return mobileCheck?.isMobile ? (
    <Box h="100vh">
      <Container maxW="full" p={0}>
        {children}
      </Container>
      <MobileNav />
    </Box>
  ) : (
    <Flex>
      <Navbar />
      <Container maxW={isWide ? "8xl" : "5xl"} pt={2}>
        {children}
      </Container>
    </Flex>
  );
};
