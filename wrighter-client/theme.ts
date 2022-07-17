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
        color: mode("#2b292e", "#ededed")(props),
      },
    }),
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: "700",
        borderRadius: "10px",
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
    Menu: {
      parts: ["menu", "item", "list"],
      baseStyle: {
        menu: {},
        list: {
          border: "1px solid var(--chakra-colors-containerBorder)",
          background: "bgLighter",
          borderRadius: "10px",
          py: "4px",
        },
        item: {
          py: "4px",
          width: "calc(100% - 8px)",
          marginRight: "0px",
          marginLeft: "4px",
          fontWeight: "medium",
          color: "textColor",
          background: "bgLightest",
          borderRadius: "6px",
          fontSize: "0.92rem",
        },
      },
    },
    Popover: {
      parts: ["content", "arrow", "header", "footer"],
      baseStyle: {
        header: {
          paddingBottom: "12px",
          borderColor: "var(--chakra-colors-containerBorder) !important",
        },
        footer: {
          paddingTop: "12px",
          borderColor: "var(--chakra-colors-containerBorder) !important",
        },
        arrow: {
          "--popper-arrow-shadow-color": "var(--chakra-colors-containerBorder)",
          background: "var(--chakra-colors-bgLighter) !important",
        },
        content: {
          border: "1px solid var(--chakra-colors-containerBorder) !important",
          background: "bgLighter",
          borderRadius: "10px",
          py: "4px",
          boxShadow: "var(--chakra-shadows-lg)",
        },
      },
    },
  },
  semanticTokens: {
    colors: {
      accentColor: "#6261fe",
      accentColorTrans: "#6261fe20",
      bg: { default: "#fbfbfb", _dark: "#222326" },
      bgDark: { default: "#f2f2f3", _dark: "#1d1e20" },
      bgLight: { default: "#2320270d", _dark: "#494b504d" },
      bgLighter: { default: "#ffffff", _dark: "#292a2e" },
      textPlaceholder: { default: "#96939a", _dark: "#7c7d83" },
      textColorWhite: "#ededed",
      textColorBlack: "#2b292e",
      textColor: { default: "#2b292e", _dark: "#ededed" },
      textColorInvert: { default: "#ededed", _dark: "#2b292e" },
      textLight: { default: "#2b292e", _dark: "#dddddf" },
      textLighter: { default: "#6a686e", _dark: "#a6a7ab" },
      containerBorder: { default: "#e5e5e6", _dark: "#494b504d" },
      border: { default: "#ffffff", _dark: "#333438" },
      inputBorderColor: { default: "var(--chakra-colors-blackAlpha-400)", _dark: "var(--chakra-colors-whiteAlpha-300)" },
      errorRed: "#d90d17",
      errorRedTransBg: "#fe413d20",
      tooltipBg: { default: "#393b41", _dark: "#393b41" },
      shadow: { default: "0px 20px 50px #2b292e10", _dark: "0px 14px 30px #0a0a0b73" },
      // editorBg: { default: "#fbfbfb", _dark: "#222326" },
      // editorToolBarBg: { default: "#F1F0F1", _dark: "#2E3033" },
      editorToolBarBgHover: { default: "#18141f1f", _dark: "#6c6e755c" },
      editorToolBarDropDownBg: { default: "#ffffff", _dark: "#2A2A2E" },
      editorToolBarDropDownBgHover: { default: "#F5F5F5", _dark: "#333439" },
    },
  },
});
