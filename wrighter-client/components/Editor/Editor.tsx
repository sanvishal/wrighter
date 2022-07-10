import { Box } from "@chakra-ui/react";
import { Editor as ByteMdEditor } from "@bytemd/react";
import { useMemo, useState } from "react";
import gfmPluin from "@bytemd/plugin-gfm";
import type { BytemdPlugin } from "bytemd";
import highlightPlugin from "@bytemd/plugin-highlight-ssr";
import { FiActivity, FiArrowDown } from "react-icons/fi";
import { renderToString } from "react-dom/server";
import * as icons from "@icon-park/svg";

const actionsPlugin = (): BytemdPlugin => {
  return {
    actions: [
      // {
      //   icon: icons.Formula({}),
      //   handler: {
      //     type: "dropdown",
      //     actions: [
      //       {
      //         title: "some",
      //         icon: icons.Inline({}),
      //         handler: {
      //           type: "action",
      //           click({ wrapText, editor }) {
      //             wrapText("$");
      //             editor.focus();
      //           },
      //         },
      //       },
      //       {
      //         title: "someaga",
      //         icon: icons.Block({}),
      //         handler: {
      //           type: "action",
      //           click({ appendBlock, editor, codemirror }) {
      //             const { line } = appendBlock("$$\n\\TeX\n$$");
      //             editor.setSelection(codemirror.Pos(line + 1, 0), codemirror.Pos(line + 1, 4));
      //             editor.focus();
      //           },
      //         },
      //       },
      //     ],
      //   },
      // },
    ],
  };
};

export const Editor = () => {
  const [content, setContent] = useState("");

  const plugins = useMemo(() => [actionsPlugin(), highlightPlugin(), gfmPluin()], []);

  return (
    <Box>
      <ByteMdEditor
        value={content}
        onChange={(v) => {
          setContent(v);
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
