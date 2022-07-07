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
        return "errorRed";
      case "success":
        return "green.500";
      default:
        return "bgLight";
    }
  };

  return (
    // @ts-ignore
    <Box m={3} p={3} bg={() => getTypeColor(type)} borderRadius={10}>
      <Text color={type === "error" ? "textColorBlack" : "textColor"}>{message}</Text>
    </Box>
  );
};
