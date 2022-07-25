import { Box, Center, HStack, Icon, Text, VStack } from "@chakra-ui/react";
import { FiCopy, FiExternalLink } from "react-icons/fi";
import { Bite } from "../../../types";
import { getHostName } from "../../../utils";
import { CustomToolTip } from "../../CustomTooltip";

export const LinkCard = ({ bite }: { bite: Bite }) => {
  const imageOrigin = new URL(bite.content).origin;
  const protocol = new URL(bite.content).protocol;

  return (
    <VStack alignItems="flex-start">
      <VStack p={0} bg="bgLighter" w="full" borderRadius={8} spacing={0}>
        <Box
          w="full"
          bg="bgLighter"
          h="180px"
          borderTopRadius={8}
          pos="relative"
          role="group"
          borderBottom="1px solid"
          borderBottomColor="containerBorder"
        >
          <HStack pos="absolute" w="full" zIndex={0} justifyContent="space-between" p={3}>
            <Box>
              <Icon as={FiExternalLink} color="textLighter"></Icon>
            </Box>
            <Box>
              <Icon as={FiCopy} color="textLighter"></Icon>
            </Box>
          </HStack>
          <HStack
            w="full"
            h="full"
            pos="absolute"
            bg="bgLighter"
            _groupHover={{ opacity: 1 }}
            borderTopRadius={8}
            opacity={0}
            transition="opacity 0.1s ease-in-out"
            zIndex={1}
          >
            <CustomToolTip label="open in new tab">
              <Center
                w="50%"
                borderTopLeftRadius={8}
                _hover={{
                  bg: "bgDark",
                }}
                h="full"
                cursor="pointer"
                as="a"
                href={bite.content}
                target="blank"
              >
                <Icon as={FiExternalLink} width="1.5em" height="1.5em"></Icon>
              </Center>
            </CustomToolTip>
            <CustomToolTip label="copy to clipboard">
              <Center
                w="50%"
                borderTopRightRadius={8}
                _hover={{
                  bg: "bgDark",
                }}
                cursor="pointer"
                h="full"
                onClick={() => navigator.clipboard.writeText(bite.content)}
              >
                <Icon as={FiCopy} width="1.5em" height="1.5em"></Icon>
              </Center>
            </CustomToolTip>
          </HStack>
          <Center
            h="full"
            fontWeight="800"
            fontSize="x-large"
            color="textLighter"
            opacity={1}
            _groupHover={{ opacity: 0 }}
            transition="opacity 0.1s ease-in-out"
          >
            <Text casing="capitalize">{getHostName(bite.content)}</Text>
          </Center>
        </Box>
        <HStack spacing={2} w="full" p={2} as="a" href={bite.content} target="blank">
          <img src={"https://www.google.com/s2/favicons?domain=" + imageOrigin} alt={`favicon for ${bite.title}`} />
          <Text color="textLight" fontWeight="bold" whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis">
            <Text as="span" color="textLighter" opacity={0.7}>
              {protocol + "//"}
            </Text>
            {bite.content.replace(/(^\w+:|^)\/\//, "")}
          </Text>
        </HStack>
      </VStack>
    </VStack>
  );
};
