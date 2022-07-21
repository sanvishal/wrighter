import { Box, Center, HStack, Icon, IconButton, Text, VStack } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { FiEdit, FiExternalLink, FiEye, FiEyeOff, FiHash, FiSettings, FiX } from "react-icons/fi";
import { Wright } from "../types";
import { CustomToolTip } from "./CustomTooltip";
// @ts-ignore
import removeMd from "remove-markdown";

export const WrightCard = ({
  wright,
  showSettings = false,
  onWrightSettingsClick,
}: {
  wright: Wright;
  showSettings?: boolean;
  onWrightSettingsClick: (wright: Wright) => void;
}): JSX.Element => {
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
      pos="relative"
      role="group"
    >
      {showSettings && (
        <Box
          h="full"
          w="70px"
          pos="absolute"
          opacity={0}
          left="-25px"
          top="0"
          _groupHover={{
            opacity: 1,
            transform: "translateX(-30px)",
          }}
          transition="all 0.2s ease-in-out"
        >
          <IconButton
            cursor="pointer"
            as={FiSettings}
            onClick={() => {
              onWrightSettingsClick(wright);
            }}
            variant="ghost"
            aria-label="wright settings"
            p={3}
          />
        </Box>
      )}
      <HStack>
        <Box w="90%">
          <VStack align="flex-start" spacing={0}>
            <HStack spacing={2}>
              <Text fontWeight="800" fontSize="x-large">
                {wright.title}
              </Text>
              <CustomToolTip
                placement="top"
                label={
                  wright.isPublic
                    ? `this wright is public`
                    : `this wright is private${!showSettings ? ", guests cannot make wright public" : ""}`
                }
              >
                <Center pb={1} pl={2}>
                  <Icon as={wright?.isPublic ? FiEye : FiEyeOff} color="textLighter" opacity={0.6} />
                </Center>
              </CustomToolTip>
            </HStack>
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
          <Text
            fontWeight="bold"
            fontSize="md"
            color="textLight"
            mt={5}
            opacity={wright.head.trim() ? 1 : 0.2}
            fontStyle={wright.head.trim() ? "normal" : "italic"}
          >
            {removeMd(wright.head) || "No content"}
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
              href={!wright.isPublic ? "/wright?id=" + wright.id : "wright/" + wright.slug + `-${wright.id}`}
              target="_blank"
              referrerPolicy="no-referrer"
            />
          </CustomToolTip>
        </HStack>
      </HStack>
    </Box>
  );
};
