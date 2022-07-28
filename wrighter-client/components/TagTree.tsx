import {
  Box,
  Button,
  Center,
  HStack,
  Icon,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
  Portal,
  Spinner,
  Text,
  useDisclosure,
  useOutsideClick,
  VStack,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { FiBookOpen, FiEdit, FiEye, FiHash, FiImage, FiLink2, FiRefreshCw, FiSearch, FiTrash2, FiX } from "react-icons/fi";
import { TbBulb, TbMarkdown } from "react-icons/tb";
import { useQuery } from "react-query";
import { useTagsContext } from "../contexts/TagsContext";
import { useUserContext } from "../contexts/UserContext";
import { WrightIDB } from "../services/dbService";
import { deleteTag, getTagContents } from "../services/tagService";
import { Bite, BiteType, Tag, Wright } from "../types";
import { ImageCard } from "./Bites/Image/ImageCard";
import { LinkCard } from "./Bites/Link/LinkCard";
import { TextCard } from "./Bites/Text/TextCard";
import { CustomToolTip } from "./CustomTooltip";

enum ContentType {
  WRIGHT = "WRIGHT",
  BITE = "BITE",
}

const isWright = (content: any): content is Wright | WrightIDB => {
  return !("type" in content);
};

const getIcon = (content: any) => {
  if (isWright(content)) {
    return <Icon as={FiBookOpen} color="accentColor" mb={-0.5} />;
  }
  switch (content.type) {
    case BiteType.LINK:
      return <Icon as={FiLink2} color="biteAccentColor" mb={-0.5} />;
    case BiteType.IMAGE:
      return <Icon as={FiImage} color="biteAccentColor" mb={-0.5} />;
    case BiteType.TEXT:
      return <Icon as={TbMarkdown} color="biteAccentColor" mb={-0.5} />;
    default:
      return <Icon as={TbBulb} color="biteAccentColor" mb={-0.5} />;
  }
};

const Tag = ({
  tag,
  isAuthenticated,
  onBiteOpen,
  showTag,
  captureFocus,
  onDeleteTag,
}: {
  tag: Tag;
  isAuthenticated: () => boolean;
  onBiteOpen: (bite: Bite) => void;
  showTag: boolean;
  captureFocus: (state: boolean) => void;
  onDeleteTag: () => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { onOpen: onDeleteOpen, onClose: onDeleteClose, isOpen: isDeleteOpen } = useDisclosure();
  const router = useRouter();

  const {
    refetch: tagContentRequest,
    data: tagContents,
    isFetching: isContentLoading,
  } = useQuery(["getTagContentQuery", tag.id], () => getTagContents(!isAuthenticated(), tag.id || ""), {
    enabled: false,
    refetchOnWindowFocus: false,
  });

  const { refetch: deleteTagRequest, isFetching: isDeleting } = useQuery(
    ["deleteTagQuery", tag.id],
    () => deleteTag(!isAuthenticated(), tag.id || ""),
    {
      enabled: false,
      refetchOnWindowFocus: false,
    }
  );

  const handleTagOpen = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (isOpen) {
      tagContentRequest();
    }
  }, [isOpen]);

  const onPopOverOpen = () => {
    captureFocus(true);
    onDeleteOpen();
  };

  const onPopOverClose = () => {
    captureFocus(false);
    onDeleteClose();
  };

  const handleDeleteTag = async () => {
    await deleteTagRequest();
    onPopOverClose();
    onDeleteTag();
  };

  return (
    <>
      <Box
        w="full"
        borderRadius={8}
        p={2}
        _hover={{ bg: "bgLight" }}
        transition="background 0.17s ease-in-out"
        onClick={(e: any) => {
          e.stopPropagation();
          handleTagOpen();
        }}
        cursor="pointer"
        display={showTag ? "block" : "none"}
        role="group"
      >
        <HStack w="full" pos="relative">
          <Icon as={FiHash} color="textLighter" mb={0.5} />
          <Text fontWeight="800" opacity={isOpen ? 1 : 0.7} whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis">
            {tag.name}
          </Text>
          <Box
            pos="absolute"
            right="0"
            top="0"
            w="70px"
            opacity={0}
            _groupHover={{
              opacity: 1,
            }}
          >
            <CustomToolTip label="refresh" placement="right">
              <IconButton
                icon={<FiRefreshCw />}
                size="xs"
                variant="ghost"
                aria-label={"refresh " + tag.name + " tag"}
                color="textLighter"
                ml={2}
                zIndex={1}
                onClick={(e: any) => {
                  e.stopPropagation();
                  tagContentRequest();
                  if (!isOpen) {
                    setIsOpen(true);
                  }
                }}
              />
            </CustomToolTip>
            <CustomToolTip label="delete tag" placement="right">
              <Popover placement="right" isOpen={isDeleteOpen} onOpen={onPopOverOpen} onClose={onPopOverClose}>
                <PopoverTrigger>
                  <IconButton
                    icon={<FiTrash2 />}
                    size="xs"
                    variant="ghost"
                    aria-label={"delete " + tag.name + " tag"}
                    color="textLighter"
                    ml={2}
                    zIndex={1}
                    onClick={(e: any) => {
                      e.stopPropagation();
                    }}
                  />
                </PopoverTrigger>
                <Portal>
                  <PopoverContent maxW="290px">
                    <PopoverArrow />
                    <PopoverHeader>You sure?</PopoverHeader>
                    <PopoverBody>this with detach all the wrights and bites from this tag</PopoverBody>
                    <PopoverFooter>
                      <HStack justifyContent="flex-end" w="full">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e: any) => {
                            e.stopPropagation();
                            onPopOverClose();
                          }}
                        >
                          Cancel
                        </Button>
                        <Button
                          isLoading={isDeleting}
                          variant="solid-negative-cta"
                          size="sm"
                          onClick={(e: any) => {
                            e.stopPropagation();
                            handleDeleteTag();
                            onPopOverClose();
                          }}
                        >
                          Delete
                        </Button>
                      </HStack>
                    </PopoverFooter>
                  </PopoverContent>
                </Portal>
              </Popover>
            </CustomToolTip>
          </Box>
        </HStack>
      </Box>
      {isOpen && (
        <Box
          w="full"
          borderTop="2px solid"
          _hover={{ borderColor: tagContents && tagContents.length > 0 ? "bgLight" : "transparent" }}
          borderColor="transparent"
          display={showTag ? "block" : "none"}
        >
          {isContentLoading ? (
            <Center>
              <Spinner
                sx={{
                  "--spinner-size": "1rem",
                  borderBottomColor: "textLighter",
                  borderLeftColor: "textLighter",
                  borderTopColor: "transparent",
                  borderRightColor: "transparent",
                }}
              />
            </Center>
          ) : tagContents && tagContents?.length > 0 ? (
            tagContents?.map((content) => {
              return (
                <Box
                  key={content.id}
                  ml={2}
                  w="full"
                  borderRadius={8}
                  p={2}
                  transition="background 0.17s ease-in-out"
                  cursor="pointer"
                  whiteSpace="nowrap"
                  overflow="hidden"
                  textOverflow="ellipsis"
                >
                  <Box role="group" pos="relative">
                    <HStack>
                      {getIcon(content)}
                      <Text fontWeight="bold" whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis" w="full">
                        {content.title}
                      </Text>
                    </HStack>
                    {isWright(content) ? (
                      <HStack
                        pos="absolute"
                        right="0"
                        top="0"
                        bg="bgDarkGrad"
                        w="70px"
                        opacity={0}
                        _groupHover={{
                          opacity: 1,
                        }}
                      >
                        <IconButton
                          icon={<FiEdit />}
                          size="xs"
                          variant="ghost"
                          aria-label={"edit wright " + content.title}
                          color="textLighter"
                          ml={2}
                          onClick={() => {
                            router.push("/wrighting?id=" + content.id);
                          }}
                        />
                        <IconButton
                          icon={<FiEye />}
                          size="xs"
                          variant="ghost"
                          aria-label={"open wright " + content.title}
                          color="textLighter"
                          ml={2}
                          onClick={() => {
                            if (content.isPublic) {
                              window.open("/wright/" + content.slug + "-" + content.id, "_blank");
                            } else {
                              window.open(`/wright?id=${content.id}`, "_blank");
                            }
                          }}
                        />
                      </HStack>
                    ) : (
                      <Box
                        pos="absolute"
                        right="0"
                        top="0"
                        bg="bgDarkGrad"
                        w="35px"
                        opacity={0}
                        _groupHover={{
                          opacity: 1,
                        }}
                      >
                        <IconButton
                          icon={<FiEye />}
                          size="xs"
                          variant="ghost"
                          aria-label={"open bite " + content.title}
                          color="textLighter"
                          ml={2}
                          onClick={() => {
                            onBiteOpen(content);
                          }}
                        />
                      </Box>
                    )}
                  </Box>
                </Box>
              );
            })
          ) : (
            <Text w="full" textAlign="center" fontSize="sm" color="textLighter" display={showTag ? "block" : "none"}>
              nothing here
            </Text>
          )}
        </Box>
      )}
    </>
  );
};

export const TagTree = ({
  isOpen,
  onOpen,
  onClose,
  isMobile = false,
}: {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  isMobile?: boolean;
}) => {
  const { tags, fetchTags } = useTagsContext();
  // const [tags, setTags] = useState<Tag[]>([]);
  const { isAuthenticated } = useUserContext();
  const { isOpen: isViewerOpen, onOpen: onViewerOpen, onClose: onViewerClose } = useDisclosure();
  const [selectedBite, setSelectedBite] = useState<Bite | undefined>();
  const [currentSearchQuery, setCurrentSearchQuery] = useState("");
  const [focusCaptured, setFocusCaptured] = useState(false);

  const onBiteOpen = (bite: Bite) => {
    setSelectedBite(bite);
    onViewerOpen();
  };

  const tagTreeRef = useRef<any>();
  useOutsideClick({
    enabled: isMobile ? false : !isViewerOpen && !focusCaptured,
    ref: tagTreeRef,
    handler: () => onClose(),
  });

  const onCaptureFocus = (state: boolean) => {
    setFocusCaptured(state);
  };

  const onDeleteTag = () => {
    fetchTags?.();
  };

  return (
    <Box
      top="0"
      bg="bgDark"
      transform={isMobile ? `translateX(${isOpen ? "0px" : "100%"})` : `translateX(${isOpen ? 0 : -(56 + 260 + 1)}px)`}
      transition="transform 0.17s ease-in-out"
      pos="fixed"
      zIndex={1}
      ml={isMobile ? "0px" : "56px"}
      w={isMobile ? "100%" : "260px"}
      h={isMobile ? "calc(100vh - 56px)" : "100vh"}
      borderRight={!isMobile ? "1px solid" : ""}
      borderBottom={isMobile ? "1px solid" : ""}
      borderBottomRadius={isMobile ? "10px" : "0px"}
      overflowY="auto"
      borderColor="containerBorder"
      ref={tagTreeRef}
      overflowX="hidden"
    >
      <Box pos="relative" mt={2.5} mx={1.5} zIndex={1}>
        <Box pos="sticky" top="10px" bg="bgLight" borderRadius={8}>
          <HStack spacing={0}>
            <Center pl={2} w={6} h={6}>
              <Icon as={FiSearch} opacity={0.6} color="textLighter" />
            </Center>
            <Input
              variant="unstyled"
              placeholder="search tag"
              autoFocus
              size="md"
              borderColor="inputBorderColor"
              borderRadius={8}
              // width={100}
              height="32px"
              px={2}
              value={currentSearchQuery}
              _focusVisible={{
                bg: "transparent",
                border: "none",
              }}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setCurrentSearchQuery(e.target.value.trim())}
            />
          </HStack>
        </Box>
        <VStack spacing={1} overflowX="hidden" mt={4}>
          {tags && tags.length > 0 ? (
            tags.map((tag) => {
              return (
                <Tag
                  key={tag.id}
                  tag={tag}
                  isAuthenticated={isAuthenticated}
                  onBiteOpen={onBiteOpen}
                  showTag={tag.name.toLowerCase().includes(currentSearchQuery.toLowerCase())}
                  captureFocus={onCaptureFocus}
                  onDeleteTag={onDeleteTag}
                />
              );
            })
          ) : (
            <Center>
              <Text fontSize="sm" color="textLighter" my={20}>
                no tags in here!
              </Text>
            </Center>
          )}
        </VStack>
      </Box>
      <Box w="full" pos="sticky" p={2} bottom="0px" zIndex={1}>
        <Button variant="ghost" w="full" onClick={onClose} leftIcon={<FiX />} iconSpacing={1}>
          Close
        </Button>
      </Box>
      <Modal
        isOpen={isViewerOpen}
        onClose={onViewerClose}
        size={selectedBite?.type === BiteType.IMAGE ? "4xl" : selectedBite?.type === BiteType.TEXT ? "3xl" : "xl"}
      >
        <ModalOverlay />
        <ModalContent borderRadius={10} bg="bgLighter" border="1px solid" borderColor="containerBorder" boxShadow="shadow">
          <ModalHeader>{selectedBite?.title}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedBite?.tags && selectedBite?.tags?.length > 0 && (
              <HStack wrap="wrap" spacing={0} mt={-2} mb={3}>
                {selectedBite?.tags.map((tag) => {
                  return (
                    <Box key={tag.id} color="textLighter" pr={2}>
                      <Text>#{tag.name}</Text>
                    </Box>
                  );
                })}
              </HStack>
            )}
            {selectedBite?.type === BiteType.LINK && <LinkCard bite={selectedBite} />}
            {selectedBite?.type === BiteType.IMAGE && <ImageCard bite={selectedBite} />}
            {selectedBite?.type === BiteType.TEXT && <TextCard bite={selectedBite} />}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};
