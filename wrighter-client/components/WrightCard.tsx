import { Box, Text } from "@chakra-ui/react";
import { Wright } from "../types";

export const WrightCard = ({ wright }: { wright: Wright }): JSX.Element => {
  return (
    <Box bg="bgLighter" px={3} py={4} borderRadius={10} border="1px solid" borderColor="containerBorder" w="full">
      <Text fontWeight="800" fontSize="x-large">
        {wright.title}
      </Text>
      <Text fontWeight="bold" fontSize="large">
        {wright.head}
      </Text>
    </Box>
  );
};
