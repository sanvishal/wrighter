import { Viewer } from "@bytemd/react";
import { Box, Center, Container, IconButton, Spinner, Text, useColorMode } from "@chakra-ui/react";
import { useLiveQuery } from "dexie-react-hooks";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { db, WrightIDB } from "../services/dbService";
import { autoLinkHeadingsPlugin, figCaptionPlugin, pastePlugin } from "../services/pluginService";
import mathPlugin from "@bytemd/plugin-math-ssr";
import mediumZoom from "@bytemd/plugin-medium-zoom";
import gfmPluin from "@bytemd/plugin-gfm";
import highlightPlugin from "@bytemd/plugin-highlight-ssr";
import { useUserContext } from "../contexts/UserContext";
import { useQuery } from "react-query";
import { getWright } from "../services/wrightService";
import { FiMoon, FiSun } from "react-icons/fi";
import Head from "next/head";
import { scrollAnchorIntoView } from "../utils";

export interface ILocalPreviewProps {
  // wright: WrightIDB;
}

function useIsMounted() {
  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;

    return () => {
      isMounted.current = false;
    };
  }, []);

  return useCallback(() => isMounted.current, []);
}

export const LocalPreview = (): JSX.Element => {
  const router = useRouter();
  const [id, setId] = useState("");
  const localWright = useLiveQuery(() => db.wrights.get(id), [id]);
  const { isAuthenticated, isUserLoading } = useUserContext();
  const { toggleColorMode, colorMode } = useColorMode();

  useEffect(() => {
    if (router.isReady && router?.query?.id) {
      setId((router?.query?.id || "") as string);
    }
  }, [router.isReady]);

  const {
    refetch: getWrightRequest,
    data: remoteWright,
    isFetching: isWrightLoading,
    status: wrightGetStatus,
  } = useQuery("getPreviewWrightQuery", () => getWright(false, id), {
    enabled: false,
    refetchOnWindowFocus: true,
    retry: false,
  });

  useEffect(() => {
    if (isAuthenticated() && !isUserLoading && id) {
      getWrightRequest();
    }
  }, [isAuthenticated, isUserLoading, id]);

  useEffect(() => {
    scrollAnchorIntoView();
  }, [isWrightLoading, localWright?.content, remoteWright?.content]);

  const plugins = useMemo(
    () => [
      figCaptionPlugin(),
      mediumZoom({ background: "var(--chakra-colors-bgLight)" }),
      highlightPlugin(),
      gfmPluin(),
      mathPlugin({ katexOptions: { output: "html" } }),
      autoLinkHeadingsPlugin(),
    ],
    []
  );

  const renderLocalWright = () => {
    if (!isAuthenticated()) {
      if (localWright) {
        return (
          <>
            <Text fontSize="sm" color="textLighter" mb="-5px">
              {new Date(localWright.updatedAt || new Date().toISOString()).toLocaleString()}
            </Text>
            <Text fontWeight="800" lineHeight="1.03" my={4} mb={8} fontSize={{ base: "2.1em", md: "6xl" }}>
              {localWright.title || ""}
            </Text>
            <Viewer value={localWright.content || ""} plugins={plugins} />
          </>
        );
      }
      return (
        <Center>
          <Spinner
            sx={{
              "--spinner-size": "2rem",
              borderBottomColor: "textLighter",
              borderLeftColor: "textLighter",
              borderTopColor: "transparent",
              borderRightColor: "transparent",
            }}
          />
        </Center>
      );
    }
    return null;
  };

  const getPageTitle = () => {
    if (remoteWright) {
      return remoteWright.title;
    }
    if (localWright) {
      return localWright.title;
    }
    return "wrighter • wright";
  };

  return (
    <Container maxW="5xl" pt={10} id="wright-preview" pos="relative" pb={10}>
      <Head>
        <title>{getPageTitle()}</title>
      </Head>
      <Box pos="fixed" bottom="20px" left="20px">
        <IconButton
          aria-label="toggle theme"
          as={colorMode === "dark" ? FiMoon : FiSun}
          onClick={toggleColorMode}
          cursor="pointer"
          variant="ghost"
          p={3}
        ></IconButton>
      </Box>
      {isAuthenticated() && !isUserLoading && remoteWright ? (
        <>
          <Text fontSize="sm" color="textLighter" mb="-5px">
            {new Date(remoteWright.updatedAt || new Date().toISOString()).toLocaleString()}
          </Text>
          <Text fontWeight="800" lineHeight="1.03" my={4} mb={8} fontSize={{ base: "2.1em", md: "6xl" }}>
            {remoteWright.title || ""}
          </Text>
          <Viewer value={remoteWright.content || ""} plugins={plugins} />
        </>
      ) : isWrightLoading || isUserLoading ? (
        <Center>
          <Spinner
            sx={{
              "--spinner-size": "2rem",
              borderBottomColor: "textLighter",
              borderLeftColor: "textLighter",
              borderTopColor: "transparent",
              borderRightColor: "transparent",
            }}
          />
        </Center>
      ) : (
        wrightGetStatus === "error" && (
          <Center>
            <Text fontSize="2xl" fontWeight="800" color="textLighter">
              404! Wright not found
            </Text>
          </Center>
        )
      )}
      {renderLocalWright()}
    </Container>
  );
};
