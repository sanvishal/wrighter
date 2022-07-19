import {
  Box,
  Button,
  Center,
  Container,
  FormControl,
  FormHelperText,
  FormLabel,
  HStack,
  Icon,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { AxiosError, AxiosResponse } from "axios";
import { useRouter } from "next/router";
import { ChangeEvent, KeyboardEvent, useState } from "react";
import { FiCheck, FiX, FiXCircle } from "react-icons/fi";
import { useQuery } from "react-query";
import Logo from "../components/Logo";
import { Toaster } from "../components/Toaster";
import { login, register } from "../services/authService";
import { validateEmail } from "../utils";

const LogInForm = ({ handleGotoSignUp }: { handleGotoSignUp: () => void }): JSX.Element => {
  const toast = useToast();
  const router = useRouter();

  const [errorAnimClass, setErrorAnimClass] = useState("");

  const [email, setEmail] = useState({
    value: "",
    error: "",
  });

  const [password, setPassword] = useState({
    value: "",
    error: "",
  });

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
    setErrorAnimClass("");
    const { status, error } = await sendLoginRequest();
    if (status === "error") {
      setErrorAnimClass("shake");
      toast({
        position: "bottom-left",
        render: () => (
          <Toaster message={error.response?.data?.message || "Something bad happened! Please try again."} type="error" />
        ),
      });
    } else if (status === "success") {
      router.push("/wrights");
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
            onKeyPress={(e: KeyboardEvent<HTMLInputElement>) => {
              if (e.key === "Enter") {
                handleLogin();
              }
            }}
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
            onKeyPress={(e: KeyboardEvent<HTMLInputElement>) => {
              if (e.key === "Enter") {
                handleLogin();
              }
            }}
            onChange={(e: ChangeEvent<HTMLInputElement>) => handlePasswordChange(e.target.value)}
          />
        </Box>
      </FormControl>
      <Box w="full" pt={7}>
        <Button
          className={errorAnimClass}
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
  const toast = useToast();

  const [errorAnimClass, setErrorAnimClass] = useState("");
  const [name, setName] = useState({ value: "", error: "" });
  const [email, setEmail] = useState({ value: "", error: "" });
  const [password, setPassword] = useState({ value: "", error: "" });
  const [password2, setPassword2] = useState({ value: "", error: "" });

  const handleNameChange = (nameValue: string) => {
    const isValidName = nameValue.length > 0;
    const isNameTooLong = nameValue.length > 20;
    setName({
      value: nameValue,
      error: isValidName ? (isNameTooLong ? "name is too long, could break the UI 😅" : "") : "enter a name",
    });
  };

  const handleEmailChange = (emailValue: string) => {
    const isValidEmail = validateEmail(emailValue);
    setEmail({
      value: emailValue,
      error: isValidEmail ? "" : "invalid email",
    });
  };

  const handlePasswordChange = (passwordValue: string) => {
    const isValidPassword = passwordValue.length > 0;
    const isPasswordLengthValid = passwordValue.length >= 8;
    setPassword({
      value: passwordValue,
      error: isValidPassword ? (!isPasswordLengthValid ? "password must be 8 characters minimum" : "") : "enter a password",
    });
  };

  const handlePassword2Change = (passwordValue: string) => {
    const doesPasswordsMatch = passwordValue === password.value;
    setPassword2({
      value: passwordValue,
      error: doesPasswordsMatch ? "" : "passwords does not match",
    });
  };

  const isFormValid = (): boolean => {
    return (
      Boolean(name.value) &&
      Boolean(email.value) &&
      Boolean(password.value) &&
      Boolean(password2.value) &&
      !Boolean(name.error) &&
      !Boolean(email.error) &&
      !Boolean(password.error) &&
      !Boolean(password2.error)
    );
  };

  const { refetch: sendRegisterRequest, isLoading } = useQuery<unknown, AxiosError<{ message: string }, unknown>>(
    "registerQuery",
    () => register({ email: email.value, password: password.value, name: name.value }),
    { enabled: false }
  );

  const handleRegister = async () => {
    setErrorAnimClass("");
    const { status, error } = await sendRegisterRequest();
    if (status === "error") {
      setErrorAnimClass("shake");
      toast({
        position: "bottom-left",
        render: () => (
          <Toaster message={error.response?.data?.message || "Something bad happened! Please try again."} type="error" />
        ),
      });
    } else if (status === "success") {
      handleGotoLogin();
      toast({
        position: "bottom-left",
        render: () => <Toaster message="Account created! You can login now :)" type="success" />,
      });
    }
  };

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
      <FormControl>
        <Box mb={5}>
          <FormLabel htmlFor="email" mb={1}>
            Preferred Name &nbsp; <span style={{ color: "var(--chakra-colors-errorRed)" }}>{name.error}</span>
          </FormLabel>
          <Input
            borderColor="inputBorderColor"
            isInvalid={Boolean(name.error)}
            type="email"
            id="email"
            required
            value={name.value}
            onChange={(e: ChangeEvent<HTMLInputElement>) => handleNameChange(e.target.value)}
          />
        </Box>
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
        <Box mb={5}>
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
        <Box>
          <FormLabel htmlFor="password2" mb={1}>
            Password Again &nbsp; <span style={{ color: "var(--chakra-colors-errorRed)" }}> {password2.error}</span>
          </FormLabel>
          <Input
            borderColor="inputBorderColor"
            isInvalid={Boolean(password2.error)}
            type="password"
            id="password2"
            required
            value={password2.value}
            onChange={(e: ChangeEvent<HTMLInputElement>) => handlePassword2Change(e.target.value)}
          />
        </Box>
      </FormControl>
      <Box w="full" pt={7}>
        <Button
          className={errorAnimClass}
          onClick={handleRegister}
          isLoading={isLoading}
          isDisabled={!isFormValid()}
          w="full"
          size="lg"
          fontSize="xl"
          fontWeight="800"
          _hover={{
            transform: "scale(1.025)",
          }}
        >
          Signup
        </Button>
      </Box>
    </VStack>
  );
};

export default function SignIn(): JSX.Element {
  const [tabIndex, setTabIndex] = useState(0);
  const { isOpen: isGuestWarnOpen, onOpen: onGuestWarnOpen, onClose: onGuestWarnClose } = useDisclosure();

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
      <Container mt={{ base: 14, md: 140 }} centerContent p={0}>
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
        <VStack w="full" mt={5} px={4} spacing={4}>
          <Text color="textLighter" fontSize="lg" fontWeight="bold">
            - or -
          </Text>
          <Button variant="ghost" w="full" size="lg" onClick={onGuestWarnOpen}>
            Continue as Guest
          </Button>
        </VStack>
        <Modal isOpen={isGuestWarnOpen} onClose={onGuestWarnClose} isCentered size="lg">
          <ModalOverlay />
          <ModalContent
            borderRadius={10}
            bg="bgLighter"
            border="1px solid"
            borderColor="containerBorder"
            boxShadow="shadow"
            pb={4}
          >
            <ModalHeader>
              <Text>About guest mode</Text>
            </ModalHeader>
            <ModalCloseButton borderRadius={10} />
            <ModalBody py={4}>
              <VStack align="flex-start" spacing={4}>
                <HStack spacing={3}>
                  <Center borderRadius="100px" w={6} h={6} bg="green.500">
                    <Icon as={FiCheck} strokeWidth={3} />
                  </Center>
                  <Text fontWeight="bold">All features of wrighter</Text>
                </HStack>
                <HStack spacing={3}>
                  <Center borderRadius="100px" w={6} h={6} bg="green.500">
                    <Icon as={FiCheck} strokeWidth={3} />
                  </Center>
                  <Text fontWeight="bold">Persistent single browser sync</Text>
                </HStack>
                <HStack spacing={3}>
                  <Center borderRadius="100px" w={6} h={6} bg="errorRed">
                    <Icon as={FiX} strokeWidth={3} />
                  </Center>
                  <Text fontWeight="bold">Persistent cloud sync</Text>
                </HStack>
                <HStack spacing={3}>
                  <Center borderRadius="100px" w={6} h={6} bg="errorRed">
                    <Icon as={FiX} strokeWidth={3} />
                  </Center>
                  <Text fontWeight="bold">Access all your data on multiple devices</Text>
                </HStack>
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button w="full" fontWeight="bold" as="a" href="/wrights">
                Ok, Continue!
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Container>
    </Container>
  );
}
