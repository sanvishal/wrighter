import gfmPluin from "@bytemd/plugin-gfm";
import highlightPlugin from "@bytemd/plugin-highlight-ssr";
import mathPlugin from "@bytemd/plugin-math-ssr";
import { Editor as ByteMdEditor } from "@bytemd/react";
import { Box, Text, VStack } from "@chakra-ui/react";
import debounce from "lodash.debounce";
import { useEffect, useMemo, useState } from "react";
import { pastePlugin } from "../../../services/pluginService";
import { BiteType } from "../../../types";

const TEXT_LIMIT = 960;
export const MDEditor = ({ onContentSet }: { onContentSet: (content: string, type: BiteType) => void }): JSX.Element => {
  const [content, setContent] = useState("");

  const plugins = useMemo(
    () => [pastePlugin({ injectCM: false }), highlightPlugin(), gfmPluin(), mathPlugin({ katexOptions: { output: "html" } })],
    []
  );

  const onEditorChange = () => {
    if (content.length > TEXT_LIMIT) {
      onContentSet("", BiteType.TEXT);
      return;
    }
    onContentSet(content, BiteType.TEXT);
  };

  const debouncedOnEditorChange = useMemo(() => debounce(onEditorChange, 800), [onEditorChange]);

  useEffect(() => {
    debouncedOnEditorChange();
  }, [content]);

  return (
    <VStack>
      <Box className="mini-editor" mt={4} w="full">
        <ByteMdEditor
          value={content}
          onChange={(v) => {
            setContent(v);
          }}
          key="editor"
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
      <Text color={content.length > TEXT_LIMIT ? "errorRed" : "textColor"} textAlign="right" w="full" fontSize="lg">
        {content.length}/{TEXT_LIMIT}
      </Text>
    </VStack>
  );
};
