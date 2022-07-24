import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  VStack,
  HStack,
  Center,
  Icon,
  ModalFooter,
  Button,
  Text,
  FormControl,
  Box,
  FormLabel,
  Input,
  InputGroup,
  InputLeftElement,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import { format } from "date-fns";
import { ChangeEvent, KeyboardEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FiCheck, FiGlobe, FiHash, FiImage, FiX } from "react-icons/fi";
import { MdOutlineBrokenImage } from "react-icons/md";
import { Bite, BiteType, Tag } from "../../types";
import { Tags } from "../Editor/Tags";
import { isValidUrl } from "../../utils";
import { Editor as ByteMdEditor } from "@bytemd/react";
import axios from "axios";
import { pastePlugin } from "../../services/pluginService";
import gfmPluin from "@bytemd/plugin-gfm";
import highlightPlugin from "@bytemd/plugin-highlight-ssr";
import mathPlugin from "@bytemd/plugin-math-ssr";
import { CUIAutoComplete } from "chakra-ui-autocomplete";
import { useTagsContext } from "../../contexts/TagsContext";
import { useMutation, useQuery } from "react-query";
import { createTag } from "../../services/tagService";
import { useUserContext } from "../../contexts/UserContext";
import { UseMultipleSelectionStateChange, UseMultipleSelectionStateChangeTypes } from "downshift";
import { Toaster } from "../Toaster";
import debounce from "lodash.debounce";
import { createBite } from "../../services/biteService";

const TEXT_LIMIT = 960;
const MDEditor = ({ onContentSet }: { onContentSet: (content: string, type: BiteType) => void }): JSX.Element => {
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

const ImageEditor = ({ onContentSet }: { onContentSet: (content: string, type: BiteType) => void }): JSX.Element => {
  const [link, setLink] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [linkError, setLinkError] = useState("");
  const [imgError, setImgError] = useState(false);
  const [isImgLoading, setIsImgLoading] = useState(false);

  const handleInputBlur = () => {
    if (link && isValidUrl(link)) {
      setImageUrl(link);
      setIsImgLoading(true);
    }
  };

  return (
    <>
      <FormControl>
        <Box>
          <FormLabel htmlFor="link" mb={1} fontSize="lg">
            Save an Image &nbsp;
            <span style={{ color: "var(--chakra-colors-errorRed)", fontSize: "var(--chakra-fontSizes-sm)" }}>{linkError}</span>
          </FormLabel>
          <InputGroup>
            <InputLeftElement
              pointerEvents="none"
              children={
                imgError ? (
                  <MdOutlineBrokenImage color="var(--chakra-colors-textLighter)" />
                ) : (
                  <FiImage color="var(--chakra-colors-textLighter)" />
                )
              }
            />
            <Input
              isInvalid={linkError.length > 0}
              fontSize="lg"
              borderColor="inputBorderColor"
              type="text"
              placeholder="Enter an Image link"
              id="link"
              required
              onBlur={handleInputBlur}
              value={link}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setLink(e.target.value);
                if (!isValidUrl(e.target.value)) {
                  setLinkError("URL is not valid");
                  onContentSet("", BiteType.IMAGE);
                } else {
                  setLinkError("");
                  onContentSet(e.target.value, BiteType.IMAGE);
                }
              }}
            />
          </InputGroup>
        </Box>
      </FormControl>
      <Center w="full" mt={10}>
        <Box w="250px" h="250px" bg={imgError || imageUrl === "" ? "bgLight" : "transparent"} borderRadius={10}>
          {imageUrl && (
            <img
              style={{
                display: imgError || isImgLoading ? "none" : "block",
                maxHeight: "250px",
                maxWidth: "250px",
                margin: "0 auto",
                borderRadius: 8,
              }}
              src={imageUrl}
              alt="image"
              onError={(e) => {
                setIsImgLoading(false);
                setImgError(true);
              }}
              onLoad={() => {
                setIsImgLoading(false);
                setImgError(false);
              }}
            />
          )}
          {isImgLoading && (
            <Center h="full" p={20} flexDir="column">
              <Spinner
                sx={{
                  "--spinner-size": "1.5rem",
                  borderBottomColor: "textLighter",
                  borderLeftColor: "textLighter",
                  borderTopColor: "transparent",
                  borderRightColor: "transparent",
                }}
              />
            </Center>
          )}
          {(imgError || imageUrl === "") && !isImgLoading && (
            <Center h="full" p={20} flexDir="column">
              <Icon as={MdOutlineBrokenImage} color="textLighter" w="full" h="full" />
              <Text fontSize="md" color="textLighter">
                404!
              </Text>
            </Center>
          )}
        </Box>
      </Center>
    </>
  );
};

const LinkEditor = ({ onContentSet }: { onContentSet: (content: string, type: BiteType) => void }): JSX.Element => {
  const [link, setLink] = useState("");
  const [faviconLink, setFaviconLink] = useState("");
  const [linkError, setLinkError] = useState("");
  const [faviconError, setFaviconError] = useState(true);
  const [faviconLoading, setFaviconLoading] = useState(false);

  const handleInput = (): void => {
    if (isValidUrl(link)) {
      setFaviconError(false);
      const origin = new URL(link).origin;
      setFaviconLink("https://www.google.com/s2/favicons?domain=" + origin);
    } else {
      setFaviconLoading(false);
      setFaviconError(true);
    }
  };

  useEffect(() => {
    setFaviconLoading(true);
  }, [faviconLink]);

  return (
    <FormControl>
      <Box>
        <FormLabel htmlFor="link" mb={1} fontSize="lg">
          Save a Link &nbsp;
          <span style={{ color: "var(--chakra-colors-errorRed)", fontSize: "var(--chakra-fontSizes-sm)" }}>{linkError}</span>
        </FormLabel>
        <InputGroup>
          <InputLeftElement
            pointerEvents="none"
            children={
              faviconError ? (
                <FiGlobe color="var(--chakra-colors-textLighter)" />
              ) : (
                <>
                  {faviconLoading && (
                    <Spinner
                      sx={{
                        "--spinner-size": "1rem",
                        borderBottomColor: "textLighter",
                        borderLeftColor: "textLighter",
                        borderTopColor: "transparent",
                        borderRightColor: "transparent",
                      }}
                    />
                  )}
                  <img
                    src={faviconLink}
                    alt="favicon"
                    style={{ display: faviconLoading ? "none" : "block" }}
                    onError={(e) => {
                      setFaviconError(true);
                      setFaviconLoading(false);
                    }}
                    onLoad={() => {
                      setFaviconLoading(false);
                    }}
                  />
                </>
              )
            }
          />
          <Input
            isInvalid={linkError.length > 0}
            fontSize="lg"
            borderColor="inputBorderColor"
            placeholder="Enter a link"
            type="text"
            id="link"
            required
            onBlur={handleInput}
            value={link}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setLink(e.target.value);
              // debouncedLinkHandler(e.target.value);
              if (!isValidUrl(e.target.value)) {
                setLinkError("invalid URL, make sure you put in http/https");
                onContentSet("", BiteType.LINK);
              } else {
                onContentSet(e.target.value, BiteType.LINK);
                setLinkError("");
              }
            }}
          />
        </InputGroup>
      </Box>
    </FormControl>
  );
};

type ACTag = Tag & { label: string; value: string };
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
    await createBite(!isAuthenticated(), newBite);
    triggerRefresh();
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
    const { status } = await createBiteRequest();
    if (status === "error") {
      toast({
        position: "bottom-left",
        render: () => <Toaster message="something happened, please try again" type="error" />,
      });
    } else if (status === "success") {
      onClose();
    }
  };

  const handleTagSelectStateChange = (changes: UseMultipleSelectionStateChange<ACTag>) => {
    // enums is undefined and does not work for some reason
    if (changes.type === "__function_add_selected_item__" || changes.type === "__function_remove_selected_item__") {
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
    console.log(content, type);
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
              {/* <Box>Tags</Box> */}
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
                {navigator.platform.indexOf("Mac") > -1 ? "⌘" : "Ctrl"} + S
              </Text>
            </Box>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
