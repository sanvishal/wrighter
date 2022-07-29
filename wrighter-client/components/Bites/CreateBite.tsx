import {
  Box,
  Button,
  FormControl,
  FormLabel,
  HStack,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { CUIAutoComplete } from "chakra-ui-autocomplete";
import { format } from "date-fns";
import { UseMultipleSelectionStateChange } from "downshift";
import { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import { FiCheck, FiHash } from "react-icons/fi";
import { useMutation, useQuery } from "react-query";
import { useBitesContext } from "../../contexts/BitesContext";
import { useTagsContext } from "../../contexts/TagsContext";
import { useUserContext } from "../../contexts/UserContext";
import { createBite } from "../../services/biteService";
import { createTag } from "../../services/tagService";
import { ACTag, Bite, BiteType, Tag } from "../../types";
import { Toaster } from "../Toaster";
import { ImageEditor } from "./Image/ImageEditor";
import { LinkEditor } from "./Link/LinkEditor";
import { MDEditor } from "./Text/MDEditor";

export const CreateBite = ({
  isOpen,
  onClose,
  date,
  triggerRefresh,
}: {
  isOpen: boolean;
  onClose: () => void;
  date: Date;
  triggerRefresh: () => void;
}): JSX.Element => {
  const [title, setTitle] = useState(
    `Bite on ${format(date.toDateString() === new Date().toDateString() ? new Date() : date, "MMMM do hh:mm a")}`
  );
  const [currentMode, setCurrentMode] = useState<BiteType>(BiteType.LINK);
  const { isAuthenticated } = useUserContext();
  const { tags: allTags, fetchTags } = useTagsContext();
  const [selectedTags, setSelectedTags] = useState<ACTag[]>([]);
  const [tags, setTags] = useState<ACTag[]>([]);
  const initialRef = useRef<any>(null);
  const toast = useToast();
  const [tagSearchValue, setTagSearchValue] = useState("");
  const [biteContent, setBiteContent] = useState("");
  const { addToBitesMemoryContext, removeFromBitesMemoryContext } = useBitesContext();

  useEffect(() => {
    setTags(
      allTags.map((tag) => {
        return { ...tag, label: tag.name, value: tag.name };
      })
    );
  }, [allTags]);

  useEffect(() => {
    if (isOpen) {
      setSelectedTags([]);
      setTagSearchValue("");
      setTitle(
        `Bite on ${
          date.toDateString() === new Date().toDateString() ? format(new Date(), "MMMM do hh:mm a") : format(date, "MMMM do")
        }`
      );
    }
  }, [isOpen]);

  const handleCreateTagSuccess = async (data: Tag) => {
    if (fetchTags) {
      await fetchTags();
    }
    setSelectedTags([...selectedTags, { ...data, label: data.name, value: data.name }]);
  };

  const createBiteHandler = async () => {
    const newBite = {
      title,
      content: biteContent,
      type: currentMode,
      tags: selectedTags.map((tag) => {
        return { id: tag.id, name: tag.name };
      }),
      createdAt: date.toISOString(),
      updatedAt: date.toISOString(),
    };
    const bite = await createBite(!isAuthenticated(), newBite);
    triggerRefresh();
    return bite;
  };

  const { mutate: createTagRequest } = useMutation((tag: ACTag) => createTag(!isAuthenticated(), { name: tag.value }), {
    onSuccess: (data) => {
      if (data) {
        handleCreateTagSuccess(data);
      }
    },
  });

  const { refetch: createBiteRequest, isFetching: isCreatingBite } = useQuery("createBiteQuery", () => createBiteHandler(), {
    enabled: false,
    refetchOnWindowFocus: false,
  });

  const clickSaveHandler = async () => {
    const { status, data: bite } = await createBiteRequest();
    if (status === "error") {
      toast({
        position: "bottom-left",
        render: () => <Toaster message="something happened, please try again" type="error" />,
      });
    } else if (status === "success") {
      if (bite) {
        addToBitesMemoryContext({
          id: bite.id,
          title: bite.title,
          content: bite.content,
          type: bite.type,
          createdAt: bite.createdAt,
          updatedAt: bite.updatedAt,
          tags: bite.tags || [],
        } as Bite);
      }
      onClose();
    }
  };

  const handleTagSelectStateChange = (changes: UseMultipleSelectionStateChange<ACTag>) => {
    // enums is undefined and does not work for some reason

    if (
      changes.type === "__function_add_selected_item__" ||
      changes.type === "__function_remove_selected_item__" ||
      // @ts-ignore
      changes.type === 8 ||
      // @ts-ignore
      changes.type === 9
    ) {
      setSelectedTags(changes?.selectedItems || []);
    }
  };

  const validateAndTransformTag = (tag: ACTag): ACTag | undefined => {
    const tagName = tag.value.trim().replace(/\s/g, "");
    if (tagName.length < 3 || tagName.length > 35) {
      toast({
        position: "bottom-left",
        render: () => <Toaster message="tag name too short or too long" type="error" />,
      });
      return;
    }
    return { ...tag, value: tagName, label: tagName };
  };

  const handleOnContentChange = (content: string, type: BiteType) => {
    return setBiteContent(content);
  };

  useEffect(() => {
    setBiteContent("");
  }, [currentMode]);

  const isTitleInvalid = () => {
    return title.trim().length < 2 || title.trim().length > 150;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered={false} size="3xl" initialFocusRef={initialRef}>
      <ModalOverlay />
      <ModalContent
        ml={{ base: 0, md: "56px" }}
        borderRadius={10}
        bg="bgLighter"
        border="1px solid"
        borderColor="containerBorder"
        boxShadow="shadow"
        pb={4}
        mt={20}
        // mb={0}
        onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
          if ((e.ctrlKey || e.metaKey) && e.key === "s") {
            e.preventDefault();
            if (!(biteContent.trim().length === 0 || isTitleInvalid()) && !isCreatingBite) {
              clickSaveHandler();
              onClose();
            } else {
              toast({
                position: "bottom-left",
                render: () => <Toaster message="please fix the errors before saving" type="error" />,
              });
            }
          }
        }}
      >
        <ModalHeader px={{ base: 4, md: 5 }}>
          <Text>
            Bite on <b style={{ fontWeight: 800 }}>{format(date, "dd MMMM")}</b>
          </Text>
        </ModalHeader>
        <ModalCloseButton borderRadius={10} mt={2} />
        <ModalBody py={4} p={{ base: 4, md: 5 }}>
          <VStack alignItems="flex-start" spacing={8} fontSize="lg">
            <FormControl>
              <Box>
                <FormLabel htmlFor="title" mb={1} fontSize="lg">
                  Title &nbsp;
                  {isTitleInvalid() && (
                    <Text color="errorRed" as="span" fontSize="sm">
                      title too long or too short
                    </Text>
                  )}
                </FormLabel>
                <Input
                  autoFocus
                  ref={initialRef}
                  fontSize="lg"
                  borderColor="inputBorderColor"
                  type="text"
                  id="title"
                  isInvalid={isTitleInvalid()}
                  required
                  value={title}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
                />
              </Box>
            </FormControl>
            <VStack w="full" alignItems="flex-start" id="bite-tag-select">
              {selectedTags.length === 0 && (
                <Text fontSize="sm" as="i" color="textLighter">
                  untagged
                </Text>
              )}
              <CUIAutoComplete
                label=""
                placeholder="Add Tags"
                hideToggleButton
                tagStyleProps={{
                  bg: "bgLight",
                  borderRadius: "10px",
                  marginBottom: "0px",
                  marginTop: "5px !important",
                  fontSize: "sm",
                  paddingTop: "3px",
                  paddingBottom: "3px",
                }}
                onCreateItem={(item) => {
                  const validatedTag = validateAndTransformTag(item);
                  if (validatedTag) {
                    createTagRequest(validatedTag);
                  }
                }}
                onStateChange={(changes: UseMultipleSelectionStateChange<ACTag>) => handleTagSelectStateChange(changes)}
                inputStyleProps={{ position: "relative", width: "200px" }}
                renderCustomInput={(props) => {
                  return (
                    <InputGroup>
                      <InputLeftElement children={<Icon as={FiHash} color="textLighter" />} />
                      <Input
                        {...props}
                        fontSize="lg"
                        borderColor="inputBorderColor"
                        autoFocus={false}
                        onChangeCapture={(e: ChangeEvent<HTMLInputElement>) => setTagSearchValue(e.target.value.trim() || "")}
                        value={tagSearchValue}
                      />
                    </InputGroup>
                  );
                }}
                selectedItems={selectedTags}
                listStyleProps={{
                  position: "absolute",
                  zIndex: 10000,
                  width: "200px",
                  borderRadius: "8px",
                  overflow: "auto",
                  height: "200px",
                  backgroundColor: "bgLighter",
                }}
                // @ts-ignore
                icon={FiCheck}
                listItemStyleProps={{ borderRadius: "5px", margin: "4px" }}
                highlightItemBg="bgLight"
                items={tags}
              />
            </VStack>
          </VStack>
          <HStack
            spacing={0}
            mt={{ md: 5, base: 1 }}
            justifyContent="flex-end"
            w={{ base: "full", md: "auto" }}
            mb={{ base: 6, md: 0 }}
          >
            <Button
              variant={currentMode === BiteType.LINK ? "solid-bite" : "ghost"}
              borderRightRadius={0}
              w={28}
              isActive={currentMode === BiteType.LINK}
              color="textColor"
              _focus={{ color: "textColor" }}
              _hover={{ color: "textColor" }}
              onClick={() => setCurrentMode(BiteType.LINK)}
              opacity={currentMode !== BiteType.LINK ? 0.5 : 1}
              leftIcon={currentMode === BiteType.LINK ? <FiCheck strokeWidth={4} /> : <></>}
              ref={initialRef}
            >
              Link
            </Button>
            <Button
              variant={currentMode === BiteType.IMAGE ? "solid-bite" : "ghost"}
              borderRadius={0}
              borderLeft="1px solid"
              borderRight="1px solid"
              borderColor="bgDark"
              w={28}
              color="textColor"
              _focus={{ color: "textColor" }}
              _hover={{ color: "textColor" }}
              isActive={currentMode === BiteType.IMAGE}
              opacity={currentMode !== BiteType.IMAGE ? 0.5 : 1}
              onClick={() => setCurrentMode(BiteType.IMAGE)}
              leftIcon={currentMode === BiteType.IMAGE ? <FiCheck strokeWidth={4} /> : <></>}
            >
              Image
            </Button>
            <Button
              variant={currentMode === BiteType.TEXT ? "solid-bite" : "ghost"}
              borderLeftRadius={0}
              color="textColor"
              _focus={{ color: "textColor" }}
              _hover={{ color: "textColor" }}
              w={28}
              isActive={currentMode === BiteType.TEXT}
              onClick={() => setCurrentMode(BiteType.TEXT)}
              opacity={currentMode !== BiteType.TEXT ? 0.5 : 1}
              leftIcon={currentMode === BiteType.TEXT ? <FiCheck strokeWidth={4} /> : <></>}
            >
              MD
            </Button>
          </HStack>
          {currentMode === BiteType.LINK && <LinkEditor onContentSet={handleOnContentChange} />}
          {currentMode === BiteType.IMAGE && <ImageEditor onContentSet={handleOnContentChange} />}
          {currentMode === BiteType.TEXT && <MDEditor onContentSet={handleOnContentChange} />}
        </ModalBody>
        <ModalFooter justifyContent="space-between">
          <Text
            color="textLighter"
            fontWeight="normal"
            fontSize={{ base: "xs", md: "sm" }}
            as="i"
            opacity={0.8}
            alignSelf="flex-end"
          >
            *you can&apos;t edit a bite after creation
          </Text>
          <HStack spacing={3}>
            <Button variant="ghost" w={{ md: 32, base: 20 }} onClick={onClose} display={{ md: "none", base: "block" }}>
              Cancel
            </Button>
            <Box pos="relative">
              <Button
                variant="solid-bite"
                w={{ md: 32, base: 20 }}
                isDisabled={biteContent.trim().length === 0 || isTitleInvalid()}
                isLoading={isCreatingBite}
                onClick={clickSaveHandler}
              >
                Save
                <Text as="span" casing="lowercase" ml={1} display={{ md: "block", base: "none" }}>
                  {currentMode}
                </Text>
              </Button>
              <Text
                pos="absolute"
                fontSize="xs"
                bg="transparent"
                py={0.5}
                color="textLight"
                opacity={0.6}
                display={{ md: "block", base: "none" }}
              >
                {typeof window !== "undefined" && (navigator.platform.indexOf("Mac") > -1 ? "⌘ + S" : "Ctrl + S")}
              </Text>
            </Box>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
