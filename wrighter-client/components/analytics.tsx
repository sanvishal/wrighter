import { GTAG } from "../constants";
import Script from "next/script";

export default function Analytics() {
  return (
    <Script strategy="lazyOnload" id="ga">
      {`
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', ${GTAG}, {
                    page_path: window.location.pathname,
                    });
                `}
    </Script>
  );
}