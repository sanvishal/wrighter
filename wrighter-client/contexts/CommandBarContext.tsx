/* eslint-disable react/display-name */
import { Box, Center, HStack, Text, useColorMode, VStack } from "@chakra-ui/react";
import {
  Action,
  ActionId,
  ActionImpl,
  KBarAnimator,
  KBarPortal,
  KBarPositioner,
  KBarProvider,
  KBarResults,
  KBarSearch,
  Priority,
  useKBar,
  useMatches,
} from "kbar";
import { useRouter } from "next/router";
import { forwardRef, Fragment, Ref, useEffect, useMemo } from "react";
import { FiBookOpen, FiHome, FiLogOut, FiSearch, FiSun } from "react-icons/fi";
import { TbBulb } from "react-icons/tb";
import { logout } from "../services/authService";
import { COMMAND_PARENT } from "../types";
import { useWrightsSearch } from "./CommandBarHooks/useWrightsSearch";
import { useUserContext } from "./UserContext";

const ResultItem = forwardRef(
  (
    {
      action,
      active,
      currentRootActionId,
    }: {
      action: ActionImpl;
      active: boolean;
      currentRootActionId?: ActionId | null;
    },
    ref: Ref<HTMLDivElement>
  ) => {
    const ancestors = useMemo(() => {
      if (!currentRootActionId) return action.ancestors;
      const index = action.ancestors.findIndex((ancestor) => ancestor.id === currentRootActionId);
      return action.ancestors.slice(index + 1);
    }, [action.ancestors, currentRootActionId]);

    return (
      <HStack
        ref={ref}
        p={2.5}
        cursor="pointer"
        bg={active ? "bgLighter" : "cmdbarBg"}
        justifyContent="flex-start"
        spacing={2.5}
        fontSize="lg"
      >
        {action.icon && (
          <Center
            mb={0.5}
            color="textLight"
            bg={
              !action.id.includes("miscother")
                ? action.id.includes("wright")
                  ? "accentColorTrans"
                  : "biteAccentColorTrans"
                : "bgLight"
            }
            w={{ base: 7, md: 8 }}
            h={{ base: 7, md: 8 }}
            p={1.5}
            borderRadius={8}
          >
            {action.icon}
          </Center>
        )}
        <VStack alignItems="flex-start" spacing={0}>
          <div>
            {ancestors.length > 0 &&
              ancestors.map((ancestor) => (
                <Fragment key={ancestor.id}>
                  <Text
                    as="span"
                    fontSize={{ base: "md", md: "lg" }}
                    style={{
                      opacity: 0.5,
                      marginRight: 8,
                    }}
                  >
                    {ancestor.name.length > 14 ? ancestor.name.slice(0, 14) + "…" : ancestor.name}
                  </Text>
                  <span
                    style={{
                      marginRight: 8,
                    }}
                  >
                    &rsaquo;
                  </span>
                </Fragment>
              ))}
            <Text as="span" fontSize={{ base: "md", md: "lg" }}>
              {action.name}
            </Text>
          </div>
          {action.subtitle && (
            <Text as="span" fontSize={{ base: "xs", md: "sm" }} color="textLighter">
              {action.subtitle}
            </Text>
          )}
        </VStack>
      </HStack>
    );
  }
);

function RenderResults() {
  const { results, rootActionId } = useMatches();

  return (
    <KBarResults
      items={results}
      onRender={({ item, active }) => {
        // console.log(item, active);
        if (typeof item === "string") {
          return (
            <Box bg="cmdbarBg">
              <Text
                color="textLighter"
                fontWeight="800"
                casing="uppercase"
                opacity={0.4}
                fontSize={{ base: "11px", md: "xs" }}
                px={2}
              >
                {item}
              </Text>
            </Box>
          );
        }
        return <ResultItem action={item} active={active} currentRootActionId={rootActionId} />;
      }}
    />
  );
}

export const ActionsProvider = ({ children }: { children: React.ReactNode }) => {
  // useWrightsSearch();

  return (
    <>
      <KBarPortal>
        <KBarPositioner className="cmd-bar" style={{ zIndex: "10000" }}>
          <KBarAnimator
            style={{
              border: "1px solid var(--chakra-colors-containerBorder)",
              overflow: "hidden",
              borderRadius: "10px",
              backdropFilter: "var(--chakra-backdropFilter-cmdbarFilter)",
            }}
          >
            <KBarSearch className="cmd-bar search" />
            <RenderResults />
          </KBarAnimator>
        </KBarPositioner>
      </KBarPortal>
      {children}
    </>
  );
};

export const CommandBarProvider = ({ children }: { children: JSX.Element | JSX.Element[] }): JSX.Element => {
  const router = useRouter();
  const { isAuth } = useUserContext();

  const logoutAction = async () => {
    logout();
    router.push("/signin");
  };

  const routeActions: Action[] = [
    {
      id: "wrights-page",
      name: "Your Wrights",
      section: "Navigation",
      keywords: "writing words blog article wright markdown",
      perform: () => {
        router.push("/wrights");
      },
      icon: <FiBookOpen color="var(--chakra-colors-accentColor)" />,
      priority: Priority.LOW,
      subtitle: "all your wrightups are here",
    },
    {
      id: "bites-page",
      name: "Your Bites",
      section: "Navigation",
      keywords: "bites quick link image",
      perform: () => {
        router.push("/bites");
      },
      icon: <TbBulb color="var(--chakra-colors-biteAccentColor)" />,
      priority: Priority.LOW,
      subtitle: "jot down bite-sized thoughts and information",
    },
    {
      id: "miscother-home-page",
      name: "Home Page",
      keywords: "email",
      section: "Navigation",
      perform: () => {
        router.push("/");
      },
      icon: <FiHome />,
      priority: Priority.LOW,
      subtitle: "the landing page for wrighter",
    },
    {
      id: COMMAND_PARENT.BITE_ATTACH,
      name: "Attach bite to current wright",
      keywords: "bite wright attach put link",
      section: "Actions",
      icon: <TbBulb color="var(--chakra-colors-biteAccentColor)" />,
      priority: Priority.LOW,
      subtitle: "Attach bite to your wright you are editing right now",
    },
    {
      id: "miscother-logout",
      name: "Logout/Exit",
      keywords: "logout user exit",
      section: "Navigation",
      icon: <FiLogOut />,
      priority: Priority.LOW,
      perform: () => logoutAction(),
    },
  ];

  return (
    <KBarProvider actions={routeActions} options={{ toggleShortcut: "$mod+Shift+P", enableHistory: true }}>
      <ActionsProvider>{children}</ActionsProvider>
    </KBarProvider>
  );
};
