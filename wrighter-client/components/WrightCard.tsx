import { Box, HStack, Icon, IconButton, Text, VStack } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { FiEdit, FiExternalLink, FiHash, FiX } from "react-icons/fi";
import { Wright } from "../types";
import { CustomToolTip } from "./CustomTooltip";
// @ts-ignore
import removeMd from "remove-markdown";

export const WrightCard = ({ wright }: { wright: Wright }): JSX.Element => {
  const router = useRouter();

  return (
    <Box bg="bgLighter" px={3} py={4} borderRadius={10} border="1px solid" borderColor="containerBorder" w="full">
      <HStack>
        <Box w="90%">
          <VStack align="flex-start" spacing={0}>
            <Text fontWeight="800" fontSize="x-large">
              {wright.title}
            </Text>
            <HStack spacing={1}>
              {wright.tags && wright.tags.length > 0 ? (
                wright?.tags.map((tag) => {
                  return (
                    <Box key={tag.id} py={0} px={2} borderRadius={10} borderColor="containerBorder" bg="bgLight">
                      <HStack spacing={0.5}>
                        <Icon as={FiHash} fontSize="12px" mb={0.5} color="textLighter" />
                        <Text fontSize="sm" fontWeight="bold" color="textLighter">
                          {tag.name}
                        </Text>
                      </HStack>
                    </Box>
                  );
                })
              ) : (
                <Text color="textLighter" as="i" fontSize="sm" opacity="0.6" mt={-1}>
                  untagged
                </Text>
              )}
            </HStack>
          </VStack>
          <Text fontWeight="bold" fontSize="md" color="textLight" mt={5}>
            {removeMd(wright.head)}
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
