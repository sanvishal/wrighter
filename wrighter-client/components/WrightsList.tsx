import { Box, Button, Center, Container, HStack, Icon, Spinner, Text, VStack } from "@chakra-ui/react";
import { useLiveQuery } from "dexie-react-hooks";
import { nanoid } from "nanoid";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FiBookOpen, FiPlus } from "react-icons/fi";
import { useQuery } from "react-query";
import { useUserContext } from "../contexts/UserContext";
import { db, WrightIDB } from "../services/dbService";
import { clearAndCreateEditorContext, createWright, getAllWrights } from "../services/wrightService";
import { Wright } from "../types";
import { WrightCard } from "./WrightCard";

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

export const WrightsList = (): JSX.Element => {
  const [wrights, setWrights] = useState<Wright[] | WrightIDB[]>([]);
  const router = useRouter();
  const { isUserLoading, isAuthenticated, user } = useUserContext();

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
      console.log(wrights);
      setWrights(wrights || []);
    }
  };

  useEffect(() => {
    if (!isUserLoading) {
      getAllWrightsHandler();
    }
  }, [isUserLoading]);

  useEffect(() => {
    console.log(wrights);
  }, [wrights]);

  return (
    <Container maxW="full" pt={20}>
      <HStack w="full" justify="space-between">
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
        <Button
          rightIcon={<FiPlus style={{ marginBottom: "4px" }} />}
          variant="ghost"
          onClick={createWrightHandler}
          display={wrights?.length > 0 ? "flex" : "none"}
          isLoading={isLoading}
        >
          Create Wright
        </Button>
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
          <VStack spacing={5} align={wrights?.length > 0 ? "flex-start" : "center"} w="full">
            {wrights?.length > 0 ? (
              wrights?.map((wright) => {
                return <WrightCard key={wright.id} wright={wright as Wright} />;
              })
            ) : (
              <CreateWright createWrightHandler={createWrightHandler} isLoading={isLoading} />
            )}
          </VStack>
        )}
      </Box>
    </Container>
  );
};
