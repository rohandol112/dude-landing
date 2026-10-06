import { useSyncExternalStore } from "react";

/**
 * "full" or "lite": how much motion this device gets. Decided once, before first paint, by the
 * inline script in index.html (reduced motion, Data Saver, 2G, low memory or few CPU cores → lite).
 */
export function readMotionBudget() {
  return document.documentElement.dataset.motion === "full" ? "full" : "lite";
}

const subscribe = () => () => {};

/** The motion budget for rendering. Pre-rendering and hydration see "lite" (the stills), then the real value. */
export function useMotionBudget() {
  return useSyncExternalStore(subscribe, readMotionBudget, () => "lite");
}
