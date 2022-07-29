import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  VStack,
  HStack,
  Switch,
  FormControl,
  FormLabel,
  Center,
  Icon,
  Input,
  Spinner,
  ModalFooter,
  Button,
  Text,
  Box,
  Divider,
  useToast,
} from "@chakra-ui/react";
import { ChangeEvent, useEffect, useState } from "react";
import { FiDownload, FiInfo, FiTrash2 } from "react-icons/fi";
import { useQuery } from "react-query";
import { WrightIDB } from "../services/dbService";
import { deleteWright, getWright } from "../services/wrightService";
import { Wright } from "../types";
import { slugify } from "../utils";
import { Toaster } from "./Toaster";

export const WrightSettingsGuest = ({
  wright,
  isOpen,
  onClose,
  triggerUpdate,
}: {
  wright: Wright | WrightIDB;
  isOpen: boolean;
  onClose: () => void;
  triggerUpdate: () => void;
}) => {
  const toast = useToast();
  const [isDeleteClicked, setIsDeleteClicked] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsDeleteClicked(false);
    }
  }, [isOpen]);

  const { refetch: deleteWrightRequest, isFetching: isDeletingWright } = useQuery(
    "deleteWrightQueryLocal",
    () => deleteWright(true, wright.id || ""),
    { enabled: false, refetchOnWindowFocus: false }
  );

  const { refetch: getWrightRequest, isFetching: isGettingWright } = useQuery(
    "getWrightOnSettingsGuest",
    () => getWright(true, wright.id || "", false),
    { enabled: false, refetchOnWindowFocus: false }
  );

  const exportWrightHandler = async () => {
    const { data: latestWright, status } = await getWrightRequest();
    if (status === "success" && latestWright) {
      const blob = new Blob([latestWright.content || ""], {
        type: "application/text",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${slugify((latestWright.title || "") + " " + new Date().toDateString())}.md`;
      link.click();
      window.URL.revokeObjectURL(url);
    }
  };

  const deleteWrightHandler = async () => {
    const { status } = await deleteWrightRequest();
    if (status === "success") {
      triggerUpdate();
      toast({
        position: "bottom-right",
        render: () => <Toaster message="deleted wright successfully" type="success" />,
      });
      onClose();
    } else if (status === "error") {
      toast({
        position: "bottom-right",
        render: () => <Toaster message="error deleting wright" type="error" />,
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
      <ModalOverlay />
      <ModalContent borderRadius={10} bg="bgLighter" border="1px solid" borderColor="containerBorder" boxShadow="shadow" pb={4}>
        <ModalHeader>
          <Text>Wright Settings</Text>
        </ModalHeader>
        <ModalCloseButton borderRadius={10} />
        <ModalBody py={2}>
          <VStack alignItems="space-between" spacing={10}>
            <HStack justifyContent="space-between">
              <Text fontSize={{ base: "md", md: "lg" }}>Export as Markdown file</Text>
              <Button fontWeight="bold" leftIcon={<FiDownload />} onClick={exportWrightHandler} isLoading={isGettingWright}>
                Export
              </Button>
            </HStack>
            <Divider />
            <HStack justifyContent="space-between" w="full">
              <Box>
                <Text fontWeight="bold" fontSize={{ base: "md", md: "lg" }}>
                  Delete Wright
                </Text>
                <Text fontWeight="bold" fontSize={{ base: "md", md: "lg" }} color="errorRed">
                  This action is irreversible!
                </Text>
              </Box>
              <VStack spacing={1} alignItems="flex-end">
                <Button
                  fontWeight="bold"
                  variant="solid-negative-cta"
                  leftIcon={<FiTrash2 />}
                  isLoading={isDeletingWright}
                  onClick={() => {
                    if (!isDeleteClicked) {
                      setIsDeleteClicked(true);
                    } else {
                      deleteWrightHandler();
                    }
                  }}
                >
                  Delete
                </Button>
                <Text
                  visibility={isDeleteClicked ? "visible" : "hidden"}
                  fontSize={{ base: "xs", md: "sm" }}
                  color="textLighter"
                  textAlign="right"
                >
                  (click it again to delete)
                </Text>
              </VStack>
            </HStack>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
