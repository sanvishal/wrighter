import { GTAG } from "../constants";
import Script from "next/script";

export default function Gtag() {
  return (
    <Script strategy="lazyOnload" src={`https://www.googletagmanager.com/gtag/js?id=${GTAG}`} />
  );
}