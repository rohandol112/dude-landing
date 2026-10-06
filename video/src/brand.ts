import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

/** Colours from the site's tokens (src/index.css) so the videos sit flush on the page. */
export const brand = {
  yellow: "#FED900",
  ink: "#0A0B0C",
  paper: "#FCFCFB",
  sky: "#CFE6F7",
  mist: "#EEF4F8",
} as const;

export const fontFamily = "Google Sans";

// Same variable font file the site ships (@fontsource-variable/google-sans).
loadFont({
  family: fontFamily,
  url: staticFile("fonts/google-sans-latin-wght-normal.woff2"),
  weight: "100 900",
});
