import { Container, Spinner, Text } from "@chakra-ui/react";

export const SuspenseFallback = (): JSX.Element => {
  return (
    <Container maxW="5xl" centerContent mt={20}>
      <Spinner
        sx={{
          "--spinner-size": "2.6rem",
          borderBottomColor: "textLighter",
          borderLeftColor: "textLighter",
          borderTopColor: "transparent",
          borderRightColor: "transparent",
        }}
      />
      <Text fontSize="lg" color="textLighter" mt={8}>
        Loading for the first time
      </Text>
    </Container>
  );
};
