import mathPlugin from "@bytemd/plugin-math-ssr";
import mediumZoom from "@bytemd/plugin-medium-zoom";
import gfmPluin from "@bytemd/plugin-gfm";
import highlightPlugin from "@bytemd/plugin-highlight-ssr";
import { Viewer } from "@bytemd/react";
import { Box, Center, Container, HStack, Icon, IconButton, Text, useColorMode, VStack } from "@chakra-ui/react";
import axios from "axios";
import { GetServerSidePropsContext, NextPage } from "next";
import { useEffect, useMemo } from "react";
import { API_BASE_URL } from "../../constants";
import { Wright } from "../../types";
import Head from "next/head";
import { autoLinkHeadingsPlugin, figCaptionPlugin } from "../../services/pluginService";
import { scrollAnchorIntoView } from "../../utils";
import { FiMoon, FiSun } from "react-icons/fi";

interface PageProps {
  wright: Wright & { user: string };
}

const Wrights: NextPage<PageProps> = ({ wright }: PageProps) => {
  const { colorMode, toggleColorMode } = useColorMode();
  const plugins = useMemo(
    () => [
      mediumZoom({ background: "var(--chakra-colors-bgLight)" }),
      autoLinkHeadingsPlugin(),
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
        {wright && (
          <>
            <title>{wright ? wright.title : "wrighter • wright"}</title>
            <meta property="og:title" content={wright.title} key="title" />
            <meta property="twitter:title" content={wright.title} key="title" />
            <meta
              name="description"
              content={`by ${wright.user + " • "} ` + (wright.content.trim() ? wright.content.substring(0, 150) : wright.title)}
            />
            <meta property="og:type" content="article" />
            <meta property="og:image" content={wright.ogImage || ""} />
            <meta property="og:image:alt" content={wright.title || ""} />
            <meta property="twitter:image" content={wright.ogImage || ""} />
            <meta property="twitter:image:alt" content={wright.title || ""} />
            <meta name="keywords" content={wright.tags ? wright.tags?.map((tag) => tag.name).join(", ") : ""}></meta>
            <meta name="author" content={wright.user}></meta>
            <meta name="twitter:creator" content={wright.user}></meta>
            <meta
              name="twitter:description"
              content={`by ${wright.user + " • "} ` + (wright.content.trim() ? wright.content.substring(0, 150) : wright.title)}
            />
            <meta
              name="og:description"
              content={`by ${wright.user + " • "} ` + (wright.content.trim() ? wright.content.substring(0, 150) : wright.title)}
            />
          </>
        )}
      </Head>
      {wright ? (
        <>
          <Box pos="fixed" bottom="20px" left="20px">
            <IconButton
              aria-label="toggle theme"
              as={colorMode === "dark" ? FiMoon : FiSun}
              onClick={toggleColorMode}
              cursor="pointer"
              variant="ghost"
              p={3}
            ></IconButton>
          </Box>
          <HStack mb="-5px" justify="space-between" fontSize="sm" color="textLighter" opacity={0.7} w="full" spacing={3}>
            <Text w="30%" color="textColor">
              {new Date(wright.updatedAt || new Date().toISOString()).toDateString()}
            </Text>
            <HStack wrap="wrap" justifyContent="flex-end" w="70%" alignItems="flex-start">
              {wright.tags?.map((tag) => {
                return <Text key={tag.id}>#{tag.name}</Text>;
              })}
            </HStack>
          </HStack>
          <Text fontSize={{ base: "2.1em", md: "6xl" }} fontWeight="800" lineHeight="1.03" my={4}>
            {wright.title || ""}
          </Text>
          <Text fontSize="md" color="textLighter" mt="-8px" mb={12}>
            by <span style={{ fontWeight: 800 }}>{wright.user}</span>
            <Text as="a" href="https://wrighter.vercel.app/" target="_blank" ml={1.5} fontWeight="bold">
              using <u>wrighter</u>
            </Text>
          </Text>
          <Viewer value={wright.content} plugins={plugins} />
          <Box w="full" h={32}></Box>
          <Box opacity={0.6} pos="absolute" bottom="20px" right="20px" mt={1} zIndex={-2}>
            try
            <Text as="a" href="https://wrighter.vercel.app/" target="_blank" ml={1}>
              <u>wrighter</u>
            </Text>
          </Box>
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
  context.res.setHeader("Cache-Control", "public, s-maxage=20, stale-while-revalidate=59");
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
      },
    };
  }
}

export default Wrights;
