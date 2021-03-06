// @ts-ignore
import remarkFigureCaption from "@microflash/remark-figure-caption";
import type { BytemdPlugin } from "bytemd";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";
import { turndownService } from "../services/turndownService";

export const autoLinkHeadingsPlugin = (): BytemdPlugin => {
  return { rehype: (processor) => processor.use(rehypeSlug).use(rehypeAutolinkHeadings, { behavior: "append" }) };
};

export const figCaptionPlugin = (): BytemdPlugin => {
  return { remark: (processor) => processor.use(remarkFigureCaption) };
};

export const pastePlugin = ({ injectCM = false }: { injectCM?: boolean }): BytemdPlugin => {
  return {
    editorEffect(ctx) {
      // injecting the whole editor instance in window and using it feels illegal... but it works so... ¯\_(ツ)_/¯
      if (window && injectCM) {
        console.log("cm window set");
        window["cm"] = ctx;
      }
      ctx.editor.on("copy", (cm, event) => {
        if (cm.getSelection()) {
          event.clipboardData?.setData("text/plain", turndownService.escape(cm.getSelection()));
        }
      });
      ctx.editor.on("paste", (cm, event) => {
        // event.preventDefault();
        if (event) {
          const htmlText = event?.clipboardData?.getData("text/html") || "";
          const normalText = event?.clipboardData?.getData("text/plain") || "";

          const finalTextToPaste = (() => {
            const token = ctx.editor.getTokenAt(ctx.editor.getCursor());
            if (token.state?.overlay?.code || token.state?.overlay?.codeBlock) {
              return normalText;
            }
            if (htmlText.trim().length > 0) {
              return turndownService.turndown(htmlText);
            }

            return normalText;
          })();

          if (!cm.somethingSelected()) {
            cm.replaceRange(finalTextToPaste, cm.getCursor());
          } else {
            cm.replaceSelection(finalTextToPaste);
          }
        }
        event.preventDefault();
      });

      return () => {
        if (window && injectCM) {
          window.cm = null;
          console.log("cm window destroy");
        }
      };
    },
  };
};
