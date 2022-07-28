import { Box, useBreakpointValue } from "@chakra-ui/react";
import { Editor as ByteMdEditor, EditorProps } from "@bytemd/react";
import { useEffect, useMemo, useState } from "react";
import gfmPluin from "@bytemd/plugin-gfm";
import highlightPlugin from "@bytemd/plugin-highlight-ssr";
import mathPlugin from "@bytemd/plugin-math-ssr";
import { Router, useRouter } from "next/router";
import debounce from "lodash.debounce";
import { db, WrightIDB } from "../../services/dbService";
import { Wright } from "../../types";
import { figCaptionPlugin, pastePlugin } from "../../services/pluginService";
import { useWrightingActions } from "../../contexts/CommandBarHooks/useWrightingActions";
import { useBiteActions } from "../../contexts/CommandBarHooks/useBiteActions";

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
  const editorMode = useBreakpointValue({ base: "tab", md: "split" });

  const plugins = useMemo(
    () => [
      pastePlugin({ injectCM: true }),
      figCaptionPlugin(),
      highlightPlugin(),
      gfmPluin(),
      mathPlugin({ katexOptions: { output: "html" } }),
    ],
    []
  );

  const editorOnChange = async (value: string) => {
    if (id) {
      await db.editorContext.update(id, {
        content: value,
        head: value.substring(0, 50),
      });
      editorOnSaveHandler();
    }
  };

  // const fullScreenHandler = () => {
  //   console.log(document.getElementsByClassName("bytemd")?.[0]?.classList);
  // };

  // useEffect(() => {
  //   if (window.cm) {
  //     document.querySelector('.bytemd-toolbar-right > [bytemd-tippy-path="4"]')?.addEventListener("click", fullScreenHandler);
  //   }

  //   return () => {
  //     document.querySelector('.bytemd-toolbar-right > [bytemd-tippy-path="4"]')?.removeEventListener("click", fullScreenHandler);
  //   };
  // }, [id]);

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

  useWrightingActions();
  useBiteActions();

  return (
    <Box>
      <ByteMdEditor
        value={content}
        onChange={async (v) => {
          setContent(v);
          await debouncedEditorOnChange(v);
        }}
        key="editor"
        mode={editorMode as EditorProps["mode"]}
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
