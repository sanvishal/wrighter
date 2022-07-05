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
      baseStyle: {
        fontWeight: "700",
        borderRadius: "12px",
        _loading: {
          opacity: 0.7,
        },
        _disabled: {
          opacity: 0.5,
        },
      },
      sizes: {
        md: {
          h: "2.5rem",
        },
      },
      variants: {
        solid: (props: any) => ({
          color: "#ffffff",
          backgroundColor: "var(--chakra-colors-accentColor)",
          outline: "0px solid var(--chakra-colors-accentColorTrans)",
          _hover: {
            color: "#ffffff",
            backgroundColor: "var(--chakra-colors-accentColor)",
            outline: "2px solid var(--chakra-colors-accentColorTrans)",
            outlineOffset: "-1px",
            _disabled: {
              backgroundColor: "var(--chakra-colors-accentColor)",
              outline: "0px solid var(--chakra-colors-accentColorTrans)",
            },
            _loading: {
              backgroundColor: "var(--chakra-colors-accentColor)",
              outline: "0px solid var(--chakra-colors-accentColorTrans)",
            },
          },
          _active: {
            color: "#ffffff",
            backgroundColor: "var(--chakra-colors-accentColor)",
            outline: "2px solid var(--chakra-colors-accentColorTrans)",
            outlineOffset: "-1px",
            _disabled: {
              backgroundColor: "var(--chakra-colors-accentColor)",
              outline: "0px solid var(--chakra-colors-accentColorTrans)",
            },
            _loading: {
              backgroundColor: "var(--chakra-colors-accentColor)",
              outline: "0px solid var(--chakra-colors-accentColorTrans)",
            },
          },
          _focus: {
            color: "#ffffff",
            backgroundColor: "var(--chakra-colors-accentColor)",
            outline: "4px solid var(--chakra-colors-accentColorTrans)",
            outlineOffset: "-1px",
            _disabled: {
              backgroundColor: "var(--chakra-colors-accentColor)",
              outline: "0px solid var(--chakra-colors-accentColorTrans)",
            },
          },
        }),
        ghost: (props: any) => ({
          color: "var(--chakra-colors-textLighter)",
          backgroundColor: "var(--chakra-colors-bgLight)",
          _hover: {
            color: "var(--chakra-colors-textLighter)",
            backgroundColor: mode("#18141f1f", "#6c6e755c")(props),
          },
          _focus: {
            color: "var(--chakra-colors-textLighter)",
            backgroundColor: mode("#18141f1f", "#6c6e755c")(props),
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
      accentColor: "#6261fe",
      accentColorTrans: "#6261fe50",
      bgDark: { default: "#f2f2f3", _dark: "#1d1e20" },
      bgLight: { default: "#2320270d", _dark: "#494b504d" },
      bgLighter: { default: "#ffffff", _dark: "#292a2e" },
      textPlaceholder: { default: "#96939a", _dark: "#7c7d83" },
      textLight: { default: "#2b292e", _dark: "#dddddf" },
      textLighter: { default: "#6a686e", _dark: "#a6a7ab" },
    },
  },
});
