import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  VStack,
  HStack,
  Center,
  Icon,
  ModalFooter,
  Button,
  Text,
  FormControl,
  Box,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import { format } from "date-fns";
import { ChangeEvent, useState } from "react";
import { FiCheck, FiX } from "react-icons/fi";
import { BiteType } from "../../types";
import { Tags } from "../Editor/Tags";

export const CreateBite = ({ isOpen, onClose, date }: { isOpen: boolean; onClose: () => void; date: Date }): JSX.Element => {
  const [title, setTitle] = useState("");
  const [currentMode, setCurrentMode] = useState<BiteType>(BiteType.LINK);

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="4xl">
      <ModalOverlay />
      <ModalContent
        ml="56px"
        borderRadius={10}
        bg="bgLighter"
        border="1px solid"
        borderColor="containerBorder"
        boxShadow="shadow"
        pb={4}
      >
        <ModalHeader>
          <Text>
            Bite on <b style={{ fontWeight: 800 }}>{format(date, "dd MMMM")}</b>
          </Text>
        </ModalHeader>
        <ModalCloseButton borderRadius={10} />
        <ModalBody py={4}>
          <VStack alignItems="flex-start" spacing={8} fontSize="lg">
            <FormControl>
              <Box>
                <FormLabel htmlFor="title" mb={1} fontSize="lg">
                  Title
                </FormLabel>
                <Input
                  fontSize="lg"
                  borderColor="inputBorderColor"
                  type="text"
                  id="title"
                  required
                  value={title}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
                />
              </Box>
            </FormControl>
            <VStack w="full" alignItems="flex-start">
              <Box>Tags</Box>
              <Box bg="bgLight" w="full" h={10}></Box>
            </VStack>
          </VStack>
          <HStack spacing={0} mt={5} justifyContent="flex-end">
            <Button
              variant={currentMode === BiteType.LINK ? "solid-bite" : "ghost"}
              borderRightRadius={0}
              w={28}
              isActive={currentMode === BiteType.LINK}
              color="textColor"
              _focus={{ color: "textColor" }}
              _hover={{ color: "textColor" }}
              onClick={() => setCurrentMode(BiteType.LINK)}
              opacity={currentMode !== BiteType.LINK ? 0.5 : 1}
              leftIcon={currentMode === BiteType.LINK ? <FiCheck strokeWidth={4} /> : <></>}
            >
              Link
            </Button>
            <Button
              variant={currentMode === BiteType.IMAGE ? "solid-bite" : "ghost"}
              borderRadius={0}
              borderLeft="1px solid"
              borderRight="1px solid"
              borderColor="bgDark"
              w={28}
              color="textColor"
              _focus={{ color: "textColor" }}
              _hover={{ color: "textColor" }}
              isActive={currentMode === BiteType.IMAGE}
              opacity={currentMode !== BiteType.IMAGE ? 0.5 : 1}
              onClick={() => setCurrentMode(BiteType.IMAGE)}
              leftIcon={currentMode === BiteType.IMAGE ? <FiCheck strokeWidth={4} /> : <></>}
            >
              Image
            </Button>
            <Button
              variant={currentMode === BiteType.TEXT ? "solid-bite" : "ghost"}
              borderLeftRadius={0}
              color="textColor"
              _focus={{ color: "textColor" }}
              _hover={{ color: "textColor" }}
              w={28}
              isActive={currentMode === BiteType.TEXT}
              onClick={() => setCurrentMode(BiteType.TEXT)}
              opacity={currentMode !== BiteType.TEXT ? 0.5 : 1}
              leftIcon={currentMode === BiteType.TEXT ? <FiCheck strokeWidth={4} /> : <></>}
            >
              MD
            </Button>
          </HStack>
        </ModalBody>
        <ModalFooter>
          <Button variant="solid-bite" w={32}>
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
