import {
  Box,
  Button,
  Center,
  Checkbox,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Icon,
  IconButton,
  Input,
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
import { ChangeEvent, useEffect, useState } from "react";
import { FiCheck, FiExternalLink, FiInfo, FiSettings, FiX } from "react-icons/fi";
import { useQuery } from "react-query";
import { changeWrightSettings, getWright } from "../../services/wrightService";
import { isValidUrl, slugify } from "../../utils";
import { CustomToolTip } from "../CustomTooltip";
import { Toaster } from "../Toaster";

export const WrightSettings = ({
  wrightId,
  isOpen,
  onOpen,
  onClose,
  showButton = true,
  triggerUpdate,
}: {
  wrightId: string;
  isOpen: any;
  onOpen: any;
  onClose: any;
  showButton?: boolean;
  triggerUpdate?: () => void;
}): JSX.Element => {
  // const { isOpen, onOpen, onClose } = useDisclosure();
  const [switchChecked, setSwitchChecked] = useState(false);
  const [slugValue, setSlugValue] = useState("");
  const [slugError, setIsSlugError] = useState("");
  const [metaImage, setMetaImage] = useState("");
  const [imgError, setImgError] = useState("");
  const [shouldTriggerUpdate, setShouldTriggerUpdate] = useState(false);
  const toast = useToast();

  const {
    data: wright,
    isFetching: isWrightLoading,
    refetch: getWrightRequest,
  } = useQuery("getWrightOnSettingsQuery", () => getWright(false, wrightId, true), {
    refetchOnWindowFocus: false,
    enabled: false,
    retry: false,
  });

  const { isFetching: isSaving, refetch: saveSettings } = useQuery(
    "saveWrightSettingsQuery",
    () => changeWrightSettings(wrightId, switchChecked, slugify(slugValue), metaImage),
    {
      refetchOnWindowFocus: false,
      enabled: false,
      retry: false,
    }
  );

  useEffect(() => {
    getWrightRequest();
  }, []);

  const handleWrightRequest = async () => {
    const { data: wright } = await getWrightRequest();
    setSlugValue(wright?.slug || "");
    setMetaImage(wright?.ogImage || "");
    setSwitchChecked(wright?.isPublic === undefined ? false : wright.isPublic);
  };

  useEffect(() => {
    if (isOpen) {
      handleWrightRequest();
    }
  }, [isOpen]);

  const handleOnSaveClick = async () => {
    if (
      wright?.slug !== slugify(slugValue) ||
      wright?.isPublic !== switchChecked ||
      (wright.ogImage && wright?.ogImage?.trim() !== metaImage.trim())
    ) {
      setShouldTriggerUpdate(true);
    }
    const { status } = await saveSettings();
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

  const handleSlugChange = (value: string) => {
    const slug = slugify(value);
    if (slug.length < 5 || slug.length > 200) {
      setIsSlugError("slug must be between 5 and 200 characters");
    } else {
      setIsSlugError("");
    }
    setSlugValue(value);
  };

  const handleMetaChange = (value: string) => {
    const trimmed = value.trim();
    setMetaImage(trimmed);
    if (trimmed.length > 250) {
      setImgError("slug must be below 250 characters");
      return;
    } else {
      setImgError("");
    }
    if (trimmed.length > 0 && !isValidUrl(trimmed)) {
      setImgError("invalid URL");
    } else {
      setImgError("");
    }
  };

  const onCloseHandler = () => {
    if (shouldTriggerUpdate && triggerUpdate) {
      triggerUpdate();
    }
    onClose();
  };

  useEffect(() => {
    if (isOpen) {
      setShouldTriggerUpdate(false);
      setImgError("");
      setIsSlugError("");
    }
  }, [isOpen]);

  return (
    <>
      {showButton && (
        <VStack spacing={2}>
          <CustomToolTip label="wright settings" placement="left">
            <IconButton aria-label="wright settings" icon={<FiSettings />} variant="ghost" size="sm" onClick={onOpen} />
          </CustomToolTip>
          <CustomToolTip label="preview in new tab">
            <IconButton
              variant="ghost"
              size="sm"
              icon={<FiExternalLink />}
              aria-label="open wright"
              as="a"
              href={!wright?.isPublic ? "/wright?id=" + wright?.id : "wright/" + wright?.slug + `-${wright?.id}`}
              target="_blank"
              referrerPolicy="no-referrer"
            />
          </CustomToolTip>
        </VStack>
      )}
      <Modal isOpen={isOpen} onClose={onCloseHandler} isCentered size="lg">
        <ModalOverlay />
        <ModalContent borderRadius={10} bg="bgLighter" border="1px solid" borderColor="containerBorder" boxShadow="shadow" pb={4}>
          <ModalHeader>
            <Text>Wright Settings</Text>
          </ModalHeader>
          <ModalCloseButton borderRadius={10} />
          <ModalBody py={4}>
            {!isWrightLoading && wright ? (
              <VStack alignItems="flex-start">
                <HStack alignItems="flex-start" justifyContent="flex-start" spacing={4}>
                  <Switch
                    defaultChecked={wright.isPublic}
                    mt={0.5}
                    onChange={(e: any) => {
                      setSwitchChecked(e.target.checked);
                    }}
                  />
                  <VStack alignItems="flex-start" justifyContent="flex-start" spacing={1}>
                    <Text fontWeight="bold">Toggle Wright Visibility</Text>
                    <Text fontSize="sm" color="textLighter">
                      wright is now {switchChecked ? `public` : `private`}
                    </Text>
                  </VStack>
                </HStack>
                <FormControl>
                  <Box mt={5}>
                    <FormLabel htmlFor="slug" mb={1}>
                      <HStack>
                        <Text>Slug</Text>
                        <CustomToolTip label="slug will be at the end of your the url when you make it the wright public, it should be descriptive and relavant to the wright, by default the title is your slug">
                          <Center>
                            <Icon as={FiInfo} color="textLighter" cursor="pointer" />
                          </Center>
                        </CustomToolTip>
                        {slugError && (
                          <Text color="errorRed" fontSize="sm" w="full" textAlign="right">
                            {slugError}
                          </Text>
                        )}
                      </HStack>
                    </FormLabel>
                    <Input
                      borderColor="inputBorderColor"
                      type="text"
                      id="slug"
                      isInvalid={slugError.length > 0}
                      placeholder="Make this as descriptive as possible, helps with SEO"
                      required
                      value={slugValue}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => handleSlugChange(e.target.value)}
                    />
                    <HStack fontSize="sm" color="textLighter" mt={1}>
                      <Text>
                        {slugify(slugValue)}-<span style={{ opacity: 0.4 }}>{wrightId}</span>
                      </Text>
                    </HStack>
                  </Box>
                  <Box mt={5}>
                    <FormLabel htmlFor="img" mb={1}>
                      <HStack>
                        <Text>Meta Image</Text>
                        <CustomToolTip label="the image that would appear in shared link if you share your wright in social media">
                          <Center>
                            <Icon as={FiInfo} color="textLighter" cursor="pointer" />
                          </Center>
                        </CustomToolTip>
                        {imgError && (
                          <Text color="errorRed" fontSize="sm" w="50%" style={{ marginLeft: "auto" }} textAlign="right">
                            {imgError}
                          </Text>
                        )}
                      </HStack>
                    </FormLabel>
                    <Input
                      borderColor="inputBorderColor"
                      type="text"
                      id="img"
                      isInvalid={imgError.length > 0}
                      placeholder="A link to the meta image, helps with SEO"
                      required
                      value={metaImage}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => handleMetaChange(e.target.value)}
                    />
                  </Box>
                </FormControl>
              </VStack>
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
            <Button
              w="full"
              fontWeight="bold"
              isLoading={isWrightLoading || isSaving}
              onClick={handleOnSaveClick}
              disabled={slugError.length > 0 || imgError.length > 0}
            >
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
