import { Action, Priority, useKBar, useRegisterActions } from "kbar";
import { FaPaintBrush } from "react-icons/fa";
import {
  FiAlignJustify,
  FiArrowRight,
  FiBold,
  FiCheck,
  FiCode,
  FiDownload,
  FiEye,
  FiImage,
  FiItalic,
  FiLink,
  FiList,
  FiMaximize,
  FiType,
} from "react-icons/fi";
import { TbMathFunction } from "react-icons/tb";

export const getShortcut = (key: string) => {
  return typeof navigator !== "undefined"
    ? navigator.platform.indexOf("Mac") > -1
      ? `⌘ + ${key}`
      : `Ctrl + ${key}`
    : `⌘ + ${key}`;
};

export const useWrightingActions = (exportHandler: () => void) => {
  const getHeadingActions = () => {
    const headingActions: Action[] = [];
    for (let i = 1; i <= 6; i++) {
      headingActions.push({
        id: `wright-heading-${i}`,
        icon: <FiType style={{ width: `${18 - i * 2}px`, height: `${18 - i * 2}px` }} color="var(--chakra-colors-accentColor)" />,
        parent: "wrighter-heading",
        name: `Heading ${i}`,
        keywords: "headings title big small" + `h${i}`,
        priority: Priority.LOW,
        perform: () => {
          if (window.cm) {
            window.cm.replaceLines((line) => {
              line = line.trim().replace(/^#*/, "").trim();
              line = "#".repeat(i) + " " + line;
              return line;
            });
            window.cm.editor.undoSelection();
          }
        },
      });
    }

    return headingActions;
  };

  const actions: Action[] = [
    {
      id: "wrighter-bold",
      name: "Bold",
      section: "Typography",
      keywords: "bold",
      icon: <FiBold color="var(--chakra-colors-accentColor)" />,
      subtitle: getShortcut("B"),
      priority: Priority.NORMAL,
      perform: () => {
        if (window.cm) {
          window.cm.wrapText("**");
        }
      },
    },
    {
      id: "wrighter-italic",
      name: "Italic",
      section: "Typography",
      priority: Priority.NORMAL,
      subtitle: getShortcut("I"),
      keywords: "italic slant oblique",
      icon: <FiItalic color="var(--chakra-colors-accentColor)" />,
      perform: () => {
        if (window.cm) {
          window.cm.wrapText("*");
        }
      },
    },
    {
      id: "wrighter-heading",
      name: "Headings",
      section: "Typography",
      keywords: "headings title big",
      icon: <FiType color="var(--chakra-colors-accentColor)" />,
      subtitle: "h1 to h6",
      priority: Priority.NORMAL,
    },
    ...getHeadingActions(),
    {
      id: "wrighter-quote",
      name: "Blockquote",
      section: "Formatting",
      keywords: "quote blockquote format",
      icon: <FiArrowRight color="var(--chakra-colors-accentColor)" />,
      subtitle: "quote a block",
      priority: Priority.NORMAL,
      perform: () => {
        if (window.cm) {
          window.cm.replaceLines((line) => "> " + line);
        }
      },
    },
    {
      id: "wrighter-link",
      name: "Add URL",
      section: "Formatting",
      keywords: "url link address",
      icon: <FiLink color="var(--chakra-colors-accentColor)" />,
      subtitle: getShortcut("K"),
      priority: Priority.NORMAL,
      perform: () => {
        if (window.cm) {
          window.cm.wrapText("[", "](url)");
          const cursor = window.cm.editor.getCursor();
          window.cm.editor.setSelection(
            window.cm.codemirror.Pos(cursor.line, cursor.ch + 2),
            window.cm.codemirror.Pos(cursor.line, cursor.ch + 5)
          );
        }
      },
    },
    {
      id: "wrighter-img",
      name: "Add Image Link",
      section: "Formatting",
      keywords: "url link address image attach",
      icon: <FiImage color="var(--chakra-colors-accentColor)" />,
      subtitle: "insert image by URL",
      priority: Priority.NORMAL,
      perform: () => {
        if (window.cm) {
          window.cm.wrapText("![", "](imgurl)");
          const cursor = window.cm.editor.getCursor();
          window.cm.editor.setSelection(
            window.cm.codemirror.Pos(cursor.line, cursor.ch + 2),
            window.cm.codemirror.Pos(cursor.line, cursor.ch + 8)
          );
        }
      },
    },
    {
      id: "wrighter-code",
      name: "Code",
      section: "Formatting",
      keywords: "code inline",
      icon: <FiCode color="var(--chakra-colors-accentColor)" />,
      subtitle: getShortcut("Shift + K"),
      priority: Priority.NORMAL,
      perform: () => {
        if (window.cm) {
          window.cm.wrapText("`");
        }
      },
    },
    {
      id: "wrighter-code-block",
      name: "Code Block",
      section: "Formatting",
      keywords: "code block language",
      icon: <FiCode color="var(--chakra-colors-accentColor)" />,
      subtitle: getShortcut("Shift + C"),
      priority: Priority.NORMAL,
      perform: () => {
        if (window.cm) {
          if (window.cm.editor.getSelection().length === 0) {
            const pos = window.cm.appendBlock("```js\n```");
            window.cm.editor.setSelection(window.cm.codemirror.Pos(pos.line, 3), window.cm.codemirror.Pos(pos.line, 5));
          } else {
            const pos = window.cm.editor.getCursor();
            window.cm.replaceLines((line) => "```js\n" + line + "\n```");
            window.cm.editor.setSelection(window.cm.codemirror.Pos(pos.line, 3), window.cm.codemirror.Pos(pos.line, 5));
          }
        }
      },
    },
    {
      id: "wrighter-ul",
      name: "Unordered List Item",
      section: "Formatting",
      keywords: "item list ul unordered bulletin",
      icon: <FiList color="var(--chakra-colors-accentColor)" />,
      subtitle: getShortcut("Shift + U"),
      priority: Priority.NORMAL,
      perform: () => {
        if (window.cm) {
          window.cm.replaceLines((line) => "- " + line);
        }
      },
    },
    {
      id: "wrighter-ol",
      name: "Ordered List Item",
      section: "Formatting",
      keywords: "item list ol ordered bulletin numbering",
      icon: <FiList color="var(--chakra-colors-accentColor)" />,
      subtitle: getShortcut("Shift + O"),
      priority: Priority.NORMAL,
      perform: () => {
        if (window.cm) {
          window.cm.replaceLines((line, i) => `${i + 1}. ${line}`);
        }
      },
    },
    {
      id: "wrighter-strike",
      name: "StrikeThrough",
      section: "Formatting",
      keywords: "strike mistake dash",
      icon: <FiType color="var(--chakra-colors-accentColor)" />,
      subtitle: "strike through text",
      priority: Priority.NORMAL,
      perform: () => {
        if (window.cm) {
          window.cm.wrapText("~~");
        }
      },
    },
    {
      id: "wrighter-todo",
      name: "Add Todo Item",
      section: "Extras",
      keywords: "todo item done check",
      icon: <FiCheck color="var(--chakra-colors-accentColor)" />,
      subtitle: "add todo item",
      priority: Priority.NORMAL,
      perform: () => {
        if (window.cm) {
          window.cm.replaceLines((line) => "- [ ] " + line);
        }
      },
    },
    {
      id: "wrighter-table",
      name: "Add Table",
      section: "Extras",
      keywords: "table data columns rows",
      icon: <FiAlignJustify color="var(--chakra-colors-accentColor)" />,
      subtitle: "adds a table",
      priority: Priority.NORMAL,
      perform: () => {
        if (window.cm) {
          const { line } = window.cm.appendBlock(`| heading |  |\n| --- | --- |\n|  |  |\n`);
          window.cm.editor.setSelection(window.cm.codemirror.Pos(line, 2), window.cm.codemirror.Pos(line, 2 + "heading".length));
        }
      },
    },
    {
      id: "wrighter-formula-inline",
      name: "Inline Formula",
      section: "Extras",
      keywords: "math formula katex inline",
      icon: <TbMathFunction color="var(--chakra-colors-accentColor)" />,
      subtitle: "KaTeX inline formula",
      priority: Priority.NORMAL,
      perform: () => {
        if (window.cm) {
          window.cm.wrapText("$");
        }
      },
    },
    {
      id: "wrighter-formula-block",
      name: "Formula Block",
      section: "Extras",
      keywords: "math formula katex block",
      icon: <TbMathFunction color="var(--chakra-colors-accentColor)" />,
      subtitle: "KaTeX block formula",
      priority: Priority.NORMAL,
      perform: () => {
        if (window.cm) {
          const { line } = window.cm.appendBlock("$$\n\\TeX\n$$");
          window.cm.editor.setSelection(window.cm.codemirror.Pos(line + 1, 0), window.cm.codemirror.Pos(line + 1, 4));
        }
      },
    },
    {
      id: "wrighter-bold-sentence",
      name: "Make Paragraph bold",
      section: "Extras",
      keywords: "bold text paragraph",
      icon: <FiBold color="var(--chakra-colors-accentColor)" />,
      subtitle: "makes a the current paragraph bold",
      priority: Priority.NORMAL,
      perform: () => {
        if (window.cm) {
          window.cm.replaceLines((line) => {
            return `**${line.trim()}**`;
          });
          window.cm.editor.undoSelection();
        }
      },
    },
    {
      id: "wrighter-fullscreen",
      name: "Focus Mode",
      section: "This Wright",
      keywords: "focus mode fullscreen distraction",
      icon: <FiMaximize color="var(--chakra-colors-accentColor)" />,
      subtitle: "Go to Focus mode",
      priority: Priority.NORMAL,
      perform: () => {
        if (window.cm) {
          // hackiest piece of code ever
          // @ts-ignore
          document.querySelector('.bytemd-toolbar-right > [bytemd-tippy-path="4"]')?.click?.();
        }
      },
    },
    {
      id: "wrighter-export",
      name: "Export as MD",
      section: "This Wright",
      keywords: "export download markdown blog import",
      icon: <FiDownload color="var(--chakra-colors-accentColor)" />,
      subtitle: "Download this wright as markdown",
      priority: Priority.NORMAL,
      perform: () => {
        exportHandler();
      },
    },
    {
      id: "wrighter-preview",
      name: "Preview",
      section: "This Wright",
      keywords: "preview toggle write markdown",
      icon: <FiEye color="var(--chakra-colors-accentColor)" />,
      subtitle: "toggle the preview pane",
      priority: Priority.NORMAL,
      perform: () => {
        if (window.cm) {
          // hackiest piece of code ever
          // @ts-ignore
          document.querySelector('.bytemd-toolbar-right > [bytemd-tippy-path="3"]')?.click?.();
        }
      },
    },
  ];

  useRegisterActions(actions);
};
