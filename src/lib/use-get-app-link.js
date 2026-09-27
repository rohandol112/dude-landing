import { useState } from "react";

import { links } from "@/lib/links";

function storeForDevice() {
  const { userAgent, maxTouchPoints, platform } = navigator;
  // iPadOS reports itself as a Mac; touch support gives it away.
  if (/iPhone|iPad|iPod/i.test(userAgent) || (platform === "MacIntel" && maxTouchPoints > 1)) return links.appStore;
  if (/Android/i.test(userAgent)) return links.playStore;
  return null;
}

/** "Get the app" destination: the right store on phones, the download section everywhere else. */
export function useGetAppLink() {
  const [href] = useState(() => storeForDevice() ?? "#get-app");
  return href;
}
