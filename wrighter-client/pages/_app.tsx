import "../styles/globals.css";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ChakraProvider } from "@chakra-ui/react";

import { verifyJWT } from "../services/authService";
import { theme } from "../theme";

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    // run auth check on initial load
    authCheck(router.asPath);

    // set authorized to false to hide page content while changing routes
    const hideContent = () => setAuthorized(false);
    router.events.on("routeChangeStart", hideContent);

    // run auth check on route change
    router.events.on("routeChangeComplete", authCheck);

    // unsubscribe from events in useEffect return function
    return () => {
      router.events.off("routeChangeStart", hideContent);
      router.events.off("routeChangeComplete", authCheck);
    };
  }, []);

  const authCheck = (url: string) => {
    // redirect to login page if accessing a private page and not logged in
    const publicPaths = ["/"];
    const path = url.split("?")[0];
    // if (!userService.userValue && !publicPaths.includes(path)) {
    //   setAuthorized(false);
    //   router.push({
    //     pathname: "/",
    //     query: { returnUrl: router.asPath },
    //   });
    // } else {
    //   setAuthorized(true);
    // }
    console.log(verifyJWT(), pageProps);
  };

  return (
    <ChakraProvider theme={theme}>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}

export default MyApp;
