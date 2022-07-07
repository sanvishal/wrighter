import {
  Box,
  Button,
  Center,
  Container,
  FormControl,
  FormHelperText,
  FormLabel,
  HStack,
  Input,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { AxiosError, AxiosResponse } from "axios";
import { useRouter } from "next/router";
import { ChangeEvent, useState } from "react";
import { useQuery } from "react-query";
import Logo from "../components/Logo";
import { Toaster } from "../components/Toaster";
import { login } from "../services/authService";
import { validateEmail } from "../utils";

const LogInForm = ({ handleGotoSignUp }: { handleGotoSignUp: () => void }): JSX.Element => {
  const toast = useToast();
  const router = useRouter();

  const [email, setEmail] = useState({
    value: "",
    error: "",
  });

  const [password, setPassword] = useState({
    value: "",
    error: "",
  });

  const [loginError, setLoginError] = useState("");

  const handleEmailChange = (emailValue: string) => {
    const isValidEmail = validateEmail(emailValue);
    setEmail({
      value: emailValue,
      error: isValidEmail ? "" : "invalid email",
    });
  };

  const handlePasswordChange = (passwordValue: string) => {
    const isValidPassword = passwordValue.length > 0;
    setPassword({
      value: passwordValue,
      error: isValidPassword ? "" : "enter a password",
    });
  };

  const { refetch: sendLoginRequest, isLoading } = useQuery<unknown, AxiosError<{ message: string }, unknown>>(
    "loginQuery",
    () => login({ email: email.value, password: password.value }),
    { enabled: false }
  );

  const handleLogin = async () => {
    const { status, error } = await sendLoginRequest();
    if (status === "error") {
      setLoginError(error.response?.data?.message || "Something bad happened! Please try again.");
      toast({
        position: "bottom-left",
        render: () => (
          <Toaster message={error.response?.data?.message || "Something bad happened! Please try again."} type="error" />
        ),
      });
    } else if (status === "success") {
      router.push("/home");
    }
  };

  return (
    <VStack p={3}>
      <Text fontWeight={800} fontSize={{ base: "x-large", md: "xx-large" }}>
        Continue Wrighting!
      </Text>
      <Text fontWeight="bold" fontSize="md" color="textLight">
        or create an account &nbsp;
        <span style={{ color: "var(--chakra-colors-accentColor)", cursor: "pointer" }} onClick={handleGotoSignUp}>
          Register
        </span>
      </Text>
      <FormControl>
        <Box mb={5}>
          <FormLabel htmlFor="email" mb={1}>
            Email &nbsp; <span style={{ color: "var(--chakra-colors-errorRed)" }}>{email.error}</span>
          </FormLabel>
          <Input
            borderColor="inputBorderColor"
            isInvalid={Boolean(email.error)}
            type="email"
            id="email"
            required
            value={email.value}
            onChange={(e: ChangeEvent<HTMLInputElement>) => handleEmailChange(e.target.value)}
          />
        </Box>
        <Box>
          <FormLabel htmlFor="password" mb={1}>
            Password &nbsp; <span style={{ color: "var(--chakra-colors-errorRed)" }}> {password.error}</span>
          </FormLabel>
          <Input
            borderColor="inputBorderColor"
            isInvalid={Boolean(password.error)}
            type="password"
            id="password"
            required
            value={password.value}
            onChange={(e: ChangeEvent<HTMLInputElement>) => handlePasswordChange(e.target.value)}
          />
        </Box>
      </FormControl>
      <Box w="full" pt={7}>
        <Button
          onClick={handleLogin}
          isLoading={isLoading}
          isDisabled={!(Boolean(email.value) && Boolean(password.value) && !Boolean(email.error) && !Boolean(password.error))}
          w="full"
          size="lg"
          fontSize="xl"
          fontWeight="800"
          _hover={{
            transform: "scale(1.025)",
          }}
        >
          Login
        </Button>
      </Box>
    </VStack>
  );
};

const SignUpForm = ({ handleGotoLogin }: { handleGotoLogin: () => void }): JSX.Element => {
  return (
    <VStack p={3}>
      <Text fontWeight={800} fontSize={{ base: "x-large", md: "xx-large" }}>
        Start Wrighting!
      </Text>
      <Text fontWeight="bold" fontSize="md" color="textLight">
        already have an account? &nbsp;
        <span style={{ color: "var(--chakra-colors-accentColor)", cursor: "pointer" }} onClick={handleGotoLogin}>
          Login
        </span>
      </Text>
      <FormControl></FormControl>
    </VStack>
  );
};

export default function SignIn(): JSX.Element {
  const [tabIndex, setTabIndex] = useState(0);

  return (
    <Container maxWidth="6xl" py={{ base: 3, md: 6 }}>
      <HStack w="50px" h="50px" spacing={3}>
        <Box>
          <Logo />
        </Box>
        <Text fontWeight="800" fontSize="xl">
          wrighter
        </Text>
      </HStack>
      <Container mt={140} centerContent p={0}>
        <Tabs
          size="lg"
          index={tabIndex}
          isFitted
          variant="enclosed"
          w={{ base: "full", md: "500px" }}
          onChange={(index: number) => setTabIndex(index)}
        >
          <TabList border="unset" marginBottom={0}>
            <Tab
              _selected={{
                border: "unset",
                borderBottomColor: "transparent",
                bg: "accentColor",
                color: "textColorWhite",
                fontWeight: "800",
                marginBottom: "0",
              }}
              color="textLighter"
              border="unset"
            >
              Login
            </Tab>
            <Tab
              _selected={{
                border: "unset",
                borderBottomColor: "transparent",
                bg: "accentColor",
                color: "textColorWhite",
                fontWeight: "800",
                marginBottom: "0",
              }}
              color="textLighter"
              border="unset"
            >
              Signup
            </Tab>
          </TabList>
          <TabPanels
            bg="bgLight"
            borderTopLeftRadius={tabIndex === 0 ? 0 : 10}
            borderTopRightRadius={tabIndex === 1 ? 0 : 10}
            borderBottomRadius={10}
            boxShadow="var(--chakra-colors-shadow)"
          >
            <TabPanel>
              <LogInForm
                handleGotoSignUp={() => {
                  setTabIndex(1);
                }}
              />
            </TabPanel>
            <TabPanel>
              <SignUpForm
                handleGotoLogin={() => {
                  setTabIndex(0);
                }}
              />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Container>
    </Container>
  );
}
