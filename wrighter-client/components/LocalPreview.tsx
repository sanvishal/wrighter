import { Viewer } from "@bytemd/react";
import { Container, Text } from "@chakra-ui/react";
import { useLiveQuery } from "dexie-react-hooks";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { db, WrightIDB } from "../services/dbService";
import { pastePlugin } from "../services/pluginService";
import mathPlugin from "@bytemd/plugin-math-ssr";
import mediumZoom from "@bytemd/plugin-medium-zoom";
import gfmPluin from "@bytemd/plugin-gfm";
import highlightPlugin from "@bytemd/plugin-highlight-ssr";

export interface ILocalPreviewProps {
  // wright: WrightIDB;
}

export const LocalPreview = (): JSX.Element => {
  const router = useRouter();
  const [id, setId] = useState("");
  const wright = useLiveQuery(() => db.wrights.get(id), [id]);

  useEffect(() => {
    console.log(wright);
  }, [wright]);

  useEffect(() => {
    if (router.isReady && router?.query?.id) {
      setId((router?.query?.id || "") as string);
    }
  }, [router.isReady]);

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

  return (
    <Container maxW="5xl" pt={10} id="local-preview">
      {wright ? (
        <>
          <Text fontSize="sm" color="textLighter" mb="-5px">
            {new Date(wright.updatedAt || new Date().toISOString()).toLocaleString()}
          </Text>
          <Text fontSize="6xl" fontWeight="800">
            {wright.title || ""}
          </Text>
          <Viewer value={wright.content || ""} plugins={plugins} />
        </>
      ) : (
        <div>Loading...</div>
      )}
    </Container>
  );
};
