import {
  Box,
  Button,
  ButtonGroup,
  Center,
  Container,
  Divider,
  HStack,
  Icon,
  IconButton,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Spinner,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FiBookOpen, FiCheck, FiPlus } from "react-icons/fi";
import { FaSort } from "react-icons/fa";
import { useQuery } from "react-query";
import { useUserContext } from "../../contexts/UserContext";
import { WrightIDB } from "../../services/dbService";
import { createWright, getAllWrights } from "../../services/wrightService";
import { Wright } from "../../types";
import { WrightCard } from "./WrightCard";
import { WrightSettings } from "../Editor/WrightSettings";

export const CreateWright = ({
  createWrightHandler,
  isLoading = false,
}: {
  createWrightHandler: () => void;
  isLoading: boolean;
}) => {
  return (
    <VStack mt={10} spacing={4}>
      <Text fontWeight="bold" color="textLighter">
        You don&apos;t seem to have any wrights yet! create one?
      </Text>
      <Button
        rightIcon={<FiPlus style={{ marginBottom: "4px" }} />}
        variant="ghost"
        onClick={createWrightHandler}
        isLoading={isLoading}
      >
        Create Wright
      </Button>
    </VStack>
  );
};

enum SortParam {
  TITLE = "TITLE",
  UPDATED = "UPDATED",
  CREATED = "CREATED",
  TAGS = "TAGS",
  VISIBILITY = "VISIBILITY",
}

const sortOptions = [
  { value: SortParam.TITLE, label: "Title" },
  { value: SortParam.UPDATED, label: "Last Updated" },
  { value: SortParam.CREATED, label: "Created Time" },
  { value: SortParam.TAGS, label: "Number of Tags" },
  { value: SortParam.VISIBILITY, label: "Visibility" },
];

export const WrightsList = (): JSX.Element => {
  const [wrights, setWrights] = useState<Wright[] | WrightIDB[]>([]);
  const [sortedWrights, setSortedWrights] = useState<Wright[] | WrightIDB[]>([]);
  const router = useRouter();
  const { isUserLoading, isAuthenticated } = useUserContext();
  const { onOpen, onClose, isOpen } = useDisclosure();
  const [currentSortParam, setCurrentSortParam] = useState<SortParam>(SortParam.UPDATED);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentSettingWright, setCurrentSettingWright] = useState("");
  const { isOpen: isSettingsOpen, onOpen: onSettingsOpen, onClose: onSettingsClose } = useDisclosure();

  const { refetch: createWrightRequest, isLoading } = useQuery("createWrightQuery", () => createWright(!isAuthenticated()), {
    enabled: false,
  });

  const { refetch: getWrightsRequest, isLoading: isGettingWrights } = useQuery(
    "getAllWrightsQuery",
    () => getAllWrights(!isAuthenticated()),
    { enabled: false }
  );

  const createWrightHandler = async () => {
    const { data: wright } = await createWrightRequest();
    if (wright) {
      router.push(`/wrighting?id=${wright.id}`);
    }
  };

  const getAllWrightsHandler = async () => {
    const { data: wrights } = await getWrightsRequest();
    if (wrights) {
      setWrights(wrights || []);
    }
  };

  useEffect(() => {
    if (!isUserLoading) {
      getAllWrightsHandler();
    }
  }, [isUserLoading]);

  useEffect(() => {
    const sortWrights = [...wrights];
    sortWrights.sort((a, b) => {
      if (currentSortParam === SortParam.TITLE) {
        return sortOrder === "asc" ? (a.title || "").localeCompare(b.title || "") : (b.title || "").localeCompare(a.title || "");
      } else if (currentSortParam === SortParam.UPDATED) {
        return ((a.updatedAt || "") > (b.updatedAt || "") ? -1 : 1) * (sortOrder === "asc" ? 1 : -1);
      } else if (currentSortParam === SortParam.CREATED) {
        return ((a.createdAt || "") > (b.createdAt || "") ? -1 : 1) * (sortOrder === "asc" ? 1 : -1);
      } else if (currentSortParam === SortParam.TAGS) {
        return ((a.tags?.length || 0) > (b.tags?.length || 0) ? -1 : 1) * (sortOrder === "asc" ? 1 : -1);
      } else if (currentSortParam === SortParam.VISIBILITY) {
        return ((a.isPublic || false) > (b.isPublic || false) ? -1 : 1) * (sortOrder === "asc" ? 1 : -1);
      }
      return 0;
    });
    setSortedWrights(sortWrights);
  }, [wrights, currentSortParam, sortOrder]);

  const wrightSettingsClickHandler = (clickedWright: Wright) => {
    setCurrentSettingWright(clickedWright.id);
    onSettingsOpen();
  };

  const onTriggerUpdate = () => {
    getAllWrightsHandler();
  };

  return (
    <Container maxW="full" pt={{ base: 5, md: 20 }}>
      <HStack w="full" justify="space-between" wrap={{ base: "wrap", md: "nowrap" }}>
        <HStack spacing={4}>
          <Center borderRadius={10} w={16} h={16} bg="accentColorTrans">
            <Icon as={FiBookOpen} w={7} h={7} color="accentColor"></Icon>
          </Center>
          <VStack align="flex-start" spacing={0}>
            <Text fontWeight="800" fontSize="xx-large">
              Wrights
            </Text>
            <Text color="textLighter">All your wrightups are here</Text>
          </VStack>
        </HStack>
        <HStack width={{ base: "100%", md: "auto" }} justifyContent={{ base: "center" }} style={{ marginTop: "20px" }}>
          <Popover placement="bottom" isOpen={isOpen} onOpen={onOpen} onClose={onClose}>
            <PopoverTrigger>
              <Box>
                <IconButton as={FaSort} aria-label="display sort settings" variant="ghost" p={3} cursor="pointer" />
              </Box>
            </PopoverTrigger>
            <PopoverContent maxW="250px" fontSize="sm">
              <PopoverArrow />
              <PopoverHeader>
                <HStack justifyContent="space-between">
                  <Text>{sortOrder === "asc" ? "Ascending" : "Descending"}</Text>
                  <ButtonGroup spacing={0}>
                    <Button
                      height="26px"
                      variant="ghost"
                      size="sm"
                      borderRightRadius={0}
                      borderRight="1px solid"
                      borderRightColor="bgDark"
                      isActive={sortOrder === "asc"}
                      opacity={sortOrder === "asc" ? 1 : 0.5}
                      onClick={() => setSortOrder("asc")}
                    >
                      ASC
                    </Button>
                    <Button
                      height="26px"
                      variant="ghost"
                      size="sm"
                      borderLeftRadius={0}
                      opacity={sortOrder === "desc" ? 1 : 0.5}
                      isActive={sortOrder === "desc"}
                      onClick={() => setSortOrder("desc")}
                    >
                      DESC
                    </Button>
                  </ButtonGroup>
                </HStack>
              </PopoverHeader>
              <PopoverBody>
                <VStack alignItems="flex-start" w="full" spacing={1}>
                  {sortOptions.map((option) => {
                    return (
                      <Box
                        key={option.value}
                        p={1}
                        py={2}
                        bg={currentSortParam === option.value ? "bgLight" : "transparent"}
                        transition="background 0.2s ease-in-out"
                        w="full"
                        borderRadius={8}
                        cursor="pointer"
                        onClick={() => {
                          setCurrentSortParam(option.value);
                        }}
                      >
                        <HStack px={2}>
                          <Icon as={FiCheck} opacity={currentSortParam === option.value ? 1 : 0}></Icon>
                          <Text>{option.label}</Text>
                        </HStack>
                      </Box>
                    );
                  })}
                </VStack>
              </PopoverBody>
            </PopoverContent>
          </Popover>
          <Button
            rightIcon={<FiPlus style={{ marginBottom: "4px" }} />}
            // variant="ghost"
            onClick={createWrightHandler}
            display={wrights?.length > 0 ? "flex" : "none"}
            isLoading={isLoading}
          >
            Create Wright
          </Button>
        </HStack>
      </HStack>
      <Box mt={10} w="full">
        {isGettingWrights && isUserLoading ? (
          <VStack spacing={3} pt={16}>
            <Text color="textLighter">Getting your wrightups...</Text>
            <Spinner
              sx={{
                "--spinner-size": "1.2rem",
                borderBottomColor: "textLighter",
                borderLeftColor: "textLighter",
                borderTopColor: "transparent",
                borderRightColor: "transparent",
              }}
            />
          </VStack>
        ) : (
          <VStack spacing={5} align={wrights?.length > 0 ? "flex-start" : "center"} w="full" mb={10}>
            {wrights?.length > 0 ? (
              sortedWrights?.map((wright, idx) => {
                return currentSortParam === SortParam.UPDATED && idx === 0 && sortOrder === "asc" ? (
                  <VStack w="full" alignItems="flex-start" mb={7} fontWeight="bold" fontSize="larger">
                    <Text>Continue wrighting...</Text>
                    <WrightCard
                      key={wright.id}
                      wright={wright as Wright}
                      onWrightSettingsClick={wrightSettingsClickHandler}
                      showSettings={isAuthenticated()}
                    />
                    <Divider py={6} opacity={0.3} width="75%" style={{ margin: "8px auto" }} />
                  </VStack>
                ) : (
                  <WrightCard
                    key={wright.id}
                    wright={wright as Wright}
                    onWrightSettingsClick={wrightSettingsClickHandler}
                    showSettings={isAuthenticated()}
                  />
                );
              })
            ) : (
              <CreateWright createWrightHandler={createWrightHandler} isLoading={isLoading} />
            )}
          </VStack>
        )}
      </Box>
      {isAuthenticated() && (
        <WrightSettings
          showButton={false}
          wrightId={currentSettingWright}
          isOpen={isSettingsOpen}
          onOpen={onSettingsOpen}
          onClose={onSettingsClose}
          triggerUpdate={onTriggerUpdate}
        />
      )}
    </Container>
  );
};
