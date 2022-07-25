import { Box, FormControl, FormLabel, Input, InputGroup, InputLeftElement, Spinner } from "@chakra-ui/react";
import { ChangeEvent, useEffect, useState } from "react";
import { FiGlobe } from "react-icons/fi";
import { BiteType } from "../../../types";
import { isValidUrl } from "../../../utils";

export const LinkEditor = ({ onContentSet }: { onContentSet: (content: string, type: BiteType) => void }): JSX.Element => {
  const [link, setLink] = useState("");
  const [faviconLink, setFaviconLink] = useState("");
  const [linkError, setLinkError] = useState("");
  const [faviconError, setFaviconError] = useState(true);
  const [faviconLoading, setFaviconLoading] = useState(false);

  const handleInput = (): void => {
    if (isValidUrl(link)) {
      setFaviconError(false);
      const origin = new URL(link).origin;
      setFaviconLink("https://www.google.com/s2/favicons?domain=" + origin);
    } else {
      setFaviconLoading(false);
      setFaviconError(true);
    }
  };

  useEffect(() => {
    setFaviconLoading(true);
  }, [faviconLink]);

  return (
    <FormControl>
      <Box>
        <FormLabel htmlFor="link" mb={1} fontSize="lg">
          Save a Link &nbsp;
          <span style={{ color: "var(--chakra-colors-errorRed)", fontSize: "var(--chakra-fontSizes-sm)" }}>{linkError}</span>
        </FormLabel>
        <InputGroup>
          <InputLeftElement
            pointerEvents="none"
            children={
              faviconError ? (
                <FiGlobe color="var(--chakra-colors-textLighter)" />
              ) : (
                <>
                  {faviconLoading && (
                    <Spinner
                      sx={{
                        "--spinner-size": "1rem",
                        borderBottomColor: "textLighter",
                        borderLeftColor: "textLighter",
                        borderTopColor: "transparent",
                        borderRightColor: "transparent",
                      }}
                    />
                  )}
                  <img
                    src={faviconLink}
                    alt="favicon"
                    style={{ display: faviconLoading ? "none" : "block" }}
                    onError={(e) => {
                      setFaviconError(true);
                      setFaviconLoading(false);
                    }}
                    onLoad={() => {
                      setFaviconLoading(false);
                    }}
                  />
                </>
              )
            }
          />
          <Input
            isInvalid={linkError.length > 0}
            fontSize="lg"
            borderColor="inputBorderColor"
            placeholder="Enter a link"
            type="text"
            id="link"
            required
            onBlur={handleInput}
            value={link}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setLink(e.target.value);
              // debouncedLinkHandler(e.target.value);
              if (!isValidUrl(e.target.value)) {
                setLinkError("invalid URL, make sure you put in http/https");
                onContentSet("", BiteType.LINK);
              } else {
                onContentSet(e.target.value, BiteType.LINK);
                setLinkError("");
              }
            }}
          />
        </InputGroup>
      </Box>
    </FormControl>
  );
};
