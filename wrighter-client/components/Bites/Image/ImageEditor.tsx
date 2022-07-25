import { Box, Center, FormControl, FormLabel, Icon, Input, InputGroup, InputLeftElement, Spinner, Text } from "@chakra-ui/react";
import { ChangeEvent, useState } from "react";
import { FiImage } from "react-icons/fi";
import { MdOutlineBrokenImage } from "react-icons/md";
import { BiteType } from "../../../types";
import { isValidUrl } from "../../../utils";

export const ImageEditor = ({ onContentSet }: { onContentSet: (content: string, type: BiteType) => void }): JSX.Element => {
  const [link, setLink] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [linkError, setLinkError] = useState("");
  const [imgError, setImgError] = useState(false);
  const [isImgLoading, setIsImgLoading] = useState(false);

  const handleInputBlur = () => {
    if (link && isValidUrl(link)) {
      setImageUrl(link);
      setIsImgLoading(true);
    }
  };

  return (
    <>
      <FormControl>
        <Box>
          <FormLabel htmlFor="link" mb={1} fontSize="lg">
            Save an Image &nbsp;
            <span style={{ color: "var(--chakra-colors-errorRed)", fontSize: "var(--chakra-fontSizes-sm)" }}>{linkError}</span>
          </FormLabel>
          <InputGroup>
            <InputLeftElement
              pointerEvents="none"
              children={
                imgError ? (
                  <MdOutlineBrokenImage color="var(--chakra-colors-textLighter)" />
                ) : (
                  <FiImage color="var(--chakra-colors-textLighter)" />
                )
              }
            />
            <Input
              isInvalid={linkError.length > 0}
              fontSize="lg"
              borderColor="inputBorderColor"
              type="text"
              placeholder="Enter an Image link"
              id="link"
              required
              onBlur={handleInputBlur}
              value={link}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setLink(e.target.value);
                if (!isValidUrl(e.target.value)) {
                  setLinkError("URL is not valid");
                  onContentSet("", BiteType.IMAGE);
                } else {
                  setLinkError("");
                  onContentSet(e.target.value, BiteType.IMAGE);
                }
              }}
            />
          </InputGroup>
        </Box>
      </FormControl>
      <Center w="full" mt={10}>
        <Box w="250px" h="250px" bg={imgError || imageUrl === "" ? "bgLight" : "transparent"} borderRadius={10}>
          {imageUrl && (
            <img
              style={{
                display: imgError || isImgLoading ? "none" : "block",
                maxHeight: "250px",
                maxWidth: "250px",
                margin: "0 auto",
                borderRadius: 8,
              }}
              src={imageUrl}
              alt="image"
              onError={(e) => {
                setIsImgLoading(false);
                setImgError(true);
              }}
              onLoad={() => {
                setIsImgLoading(false);
                setImgError(false);
              }}
            />
          )}
          {isImgLoading && (
            <Center h="full" p={20} flexDir="column">
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
          {(imgError || imageUrl === "") && !isImgLoading && (
            <Center h="full" p={20} flexDir="column">
              <Icon as={MdOutlineBrokenImage} color="textLighter" w="full" h="full" />
              <Text fontSize="md" color="textLighter">
                404!
              </Text>
            </Center>
          )}
        </Box>
      </Center>
    </>
  );
};
