import { Container, Editable, EditablePreview, EditableTextarea, Text } from "@chakra-ui/react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { ChangeEvent, useEffect, useState } from "react";
import { Content } from "../components/Content";
import { Editor } from "../components/Editor/Editor";
import { useUserContext } from "../contexts/UserContext";
import { db } from "../services/dbService";

const Wrighting: NextPage = () => {
  const [title, setTitle] = useState("Give me a title");
  const router = useRouter();

  const handleTitleChange = (value: string) => {
    setTitle(value.trim());
  };

  const handleTitleSave = async (value: string) => {
    setTitle(value.trim());
    if (router?.query?.id) {
      db.wrights.update(router.query.id, {
        title: value.trim(),
      });
    }
  };

  const editorOnChangeHandler = (content: string) => {
    if (router?.query?.id) {
      db.wrights.update(router.query.id, {
        content,
        head: content.substring(0, 50),
      });
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
      <Editor editorOnChangeHandler={(content) => editorOnChangeHandler(content)} />
    </Content>
  );
};

export default Wrighting;
