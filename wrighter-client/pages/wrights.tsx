import { Box, Center, Container, HStack, Icon, Text, VStack } from "@chakra-ui/react";
import { useLiveQuery } from "dexie-react-hooks";
import { NextPage } from "next";
import dynamic from "next/dynamic";
import { FiBookOpen } from "react-icons/fi";
import { Content } from "../components/Content";
import { WrightCard } from "../components/WrightCard";
const WrightsList = dynamic(() => import("../components/WrightsList").then((module) => module.WrightsList) as any, {
  ssr: false,
});

const Wrights: NextPage = () => {
  return (
    <Content>
      <Container maxW="full" pt={20}>
        <HStack spacing={4}>
          {/* {console.log(friends)} */}
          <Center borderRadius={10} w={16} h={16} bg="accentColorTrans">
            <Icon as={FiBookOpen} w={7} h={7} color="accentColor"></Icon>
          </Center>
          <VStack align="flex-start" spacing={0}>
            <Text fontWeight="800" fontSize="xx-large">
              Wrights
            </Text>
            <Text color="textLighter">All your wrightups are here</Text>
          </VStack>
        </HStack>
        <Box mt={10} w="full">
          <WrightsList />
        </Box>
      </Container>
    </Content>
  );
};

export default Wrights;
