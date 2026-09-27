import { cn } from "@/lib/utils";

import wordmarkBlack from "@/assets/brand/wordmark-black.png";
import wordmarkWhite from "@/assets/brand/wordmark-white.png";
import wordmarkYellow from "@/assets/brand/wordmark-yellow.png";

const sources = { black: wordmarkBlack, white: wordmarkWhite, yellow: wordmarkYellow };

/** The Düdestrap wordmark from the app's brand kit (960 × 218, transparent). */
export function Wordmark({ tone = "black", className, decorative = false }) {
  return (
    <img
      src={sources[tone]}
      alt={decorative ? "" : "Düdestrap"}
      width="960"
      height="218"
      decoding="async"
      draggable="false"
      className={cn("block h-auto select-none", className)}
    />
  );
}
