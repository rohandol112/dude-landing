import { useEffect, useRef } from "react";

import { DESKTOP_QUERY } from "@/lib/breakpoints";
import { readMotionBudget } from "@/lib/motion-budget";

/** No first frame by then (slow network): skip the intro and fade the artwork in instead. */
const START_TIMEOUT = 3000;
/** Keep the last frame up while the artwork fades in underneath, then release the decoder. */
const RELEASE_AFTER = 900;

/**
 * The hero's one-time unfold (video/src/hero/HeroUnfold.tsx): the collage opens out of a folded
 * bundle, then the app phones rise from the clouds. Its last frame is the hero artwork itself
 * (rendered from the same scene), so the <picture> underneath takes over without a visible change.
 *
 * `onDone` fires when the artwork should show: the intro ended, failed, timed out or was skipped
 * because the device is on the lite motion budget.
 */
export function HeroIntro({ onDone }) {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    let finished = false;
    let releaseTimer;

    const finish = () => {
      if (finished) return;
      finished = true;
      onDone();
      releaseTimer = window.setTimeout(() => {
        video.removeAttribute("src");
        video.load();
      }, RELEASE_AFTER);
    };

    if (readMotionBudget() !== "full") {
      finish();
      return () => window.clearTimeout(releaseTimer);
    }

    const startTimer = window.setTimeout(finish, START_TIMEOUT);
    const onPlaying = () => window.clearTimeout(startTimer);
    video.addEventListener("playing", onPlaying);
    video.addEventListener("ended", finish);
    video.addEventListener("error", finish);

    const heroEl = video.closest(".hero");
    const onHeroClick = () => {
      if (finished) return;
      finish();
    };
    heroEl?.addEventListener("click", onHeroClick);

    video.src = window.matchMedia(DESKTOP_QUERY).matches ? "/videos/hero-wide.mp4" : "/videos/hero-compact.mp4";
    video.play().catch(finish);

    return () => {
      window.clearTimeout(startTimer);
      window.clearTimeout(releaseTimer);
      video.removeEventListener("playing", onPlaying);
      video.removeEventListener("ended", finish);
      video.removeEventListener("error", finish);
      heroEl?.removeEventListener("click", onHeroClick);
      video.pause();
    };
  }, [onDone]);

  return <video ref={videoRef} className="hero-intro" muted playsInline preload="none" disablePictureInPicture aria-hidden="true" />;
}
