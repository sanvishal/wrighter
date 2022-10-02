import {
  Box,
  Button,
  Center,
  Container,
  HStack,
  Icon,
  IconButton,
  Stack,
  Text,
  useColorMode,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { NextPage } from "next";
import Head from "next/head";
import { FaICursor } from "react-icons/fa";
import {
  FiBookOpen,
  FiCalendar,
  FiCloud,
  FiCloudOff,
  FiCode,
  FiCommand,
  FiCornerRightDown,
  FiDownloadCloud,
  FiEdit,
  FiEye,
  FiGift,
  FiGlobe,
  FiHash,
  FiKey,
  FiMoon,
  FiMousePointer,
  FiPhone,
  FiStar,
  FiSun,
} from "react-icons/fi";
import {
  TbBulb,
  TbCode,
  TbCommand,
  TbDeviceMobile,
  TbEdit,
  TbKeyboard,
  TbMarkdown,
  TbMath,
  TbMathFunction,
  TbPeace,
  TbSmartHome,
  TbUserX,
} from "react-icons/tb";
import { GrainyTexture } from "../components/GrainyTexture";
import { GuestWarn } from "../components/GuestWarn";
import Logo from "../components/Logo";

const FeatureCard = ({
  icon,
  title,
  description,
  bg = "bgLight",
  link = "",
}: {
  icon: JSX.Element;
  title: string;
  description: string;
  bg?: string;
  link?: string;
}) => {
  return (
    <Box
      p={4}
      borderRadius={12}
      h="150px"
      w="290px"
      bg={bg}
      pr={3}
      shadow="base"
      as={link ? "a" : "div"}
      // @ts-ignore
      target="_blank"
      href={link || "#"}
    >
      <HStack alignItems="flex-start" spacing={3}>
        <Center p={2} bg="bg" borderRadius={8} w={10} h={10}>
          {icon}
        </Center>
        <VStack alignItems="flex-start" spacing={1}>
          <Text fontSize="20px" fontWeight="bold" lineHeight={1.3}>
            {title}
          </Text>
          <Text fontSize="15px" opacity={0.7} fontWeight="bold">
            {description}
          </Text>
        </VStack>
      </HStack>
    </Box>
  );
};

const Home: NextPage = () => {
  const { isOpen: isGuestWarnOpen, onOpen: onGuestWarnOpen, onClose: onGuestWarnClose } = useDisclosure();
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <>
      <Head>
        <title>wrighter</title>
      </Head>
      <GrainyTexture />
      <Box pos="absolute" top="0" left="0" w="full" h="150vh" id="waves-bg-overlay" zIndex="-1"></Box>
      <Box pos="absolute" top="0" left="0" w="full" h="150vh" id="waves-bg" zIndex="-2"></Box>
      <Container maxW="8xl">
        <Stack
          w="full"
          justifyContent={{ md: "space-between", base: "none" }}
          alignItems={{ base: "center", md: "none" }}
          pt={4}
          flexDir={{ base: "column", md: "row" }}
        >
          <HStack w="50px" h="50px" spacing={3} justifyContent={{ md: "flex-start", base: "center" }}>
            <Box>
              <Logo />
            </Box>
            <Text fontWeight="800" fontSize="xl">
              wrighter
            </Text>
          </HStack>
          <HStack spacing={4}>
            <IconButton
              variant="ghost"
              icon={colorMode === "dark" ? <FiSun /> : <FiMoon />}
              aria-label="theme toggle"
              onClick={toggleColorMode}
            />
            <Button as="a" fontWeight="800" href="/signin">
              Log In
            </Button>
            <Box bg="bg">
              <Button fontWeight="800" onClick={onGuestWarnOpen} variant="ghost">
                Guest Mode
              </Button>
            </Box>
          </HStack>
        </Stack>
        <VStack mt={{ base: 14, md: 24 }} w="full" textAlign="center" spacing={1}>
          <Text fontSize={{ base: "md", md: "x-large" }} color="textLighter" fontWeight="bold">
            Your new favourite markdown editor
          </Text>
          <Text fontSize={{ base: "xx-large", md: "5rem" }} fontWeight={800} lineHeight={1}>
            Minimal yet powerful writing companion
          </Text>
          <Box h={8} />
          <Button size="lg" as="a" fontWeight="800" href="/signin">
            Start Wrighting!
          </Button>
          <Text fontSize="lg" color="textLighter" pt={8}>
            or
          </Text>
          <Button size="lg" fontWeight="800" variant="ghost" onClick={onGuestWarnOpen}>
            Start as a Guest
          </Button>
          <Text color="textLighter" fontSize="md">
            (no signup required)
          </Text>
        </VStack>
        <Center w="full" role="group" pos="relative" className="landing-img-cont">
          <Text
            display={{ base: "none", md: "block" }}
            fontSize="6rem"
            pos="absolute"
            fontWeight="800"
            color="textLighter"
            opacity={0.15}
            zIndex={-1}
            top="-20px"
            right="-40%"
            w="full"
            transform="rotate(-90deg)"
          >
            The Wrighter
          </Text>
          <Box _groupHover={{ opacity: "0" }} opacity="1" pos="absolute" top="0" mt={10} transition="opacity 0.17s ease-in-out">
            <HStack w="full" justifyContent="space-between">
              <HStack>
                <Text fontSize={{ md: "xx-large", base: "large" }} fontWeight="800" color="textLight">
                  Editor
                </Text>
                <Icon as={FiCornerRightDown} />
              </HStack>
              <HStack opacity={0.6}>
                <Text color="textLighter">(hover me)</Text>
                <Icon as={FiMousePointer} color="textLighter" width="0.9em" height="0.9em" />
              </HStack>
            </HStack>
            <img
              src={colorMode === "dark" ? "editor-d.png" : "editor-l.png"}
              alt="wrighter editor"
              style={{ borderRadius: "10px", zIndex: 1, boxShadow: "var(--chakra-shadows-lg)" }}
            />
          </Box>
          <Box _groupHover={{ opacity: "1" }} opacity="0" pos="absolute" top="0" mt={10} transition="opacity 0.17s ease-in-out">
            <HStack w="full" justifyContent="space-between">
              <HStack>
                <Text fontSize={{ md: "xx-large", base: "large" }} fontWeight="800" color="textLight">
                  Viewer
                </Text>
                <Icon as={FiCornerRightDown} />
              </HStack>
              <HStack opacity={0.6}>
                <Text color="textLighter">(hover me)</Text>
                <Icon as={FiMousePointer} color="textLighter" width="0.9em" height="0.9em" />
              </HStack>
            </HStack>
            <img
              src={colorMode === "dark" ? "viewer-d.png" : "viewer-l.png"}
              alt="wrighter viewer"
              style={{ borderRadius: "10px", zIndex: 1, boxShadow: "var(--chakra-shadows-lg)" }}
            />
          </Box>
        </Center>
        <VStack mt={{ md: 5, base: 10 }} alignItems="flex-start" pos="relative">
          <Text fontWeight="bold" fontSize={{ md: "xxx-large", base: "xx-large" }} lineHeight={1}>
            Your <span style={{ opacity: 0.25 }}>**</span>
            <span style={{ fontWeight: "900" }}>next writing companion,</span>
            <span style={{ opacity: 0.25 }}>**</span>
          </Text>
          <Text fontSize={{ md: "xxx-large", base: "xx-large" }} fontWeight="bold" lineHeight={1}>
            feature packed!
          </Text>
          <Text
            display={{ base: "none", md: "block" }}
            fontSize="6rem"
            pos="absolute"
            fontWeight="800"
            color="textLighter"
            opacity={0.15}
            zIndex={-1}
            top="600px"
            left="-57%"
            w="full"
            transform="rotate(-270deg)"
          >
            The Features
          </Text>
        </VStack>
        <Stack
          mt={10}
          w="full"
          columnGap={10}
          rowGap={6}
          justifyContent="center"
          alignItems="center"
          flexDir={{ base: "column", md: "row" }}
          spacing={0}
          wrap="wrap"
        >
          <FeatureCard
            title="Wrights"
            link="https://wrighter.vercel.app/wright/introducing-wrighter-a-powerful-markdown-blogger-and-a-writing-companion-6J96hd6t0pyy8wDFlkZUI0#the-wrights-aka-your-blogs"
            icon={<Icon as={FiBookOpen} width="1.5em" height="1.5em" color="accentColor" />}
            bg="accentColorTransLighter"
            description="wrights are your markdown articles written with wrighter's powerful editor"
          />
          <FeatureCard
            title="Bites"
            link="https://wrighter.vercel.app/wright/introducing-wrighter-a-powerful-markdown-blogger-and-a-writing-companion-6J96hd6t0pyy8wDFlkZUI0#the-bites-aka-your-ideas"
            icon={<Icon as={TbBulb} width="1.6em" height="1.6em" color="biteAccentColor" />}
            bg="biteAccentColorTransLighter"
            description="bites are short blob of information(links, images, markdown snippets) that you can jot down anytime"
          />
          <FeatureCard
            title="Wrighter Editor"
            link="https://wrighter.vercel.app/wright/introducing-wrighter-a-powerful-markdown-blogger-and-a-writing-companion-6J96hd6t0pyy8wDFlkZUI0#about-wrighter"
            icon={<Icon as={TbEdit} width="1.6em" height="1.6em" color="successGreen" />}
            bg="successGreenTransBg"
            description="powerful WYSIWYM(what you see is what you mean) markdown editor, designed for productivty"
          />
          <FeatureCard
            link="https://wrighter.vercel.app/wright/introducing-wrighter-a-powerful-markdown-blogger-and-a-writing-companion-6J96hd6t0pyy8wDFlkZUI0#about-wrighter"
            title="Command Bar"
            icon={<Icon as={FiCommand} width="1.5em" height="1.5em" color="textLight" />}
            description="central command bar to control wrighter in a few keystrokes (Ctrl/⌘+Shift+P), can't find it? just search for it!"
          />
        </Stack>
        <Stack
          mt={16}
          w="full"
          columnGap={10}
          rowGap={6}
          justify="center"
          alignItems="center"
          flexDir={{ base: "column", md: "row" }}
          spacing={0}
          wrap="wrap"
        >
          <FeatureCard
            title="Extremely Reliable"
            icon={<Icon as={FiCloud} width="1.5em" height="1.5em" color="textLight" />}
            description="you can signup to wrighter, it autosaves regularly both on device and cloud, preventing data loss"
          />
          <FeatureCard
            title="Optional Signup"
            icon={<Icon as={FiCloudOff} width="1.5em" height="1.5em" color="textLight" />}
            description="you can use wrighter without even signing up, no data leaves your browser, super private"
          />
          <FeatureCard
            title="Tagging"
            icon={<Icon as={FiHash} width="1.5em" height="1.5em" color="textLight" />}
            description="use tags to organize your content and easily find them through the content tree"
          />
          <FeatureCard
            title="Attach Bite in Wright"
            icon={<Icon as={TbBulb} width="1.6em" height="1.6em" color="textLight" />}
            description="attach/embed your bites in the wrights using the command bar"
          />
          <FeatureCard
            title="GFM & KaTeX"
            icon={<Icon as={TbMathFunction} width="1.5em" height="1.5em" color="textLight" />}
            description="wrighter supports both GFM and KaTeX syntax for formatting & scientific writing"
          />
          <FeatureCard
            title="Mobile Friendly"
            icon={<Icon as={TbDeviceMobile} width="1.5em" height="1.5em" color="textLight" />}
            description="wrighter is designed to be mobile friendly, so you can use it anywhere, anytime on any device"
          />
          <FeatureCard
            title="Themes"
            icon={<Icon as={FiSun} width="1.5em" height="1.5em" color="textLight" />}
            description="wrighter has dark/light modes, you can switch anytime whenever you prefer"
          />
          <FeatureCard
            title="Publish a Wright"
            icon={<Icon as={FiGlobe} width="1.5em" height="1.5em" color="textLight" />}
            description="write and publish wrights and share them with the world with an SEO friendly URL"
          />
          <FeatureCard
            title="The Viewer"
            icon={<Icon as={FiEye} width="1.5em" height="1.5em" color="textLight" />}
            description="published wrights are designed for cosy reading, minimal design and maximal functionality"
          />
          <FeatureCard
            title="Minimal UI"
            icon={<Icon as={FiStar} width="1.5em" height="1.5em" color="textLight" />}
            description="wrighter's design system & colors are creafted with simplicity and minimalism in mind"
          />
          <FeatureCard
            title="Smart Commands"
            icon={<Icon as={FiCommand} width="1.5em" height="1.5em" color="textLight" />}
            description="command bar knows what you want to search and gives suggestions based on the context"
          />
          <FeatureCard
            title="Handy Shortcuts"
            icon={<Icon as={TbKeyboard} width="1.5em" height="1.5em" color="textLight" />}
            description="you can use shortcuts used in other editors in the wrighter editor and it will just work"
          />
          <FeatureCard
            title="Code Highlighting"
            icon={<Icon as={TbCode} width="1.5em" height="1.5em" color="textLight" />}
            description="wrighter supports syntax highlighting for all common programming languages"
          />
          <FeatureCard
            title="Focus Mode"
            icon={<Icon as={TbPeace} width="1.5em" height="1.5em" color="textLight" />}
            description="focus mode allows you to write without any kind of distractions"
          />
          <FeatureCard
            title="Export anytime"
            icon={<Icon as={FiDownloadCloud} width="1.5em" height="1.5em" color="textLight" />}
            description="you can download your wrights at anytime you want as markdown"
          />
          <FeatureCard
            title="...and more features"
            icon={<Icon as={FiGift} width="1.5em" height="1.5em" color="textLight" />}
            description="even more features to make ideation & writing easier and faster for you"
          />
        </Stack>
        <VStack mt={20} mb={12}>
          <Text fontSize={{ base: "x-large", md: "xx-large" }} textAlign="center">
            Start wrighting right now with this instant link ⚡
          </Text>
          <Text
            bg="bgLighter"
            variant="unstyled"
            fontSize={{ base: "x-large", md: "xx-large" }}
            fontWeight="bold"
            p={1}
            borderRadius={10}
            px={3}
            as="a"
            href="https://wrighter.vercel.app/new"
            target="_blank"
          >
            <Text as="span" color="textLighter" opacity="0.6">
              wrighter.vercel.app
            </Text>
            <Text as="span">/new</Text>
          </Text>
        </VStack>
        <Text fontWeight="800" w="full" textAlign="center" color="textLighter" pt={6} pb={5} fontSize={{ base: "md", md: "lg" }}>
          made by
          <Text as="a" href="https://twitter.com/tk_vishal_tk" target="_blank" ml={1} color="biteAccentColor" mr={2}>
            Vishal TK.
          </Text>
          Read more about it
          <Text
            as="a"
            href="https://wrighter.vercel.app/wright/introducing-wrighter-a-powerful-markdown-blogger-and-a-writing-companion-6J96hd6t0pyy8wDFlkZUI0"
            target="_blank"
            ml={1}
            mr={1}
            color="biteAccentColor"
          >
            here
          </Text>
          or
          <Text
            as="a"
            href="https://vishaltk.hashnode.dev/introducing-wrighter-a-powerful-markdown-blogger-a-writing-companion"
            target="_blank"
            ml={1}
            color="biteAccentColor"
          >
            here
          </Text>
        </Text>
        <Center mb={6}>
          <a
            href="https://www.producthunt.com/posts/wrighter?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-wrighter"
            target="_blank"
            rel="noreferrer"
          >
            <img
              src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=358140&theme=neutral"
              alt="Wrighter - A&#0032;modern&#0032;markdown&#0032;editor&#0032;&#0038;&#0032;writing&#0032;companion | Product Hunt"
              style={{ width: "250px", height: "54px" }}
              width="250"
              height="54"
            />
          </a>
        </Center>
        <GuestWarn isOpen={isGuestWarnOpen} onClose={onGuestWarnClose} />
      </Container>
    </>
  );
};

export default Home;
