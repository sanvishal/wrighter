import {
  Button,
  Center,
  Checkbox,
  FormControl,
  FormLabel,
  HStack,
  Icon,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Switch,
  Text,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FiCheck, FiSettings, FiX } from "react-icons/fi";
import { useQuery } from "react-query";
import { getWright, toggleWrightVisibility } from "../../services/wrightService";
import { CustomToolTip } from "../CustomTooltip";
import { Toaster } from "../Toaster";

export const WrightSettings = ({ wrightId }: { wrightId: string }): JSX.Element => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [switchChecked, setSwitchChecked] = useState(false);
  const toast = useToast();

  const {
    data: wright,
    isFetching: isWrightLoading,
    refetch: getWrightRequest,
  } = useQuery("getWrightOnSettingsQuery", () => getWright(false, wrightId), {
    refetchOnWindowFocus: false,
    enabled: false,
    retry: false,
  });

  const { isFetching: isToggling, refetch: toggleVisibilityRequest } = useQuery(
    "toggleVisibilityQuery",
    () => toggleWrightVisibility(wrightId),
    {
      refetchOnWindowFocus: false,
      enabled: false,
      retry: false,
    }
  );

  const handleWrightRequest = async () => {
    const { data: wright } = await getWrightRequest();
    console.log(wright?.isPublic);
    setSwitchChecked(wright?.isPublic === undefined ? false : wright.isPublic);
  };

  useEffect(() => {
    if (isOpen) {
      handleWrightRequest();
    }
  }, [isOpen]);

  const handleOnSaveClick = async () => {
    const { status } = await toggleVisibilityRequest();
    if (status === "success") {
      await handleWrightRequest();
      toast({
        position: "bottom-left",
        render: () => <Toaster message="wright settings successfully updated" type="success" />,
      });
    } else if (status === "error") {
      toast({
        position: "bottom-left",
        render: () => <Toaster message={"something bad happened! please try again."} type="error" />,
      });
    }
  };

  return (
    <>
      <CustomToolTip label="wright settings" placement="left">
        <IconButton aria-label="wright settings" icon={<FiSettings />} variant="ghost" size="sm" onClick={onOpen} />
      </CustomToolTip>
      <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
        <ModalOverlay />
        <ModalContent borderRadius={10} bg="bgLighter" border="1px solid" borderColor="containerBorder" boxShadow="shadow" pb={4}>
          <ModalHeader>
            <Text>Wright Settings</Text>
          </ModalHeader>
          <ModalCloseButton borderRadius={10} />
          <ModalBody py={4}>
            {!isWrightLoading && wright ? (
              <HStack alignItems="flex-start" justifyContent="flex-start" spacing={4}>
                <Switch
                  defaultChecked={wright.isPublic}
                  mt={0.5}
                  onChange={(e) => {
                    setSwitchChecked(e.target.checked);
                  }}
                />
                <VStack alignItems="flex-start" justifyContent="flex-start" spacing={1}>
                  <Text fontWeight="bold">Toggle Wright Visibility</Text>
                  <Text fontSize="sm" color="textLighter">
                    Makes Wright {switchChecked ? `Public, others would be able to see it` : `Private, only you can see it`}
                  </Text>
                </VStack>
              </HStack>
            ) : (
              <Spinner
                sx={{
                  "--spinner-size": "2rem",
                  borderBottomColor: "textLighter",
                  borderLeftColor: "textLighter",
                  borderTopColor: "transparent",
                  borderRightColor: "transparent",
                }}
              />
            )}
          </ModalBody>
          <ModalFooter>
            <Button w="full" fontWeight="bold" isLoading={isWrightLoading || isToggling} onClick={handleOnSaveClick}>
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
