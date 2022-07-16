import { Box, useBreakpointValue } from "@chakra-ui/react";
import { Editor as ByteMdEditor, EditorProps } from "@bytemd/react";
import { useEffect, useMemo, useState } from "react";
import gfmPluin from "@bytemd/plugin-gfm";
import highlightPlugin from "@bytemd/plugin-highlight-ssr";
import { useRouter } from "next/router";
import debounce from "lodash.debounce";
import { db, WrightIDB } from "../../services/dbService";
import type { BytemdPlugin } from "bytemd";
import { Wright } from "../../types";
import { turndownService } from "../../services/turndownService";

const pastePlugin = (): BytemdPlugin => {
  return {
    editorEffect(ctx) {
      if (window) {
        console.log("cm window set");
        window["cm"] = ctx.editor;
      }
      ctx.editor.on("copy", (cm, event) => {
        if (cm.getSelection()) {
          event.clipboardData?.setData("text/plain", turndownService.escape(cm.getSelection()));
        }
      });
      ctx.editor.on("paste", (cm, event) => {
        // event.preventDefault();
        if (event) {
          const htmlText = event?.clipboardData?.getData("text/html") || "";
          const normalText = event?.clipboardData?.getData("text/plain") || "";

          const finalTextToPaste = (() => {
            const token = ctx.editor.getTokenAt(ctx.editor.getCursor());
            if (token.state?.overlay?.code || token.state?.overlay?.codeBlock) {
              return normalText;
            }
            if (htmlText.trim().length > 0) {
              return turndownService.turndown(htmlText);
            }

            return normalText;
          })();

          if (!cm.somethingSelected()) {
            cm.replaceRange(finalTextToPaste, cm.getCursor());
          } else {
            cm.replaceSelection(finalTextToPaste);
          }
        }
        event.preventDefault();
      });

      return () => {
        if (window) {
          window.cm = null;
        }
      };
    },
  };
};

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

  const plugins = useMemo(() => [pastePlugin(), highlightPlugin(), gfmPluin()], []);

  const editorOnChange = async (value: string) => {
    if (id) {
      await db.editorContext.update(id, {
        content: value,
        head: value.substring(0, 50),
      });
      editorOnSaveHandler();
    }
  };

  useEffect(() => {
    console.log(window.cm);
  }, [id]);

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
