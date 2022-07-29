import {
  Box,
  Center,
  HStack,
  Icon,
  IconButton,
  Input,
  Kbd,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Spinner,
  Text,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import { FiHash, FiPlusCircle, FiX } from "react-icons/fi";
import { useQuery } from "react-query";
import { useTagsContext } from "../../contexts/TagsContext";
import { useUserContext } from "../../contexts/UserContext";
import { attachTagToWright, createTag, getTagsForWright, untagWright } from "../../services/tagService";
import { Tag, TagSearchResult, Wright } from "../../types";
import { CustomToolTip } from "../CustomTooltip";
import { Toaster } from "../Toaster";

const Tag = ({ tag, onTagDelete }: { tag: Tag; onTagDelete: (tag: Tag) => void }): JSX.Element => {
  const [isHovering, setIsHovering] = useState(false);
  const router = useRouter();
  const { isAuthenticated } = useUserContext();
  const toast = useToast();

  const { refetch: unTagRequest, isFetching: isDeletingTag } = useQuery("deleteTagQuery", () => unTagRequestHandler(), {
    enabled: false,
    refetchOnWindowFocus: false,
  });

  const unTagRequestHandler = async () => {
    try {
      await untagWright(!isAuthenticated(), tag?.id || "", router?.query?.id as string);
      onTagDelete(tag);
    } catch (e) {
      toast({
        position: "bottom-right",
        render: () => <Toaster message={"something bad happened! please try again."} type="error" />,
      });
    }
  };

  return (
    <Box
      borderRadius={10}
      border="1px solid"
      borderColor="containerBorder"
      px={2}
      py={0}
      bg="bgLight"
      onMouseOver={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <HStack spacing={1}>
        {isHovering ? (
          <Icon as={FiX} size="sm" cursor="pointer" onClick={() => unTagRequest()} />
        ) : (
          <Icon as={FiHash} size="sm" />
        )}
        <Text fontWeight="bold" color="textLight" fontSize="sm">
          {tag.name}
        </Text>
      </HStack>
    </Box>
  );
};

export const Tags = ({ initWright }: { initWright: Wright }): JSX.Element => {
  const [currentEditingTag, setCurrentEditingTag] = useState("");
  const [currentTags, setCurrentTags] = useState<Tag[]>([]);
  const [focusedTagIdx, setFocusedTagIdx] = useState<number>(0);
  const { onOpen, onClose, isOpen } = useDisclosure();
  const { isAuthenticated } = useUserContext();
  const { tags: allTags, fetchTags } = useTagsContext();
  const [searchTagResults, setSearchTagResults] = useState<TagSearchResult[]>([]);
  const initialFocusRef = useRef<any>();
  const toast = useToast();

  useEffect(() => {
    if (initWright?.tags && initWright?.tags?.length > 0) {
      setCurrentTags(initWright.tags);
    }
  }, [initWright]);

  const {
    refetch: createAndAttachTagRequest,
    isFetching: isAddingTag,
    error: createAndAttachError,
    status: createAndAttachStatus,
  } = useQuery("createAndAttachTagQuery", () => createAndAttachTagHandler(), {
    enabled: false,
    refetchOnWindowFocus: false,
    retry: false,
  });

  const { refetch: refetchTagsForWright, isFetching: isFetchingTags } = useQuery(
    "getTagsForWright",
    () => getTagsForWright(!isAuthenticated(), initWright?.id),
    {
      enabled: false,
    }
  );

  const searchTagAlreadyExists = () => {
    if (searchTagResults) {
      return searchTagResults.some((tag) => tag.name === currentEditingTag);
    }
    return false;
  };

  const markTaggedTags = (curTags: Tag[], allTags: Tag[]): TagSearchResult[] => {
    const modifiedTags: TagSearchResult[] = [];
    for (const tag of allTags) {
      if (!curTags.find((t) => t.id === tag.id)) {
        modifiedTags.push({ ...tag, isTagged: false });
      } else {
        modifiedTags.push({ ...tag, isTagged: true });
      }
    }
    modifiedTags.sort((a, b) => {
      if (a.isTagged && !b.isTagged) {
        return 1;
      } else if (!a.isTagged && b.isTagged) {
        return -1;
      } else {
        return a.name.localeCompare(b.name);
      }
    });
    return modifiedTags;
  };

  const searchTagsHandler = (): void => {
    setSearchTagResults(
      markTaggedTags(
        currentTags,
        allTags.filter((tag) => tag.name.includes(currentEditingTag))
      )
    );
    setFocusedTagIdx(currentEditingTag.trim().length === 0 ? 0 : -1);
  };

  useEffect(() => {
    if (isOpen) {
      searchTagsHandler();
    }
  }, [currentTags, isOpen, allTags]);

  const createAndAttachTagHandler = async () => {
    let newtagName = "";
    if (currentEditingTag.trim().length > 0 && focusedTagIdx === -1) {
      newtagName = currentEditingTag.trim();
    } else if (searchTagResults && focusedTagIdx < searchTagResults?.length && focusedTagIdx >= 0) {
      newtagName = searchTagResults[focusedTagIdx]?.name;
    }
    if (newtagName.trim().length === 0 || (searchTagResults && searchTagResults[focusedTagIdx]?.isTagged)) {
      return [];
    }
    if (focusedTagIdx === -1 && (currentEditingTag.trim().length < 3 || currentEditingTag.trim().length > 35)) {
      toast({
        position: "bottom-right",
        render: () => <Toaster message="tag name too short or too long" type="error" />,
      });
      return [];
    }
    const newTag = await createTag(!isAuthenticated(), { name: newtagName });
    if (newTag && newTag?.id) {
      await attachTagToWright(!isAuthenticated(), newTag.id, initWright.id);
      const { data: updatedTags } = await refetchTagsForWright();
      setCurrentTags(updatedTags || []);
      setCurrentEditingTag("");
      if (fetchTags) {
        await fetchTags();
      }
      return updatedTags || [];
    }
    return [];
  };

  useEffect(() => {
    if (createAndAttachStatus === "error") {
      toast({
        position: "bottom-right",
        render: () => <Toaster message={"something bad happened! please try again."} type="error" />,
      });
    }
  }, [isAddingTag, createAndAttachStatus]);

  const handleTagInputChange = async (value: string) => {
    setCurrentEditingTag(value.trim());
    searchTagsHandler();
  };

  useEffect(() => {
    if (currentEditingTag.length === 0) {
      setFocusedTagIdx(0);
    }
  }, [currentEditingTag]);

  const onTagDelete = (tag: Tag) => {
    const updatedTags = currentTags.filter((t) => t.id !== tag.id);
    setCurrentTags(updatedTags);
  };

  return (
    <Box px={{ base: "1%", md: "4%" }} mx={{ base: "0px", md: "20px" }}>
      <HStack spacing={3} role="group" justify="flex-end">
        <HStack>
          {currentTags && currentTags?.length > 0 ? (
            currentTags?.map((tag) => {
              return <Tag tag={tag} key={tag.id} onTagDelete={onTagDelete} />;
            })
          ) : (
            <Text fontSize="sm" fontWeight="medium" color="textLighter" opacity="0.6" as="i">
              untagged
            </Text>
          )}
        </HStack>
        <Box w={0.5} h="17px" borderRadius="100px" bg="textLighter" transition="opacity 0.2s ease-in-out" opacity={0.16}></Box>
        <HStack transition="opacity 0.2s ease-in-out" opacity={1}>
          <Popover placement="bottom-end" initialFocusRef={initialFocusRef} isOpen={isOpen} onOpen={onOpen} onClose={onClose}>
            <PopoverTrigger>
              <Box>
                <CustomToolTip label="add new tag">
                  <IconButton variant="ghost" size="xs" icon={<FiPlusCircle />} aria-label="add tag" />
                </CustomToolTip>
              </Box>
            </PopoverTrigger>
            <PopoverContent
              maxW="280px"
              onKeyPress={(e: KeyboardEvent<HTMLInputElement>) => {
                if (e.key === "Enter") {
                  createAndAttachTagRequest();
                }
              }}
              onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
                if (searchTagResults) {
                  const unTaggedTags = searchTagResults.filter((tag) => !tag.isTagged);
                  if (e.key === "ArrowUp") {
                    e.preventDefault();
                    if (focusedTagIdx === -1) {
                      setFocusedTagIdx(unTaggedTags.length - 1);
                      return;
                    }
                    if (focusedTagIdx === 0) {
                      if (currentEditingTag.trim().length > 0 && !searchTagAlreadyExists()) {
                        setFocusedTagIdx(-1);
                      } else {
                        setFocusedTagIdx(unTaggedTags?.length - 1);
                      }
                    } else {
                      const idxToMove = (focusedTagIdx - 1) % unTaggedTags?.length;
                      setFocusedTagIdx(isNaN(idxToMove) ? -1 : idxToMove);
                    }
                  } else if (e.key === "ArrowDown") {
                    e.preventDefault();
                    if (focusedTagIdx === unTaggedTags?.length - 1) {
                      if (currentEditingTag.trim().length > 0 && !searchTagAlreadyExists()) {
                        setFocusedTagIdx(-1);
                      } else {
                        setFocusedTagIdx(0);
                      }
                    } else {
                      const idxToMove = (focusedTagIdx + 1) % unTaggedTags?.length;
                      setFocusedTagIdx(isNaN(idxToMove) ? -1 : idxToMove);
                    }
                  }
                }
              }}
            >
              <PopoverArrow />
              <PopoverHeader>
                <HStack spacing={0} bg="bgLight" borderRadius={8}>
                  <Center pl={2} w={6} h={6}>
                    <Icon as={FiHash} opacity={0.6} color="textLighter" />
                  </Center>
                  <Input
                    ref={initialFocusRef}
                    variant="unstyled"
                    placeholder="search or add tag"
                    isDisabled={isAddingTag || isFetchingTags}
                    autoFocus
                    size="md"
                    borderColor="inputBorderColor"
                    borderRadius={8}
                    // width={100}
                    height="32px"
                    px={2}
                    value={currentEditingTag}
                    _focusVisible={{
                      bg: "transparent",
                      border: "none",
                    }}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => handleTagInputChange(e.target.value)}
                  />
                </HStack>
              </PopoverHeader>
              <PopoverBody maxH="200px" minH="200px" overflowY="auto">
                {isAddingTag || isFetchingTags ? (
                  <Center w="full" h="120px">
                    <Spinner
                      sx={{
                        "--spinner-size": "2rem",
                        borderBottomColor: "textLighter",
                        borderLeftColor: "textLighter",
                        borderTopColor: "transparent",
                        borderRightColor: "transparent",
                      }}
                    />
                  </Center>
                ) : (
                  <VStack align="flex-start" w="full" spacing={1}>
                    {currentEditingTag.trim() && !searchTagAlreadyExists() && (
                      <Box
                        cursor="pointer"
                        borderRadius={8}
                        px={1.5}
                        py={1}
                        w="full"
                        bg="successGreenTransBg"
                        color="successGreen"
                        transition="opacity 0.15s ease-in-out"
                        opacity={focusedTagIdx === -1 ? 1 : 0.85}
                        onMouseMoveCapture={() => {
                          setFocusedTagIdx(-1);
                        }}
                        onClick={() => {
                          createAndAttachTagRequest();
                        }}
                        ref={(ref: HTMLDivElement) => {
                          if (focusedTagIdx === -1) {
                            ref?.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
                          }
                        }}
                      >
                        <HStack justify="space-between">
                          <HStack>
                            <Icon as={FiHash} opacity={0.6} color="successGreen" />
                            <Text fontWeight="black">{currentEditingTag}</Text>
                          </HStack>
                          {/* <Text fontWeight="black"># {currentEditingTag}</Text> */}
                          <Kbd
                            bg="bgLighter"
                            borderColor="successGreen"
                            opacity={focusedTagIdx === -1 ? 1 : 0}
                            transform={focusedTagIdx === -1 ? "translateX(0)" : "translateX(4px)"}
                            transition="all 0.2s ease-in-out"
                          >
                            ↩
                          </Kbd>
                        </HStack>
                      </Box>
                    )}
                    {searchTagResults && searchTagResults?.length > 0
                      ? searchTagResults?.map((tag, idx) => {
                          return (
                            <Box
                              cursor={tag?.isTagged ? "no-drop" : "pointer"}
                              borderRadius={8}
                              px={1.5}
                              py={1}
                              w="full"
                              key={tag.id}
                              bg={idx === focusedTagIdx ? "bgLight" : "bgLighter"}
                              transition="background 0.3s ease-in-out"
                              opacity={tag?.isTagged ? 0.3 : 1}
                              ref={(ref: HTMLDivElement) => {
                                if (idx === focusedTagIdx && !tag.isTagged) {
                                  ref?.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
                                }
                              }}
                              onMouseMoveCapture={() => {
                                if (!tag.isTagged) {
                                  setFocusedTagIdx(idx);
                                }
                              }}
                              onClick={() => {
                                createAndAttachTagRequest();
                              }}
                            >
                              <HStack justify="space-between">
                                <HStack>
                                  <Icon as={FiHash} opacity={0.6} color="textLighter" />
                                  <Text
                                    fontWeight={tag?.isTagged ? "bold" : "black"}
                                    textDecoration={tag?.isTagged ? "line-through" : "none"}
                                  >
                                    {tag.name}
                                  </Text>
                                </HStack>
                                <Kbd
                                  bg="bgLighter"
                                  transition="all 0.25s ease-in-out"
                                  opacity={focusedTagIdx === idx ? 1 : 0}
                                  transform={focusedTagIdx === idx ? "translateX(0)" : "translateX(4px)"}
                                >
                                  ↩
                                </Kbd>
                              </HStack>
                            </Box>
                          );
                        })
                      : currentEditingTag.trim().length === 0 && (
                          <Center w="full" h="120px" color="textLighter">
                            <Text>type in to add tags!</Text>
                          </Center>
                        )}
                  </VStack>
                )}
              </PopoverBody>
            </PopoverContent>
          </Popover>
        </HStack>
      </HStack>
    </Box>
  );
};
