import { Box, Center, HStack, Icon, IconButton, Stack, Text, VStack } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { FiDelete, FiEdit, FiExternalLink, FiEye, FiEyeOff, FiHash, FiSettings, FiTrash2, FiX } from "react-icons/fi";
import { Wright } from "../../types";
import { CustomToolTip } from "../CustomTooltip";
// @ts-ignore
import removeMd from "remove-markdown";

export const WrightCard = ({
  wright,
  showSettings = false,
  onWrightSettingsClick,
  onWrightDeleteClick,
}: {
  wright: Wright;
  showSettings?: boolean;
  onWrightSettingsClick: (wright: Wright) => void;
  onWrightDeleteClick: (wright: Wright) => void;
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
        display={{ base: "none", sm: "block" }}
      >
        {showSettings && (
          <IconButton
            cursor="pointer"
            as={FiSettings}
            onClick={() => {
              onWrightSettingsClick(wright);
            }}
            variant="ghost"
            aria-label="wright settings"
            p={3}
            mb={3}
          />
        )}
        {!showSettings && (
          <IconButton
            cursor="pointer"
            as={FiSettings}
            onClick={() => {
              onWrightDeleteClick(wright);
            }}
            variant="ghost"
            aria-label="wright settings"
            p={3}
          />
        )}
      </Box>
      <HStack alignItems="flex-start">
        <Box w={{ base: "85%", md: "90%" }}>
          <VStack align="flex-start" spacing={0}>
            <HStack spacing={2}>
              <Text fontWeight="800" fontSize="x-large">
                {wright.title} &nbsp;
                <CustomToolTip
                  placement="top"
                  label={
                    wright.isPublic
                      ? `this wright is public`
                      : `this wright is private${!showSettings ? ", guest wrighters cannot make wright public" : ""}`
                  }
                >
                  <Text as="span">
                    <Icon as={wright?.isPublic ? FiEye : FiEyeOff} color="textLighter" opacity={0.6} w="0.74em" h="0.74em" />
                  </Text>
                </CustomToolTip>
              </Text>
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
        <Stack
          w={{ base: "15%", md: "10%" }}
          rowGap={{ base: 2, md: 0 }}
          columnGap={{ base: 0, md: 3 }}
          flexDir={{ base: "column", md: "row" }}
          alignSelf={{ base: "flex-start", md: "center" }}
        >
          <CustomToolTip label="edit wright">
            <IconButton
              variant="ghost"
              onClick={() => {
                router.push("/wrighting?id=" + wright.id);
              }}
              icon={<FiEdit strokeWidth={2.5} />}
              height={{ base: "28px", md: "40px" }}
              padding={{ base: "14px", md: "7px" }}
              size={{ base: "sm", md: "md" }}
              borderRadius="100px"
              aria-label="edit wright"
            />
          </CustomToolTip>
          <CustomToolTip label="preview in new tab">
            <IconButton
              size={{ base: "sm", md: "md" }}
              style={{ marginTop: "0px" }}
              height={{ base: "28px", md: "40px" }}
              padding={{ base: "14px", md: "7px" }}
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
          {showSettings && (
            <CustomToolTip label="preview in new tab">
              <IconButton
                height={{ base: "28px", md: "auto" }}
                padding={{ base: "14px", md: "auto" }}
                size="sm"
                style={{ marginTop: "0px" }}
                display={{ base: "flex", md: "none" }}
                // size={{ base: "sm", md: "md" }}
                variant="ghost"
                icon={<FiSettings />}
                borderRadius="100px"
                aria-label="open settings"
                onClick={() => {
                  onWrightSettingsClick(wright);
                }}
              />
            </CustomToolTip>
          )}
          {!showSettings && (
            <CustomToolTip label="wright settings">
              <IconButton
                display={{ base: "flex", md: "none" }}
                size="sm"
                style={{ marginTop: "0px" }}
                height={{ base: "28px", md: "auto" }}
                padding={{ base: "14px", md: "auto" }}
                onClick={() => {
                  onWrightDeleteClick(wright);
                }}
                variant="ghost"
                icon={<FiSettings />}
                borderRadius="100px"
                aria-label="settings for wright"
              />
            </CustomToolTip>
          )}
        </Stack>
      </HStack>
    </Box>
  );
};
