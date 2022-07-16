import { Container, Editable, EditablePreview, EditableTextarea, Spinner, Text, VStack } from "@chakra-ui/react";
import debounce from "lodash.debounce";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { useQuery } from "react-query";
import { Content } from "../components/Content";
import { Editor } from "../components/Editor/Editor";
import { useUserContext } from "../contexts/UserContext";
import { db } from "../services/dbService";
import { clearAndCreateEditorContext, getWright, saveWright } from "../services/wrightService";

const Wrighting: NextPage = () => {
  const [title, setTitle] = useState("Give me a title");
  const router = useRouter();
  const { isAuthenticated, isUserLoading } = useUserContext();
  const [wright, setWright] = useState({});
  const [id, setId] = useState("");
  const [isContextLoaded, setIsContextLoaded] = useState(false);

  const handleTitleChange = (value: string) => {
    setTitle(value);
  };

  const { refetch: getWrightRequest } = useQuery("getWrightQuery", () => getWright(!isAuthenticated(), id), {
    enabled: false,
    refetchOnWindowFocus: false,
  });

  const getEditorContext = async () => {
    setIsContextLoaded(false);
    if (id) {
      const { data: wright } = await getWrightRequest();
      if (wright) {
        await clearAndCreateEditorContext(wright);
        setWright(wright);
        setTitle(wright.title || "");
      }
    }
    setIsContextLoaded(true);
  };

  useEffect(() => {
    if (id && !isUserLoading) {
      getEditorContext();
    }
  }, [id, isUserLoading]);

  const saveWrightHandler = async () => {
    if (id) {
      const wright = await db.editorContext.get(id);
      if (wright && wright?.id) {
        console.log("updated");
        return await saveWright(!isAuthenticated(), wright);
      }
    }
  };

  const { refetch: saveWrightRequest } = useQuery("saveWrightQuery", () => saveWrightHandler(), {
    enabled: false,
    refetchOnWindowFocus: false,
  });

  const debouncedEditorOnSaveHandler = useMemo(() => debounce(saveWrightRequest, isAuthenticated() ? 1000 : 700), []);

  const handleTitleSave = async (value: string) => {
    setTitle(value.trim());
    if (id) {
      await db.editorContext.update(id, {
        title: value.trim(),
      });
      debouncedEditorOnSaveHandler();
    }
  };

  useEffect(() => {
    if (router.isReady && router?.query?.id) {
      setId((router?.query?.id || "") as string);
    }
  }, [router.isReady]);

  return (
    <Content isWide>
      {!isContextLoaded ? (
        <Container maxWidth="full" centerContent mt={200}>
          <VStack spacing={4}>
            <Spinner
              sx={{
                "--spinner-size": "3rem",
                borderBottomColor: "textLighter",
                borderLeftColor: "textLighter",
                borderTopColor: "transparent",
                borderRightColor: "transparent",
              }}
            />
            <Text color="textLighter" fontWeight="bold">
              Loading your editor...
            </Text>
          </VStack>
        </Container>
      ) : (
        <>
          <Container maxW={{ base: "full", md: "5xl" }} px={0} pt={3}>
            <Editable
              defaultValue={title}
              height="78px"
              isPreviewFocusable
              value={title}
              fontWeight="800"
              fontSize="xxx-large"
              // w="94%"
              px={{ base: "1%", md: "4%" }}
              mx="20px"
            >
              <EditablePreview
                w="full"
                h="78px"
                bg={title.trim().length <= 0 ? "errorRedTransBg" : "transparent"}
                opacity={title.trim().length > 0 ? 1 : 0.15}
              />
              <EditableTextarea
                borderRadius={10}
                _focusVisible={{
                  boxShadow: "0 0 0 3px var(--chakra-colors-containerBorder)",
                }}
                height="78px"
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) => handleTitleChange(e.target.value || "")}
                onBlur={() => handleTitleSave(title.trim().length ? title : "Give me a title")}
              />
            </Editable>
            <Editor editorOnSaveHandler={debouncedEditorOnSaveHandler} initWright={wright} />
          </Container>
        </>
      )}
    </Content>
  );
};

export default Wrighting;
