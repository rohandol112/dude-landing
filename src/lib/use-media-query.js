import { useSyncExternalStore } from "react";

/**
 * Live `matchMedia` result. Returns `serverValue` during pre-rendering and hydration,
 * then the real value, so the pre-rendered HTML and the first client render agree.
 */
export function useMediaQuery(query, serverValue = false) {
  return useSyncExternalStore(
    (onChange) => {
      const list = window.matchMedia(query);
      list.addEventListener("change", onChange);
      return () => list.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => serverValue,
  );
}
