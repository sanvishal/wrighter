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
import { Wright } from "../../types";
import Head from "next/head";
import { figCaptionPlugin } from "../../services/pluginService";

interface PageProps {
  wright: Wright & { user: string };
}

const Wrights: NextPage<PageProps> = ({ wright }: PageProps) => {
  const plugins = useMemo(
    () => [
      mediumZoom({ background: "var(--chakra-colors-bgLight)" }),
      // pastePlugin({injectCM: false}),
      figCaptionPlugin(),
      highlightPlugin(),
      gfmPluin(),
      mathPlugin({ katexOptions: { output: "html" } }),
    ],
    []
  );

  return (
    <Container maxW="5xl" id="wright-preview" pt={10}>
      <Head>
        <title>{wright ? wright.title : "wrighter • wright"}</title>
      </Head>
      {wright ? (
        <>
          <HStack mb="-5px" justify="space-between" fontSize="sm" color="textLighter" opacity={0.6} w="full" spacing={3}>
            <Text w="30%">{new Date(wright.updatedAt || new Date().toISOString()).toDateString()}</Text>
            <HStack wrap="wrap" justifyContent="flex-end" w="70%" alignItems="flex-start">
              {wright.tags?.map((tag) => {
                return <Text key={tag.id}>#{tag.name}</Text>;
              })}
            </HStack>
          </HStack>
          <Text fontSize={{ base: "5xl", md: "6xl" }} fontWeight="800" lineHeight="1.03" my={4}>
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
        revalidate: 10,
      },
    };
  } catch (e) {
    return {
      props: {
        wright: null,
      },
    };
  }
}

export default Wrights;
