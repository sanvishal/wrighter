import { Container, HStack, Center, Icon, VStack, Text, Box } from "@chakra-ui/react";
import { TbBulb } from "react-icons/tb";
import { Content } from "../Content";

export const Bites = (): JSX.Element => {
  return (
    <Container maxW="full" pt={20}>
      <HStack w="full" justify="space-between">
        <HStack spacing={4}>
          <Center borderRadius={10} w={16} h={16} bg="biteAccentColorTrans">
            <Icon as={TbBulb} w={8} h={8} color="biteAccentColor"></Icon>
          </Center>
          <VStack align="flex-start" spacing={0}>
            <Text fontWeight="800" fontSize="xx-large">
              Bites
            </Text>
            <Text color="textLighter">jot down bite-sized thoughts</Text>
          </VStack>
        </HStack>
      </HStack>
      <Box mt={10} w="full"></Box>
    </Container>
  );
};
