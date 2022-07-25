import { Box, HStack, Icon, Menu, MenuButton, MenuItem, MenuList, Portal, Text } from "@chakra-ui/react";
import { FiHash, FiSettings, FiTrash2 } from "react-icons/fi";
import { Bite, BiteType } from "../../types";
import { ImageCard } from "./Image/ImageCard";
import { LinkCard } from "./Link/LinkCard";
import { TextCard } from "./Text/TextCard";

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
