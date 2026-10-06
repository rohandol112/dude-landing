import { motion } from "motion/react";

import { cn } from "@/lib/utils";
import { inView, revealUp, stagger } from "@/lib/motion";

/**
 * Eyebrow, serif headline whose second phrase drops to a muted tone, and a short lede — revealed in sequence.
 * `tone="dark"` flips the colours for sections on the ink background.
 */
export function SectionHeading({ id, eyebrow, title, accent, lede, align = "center", tone = "light", className }) {
  const dark = tone === "dark";
  return (
    <motion.div
      className={cn(
        "flex max-w-3xl flex-col gap-5",
        align === "center" ? "mx-auto items-center text-center" : "items-start text-left",
        className,
      )}
      variants={stagger(0.09)}
      initial="hidden"
      whileInView="show"
      viewport={inView}
    >
      {eyebrow ? (
        <motion.span
          variants={revealUp}
          className={cn("text-[13px] font-semibold tracking-[0.14em] uppercase", dark ? "text-brand" : "text-[#8a6400]")}
        >
          {eyebrow}
        </motion.span>
      ) : null}
      <motion.h2
        id={id}
        variants={revealUp}
        className={cn(
          "font-display text-[clamp(2.25rem,5.2vw,4.25rem)] leading-[1.02] font-normal tracking-[-0.015em] text-balance",
          dark ? "text-white" : "text-ink",
        )}
      >
        {title} {accent ? <span className={dark ? "text-white/55" : "text-ink/50"}>{accent}</span> : null}
      </motion.h2>
      {lede ? (
        <motion.p
          variants={revealUp}
          className={cn("max-w-2xl text-[17px] leading-relaxed text-pretty md:text-lg", dark ? "text-white/70" : "text-ink/65")}
        >
          {lede}
        </motion.p>
      ) : null}
    </motion.div>
  );
}
