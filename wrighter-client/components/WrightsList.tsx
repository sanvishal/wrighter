import { Box, Button, Center, HStack, Text, VStack } from "@chakra-ui/react";
import { useLiveQuery } from "dexie-react-hooks";
import { nanoid } from "nanoid";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { FiPlus } from "react-icons/fi";
import { db } from "../services/dbService";
import { Wright } from "../types";
import { WrightCard } from "./WrightCard";

export const CreateWright = () => {
  const router = useRouter();
  const createWrightHandler = async () => {
    const id = nanoid();
    await db.wrights.add({
      id,
      head: "",
      title: "Give me a title",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userId: -99999,
    });
    router.push(`/wrighting?id=${id}`);
  };

  return (
    <VStack mt={10} spacing={4}>
      <Text fontWeight="bold" color="textLighter">
        You don&apos;t seem to have any wrights yet! create one?
      </Text>
      <Button rightIcon={<FiPlus />} variant="ghost" onClick={createWrightHandler}>
        Create Wright
      </Button>
    </VStack>
  );
};

export const WrightsList = (): JSX.Element => {
  const wrights = useLiveQuery(() => db.wrights.toArray()) as Wright[];

  useEffect(() => {
    console.log(wrights);
  }, [wrights]);

  return (
    <VStack spacing={5} align="flex-start" w="full">
      {wrights?.length > 0 ? (
        wrights?.map((wright) => {
          return <WrightCard key={wright.id} wright={wright} />;
        })
      ) : (
        <CreateWright />
      )}
    </VStack>
  );
};
