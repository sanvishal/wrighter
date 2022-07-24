import { useColorMode } from "@chakra-ui/react";

export const GrainyTexture = () => {
  const { colorMode } = useColorMode();

  return (
    <svg
      id="texture"
      className={colorMode === "dark" ? "dark-tex" : "light-tex"}
      style={{
        display: "none", // for now
        filter: colorMode === "dark" ? "contrast(600%) brightness(40%)" : "brightness(100%)",
      }}
    >
      <filter id="noise">
        <feTurbulence type="fractalNoise" baseFrequency="0.80" numOctaves="4" stitchTiles="stitch"></feTurbulence>
        <feColorMatrix type="saturate" values="0"></feColorMatrix>
      </filter>
      <rect width="100%" height="100%" filter="url(#noise)"></rect>
    </svg>
  );
};
