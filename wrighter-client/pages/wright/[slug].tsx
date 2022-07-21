import mathPlugin from "@bytemd/plugin-math-ssr";
import mediumZoom from "@bytemd/plugin-medium-zoom";
import gfmPluin from "@bytemd/plugin-gfm";
import highlightPlugin from "@bytemd/plugin-highlight-ssr";
import { Viewer } from "@bytemd/react";
import { Box, Center, Container, HStack, Icon, Text, VStack } from "@chakra-ui/react";
import axios from "axios";
import { GetServerSidePropsContext, NextPage } from "next";
import { useMemo } from "react";
import { API_BASE_URL } from "../../constants";
import { pastePlugin } from "../../services/pluginService";
import { Wright } from "../../types";

const Wrights: NextPage = ({ wright }: { wright: Wright & { user: string } }) => {
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
    <Container maxW="5xl" id="wright-preview" pt={10}>
      {wright ? (
        <>
          <HStack mb="-5px" justify="space-between" fontSize="sm" color="textLighter">
            <Text>{new Date(wright.updatedAt || new Date().toISOString()).toDateString()}</Text>
            <HStack>
              {wright.tags?.map((tag) => {
                return <Text key={tag.id}>#{tag.name}</Text>;
              })}
            </HStack>
          </HStack>
          <Text fontSize="6xl" fontWeight="800">
            {wright.title || ""}
          </Text>
          <Text fontSize="md" color="textLighter" mt="-8px" mb={12}>
            by <span style={{ fontWeight: 800 }}>{wright.user}</span>
          </Text>
          <Viewer value={wright.content} plugins={plugins} />
        </>
      ) : (
        <Center>
          <Text fontSize="2xl" fontWeight="800" color="textLighter">
            404! Wright not found
          </Text>
        </Center>
      )}
    </Container>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const slug = context.params?.slug;

  if (!slug) {
    return {
      props: {
        wright: null,
      },
    };
  }

  try {
    const req = await axios.get(`${API_BASE_URL}/wright/public/${slug}`);

    if (req.status !== 200) {
      return {
        props: {
          wright: null,
        },
      };
    }

    return {
      props: {
        wright: req.data,
      },
    };
  } catch (e) {
    return {
      props: {
        wright: null,
        revalidate: 10,
      },
    };
  }
}

export default Wrights;
