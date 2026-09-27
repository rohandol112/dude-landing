import { lazy, Suspense, useCallback, useEffect, useRef, useState } from "react";

import { DESKTOP_QUERY, REDUCED_MOTION_QUERY } from "@/lib/breakpoints";
import { useMediaQuery } from "@/lib/use-media-query";

const HeroClouds = lazy(() => import("@/components/hero-clouds"));

function supportsWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

function whenIdle(callback) {
  if ("requestIdleCallback" in window) {
    const id = window.requestIdleCallback(callback, { timeout: 1800 });
    return () => window.cancelIdleCallback(id);
  }
  const id = window.setTimeout(callback, 700);
  return () => window.clearTimeout(id);
}

/**
 * Slow-drifting three.js clouds behind the nav and headline. Loaded after first paint so it
 * never competes with the hero image, skipped for reduced motion, Data Saver and
 * browsers without WebGL, and paused whenever the hero is off-screen.
 */
export function HeroSky() {
  const ref = useRef(null);
  const [enabled, setEnabled] = useState(false);
  const [ready, setReady] = useState(false);
  const [active, setActive] = useState(true);
  const compact = !useMediaQuery(DESKTOP_QUERY, true);

  useEffect(() => {
    const reducedMotion = window.matchMedia(REDUCED_MOTION_QUERY);
    if (reducedMotion.matches || navigator.connection?.saveData || !supportsWebGL()) return undefined;

    const cancelIdle = whenIdle(() => setEnabled(true));
    const onPreferenceChange = (event) => {
      if (event.matches) setEnabled(false);
    };
    reducedMotion.addEventListener("change", onPreferenceChange);
    return () => {
      cancelIdle();
      reducedMotion.removeEventListener("change", onPreferenceChange);
    };
  }, []);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;
    const observer = new IntersectionObserver(([entry]) => setActive(entry.isIntersecting), { rootMargin: "80px" });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const handleReady = useCallback(() => setReady(true), []);

  return (
    <div ref={ref} className="hero-sky" data-ready={ready || undefined} aria-hidden="true">
      {enabled ? (
        <Suspense fallback={null}>
          <HeroClouds compact={compact} active={active} onReady={handleReady} />
        </Suspense>
      ) : null}
    </div>
  );
}
