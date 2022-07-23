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
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { FiCheck, FiX } from "react-icons/fi";
import { useQuery } from "react-query";
import { useUserContext } from "../contexts/UserContext";
import { deleteWright } from "../services/wrightService";
import { Wright } from "../types";
import { Toaster } from "./Toaster";

export const DeleteWright = ({
  isOpen,
  onClose,
  wright,
  triggerUpdate,
}: {
  isOpen: boolean;
  onClose: () => void;
  wright: Wright;
  triggerUpdate: () => void;
}) => {
  const { isAuthenticated, isUserLoading } = useUserContext();
  const toast = useToast();

  const { refetch: deleteWrightRequest, isFetching: isDeletingWright } = useQuery(
    "deleteWrightQuery",
    () => deleteWright(!isAuthenticated(), wright.id),
    { enabled: false, refetchOnWindowFocus: false }
  );

  const deleteWrightHandler = async () => {
    const { status } = await deleteWrightRequest();
    if (status === "success") {
      triggerUpdate();
      toast({
        position: "bottom-left",
        render: () => <Toaster message="deleted wright successfully" type="success" />,
      });
      onClose();
    } else if (status === "error") {
      toast({
        position: "bottom-left",
        render: () => <Toaster message="error deleting wright" type="error" />,
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
      <ModalOverlay />
      <ModalContent borderRadius={10} bg="bgLighter" border="1px solid" borderColor="containerBorder" boxShadow="shadow" pb={4}>
        <ModalHeader>
          <Text>Delete wright?</Text>
        </ModalHeader>
        <ModalCloseButton borderRadius={10} />
        <ModalBody py={4}>
          <Text fontWeight="bold" fontSize="lg" mb={3}>
            wright titled <span style={{ fontWeight: 800 }}>{wright.title}</span> will be deleted
          </Text>
          <Text fontWeight="bold" fontSize="lg" color="errorRed">
            This action is irreversible!
          </Text>
        </ModalBody>
        <ModalFooter>
          <HStack spacing={5}>
            <Button fontWeight="bold" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button fontWeight="bold" variant="solid-negative-cta" onClick={deleteWrightHandler} isLoading={isDeletingWright}>
              Yes, Delete!
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
