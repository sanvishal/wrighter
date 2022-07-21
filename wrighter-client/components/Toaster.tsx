import { Box, Text } from "@chakra-ui/react";

export const Toaster = ({
  message,
  type = "neutral",
}: {
  message: string;
  type?: "error" | "neutral" | "success";
}): JSX.Element => {
  const getTypeColor = (type: "error" | "neutral" | "success") => {
    switch (type) {
      case "error":
        return "errorRedTransBg";
      case "success":
        return "successGreenTransBg";
      default:
        return "bgLight";
    }
  };

  return (
    <Box
      m={0}
      p={2}
      maxW={{ base: "100%", md: "270px" }}
      minW={{ base: "100%", md: "270px" }}
      // @ts-ignore
      bg={() => getTypeColor(type)}
      borderRadius={10}
    >
      <Text color={type === "error" ? "errorRed" : type === "success" ? "successGreen" : "textColor"}>{message}</Text>
    </Box>
  );
};
