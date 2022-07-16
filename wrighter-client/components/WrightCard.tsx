import { Box, HStack, IconButton, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { FiEdit, FiExternalLink } from "react-icons/fi";
import { Wright } from "../types";
import { CustomToolTip } from "./CustomTooltip";

export const WrightCard = ({ wright }: { wright: Wright }): JSX.Element => {
  const router = useRouter();

  return (
    <Box bg="bgLighter" px={3} py={4} borderRadius={10} border="1px solid" borderColor="containerBorder" w="full">
      <HStack>
        <Box w="90%">
          <Text fontWeight="800" fontSize="x-large">
            {wright.title}
          </Text>
          <Text fontWeight="bold" fontSize="large">
            {wright.head}
          </Text>
        </Box>
        <HStack w="10%" spacing={2}>
          <CustomToolTip label="edit wright">
            <IconButton
              variant="ghost"
              onClick={() => {
                router.push("/wrighting?id=" + wright.id);
              }}
              icon={<FiEdit />}
              borderRadius="100px"
              aria-label="edit wright"
            />
          </CustomToolTip>
          <CustomToolTip label="preview in new tab">
            <IconButton
              variant="ghost"
              icon={<FiExternalLink />}
              borderRadius="100px"
              aria-label="open wright"
              as="a"
              href={"/wright?id=" + wright.id}
              target="_blank"
              referrerPolicy="no-referrer"
            />
          </CustomToolTip>
        </HStack>
      </HStack>
    </Box>
  );
};
