import { Action, Priority, useKBar, useRegisterActions } from "kbar";
import compact from "lodash.compact";
import { useRouter } from "next/router";
import { useMemo } from "react";
import { FiBook, FiBookOpen, FiEdit, FiEdit2, FiEye, FiSearch } from "react-icons/fi";
import { WrightIDB } from "../../services/dbService";
import { useGetAllWrights } from "../../services/wrightService";
import { COMMAND_PARENT, Wright } from "../../types";
import { useUserContext } from "../UserContext";

export const useWrightsSearch = (createWrightHandler: () => void) => {
  const { isAuthenticated } = useUserContext();
  const router = useRouter();

  const { data: wrights, isFetching } = useGetAllWrights(!isAuthenticated());

  const { actions: kBarActions } = useKBar(({ actions }) => {
    // if ("wrights-search" in actions) {
    //   const uniqueChildrenActions = actions["wrights-search"].children.reduce((unique: ActionImpl[], o) => {
    //     if (!unique.some((obj) => obj.id === o.id)) {
    //       unique.push(o);
    //     }
    //     return unique;
    //   }, []);
    //   actions["wrights-search"].children = compact(uniqueChildrenActions);
    // }
    return { actions };
  });

  const createWrightActions = (wright: Wright | WrightIDB): Action[] => {
    const parentAction: Action = {
      parent: COMMAND_PARENT.WRIGHT_SEARCH,
      id: wright.id || "",
      name: wright.title || "",
      keywords: wright.head || "",
      icon: <FiBook />,
    };
    return [
      parentAction,
      {
        parent: parentAction.id,
        id: "edit" + parentAction.id,
        name: "Edit",
        icon: <FiEdit />,
        perform: () => {
          router.push(`/wrighting?id=${parentAction.id}`);
        },
      },
      {
        parent: parentAction.id,
        id: "preview" + parentAction.id,
        name: "Preview",
        icon: <FiEye />,
        perform: () => {
          if (wright.isPublic) {
            window.open("/wright/" + wright.slug + "-" + wright.id, "_blank");
          } else {
            window.open(`/wright?id=${wright.id}`, "_blank");
          }
        },
      },
    ];
  };

  const actions = useMemo(() => {
    if (!isFetching && wrights) {
      if (COMMAND_PARENT.WRIGHT_SEARCH in kBarActions) {
        const existingChildren = kBarActions[COMMAND_PARENT.WRIGHT_SEARCH].children;
        const allWrightActions: Action[] = [];

        wrights.forEach((wright) => {
          if (!existingChildren.some((child) => child.id === wright.id)) {
            allWrightActions.push(...createWrightActions(wright));
          }
        });

        return allWrightActions;
      }
      return [];
    }
    return [];
  }, [wrights, isFetching, router.pathname]);

  useRegisterActions(
    [
      {
        id: COMMAND_PARENT.WRIGHT_SEARCH,
        name: "Search Wrights",
        keywords: "search wrights list query all",
        section: "Search",
        icon: <FiSearch />,
        priority: Priority.LOW,
      },
      ...actions,
      {
        id: "create-wright",
        name: "Create New Wright",
        keywords: "create new wright",
        section: "Actions",
        icon: <FiBookOpen />,
        priority: Priority.LOW,
        perform: () => {
          createWrightHandler();
        },
      },
    ],
    [actions]
  );
};
