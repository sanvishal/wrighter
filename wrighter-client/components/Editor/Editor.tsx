import { Box } from "@chakra-ui/react";
import { Editor as ByteMdEditor } from "@bytemd/react";
import { useEffect, useMemo, useState } from "react";
import gfmPluin from "@bytemd/plugin-gfm";
import highlightPlugin from "@bytemd/plugin-highlight-ssr";
import { useRouter } from "next/router";
import debounce from "lodash.debounce";
import { db, WrightIDB } from "../../services/dbService";
import { useQuery } from "react-query";
import { useUserContext } from "../../contexts/UserContext";
import { clearAndCreateEditorContext, getWright } from "../../services/wrightService";
import { Wright } from "../../types";

export const Editor = ({
  editorOnSaveHandler = () => {},
  initWright = {},
}: {
  editorOnSaveHandler: () => void;
  initWright: Wright | WrightIDB;
}) => {
  const [content, setContent] = useState("");
  const [id, setId] = useState("");
  const router = useRouter();

  const plugins = useMemo(() => [highlightPlugin(), gfmPluin()], []);

  const editorOnChange = async (value: string) => {
    if (id) {
      await db.editorContext.update(id, {
        content: value,
        head: value.substring(0, 50),
      });
      editorOnSaveHandler();
    }
  };

  const debouncedEditorOnChange = useMemo(() => debounce(editorOnChange, 500), [id]);

  useEffect(() => {
    if (initWright) {
      setContent(initWright.content || "");
    }
  }, [initWright]);

  useEffect(() => {
    if (router.isReady && router?.query?.id) {
      setId((router?.query?.id || "") as string);
    }
  }, [router.isReady]);

  useEffect(() => {
    console.log(id);
  }, [id]);

  return (
    <Box>
      <ByteMdEditor
        value={content}
        onChange={async (v) => {
          setContent(v);
          await debouncedEditorOnChange(v);
        }}
        key="editor"
        mode="auto"
        plugins={plugins}
        editorConfig={{
          theme: "wrighter-dark",
          mode: {
            name: "gfm",
            highlightFormatting: true,
            fencedCodeBlockHighlighting: false,
            highlightNonStandardPropertyKeywords: false,
          },
        }}
      />
    </Box>
  );
};
