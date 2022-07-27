import {
  Box,
  Center,
  Icon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Spinner,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useState } from "react";
import { MdOutlineBrokenImage } from "react-icons/md";
import { Bite } from "../../../types";

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
