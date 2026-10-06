import { BriefcaseIcon, CameraIcon, DevicePhoneMobileIcon, GiftIcon, PrinterIcon } from "@heroicons/react/24/outline";
import { ArrowRightIcon } from "@heroicons/react/20/solid";
import { useCallback, useState } from "react";
import { motion } from "motion/react";

import { HeroIntro } from "@/components/hero-intro";
import { HeroSky } from "@/components/hero-sky";
import { ShirtIcon, StageIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { services } from "@/content/services";
import { DESKTOP_QUERY } from "@/lib/breakpoints";
import { EASE_OUT } from "@/lib/motion";
import { useMotionBudget } from "@/lib/motion-budget";
import { useGetAppLink } from "@/lib/use-get-app-link";

import compact780 from "@/assets/hero/compact-780.webp";
import compact1170 from "@/assets/hero/compact-1170.webp";
import compact1560 from "@/assets/hero/compact-1560.webp";
import plate1280 from "@/assets/hero/plate-1280.webp";
import plate1920 from "@/assets/hero/plate-1920.webp";
import plate2560 from "@/assets/hero/plate-2560.webp";

const serviceIcons = {
  "custom-apparel": ShirtIcon,
  "custom-gifts": GiftIcon,
  "corporate-events": BriefcaseIcon,
  "stage-decor": StageIcon,
  "print-branding": PrinterIcon,
  "event-photography": CameraIcon,
};

const headline = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
};

const word = {
  hidden: { opacity: 0, y: "0.3em" },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE_OUT } },
};

const fadeIn = (delay) => ({
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.7, delay, ease: EASE_OUT },
});

function Words({ text }) {
  return text.split(" ").map((part, index, all) => (
    <span key={part}>
      <motion.span className="hero-word" variants={word}>
        {part}
      </motion.span>
      {index < all.length - 1 ? " " : null}
    </span>
  ));
}

function BrushUnderline() {
  return (
    <motion.svg
      className="brush-underline"
      viewBox="0 0 289 11"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
      style={{ originX: 0 }}
      initial={{ scaleX: 0 }}
      animate={{ scaleX: 1 }}
      transition={{ duration: 0.8, delay: 0.6, ease: [0.65, 0, 0.35, 1] }}
    >
      <path d="M1.2 6.4C48 3.9 104 3.2 158 3.3c45 .1 88 .9 130 2.6.9.1.9 1.9 0 2-44 .8-89 .6-134 .9-51 .3-101 1.3-152 2.3-2 0-2.6-4.4-.8-4.7Z" />
    </motion.svg>
  );
}

export function Hero() {
  const appHref = useGetAppLink();
  const [introDone, setIntroDone] = useState(false);
  const handleIntroDone = useCallback(() => setIntroDone(true), []);

  return (
    <section id="top" className="hero" aria-labelledby="hero-title" data-intro={introDone ? "done" : undefined}>
      <div className="hero-sky-layer">
        <HeroSky deferred={!introDone} />
      </div>

      <div className="hero-stage">
        <div className="hero-copy">
          <motion.h1 id="hero-title" variants={headline} initial="hidden" animate="show">
            <span className="hero-line">
              <Words text="Your Ideas," />
            </span>{" "}
            <span className="hero-line">
              <Words text="Our" />{" "}
              <em>
                <motion.span className="hero-word" variants={word}>
                  Execution.
                </motion.span>
                <BrushUnderline />
              </em>
            </span>
          </motion.h1>

          <motion.p className="hero-lede" {...fadeIn(0.45)}>
            Plan events, book vetted vendors and order custom merch and gifts,{" "}
            <br className="desktop-break" />
            all managed by Dudestrap in one app.
          </motion.p>

          <motion.div className="hero-actions" {...fadeIn(0.55)}>
            <Button asChild variant="ink" className="hero-cta">
              <a href={appHref}>
                <DevicePhoneMobileIcon aria-hidden="true" />
                Get the app
              </a>
            </Button>
            <Button asChild variant="glass" className="hero-cta">
              <a href="#how-it-works">
                See how it works
                <ArrowRightIcon aria-hidden="true" />
              </a>
            </Button>
          </motion.div>

          <motion.nav className="hero-starters" aria-label="Start with a category" {...fadeIn(0.7)}>
            <p className="hero-starters-label" aria-hidden="true">
              what are you planning?
            </p>
            <ul>
              {services.map(({ key, label, href }) => {
                const Icon = serviceIcons[key];
                return (
                  <li key={key}>
                    <a href={href} className="starter-pill">
                      <Icon aria-hidden="true" />
                      {label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </motion.nav>
        </div>

        <div className="hero-art" data-intro={introDone ? "done" : undefined}>
          <picture className="hero-backdrop">
            <source
              media={DESKTOP_QUERY}
              type="image/webp"
              sizes="(min-width: 1920px) 1920px, 100vw"
              srcSet={`${plate1280} 1280w, ${plate1920} 1920w, ${plate2560} 2560w`}
            />
            <img
              src={compact1170}
              srcSet={`${compact780} 780w, ${compact1170} 1170w, ${compact1560} 1560w`}
              sizes="100vw"
              alt="A custom T-shirt, a Dudestrap-branded event stage and shipping boxes rising out of the clouds in a paper collage"
              fetchPriority="high"
              decoding="async"
            />
          </picture>
          <HeroIntro onDone={handleIntroDone} />
        </div>
      </div>
    </section>
  );
}
