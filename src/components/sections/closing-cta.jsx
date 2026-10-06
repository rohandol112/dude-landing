import { motion } from "motion/react";

import { EASE_OUT, inView, revealUp, stagger } from "@/lib/motion";
import { links } from "@/lib/links";
import { StoreBadges } from "@/components/store-badges";

import cumulus1 from "@/assets/hero/cumulus-1.webp";
import cumulus2 from "@/assets/hero/cumulus-2.webp";
import cumulus3 from "@/assets/hero/cumulus-3.webp";

// fixed positions around the edges so the copy in the middle stays clear
const clouds = [
  { src: cumulus1, className: "-left-16 top-8 w-[300px] md:w-[380px]" },
  { src: cumulus2, className: "-right-20 top-16 w-[260px] md:w-[340px] opacity-90" },
  { src: cumulus3, className: "-bottom-10 -left-10 w-[340px] md:w-[460px]" },
  { src: cumulus1, className: "-right-14 -bottom-14 w-[320px] md:w-[440px] opacity-95" },
];

export function ClosingCta() {
  return (
    <section id="get-started" className="relative scroll-mt-24 bg-paper px-4 pb-10 md:px-6" aria-labelledby="cta-title">
      <div className="relative mx-auto max-w-[1320px] overflow-hidden rounded-[36px] bg-[linear-gradient(180deg,#bfe0f6_0%,#d7ebf7_55%,#f3f8fb_100%)] px-6 py-24 md:rounded-[44px] md:py-32">
        {clouds.map((cloud) => (
          <img
            key={cloud.className}
            src={cloud.src}
            alt=""
            aria-hidden="true"
            loading="lazy"
            className={`pointer-events-none absolute h-auto select-none ${cloud.className}`}
          />
        ))}

        <motion.div
          className="relative mx-auto flex max-w-3xl flex-col items-center gap-7 text-center"
          variants={stagger(0.1)}
          initial="hidden"
          whileInView="show"
          viewport={inView}
        >
          <motion.p variants={revealUp} className="font-hand text-2xl text-ink/80 md:text-3xl" style={{ rotate: "-2deg" }}>
            from an idea… to real experiences
          </motion.p>
          <motion.h2 id="cta-title" variants={revealUp} className="font-display text-[clamp(2.5rem,6vw,5rem)] leading-[1.02] text-ink">
            Got an idea? <span className="block text-ink/50">Let&apos;s make it real.</span>
          </motion.h2>
          <motion.p variants={revealUp} className="max-w-xl text-lg text-ink/65">
            Get the app, tell us what you need, and we&apos;ll come back with a clear quote and handle everything from there.
          </motion.p>
          <motion.div variants={revealUp} className="flex flex-col items-center gap-5">
            <StoreBadges appStoreHref={links.appStore} playStoreHref={links.playStore} audience="the Dudestrap app" className="justify-center" />
          </motion.div>
        </motion.div>
      </div>
      <motion.div
        aria-hidden="true"
        className="mx-auto mt-4 h-2 max-w-[1320px] origin-left rounded-full bg-brand"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: EASE_OUT }}
      />
    </section>
  );
}
