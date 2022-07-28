import { ChakraProvider } from "@chakra-ui/react";
import "bytemd/dist/index.css";
import "highlight.js/styles/default.css";
import "katex/dist/katex.css";
import type { AppProps } from "next/app";
import Router from "next/router";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { useState } from "react";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { QueryClient, QueryClientProvider } from "react-query";
import { BitesProvider } from "../contexts/BitesContext";
import { TagsProvider } from "../contexts/TagsContext";
import { UserProvider } from "../contexts/UserContext";
import "../styles/calender.scss";
import "../styles/cmdbar.scss";
import "../styles/editor.scss";
import "../styles/globals.css";
import { theme } from "../theme";

Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

function MyApp({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider theme={theme}>
        {/* <GrainyTexture /> */}
        <UserProvider>
          <TagsProvider>
            <BitesProvider>
              <Component {...pageProps} />
            </BitesProvider>
          </TagsProvider>
        </UserProvider>
      </ChakraProvider>
    </QueryClientProvider>
  );
}

export default MyApp;
