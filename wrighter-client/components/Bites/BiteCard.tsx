import { Box, HStack, Icon, IconButton, Menu, MenuButton, MenuItem, MenuList, Portal, Text } from "@chakra-ui/react";
import { FiCopy, FiHash, FiSettings, FiTrash2 } from "react-icons/fi";
import { Bite, BiteType, Tag } from "../../types";
import { ImageCard } from "./Image/ImageCard";
import { LinkCard } from "./Link/LinkCard";
import { TextCard } from "./Text/TextCard";

export const BiteCard = ({
  bite,
  onDeleteClick,
  onTagClick,
}: {
  bite: Bite;
  onDeleteClick: (bite: Bite) => void;
  onTagClick: (tag: Tag) => void;
}) => {
  return (
    <>
      <Box p={3} bg="bgLight" borderRadius={10} _hover={{ boxShadow: "xl" }} transition="box-shadow 0.25s ease-in-out">
        <HStack alignItems="flex-start" justifyContent="space-between">
          <Text fontSize="lg" fontWeight="800" mb={0.5}>
            {bite.title}
          </Text>
          <HStack>
            <IconButton
              as={FiCopy}
              color="textLighter"
              aria-label="copy contents"
              variant="ghost"
              size="xs"
              p={1.5}
              onClick={() => navigator.clipboard.writeText(bite.content)}
            />
            <Menu>
              <MenuButton as="button">
                <IconButton as={FiSettings} variant="ghost" size="xs" p={1.5} color="textLighter" aria-label="Bite Settings" />
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
        </HStack>
        {bite.tags && bite.tags.length > 0 && (
          <HStack mb={2} wrap="wrap" columnGap={1.5} rowGap={1.5} spacing={0}>
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
                  cursor="pointer"
                  onClick={() => onTagClick(tag)}
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
