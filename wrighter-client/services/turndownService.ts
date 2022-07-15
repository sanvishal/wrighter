import TurnDown from "turndown";
// @ts-ignore
import { gfm } from "turndown-plugin-gfm";
const baseTrundown = new TurnDown({ headingStyle: "atx", codeBlockStyle: "fenced", fence: "```" });
baseTrundown.use(gfm);
export const turndownService = baseTrundown.addRule("preRule", {
  filter: ["pre"],
  replacement: function (content) {
    return "```js\n" + content + "```";
  },
});
