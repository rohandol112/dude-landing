import { useSyncExternalStore } from "react";

import { links } from "@/lib/links";

const DOWNLOAD_SECTION = "#get-app";

function storeForDevice() {
  const { userAgent, maxTouchPoints, platform } = navigator;
  // iPadOS reports itself as a Mac; touch support gives it away.
  if (/iPhone|iPad|iPod/i.test(userAgent) || (platform === "MacIntel" && maxTouchPoints > 1)) return links.appStore;
  if (/Android/i.test(userAgent)) return links.playStore;
  return DOWNLOAD_SECTION;
}

const subscribe = () => () => {};

/**
 * "Get the app" destination: the right store on phones, the download section everywhere else.
 * Pre-rendered HTML always links to the download section; the browser swaps in the store link.
 */
export function useGetAppLink() {
  return useSyncExternalStore(subscribe, storeForDevice, () => DOWNLOAD_SECTION);
}
