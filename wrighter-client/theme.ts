import { extendTheme, ThemeConfig } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";

const themeConfig: ThemeConfig = {
  initialColorMode: "light",
  disableTransitionOnChange: false,
  useSystemColorMode: true,
};

export const theme = extendTheme({
  config: themeConfig,
  fonts: {
    body: "Avenir LT Std",
    heading: "Avenir LT Std",
  },
  styles: {
    global: (props: any) => ({
      body: {
        bg: mode("#fbfbfb", "#222326")(props),
        color: mode("#2b292e", "#dddddf")(props),
      },
    }),
  },
  components: {
    Button: {
      variants: {
        solid: (props: any) => ({
          color: mode("#ffffff", "#292a2e")(props),
          backgroundColor: "var(--chakra-colors-accentColor)",
          fontWeight: "700",
          borderRadius: "12px",
          _hover: {
            color: mode("#ffffff", "#292a2e")(props),
            backgroundColor: "var(--chakra-colors-accentColor)",
            fontWeight: "700",
            outline: "2px solid var(--chakra-colors-accentColorLight)",
            outlineOffset: "-1px",
          },
          _focus: {
            color: mode("#ffffff", "#292a2e")(props),
            backgroundColor: "var(--chakra-colors-accentColor)",
            fontWeight: "700",
            outline: "4px solid var(--chakra-colors-accentColorLight)",
            outlineOffset: "-1px",
          },
        }),
      },
    },
    Input: {
      baseStyle: (props: any) => ({
        bg: mode("#f2f2f3", "#1d1e20")(props),
        boxShadow: "none",
        field: {
          _focus: {
            bg: mode("#ffffff", "#292a2e")(props),
            borderWidth: "2px",
          },
          _invalid: {
            bg: "#8219173d",
            _focus: {
              bg: mode("#ffffff", "#292a2e")(props),
              borderColor: "#FC8181",
            },
          },
        },
      }),
      defaultProps: {
        focusBorderColor: "#62646a47",
      },
    },
  },
  semanticTokens: {
    colors: {
      accentColor: "#33BC84",
      accentColorLight: "#33BC8450",
      bgDark: { default: "#f2f2f3", _dark: "#1d1e20" },
      bgLight: { default: "#2320270d", _dark: "#494b504d" },
      bgLighter: { default: "#ffffff", _dark: "#292a2e" },
      textPlaceholder: { default: "#96939a", _dark: "#7c7d83" },
      textLight: { default: "#2b292e", _dark: "#dddddf" },
      textLighter: { default: "#6a686e", _dark: "#a6a7ab" },
    },
  },
});
