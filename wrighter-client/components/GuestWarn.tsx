import {
  Button,
  Center,
  HStack,
  Icon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useRef } from "react";
import { FiCheck, FiX } from "react-icons/fi";

export const GuestWarn = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }): JSX.Element => {
  const initialRef = useRef<any>(null);

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg" initialFocusRef={initialRef}>
      <ModalOverlay />
      <ModalContent borderRadius={10} bg="bgLighter" border="1px solid" borderColor="containerBorder" boxShadow="shadow" pb={4}>
        <ModalHeader>
          <Text>About guest mode</Text>
        </ModalHeader>
        <ModalCloseButton borderRadius={10} />
        <ModalBody py={4}>
          <VStack align="flex-start" spacing={4}>
            <HStack spacing={3}>
              <Center borderRadius="100px" w={6} h={6} bg="green.500">
                <Icon as={FiCheck} strokeWidth={3} color="textColorWhite" />
              </Center>
              <Text fontWeight="bold">All features of wrighter</Text>
            </HStack>
            <HStack spacing={3}>
              <Center borderRadius="100px" w={6} h={6} bg="green.500">
                <Icon as={FiCheck} strokeWidth={3} color="textColorWhite" />
              </Center>
              <Text fontWeight="bold">Persistent single browser sync</Text>
            </HStack>
            <HStack spacing={3}>
              <Center borderRadius="100px" w={6} h={6} bg="errorRed">
                <Icon as={FiX} strokeWidth={3} color="textColorWhite" />
              </Center>
              <Text fontWeight="bold">Persistent cloud sync</Text>
            </HStack>
            <HStack spacing={3}>
              <Center borderRadius="100px" w={6} h={6} bg="errorRed">
                <Icon as={FiX} strokeWidth={3} color="textColorWhite" />
              </Center>
              <Text fontWeight="bold">Access all your data on multiple devices</Text>
            </HStack>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button w="full" fontWeight="bold" as="a" href="/wrights" ref={initialRef}>
            Ok, Continue!
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
