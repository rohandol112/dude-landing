import { motion } from "motion/react";

import { cn } from "@/lib/utils";
import { inView, revealUp, stagger } from "@/lib/motion";

/**
 * Eyebrow, serif headline with an italic accent, and a short lede — revealed in sequence.
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
          className={cn(
            "inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[13px] font-medium",
            dark ? "bg-white/10 text-white/85 ring-1 ring-white/15" : "bg-white text-ink/75 shadow-[0_1px_0_#fff_inset,0_6px_18px_rgba(30,50,70,0.08)] ring-1 ring-ink/5",
          )}
        >
          <span className="size-1.5 rounded-full bg-brand" aria-hidden="true" />
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
        {title} {accent ? <em className="italic">{accent}</em> : null}
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
