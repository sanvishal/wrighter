import "../styles/globals.css";
import type { AppProps } from "next/app";
import NProgress from "nprogress";
import Router from "next/router";
import "nprogress/nprogress.css";
import { ChakraProvider } from "@chakra-ui/react";
import "bytemd/dist/index.css";
import "highlight.js/styles/default.css";
import "../styles/editor.scss";
import { verifyJWT } from "../services/authService";
import { theme } from "../theme";
import { QueryClient, QueryClientProvider } from "react-query";
import { UserProvider } from "../contexts/UserContext";
import { useEffect } from "react";

Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

function MyApp({ Component, pageProps }: AppProps) {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider theme={theme}>
        <UserProvider>
          <Component {...pageProps} />
        </UserProvider>
      </ChakraProvider>
    </QueryClientProvider>
  );
}

export default MyApp;
