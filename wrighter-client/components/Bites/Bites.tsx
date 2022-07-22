import {
  Container,
  HStack,
  Center,
  Icon,
  VStack,
  Text,
  Box,
  Button,
  IconButton,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
} from "@chakra-ui/react";
import {
  addDays,
  compareAsc,
  compareDesc,
  differenceInDays,
  format,
  formatDistanceToNow,
  formatRelative,
  isEqual,
  subDays,
} from "date-fns";
import { formatDistance } from "date-fns/esm";
import { useEffect, useState } from "react";
import { FiCalendar, FiChevronLeft, FiChevronRight, FiLoader, FiPlus } from "react-icons/fi";
import { TbBulb } from "react-icons/tb";
import { Content } from "../Content";
import { Calendar, DateRange, DateRangePicker, Range, RangeKeyDict } from "react-date-range";

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

  const handleDateRangeSelect = (ranges: RangeKeyDict) => {
    if (ranges.selection && ranges.selection.startDate && ranges.selection.endDate) {
      const diff = differenceInDays(ranges.selection.endDate, ranges.selection.startDate);
      console.log(compareDesc(ranges.selection.startDate, ranges.selection.endDate));
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
      setSelectedCarouselIdx(selectedCarouselIdx + dir - 1);
      return;
    }

    if (selectedCarouselIdx + dir === -1) {
      setCarouselDate({
        start: subDays(carouselDate.start, 1),
        end: carouselDate.end,
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

  return (
    <Container maxW="full" pt={{ base: 5, md: 20 }}>
      <HStack w="full" justify="space-between">
        <HStack spacing={4}>
          <Center borderRadius={10} w={16} h={16} bg="biteAccentColorTrans">
            <Icon as={TbBulb} w={8} h={8} color="biteAccentColor"></Icon>
          </Center>
          <VStack align="flex-start" spacing={0}>
            <Text fontWeight="800" fontSize="xx-large">
              Bites
            </Text>
            <Text color="textLighter">jot down bite-sized thoughts</Text>
          </VStack>
        </HStack>
        <HStack width={{ base: "100%", md: "auto" }} justifyContent={{ base: "center" }} style={{ marginTop: "20px" }}>
          <Button
            variant="solid-bite"
            rightIcon={<FiPlus style={{ marginBottom: "4px" }} />}
            // variant="ghost"
            // onClick={createWrightHandler}
            // display={wrights?.length > 0 ? "flex" : "none"}
            // isLoading={isLoading}
          >
            Create Bite
          </Button>
        </HStack>
      </HStack>
      <Box mt={8} w="full">
        <HStack justifyContent="space-between">
          <HStack spacing={4}>
            <Box as="button" w={10} h="90px" onClick={() => handleCarouselChange(-1)}>
              <IconButton as={FiChevronLeft} aria-label="carousel date back" variant="ghost" p={2} />
            </Box>
            {[1, 2, 3, 4, 5, 6, 7].map((val, idx) => {
              const currDate = addDays(carouselDate.start, val);
              return (
                <Box
                  as="button"
                  w={16}
                  h="90px"
                  bg={idx === selectedCarouselIdx ? "bgLighter" : "bgLight"}
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
                        <Text fontWeight="bold" color="textLighter" fontSize="sm">
                          {format(currDate, "EEE")}
                        </Text>
                        <Text fontWeight="800" color="textLight" fontSize="xx-large" lineHeight={1}>
                          {format(currDate, "dd")}
                        </Text>
                      </VStack>
                      <Text fontWeight="bold" color="textLighter" fontSize="xs" opacity={0.5}>
                        {format(currDate, "LLL")}
                      </Text>
                    </VStack>
                  </Center>
                </Box>
              );
            })}
            <Box as="button" w={10} h="90px" onClick={() => handleCarouselChange(1)}>
              <IconButton as={FiChevronRight} aria-label="carousel date forward" variant="ghost" p={2} />
            </Box>
          </HStack>
          <Popover>
            <PopoverTrigger>
              {selectionDateRange.startDate && selectionDateRange.endDate && (
                <HStack spacing={0} cursor="pointer">
                  <HStack fontSize="sm" bg="bgLight" color="textLighter" h="40px" pl={3} borderLeftRadius={10} pt="2px">
                    <Text>{format(selectionDateRange.startDate, "dd MMM yy")}</Text>
                    <Text>-</Text>
                    <Text>{format(selectionDateRange.endDate, "dd MMM yy")}</Text>
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
        </HStack>
        <VStack mt={8} alignItems="flex-start" spacing={-1}>
          <Text fontWeight={800} fontSize="3xl">
            {getSelectedDateString()}
          </Text>
          <Text fontWeight="bold" fontSize="large" color="textLighter" opacity={0.6}>
            {getRelativeSelectedDateString()}
          </Text>
        </VStack>
      </Box>
    </Container>
  );
};
