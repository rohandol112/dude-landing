/** Shared easing and reveal presets so every section moves with the same character. */
export const EASE_OUT = [0.22, 1, 0.36, 1];

export const revealUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE_OUT } },
};

export const stagger = (gap = 0.08, delay = 0) => ({
  hidden: {},
  show: { transition: { staggerChildren: gap, delayChildren: delay } },
});

/** Viewport settings for scroll reveals: trigger a little before the element is fully in view. */
export const inView = { once: true, amount: 0.25 };
