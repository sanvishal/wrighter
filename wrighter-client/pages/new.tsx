import { Center, Container, Spinner } from "@chakra-ui/react";
import { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useQuery } from "react-query";
import { useUserContext } from "../contexts/UserContext";
import { createWright } from "../services/wrightService";

const NewPage: NextPage = () => {
  const { isAuth, isUserLoading } = useUserContext();
  const router = useRouter();

  const { refetch: createWrightRequest, isFetching: isCreating } = useQuery("createWrightQuery", () => createWright(!isAuth), {
    enabled: false,
    refetchOnWindowFocus: false,
  });

  const createWrightHandler = async () => {
    const { data: wright } = await createWrightRequest();
    if (wright) {
      router.push(`/wrighting?id=${wright.id}`);
    }
  };

  useEffect(() => {
    if (!isUserLoading) {
      createWrightHandler();
    }
  }, [isAuth, isUserLoading]);

  return (
    <>
      <Head>
        <title>wrighter • new</title>
      </Head>
      <Container maxW="5xl" centerContent mt={10}>
        <Center w="full">
          {isCreating && (
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
        </Center>
      </Container>
    </>
  );
};

export default NewPage;
