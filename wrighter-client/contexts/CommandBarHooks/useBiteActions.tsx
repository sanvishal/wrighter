import { useToast } from "@chakra-ui/react";
import { Action, ActionImpl, Priority, useKBar, useRegisterActions } from "kbar";
import compact from "lodash.compact";
import { useRouter } from "next/router";
import { useEffect, useMemo } from "react";
import { FiImage, FiLink, FiPlus } from "react-icons/fi";
import { TbBulb, TbMarkdown } from "react-icons/tb";
import { Toaster } from "../../components/Toaster";
import { BiteType, COMMAND_PARENT } from "../../types";
import { useBitesContext } from "../BitesContext";
import { useUserContext } from "../UserContext";

const getIconForBite = (type: BiteType) => {
  switch (type) {
    case BiteType.LINK:
      return <FiLink color="var(--chakra-colors-biteAccentColor)" />;
    case BiteType.IMAGE:
      return <FiImage color="var(--chakra-colors-biteAccentColor)" />;
    case BiteType.TEXT:
      return <TbMarkdown color="var(--chakra-colors-biteAccentColor)" />;
    default:
      return <TbBulb color="var(--chakra-colors-biteAccentColor)" />;
  }
};

export const useBiteActions = () => {
  const { onCreateBiteOpen, bites, isBitesLoading } = useBitesContext();
  const router = useRouter();
  const toast = useToast();

  const { actions: kBarActions } = useKBar(({ actions }) => {
    if (COMMAND_PARENT.BITE_ATTACH in actions) {
      // brute force way to remove duplicate actions :(
      const uniqueChildrenActions = actions[COMMAND_PARENT.BITE_ATTACH].children.reduce((unique: ActionImpl[], o) => {
        if (!unique.some((obj) => obj.id === o.id)) {
          unique.push(o);
        }
        return unique;
      }, []);
      actions[COMMAND_PARENT.BITE_ATTACH].children = compact(uniqueChildrenActions);
    }
    return { actions };
  });

  useEffect(() => {
    if (router.pathname.includes("/wrighting")) {
      if (COMMAND_PARENT.BITE_ATTACH in kBarActions) {
        kBarActions[COMMAND_PARENT.BITE_ATTACH].priority = Priority.HIGH;
      }
    } else {
      if (COMMAND_PARENT.BITE_ATTACH in kBarActions) {
        kBarActions[COMMAND_PARENT.BITE_ATTACH].priority = Priority.LOW;
      }
    }
  }, [router.pathname]);

  const actions = useMemo(() => {
    if (bites) {
      if (COMMAND_PARENT.BITE_ATTACH in kBarActions) {
        const allBiteActions: Action[] = [];
        // again brute force way to remove duplicate actions :(
        kBarActions[COMMAND_PARENT.BITE_ATTACH].children = [];

        bites.forEach((bite) => {
          allBiteActions.push({
            id: bite.id,
            name: bite.title,
            icon: getIconForBite(bite.type),
            keywords: bite.tags ? bite.tags.map((t) => t.name).join(" ") : "",
            parent: COMMAND_PARENT.BITE_ATTACH,
            subtitle: bite.content.length > 70 ? bite.content.substring(0, 70) + "..." : bite.content,
            perform: () => {
              if (typeof window !== undefined && window.cm) {
                if (bite.type === BiteType.LINK) {
                  const cursor = window.cm.editor.getCursor();
                  window.cm.appendBlock(`[${bite.title}](${bite.content})`);
                  window.cm.editor.setSelection(
                    window.cm.codemirror.Pos(cursor.line + 1, cursor.ch + 1),
                    window.cm.codemirror.Pos(cursor.line + 1, cursor.ch + bite.title.length + 1)
                  );
                } else if (bite.type === BiteType.IMAGE) {
                  const cursor = window.cm.editor.getCursor();
                  window.cm.appendBlock(`![${bite.title}](${bite.content})`);
                  window.cm.editor.setSelection(
                    window.cm.codemirror.Pos(cursor.line + 1, cursor.ch + 2),
                    window.cm.codemirror.Pos(cursor.line + 1, cursor.ch + bite.title.length + 2)
                  );
                } else {
                  window.cm.appendBlock(bite.content);
                }
              } else {
                toast({
                  position: "bottom-left",
                  render: () => <Toaster message="no editor context found!" type="error" />,
                });
              }
            },
          });
        });

        return allBiteActions;
      }
      return [];
    }
    return [];
  }, [bites, isBitesLoading]);

  useRegisterActions(
    [
      {
        id: "create-bite",
        name: "Create New Bite",
        icon: <FiPlus color="var(--chakra-colors-biteAccentColor)" />,
        perform: () => onCreateBiteOpen(),
        priority: Priority.HIGH,
        keywords: "create bite quick add image link markdown text",
        section: "Actions",
      },
      ...actions,
    ],
    [actions]
  );
};
