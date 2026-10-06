import { useEffect, useRef, useState } from "react";
import { useInView } from "motion/react";

import { REDUCED_MOTION_QUERY, SCENE_WIDE_QUERY } from "@/lib/breakpoints";
import { useMotionBudget } from "@/lib/motion-budget";
import { useMediaQuery } from "@/lib/use-media-query";
import { cn } from "@/lib/utils";

/**
 * A 3D scene pre-rendered with Remotion (see video/), served from public/videos as
 * `<name>-wide.mp4` (16:10, lg and up) and `<name>-tall.mp4` (3:4), each with
 * `-start.webp` / `-end.webp` posters.
 *
 * Plays once when it scrolls into view and rests on its last frame. Pre-rendered HTML, the lite
 * motion budget (reduced motion, Data Saver, low-end devices) and blocked autoplay (iOS Low Power
 * Mode) all get the last frame as a still.
 */
export function SceneVideo({ name, alt, className }) {
  const frameRef = useRef(null);
  const videoRef = useRef(null);
  // Server values pick the still, so the pre-rendered page shows the finished scene.
  const reduced = useMediaQuery(REDUCED_MOTION_QUERY, true);
  const lite = useMotionBudget() === "lite";
  const wide = useMediaQuery(SCENE_WIDE_QUERY, true);
  const near = useInView(frameRef, { once: true, margin: "400px 0px" });
  const visible = useInView(frameRef, { once: true, amount: 0.35 });
  const [state, setState] = useState("waiting"); // waiting → playing → ended, or failed

  // Crossing the breakpoint mid-play would restart the other cut, so finish on its still instead.
  const variant = wide ? "wide" : "tall";
  const [shownVariant, setShownVariant] = useState(variant);
  if (variant !== shownVariant) {
    setShownVariant(variant);
    if (state === "playing") setState("ended");
  }

  const showVideo = !reduced && !lite && (state === "waiting" || state === "playing");

  useEffect(() => {
    if (!showVideo || !visible) return undefined;
    // Too slow to start (poor connection): settle on the still rather than play late.
    const timeout = setTimeout(() => setState((s) => (s === "waiting" ? "failed" : s)), 4000);
    videoRef.current
      .play()
      .then(() => setState("playing"))
      .catch(() => setState("failed"));
    return () => clearTimeout(timeout);
  }, [showVideo, visible]);

  const src = (suffix) => `/videos/${name}-${variant}${suffix}`;

  return (
    <div
      ref={frameRef}
      className={cn("scene-video relative mx-auto aspect-[3/4] w-full max-w-[560px] lg:aspect-[8/5] lg:max-w-none", className)}
    >
      <picture>
        <source media={SCENE_WIDE_QUERY} srcSet={`/videos/${name}-wide-end.webp`} />
        <img
          src={`/videos/${name}-tall-end.webp`}
          alt={alt}
          loading="lazy"
          decoding="async"
          className={cn("absolute inset-0 size-full object-cover", showVideo && "opacity-0")}
        />
      </picture>
      {showVideo ? (
        <video
          key={variant}
          ref={videoRef}
          className="absolute inset-0 size-full object-cover"
          src={near ? src(".mp4") : undefined}
          poster={src("-start.webp")}
          preload={near ? "auto" : "none"}
          muted
          playsInline
          disablePictureInPicture
          aria-hidden="true"
          onEnded={() => setState("ended")}
        />
      ) : null}
    </div>
  );
}
