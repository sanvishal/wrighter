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
} from "@chakra-ui/react";
import { format } from "date-fns";
import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import { FiCheck, FiGlobe, FiImage, FiX } from "react-icons/fi";
import { MdOutlineBrokenImage } from "react-icons/md";
import { BiteType, Tag } from "../../types";
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

const TEXT_LIMIT = 800;
const MDEditor = (): JSX.Element => {
  const [content, setContent] = useState("");

  const plugins = useMemo(
    () => [pastePlugin({ injectCM: false }), highlightPlugin(), gfmPluin(), mathPlugin({ katexOptions: { output: "html" } })],
    []
  );

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

const ImageEditor = (): JSX.Element => {
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
              children={imgError ? <MdOutlineBrokenImage color="textLighter" /> : <FiImage color="textLighter" />}
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
                } else {
                  setLinkError("");
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
              onError={() => {
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
          {(imgError || imageUrl === "") && (
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

const LinkEditor = (): JSX.Element => {
  const [link, setLink] = useState("");
  const [faviconLink, setFaviconLink] = useState("");
  const [linkError, setLinkError] = useState("");
  const [faviconError, setFaviconError] = useState(true);
  const [faviconLoading, setFaviconLoading] = useState(false);

  const handleInputBlur = (): void => {
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
                <FiGlobe color="textLighter" />
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
            onBlur={handleInputBlur}
            value={link}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setLink(e.target.value);
              if (!isValidUrl(e.target.value)) {
                setLinkError("URL is not valid");
              } else {
                setLinkError("");
              }
            }}
          />
        </InputGroup>
      </Box>
    </FormControl>
  );
};

type ACTag = Tag & { isSelected: boolean; label: string; value: string };
export const CreateBite = ({ isOpen, onClose, date }: { isOpen: boolean; onClose: () => void; date: Date }): JSX.Element => {
  const [title, setTitle] = useState("");
  const [currentMode, setCurrentMode] = useState<BiteType>(BiteType.LINK);
  const { tags: allTags } = useTagsContext();
  const [tags, setTags] = useState<ACTag[]>([]);
  const selectedTags = useRef<ACTag[]>();
  const initialRef = useRef<any>(null);

  useEffect(() => {
    setTags(
      allTags.map((tag) => {
        return { ...tag, label: tag.name, value: tag.name, isSelected: false };
      })
    );
  }, [allTags]);

  const handleSelectedTagsChange = (selectedTags: ACTag[]) => {
    const modifiedTags = tags.map((tag) => {
      return { ...tag, isSelected: false };
    });
    console.log(selectedTags);
    modifiedTags.forEach((tag) => {
      const foundTag = selectedTags.find((t) => t.id === tag.id);
      if (foundTag) {
        tag.isSelected = !foundTag.isSelected;
      }
    });
    // sort modified tags by isSelected
    modifiedTags.sort((a, b) => {
      if (a.isSelected && !b.isSelected) {
        return 1;
      } else if (!a.isSelected && b.isSelected) {
        return -1;
      }
      return 0;
    });
    // setTags(modifiedTags);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="3xl" initialFocusRef={initialRef}>
      <ModalOverlay />
      <ModalContent
        ml="56px"
        borderRadius={10}
        bg="bgLighter"
        border="1px solid"
        borderColor="containerBorder"
        boxShadow="shadow"
        pb={4}
      >
        <ModalHeader>
          <Text>
            Bite on <b style={{ fontWeight: 800 }}>{format(date, "dd MMMM")}</b>
          </Text>
        </ModalHeader>
        <ModalCloseButton borderRadius={10} />
        <ModalBody py={4}>
          <VStack alignItems="flex-start" spacing={8} fontSize="lg">
            <FormControl>
              <Box>
                <FormLabel htmlFor="title" mb={1} fontSize="lg">
                  Title
                </FormLabel>
                <Input
                  ref={initialRef}
                  fontSize="lg"
                  borderColor="inputBorderColor"
                  type="text"
                  id="title"
                  required
                  value={title}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
                />
              </Box>
            </FormControl>
            <VStack w="full" alignItems="flex-start" id="bite-tag-select">
              <Box>Tags</Box>
              <CUIAutoComplete
                label=""
                placeholder="Add Tags"
                hideToggleButton
                tagStyleProps={{
                  bg: "bgLight",
                  borderRadius: "10px",
                  marginBottom: "0px",
                  marginTop: "10px !important",
                  fontSize: "md",
                }}
                // onSelectedItemsChange={(changes) => handleSelectedTagsChange(changes?.selectedItems || [])}
                // onActiveIndexChange={(changes) => console.log(changes)}
                onStateChange={(changes) => console.log(changes)}
                inputStyleProps={{ position: "relative", width: "200px" }}
                renderCustomInput={(props) => {
                  return <Input {...props} fontSize="lg" borderColor="inputBorderColor" autoFocus={false} />;
                }}
                listStyleProps={{
                  position: "absolute",
                  zIndex: 10000,
                  width: "200px",
                  borderRadius: "8px",
                  overflow: "auto",
                  height: "300px",
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
          <HStack spacing={0} mt={5} justifyContent="flex-end">
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
          {currentMode === BiteType.LINK && <LinkEditor />}
          {currentMode === BiteType.IMAGE && <ImageEditor />}
          {currentMode === BiteType.TEXT && <MDEditor />}
        </ModalBody>
        <ModalFooter>
          <Button variant="solid-bite" w={32}>
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
