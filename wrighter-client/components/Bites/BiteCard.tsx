import mathPlugin from "@bytemd/plugin-math-ssr";
import gfmPluin from "@bytemd/plugin-gfm";
import highlightPlugin from "@bytemd/plugin-highlight-ssr";
import { Viewer } from "@bytemd/react";
import {
  Box,
  Button,
  Center,
  HStack,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Portal,
  Spinner,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { FiClipboard, FiCopy, FiEdit, FiExternalLink, FiHash, FiSettings, FiTrash, FiTrash2 } from "react-icons/fi";
import { Bite, BiteType } from "../../types";
import { getHostName } from "../../utils";
import { CustomToolTip } from "../CustomTooltip";
import { MdOutlineBrokenImage } from "react-icons/md";

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

export const ImageCard = ({ bite }: { bite: Bite }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [imgError, setImgError] = useState(false);
  const [isImgLoading, setIsImgLoading] = useState(true);

  return (
    <>
      <Box
        onClick={() => {
          if (!isImgLoading && !imgError) {
            onOpen();
          }
        }}
        cursor={!isImgLoading && !imgError ? "pointer" : "default"}
        as="button"
        w="full"
      >
        {isImgLoading && (
          <Center w="full" bg="bgLighter" h="180px" opacity={0.7} borderRadius={5} flexDirection="column" gap={1}>
            <Spinner
              sx={{
                "--spinner-size": "1.5rem",
                borderBottomColor: "textLighter",
                borderLeftColor: "textLighter",
                borderTopColor: "transparent",
                borderRightColor: "transparent",
              }}
            />
          </Center>
        )}
        {imgError && !isImgLoading && (
          <Center w="full" bg="bgLighter" h="180px" opacity={0.7} borderRadius={5} flexDirection="column" gap={1}>
            <Icon as={MdOutlineBrokenImage} color="errorRed" w="1.5em" h="1.5em" />
            <Text color="textLighter">broken image</Text>
          </Center>
        )}
        {!imgError && (
          <img
            src={bite.content}
            alt={bite.title}
            style={{ borderRadius: "5px" }}
            onError={() => {
              setImgError(true);
              setIsImgLoading(false);
            }}
            onLoad={() => {
              setIsImgLoading(false);
            }}
          />
        )}
      </Box>
      <Modal isOpen={isOpen} onClose={onClose} size="6xl">
        <ModalOverlay />
        <ModalContent borderRadius={8} bg="transparent" boxShadow="none">
          <ModalCloseButton />
          <ModalBody>
            <Center>
              <img src={bite.content} alt={bite.title} style={{ borderRadius: "5px" }} width="100%" height="100%" />
            </Center>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export const TextCard = ({ bite }: { bite: Bite }) => {
  const plugins = useMemo(() => [highlightPlugin(), gfmPluin(), mathPlugin({ katexOptions: { output: "html" } })], []);

  return (
    <Box
      id="wright-preview"
      overflowX="auto"
      w="full"
      pb={3}
      sx={{
        img: {
          borderRadius: "7px",
        },
      }}
    >
      <Viewer value={bite.content} plugins={plugins} />
    </Box>
  );
};

export const BiteCard = ({ bite, onDeleteClick }: { bite: Bite; onDeleteClick: (bite: Bite) => void }) => {
  return (
    <>
      <Box p={3} bg="bgLight" borderRadius={10} _hover={{ boxShadow: "xl" }} transition="box-shadow 0.25s ease-in-out">
        <HStack alignItems="flex-start" justifyContent="space-between">
          <Text fontSize="lg" fontWeight="800" mb={0.5}>
            {bite.title}
          </Text>
          <Menu>
            <MenuButton as="button">
              <Icon as={FiSettings} color="textLighter"></Icon>
            </MenuButton>
            <Portal>
              <MenuList minWidth="150px" boxShadow="md">
                {/* <MenuItem icon={<Icon as={FiEdit} mb={-0.5} />}>Edit Bite</MenuItem> */}
                <MenuItem
                  icon={<Icon as={FiTrash2} mb={-0.5} />}
                  _hover={{ bg: "errorRedTransBg" }}
                  _focus={{ bg: "errorRedTransBg" }}
                  onClick={() => onDeleteClick(bite)}
                >
                  Delete Bite
                </MenuItem>
              </MenuList>
            </Portal>
          </Menu>
        </HStack>
        {bite.tags && bite.tags.length > 0 && (
          <HStack mb={2}>
            {bite.tags.map((tag) => {
              return (
                <HStack
                  key={tag.id}
                  spacing={0.5}
                  px={1.5}
                  py={0}
                  bg="bgLight"
                  borderRadius={10}
                  role="group"
                  transition="background 0.2s ease-in-out"
                  _hover={{ bg: "bgLighter" }}
                >
                  <Icon as={FiHash} color="textLighter" width="0.8em" height="0.8em" mb={0.5} />
                  <Text color="textLighter" fontSize="sm">
                    {tag.name}
                  </Text>
                </HStack>
              );
            })}
          </HStack>
        )}
        {bite.type === BiteType.LINK && <LinkCard bite={bite} />}
        {bite.type === BiteType.IMAGE && <ImageCard bite={bite} />}
        {bite.type === BiteType.TEXT && <TextCard bite={bite} />}
      </Box>
    </>
  );
};
