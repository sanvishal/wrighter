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
    // @ts-ignore
    <Box m={0} p={2} maxW="270px" minW="270px" bg={() => getTypeColor(type)} borderRadius={10}>
      <Text color={type === "error" ? "errorRed" : type === "success" ? "successGreen" : "textColor"}>{message}</Text>
    </Box>
  );
};
