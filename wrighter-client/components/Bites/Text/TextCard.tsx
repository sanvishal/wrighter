import gfmPluin from "@bytemd/plugin-gfm";
import highlightPlugin from "@bytemd/plugin-highlight-ssr";
import mathPlugin from "@bytemd/plugin-math-ssr";
import { Viewer } from "@bytemd/react";
import { Box } from "@chakra-ui/react";
import { useMemo } from "react";
import { Bite } from "../../../types";

export const TextCard = ({ bite }: { bite: Bite }) => {
  const plugins = useMemo(() => [highlightPlugin(), gfmPluin(), mathPlugin({ katexOptions: { output: "html" } })], []);

  return (
    <Box
      id="wright-preview"
      overflowX="auto"
      w="full"
      pb={3}
      sx={{
        img: {
          borderRadius: "7px",
        },
      }}
    >
      <Viewer value={bite.content} plugins={plugins} />
    </Box>
  );
};
