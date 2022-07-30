import {
  Box,
  Button,
  Center,
  Container,
  HStack,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverTrigger,
  Spinner,
  Stack,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { addDays, differenceInDays, format, formatDistanceToNow, subDays } from "date-fns";
import { ChangeEvent, useEffect, useState } from "react";
import { DateRange, Range, RangeKeyDict } from "react-date-range";
import { FiCalendar, FiCheck, FiChevronLeft, FiChevronRight, FiFilter, FiHash, FiLoader, FiPlus } from "react-icons/fi";
import { TbBulb } from "react-icons/tb";
import { useMutation, useQuery } from "react-query";
import { useUserContext } from "../../contexts/UserContext";
import { deleteBite, getBites } from "../../services/biteService";
import { CreateBite } from "./CreateBite";
import { CUIAutoComplete } from "chakra-ui-autocomplete";
import { UseMultipleSelectionStateChange } from "downshift";
// @ts-ignore
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { useTagsContext } from "../../contexts/TagsContext";
import { ACTag, Bite, Tag } from "../../types";
import { BiteCard } from "./BiteCard";
import { useBitesContext } from "../../contexts/BitesContext";
import { useBiteActions } from "../../contexts/CommandBarHooks/useBiteActions";

export const Bites = (): JSX.Element => {
  const [carouselDate, setCarouselDate] = useState({
    start: subDays(new Date(), 4),
    end: addDays(new Date(), 3),
  });
  const [selectedCarouselIdx, setSelectedCarouselIdx] = useState(3);
  const [selectionDateRange, setSelectionDateRange] = useState<Range>({
    startDate: new Date(),
    endDate: new Date(),
    key: "selection",
  });
  // const { isOpen: isBiteCreateOpen, onOpen: onBiteCreateOpen, onClose: onBiteCreateClose } = useDisclosure();
  const { isAuth, isUserLoading, user } = useUserContext();
  const { tags: allTags } = useTagsContext();
  const [tags, setTags] = useState<ACTag[]>([]);
  const [selectedTags, setSelectedTags] = useState<ACTag[]>([]);
  const { onCreateBiteOpen, triggerRefresh, removeFromBitesMemoryContext } = useBitesContext();

  useBiteActions();

  useEffect(() => {
    setTags(
      allTags.map((tag) => {
        return { ...tag, label: tag.name, value: tag.name };
      })
    );
  }, [allTags]);

  const handleDateRangeSelect = (ranges: RangeKeyDict) => {
    if (ranges.selection && ranges.selection.startDate && ranges.selection.endDate) {
      const diff = differenceInDays(ranges.selection.endDate, ranges.selection.startDate);
      if (diff > 20) {
        setSelectionDateRange({
          startDate: ranges.selection.startDate,
          endDate: addDays(ranges.selection.startDate, 20),
          key: "selection",
        });
      } else {
        setSelectionDateRange(ranges.selection);
      }
      setCarouselDate({
        start: subDays(ranges.selection.startDate, 4),
        end: subDays(ranges.selection.startDate, 3),
      });
      setSelectedCarouselIdx(3);
    }
  };

  const handleCarouselChange = (dir: number): void => {
    if (selectedCarouselIdx + dir > 6) {
      setCarouselDate({
        start: addDays(carouselDate.start, 1),
        end: carouselDate.end,
      });
      setSelectionDateRange({
        startDate: addDays(carouselDate.start, 8),
        endDate: addDays(carouselDate.start, 8),
      });
      setSelectedCarouselIdx(selectedCarouselIdx + dir - 1);
      return;
    }

    if (selectedCarouselIdx + dir === -1) {
      setCarouselDate({
        start: subDays(carouselDate.start, 1),
        end: carouselDate.end,
      });
      setSelectionDateRange({
        startDate: subDays(carouselDate.start, 0),
        endDate: subDays(carouselDate.start, 0),
      });
      setSelectedCarouselIdx(0);
      return;
    }

    setSelectedCarouselIdx(selectedCarouselIdx + dir);
  };

  const getSelectedDate = () => {
    return addDays(carouselDate.start, selectedCarouselIdx + 1);
  };

  const getSelectedDateString = () => {
    if (selectionDateRange.startDate && selectionDateRange.endDate) {
      if (differenceInDays(selectionDateRange.startDate, selectionDateRange.endDate) === 0) {
        return format(getSelectedDate(), "dd MMM EEE");
      } else {
        return `${format(selectionDateRange.startDate, "dd MMM EEE")} - ${format(selectionDateRange.endDate, "dd MMM EEE")}`;
      }
    }
  };

  const getRelativeSelectedDateString = () => {
    if (selectionDateRange.startDate && selectionDateRange.endDate) {
      const diff = differenceInDays(selectionDateRange.endDate, selectionDateRange.startDate);
      if (diff === 0) {
        if (getSelectedDate().toDateString() === new Date().toDateString()) {
          return "Today";
        }
        if (getSelectedDate().toDateString() === addDays(new Date(), 1).toDateString()) {
          return "Tomorrow";
        }
        if (getSelectedDate().toDateString() === subDays(new Date(), 1).toDateString()) {
          return "Yesterday";
        }
        return formatDistanceToNow(getSelectedDate(), { addSuffix: true });
      } else {
        return diff > 1 ? `${diff} days` : `${diff} day`;
      }
    }
  };

  useEffect(() => {
    setSelectionDateRange({
      startDate: getSelectedDate(),
      endDate: getSelectedDate(),
      key: "selection",
    });
  }, [selectedCarouselIdx]);

  const getBitesHandler = async () => {
    if (selectionDateRange.startDate && selectionDateRange.endDate) {
      const bites = await getBites(!isAuth, selectionDateRange.startDate, selectionDateRange.endDate);
      bites.sort((a, b) => a.createdAt.localeCompare(b.createdAt) * -1);
      return bites;
    }
    return [];
  };

  const { mutate: biteDeleteRequest } = useMutation((biteToDelete: Bite) => deleteBite(!isAuth, biteToDelete.id));

  const {
    refetch: getBitesRequest,
    data: bites,
    isFetching: isBitesLoading,
  } = useQuery("getBites", () => getBitesHandler(), {
    enabled: false,
    refetchOnWindowFocus: false,
  });

  const onDeleteHandler = async (biteToDelete: Bite) => {
    await biteDeleteRequest(biteToDelete);
    removeFromBitesMemoryContext(biteToDelete);
    // fake delay cuz deletion is not read consistent
    await new Promise((resolve) => setTimeout(resolve, 300));
    await getBitesRequest();
  };

  useEffect(() => {
    if (!isUserLoading) {
      getBitesRequest();
    }
  }, [selectionDateRange, carouselDate.start, isUserLoading, isAuth]);

  useEffect(() => {
    if (!isUserLoading) {
      getBitesRequest();
    }
  }, [triggerRefresh, isUserLoading, isAuth]);

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

  const onTagClickHandler = (tag: Tag) => {
    if (!selectedTags.find((t) => t.id === tag.id)) {
      setSelectedTags([...selectedTags, { ...tag, label: tag.name, value: tag.name }]);
    }
  };

  const getFilteredBites = () => {
    const selectedTagIds = selectedTags.map((tag) => tag.id);
    return (bites || []).filter((bite) => {
      if (selectedTags.length === 0) {
        return true;
      }
      const biteTagIds = bite.tags ? bite.tags.map((tag) => tag.id) : [];
      return selectedTagIds.some((tagId) => biteTagIds.includes(tagId));
    });
  };

  return (
    <Container maxW="full" pt={{ base: 5, md: 20 }} pb={20} overflowX="hidden" className="fade-in">
      <HStack w="full" justify="space-between">
        <HStack spacing={4}>
          <Center borderRadius={10} w={16} h={16} bg="biteAccentColorTrans">
            <Icon as={TbBulb} w={8} h={8} color="biteAccentColor"></Icon>
          </Center>
          <VStack align="flex-start" spacing={0}>
            <Text fontWeight="800" fontSize="xx-large">
              Bites
            </Text>
            <Text color="textLighter">jot down bite-sized thoughts and information</Text>
          </VStack>
        </HStack>
        <Button
          variant="solid-bite"
          rightIcon={<FiPlus style={{ marginBottom: "2px" }} />}
          onClick={() => onCreateBiteOpen(getSelectedDate())}
          display={{ base: "none", md: "flex" }}
        >
          Create Bite
        </Button>
        <IconButton
          aria-label="create bite"
          variant="solid-bite"
          as={FiPlus}
          size="md"
          p={2}
          onClick={() => onCreateBiteOpen(getSelectedDate())}
          display={{ base: "flex", md: "none" }}
        />
      </HStack>
      <Box mt={8} w="full">
        <Stack
          justifyContent={{ md: "space-between", base: "unset" }}
          rowGap={{ base: 5, md: 0 }}
          alignItems={{ base: "center", md: "unset" }}
          direction={{ base: "column", md: "row" }}
        >
          <HStack spacing={{ md: 4, base: 2 }}>
            <Box as="button" w={10} h="90px" onClick={() => handleCarouselChange(-1)} display={{ base: "none", md: "block" }}>
              <IconButton as={FiChevronLeft} aria-label="carousel date back" variant="ghost" p={2} />
            </Box>
            {[1, 2, 3, 4, 5, 6, 7].map((val, idx) => {
              const currDate = addDays(carouselDate.start, val);
              return (
                <Box
                  as="button"
                  w={{ base: 10, md: 16 }}
                  h={{ base: "70px", md: "90px" }}
                  bg={idx === selectedCarouselIdx ? "bgLight" : "bgLighter"}
                  opacity={idx === selectedCarouselIdx ? 1 : 0.6}
                  transform={idx === selectedCarouselIdx ? "scale(1.15)" : "scale(1)"}
                  shadow={idx === selectedCarouselIdx ? "md" : "unset"}
                  borderRadius={10}
                  key={val}
                  cursor="pointer"
                  pos="relative"
                  onClick={() => setSelectedCarouselIdx(idx)}
                  transition="all 0.2s ease-in-out"
                >
                  {currDate.toDateString() === new Date().toDateString() && (
                    <Center w={3} h={3} bg="biteAccentColor" pos="absolute" right="-5px" top="-5px" borderRadius={100}>
                      <Icon as={FiLoader} fontSize="8px" stroke="textColorWhite"></Icon>
                    </Center>
                  )}
                  <Center
                    w="full"
                    h={1}
                    bg="transparent"
                    opacity={idx === selectedCarouselIdx ? 1 : 0}
                    transform={idx === selectedCarouselIdx ? "scaleX(1)" : "scaleX(0)"}
                    transition="all 0.2s ease-in-out"
                    pos="absolute"
                    bottom="-8px"
                  >
                    <Box bg="biteAccentColor" w="24%" h="full" borderRadius={100}></Box>
                  </Center>
                  <Center w="full" h="full">
                    <VStack>
                      <VStack spacing={1}>
                        <Text fontWeight="bold" color="textLighter" fontSize={{ md: "sm", base: "10px" }}>
                          {format(currDate, "EEE")}
                        </Text>
                        <Text fontWeight="800" color="textLight" fontSize={{ md: "xx-large", base: "md" }} lineHeight={1}>
                          {format(currDate, "dd")}
                        </Text>
                      </VStack>
                      <Text fontWeight="bold" color="textLighter" fontSize={{ md: "sm", base: "10px" }} opacity={0.5}>
                        {format(currDate, "LLL")}
                      </Text>
                    </VStack>
                  </Center>
                </Box>
              );
            })}
            <Box as="button" w={10} h="90px" onClick={() => handleCarouselChange(1)} display={{ base: "none", md: "block" }}>
              <IconButton as={FiChevronRight} aria-label="carousel date forward" variant="ghost" p={2} />
            </Box>
          </HStack>
          <HStack justifyContent={{ base: "space-between", md: "unset" }} w={{ base: "full", md: "auto" }}>
            <Popover>
              <PopoverTrigger>
                {selectionDateRange.startDate && selectionDateRange.endDate && (
                  <HStack spacing={0} cursor="pointer">
                    <HStack fontSize="sm" bg="bgLight" color="textLighter" h="40px" pl={3} borderLeftRadius={10} pt="2px">
                      <Text>{format(selectionDateRange.startDate, "dd MMM")}</Text>
                      <Text>-</Text>
                      <Text>{format(selectionDateRange.endDate, "dd MMM")}</Text>
                    </HStack>
                    <Box>
                      <IconButton as={FiCalendar} aria-label="calender open" variant="ghost" p={3} borderLeftRadius={0} />
                    </Box>
                  </HStack>
                )}
              </PopoverTrigger>
              <PopoverContent maxW="unset" minW="unset" width="auto">
                <PopoverArrow />
                <PopoverBody maxW="unset" minW="unset">
                  <DateRange
                    dragSelectionEnabled
                    rangeColors={["var(--chakra-colors-biteAccentColor)", "red", "blue"]}
                    editableDateInputs
                    ranges={[selectionDateRange]}
                    onChange={handleDateRangeSelect}
                    className="date-range-picker"
                  />
                </PopoverBody>
              </PopoverContent>
            </Popover>
            <HStack display={{ base: "flex", md: "none" }}>
              <IconButton
                as={FiChevronLeft}
                onClick={() => handleCarouselChange(-1)}
                aria-label="carousel date back"
                variant="ghost"
                p={2}
              />
              <IconButton
                as={FiChevronRight}
                onClick={() => handleCarouselChange(1)}
                aria-label="carousel date forward"
                variant="ghost"
                p={2}
              />
            </HStack>
          </HStack>
        </Stack>
        <HStack justifyContent="space-between">
          <VStack mt={8} alignItems="flex-start" spacing={-1}>
            <Text fontWeight={800} fontSize="3xl">
              {getSelectedDateString()}
            </Text>
            <Text fontWeight="bold" fontSize="large" color="textLighter" opacity={0.6}>
              {getRelativeSelectedDateString()}
            </Text>
          </VStack>
          <Popover>
            <PopoverTrigger>
              <Center pos="relative">
                <IconButton icon={<FiFilter />} aria-label="bite filter" variant="ghost" p={3} cursor="pointer"></IconButton>
                {selectedTags.length > 0 && (
                  <Box pos="absolute" w="40%" h="2px" borderRadius={10} bg="biteAccentColor" bottom="-6px"></Box>
                )}
              </Center>
            </PopoverTrigger>
            <PopoverContent>
              <PopoverCloseButton color="textLighter" />
              <PopoverArrow />
              <PopoverBody>
                <VStack w="full" alignItems="flex-start" id="bite-tag-select" className="tag-filter">
                  {selectedTags.length === 0 && (
                    <Text fontSize="sm" as="i" color="textLighter" w="full" textAlign="center">
                      no tags selected
                    </Text>
                  )}
                  <CUIAutoComplete
                    label=""
                    placeholder="Filter by tags"
                    hideToggleButton
                    tagStyleProps={{
                      bg: "bgLight",
                      borderRadius: "10px",
                      marginBottom: "5px !important",
                      // marginTop: "5px !important",
                      marginLeft: "0px !important",
                      marginRight: "5px !important",
                      fontSize: "sm",
                      paddingTop: "3px",
                      paddingBottom: "3px",
                      height: "15px",
                    }}
                    disableCreateItem
                    onStateChange={(changes: UseMultipleSelectionStateChange<ACTag>) => handleTagSelectStateChange(changes)}
                    inputStyleProps={{ position: "relative", width: "full" }}
                    renderCustomInput={(props) => {
                      return (
                        <InputGroup w="full">
                          <InputLeftElement children={<Icon as={FiHash} color="textLighter" mb={1.5} />} />
                          <Input {...props} borderColor="inputBorderColor" size="md" borderRadius={8} height="36px" />
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
                    listItemStyleProps={{ borderRadius: "5px", margin: "4px", fontSize: "md", cursor: "pointer" }}
                    highlightItemBg="bgLight"
                    items={tags}
                  />
                </VStack>
              </PopoverBody>
            </PopoverContent>
          </Popover>
        </HStack>
      </Box>
      <Box mt={10}>
        {isBitesLoading ? (
          <Center mt={20}>
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
          <>
            {bites && bites.length === 0 ? (
              <Center mt={16} flexDirection="column" gap={2} className="fade-in">
                <Text fontSize="lg" color="textLighter">
                  No bites found on {format(getSelectedDate(), "do MMM")}, create one?
                </Text>
                <Button
                  variant="ghost"
                  rightIcon={<FiPlus style={{ marginBottom: "2px" }} />}
                  onClick={() => onCreateBiteOpen(getSelectedDate())}
                >
                  Create Bite
                </Button>
              </Center>
            ) : getFilteredBites().length === 0 ? (
              <Center mt={16} flexDirection="column" gap={2} className="fade-in">
                <Text fontSize="lg" color="textLighter">
                  No bites found on {format(getSelectedDate(), "do MMM")} with tags{" "}
                  <Text as="span" fontWeight="bold">
                    {selectedTags.map((tag) => `#${tag.name}`).join(", ")}
                  </Text>
                </Text>
              </Center>
            ) : (
              <ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 750: 2 }} className="fade-in">
                <Masonry gutter="20px">
                  {bites &&
                    getFilteredBites().map((bite) => {
                      return (
                        <BiteCard bite={bite} key={bite.id} onDeleteClick={onDeleteHandler} onTagClick={onTagClickHandler} />
                      );
                    })}
                </Masonry>
              </ResponsiveMasonry>
            )}
          </>
        )}
      </Box>
      {/* <CreateBite
        isOpen={isBiteCreateOpen}
        onClose={onBiteCreateClose}
        date={getSelectedDate()}
        triggerRefresh={triggerRefresh}
      /> */}
    </Container>
  );
};
