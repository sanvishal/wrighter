import { Box, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { Wright } from "../types";

export const WrightCard = ({ wright }: { wright: Wright }): JSX.Element => {
  const router = useRouter();

  return (
    <Box
      bg="bgLighter"
      px={3}
      py={4}
      borderRadius={10}
      border="1px solid"
      borderColor="containerBorder"
      w="full"
      cursor="pointer"
      onClick={() => {
        router.push("/wrighting?id=" + wright.id);
      }}
    >
      <Text fontWeight="800" fontSize="x-large">
        {wright.title}
      </Text>
      <Text fontWeight="bold" fontSize="large">
        {wright.head}
      </Text>
    </Box>
  );
};
