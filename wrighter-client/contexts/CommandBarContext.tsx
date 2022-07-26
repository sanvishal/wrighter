/* eslint-disable react/display-name */
import { Box, HStack, Text, useColorMode, VStack } from "@chakra-ui/react";
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
          <Box mb={0.5} color="textLight">
            {action.icon}
          </Box>
        )}
        <VStack alignItems="flex-start" spacing={0}>
          <div>
            {ancestors.length > 0 &&
              ancestors.map((ancestor) => (
                <Fragment key={ancestor.id}>
                  <span
                    style={{
                      opacity: 0.5,
                      marginRight: 8,
                    }}
                  >
                    {ancestor.name}
                  </span>
                  <span
                    style={{
                      marginRight: 8,
                    }}
                  >
                    &rsaquo;
                  </span>
                </Fragment>
              ))}
            <span>{action.name}</span>
          </div>
          {action.subtitle && (
            <Text as="span" fontSize="xs" color="textLighter">
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
              <Text color="textLighter" fontWeight="800" casing="uppercase" opacity={0.4} fontSize="xs" px={2}>
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
  const { isAuthenticated } = useUserContext();
  const { setColorMode, colorMode, toggleColorMode } = useColorMode();

  const routeActions: Action[] = [
    {
      id: "wrights-page",
      name: "Your Wrights",
      section: "Navigation",
      keywords: "writing words blog article wright markdown",
      perform: () => {
        router.push("/wrights");
      },
      icon: <FiBookOpen />,
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
      icon: <TbBulb />,
      priority: Priority.LOW,
      subtitle: "jot down bite-sized thoughts and information",
    },
    {
      id: "home-page",
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
      id: "logout",
      name: "Logout/Exit",
      keywords: "logout user exit",
      section: "Navigation",
      icon: <FiLogOut />,
      priority: Priority.LOW,
      perform: () => {
        if (!isAuthenticated()) {
          router.push("/signin");
        } else {
          logout();
        }
      },
    },
  ];

  return (
    <KBarProvider actions={routeActions} options={{ toggleShortcut: "$mod+/" }}>
      <ActionsProvider>{children}</ActionsProvider>
    </KBarProvider>
  );
};
