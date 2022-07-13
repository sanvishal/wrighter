import { Container, Editable, EditablePreview, EditableTextarea, Text } from "@chakra-ui/react";
import debounce from "lodash.debounce";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { useQuery } from "react-query";
import { Content } from "../components/Content";
import { Editor } from "../components/Editor/Editor";
import { useUserContext } from "../contexts/UserContext";
import { db, WrightIDB } from "../services/dbService";
import { clearAndCreateEditorContext, getWright, saveWright } from "../services/wrightService";
import { Wright } from "../types";

const Wrighting: NextPage = () => {
  const [title, setTitle] = useState("Give me a title");
  const router = useRouter();
  const { isAuthenticated, isUserLoading } = useUserContext();
  const [wright, setWright] = useState({});

  const handleTitleChange = (value: string) => {
    setTitle(value.trim());
  };

  const { refetch: getWrightRequest, isLoading: isGettingWright } = useQuery(
    "getWrightQuery",
    () => getWright(!isAuthenticated(), router?.query?.id as string | undefined),
    { enabled: false, refetchOnWindowFocus: false }
  );

  const getEditorContext = async () => {
    if (router?.query?.id) {
      const { data: wright } = await getWrightRequest();
      if (wright) {
        await clearAndCreateEditorContext(wright);
        setWright(wright);
      }
    }
  };

  useEffect(() => {
    if (router?.query?.id && !isUserLoading) {
      getEditorContext();
    }
  }, [router?.query?.id, isUserLoading]);

  const saveWrightHandler = async () => {
    if (router?.query?.id) {
      const wright = await db.editorContext.get(router.query.id);
      if (wright && wright?.id) {
        console.log("updated");
        return await saveWright(!isAuthenticated(), wright);
      }
    }
  };

  const { refetch: saveWrightRequest, isLoading: isSavingWright } = useQuery("saveWrightQuery", () => saveWrightHandler(), {
    enabled: false,
    refetchOnWindowFocus: false,
  });

  const debouncedEditorOnSaveHandler = useMemo(() => debounce(saveWrightRequest, isAuthenticated() ? 1000 : 700), []);

  const handleTitleSave = async (value: string) => {
    setTitle(value.trim());
    if (router?.query?.id) {
      await db.editorContext.update(router.query.id, {
        title: value.trim(),
      });
      debouncedEditorOnSaveHandler();
    }
  };

  return (
    <Content isWide>
      <Container maxW="full" px={0} py={3}>
        <Editable defaultValue={title} height="78px" isPreviewFocusable value={title} fontWeight="800" fontSize="xxx-large">
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
      </Container>
      <Editor editorOnSaveHandler={debouncedEditorOnSaveHandler} initWright={wright} />
    </Content>
  );
};

export default Wrighting;
