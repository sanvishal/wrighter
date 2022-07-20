import { Viewer } from "@bytemd/react";
import { Center, Container, Spinner, Text } from "@chakra-ui/react";
import { useLiveQuery } from "dexie-react-hooks";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { db, WrightIDB } from "../services/dbService";
import { pastePlugin } from "../services/pluginService";
import mathPlugin from "@bytemd/plugin-math-ssr";
import mediumZoom from "@bytemd/plugin-medium-zoom";
import gfmPluin from "@bytemd/plugin-gfm";
import highlightPlugin from "@bytemd/plugin-highlight-ssr";
import { useUserContext } from "../contexts/UserContext";
import { useQuery } from "react-query";
import { getWright } from "../services/wrightService";

export interface ILocalPreviewProps {
  // wright: WrightIDB;
}

export const LocalPreview = (): JSX.Element => {
  const router = useRouter();
  const [id, setId] = useState("");
  const localWright = useLiveQuery(() => db.wrights.get(id), [id]);
  const { isAuthenticated, isUserLoading } = useUserContext();

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

  const plugins = useMemo(
    () => [
      mediumZoom({ background: "var(--chakra-colors-bgLight)" }),
      pastePlugin(),
      highlightPlugin(),
      gfmPluin(),
      mathPlugin({ katexOptions: { output: "html" } }),
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
            <Text fontSize="6xl" fontWeight="800">
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

  return (
    <Container maxW="5xl" pt={10} id="local-preview">
      {isAuthenticated() && !isUserLoading && remoteWright ? (
        <>
          <Text fontSize="sm" color="textLighter" mb="-5px">
            {new Date(remoteWright.updatedAt || new Date().toISOString()).toLocaleString()}
          </Text>
          <Text fontSize="6xl" fontWeight="800">
            {remoteWright.title || ""}
          </Text>
          <Viewer value={remoteWright.content || ""} plugins={plugins} />
        </>
      ) : isWrightLoading ? (
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
