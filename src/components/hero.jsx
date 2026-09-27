import { ArrowRight, Briefcase, Camera, Gift, Printer, Shirt, Smartphone, Theater } from "lucide-react";
import { motion } from "motion/react";

import { HeroSky } from "@/components/hero-sky";
import { Button } from "@/components/ui/button";
import { DESKTOP_QUERY } from "@/lib/breakpoints";
import { EASE_OUT } from "@/lib/motion";
import { useGetAppLink } from "@/lib/use-get-app-link";

import compact780 from "@/assets/hero/compact-780.webp";
import compact1170 from "@/assets/hero/compact-1170.webp";
import compact1560 from "@/assets/hero/compact-1560.webp";
import plate1280 from "@/assets/hero/plate-1280.webp";
import plate1920 from "@/assets/hero/plate-1920.webp";
import plate2560 from "@/assets/hero/plate-2560.webp";

const starters = [
  { icon: Shirt, label: "Custom apparel", href: "#products" },
  { icon: Gift, label: "Custom gifts", href: "#business" },
  { icon: Briefcase, label: "Corporate events", href: "#events" },
  { icon: Theater, label: "Stage & décor", href: "#events" },
  { icon: Printer, label: "Print & branding", href: "#products" },
  { icon: Camera, label: "Event photography", href: "#events" },
];

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

  return (
    <section id="top" className="hero" aria-labelledby="hero-title">
      <div className="hero-sky-layer">
        <HeroSky />
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
            Dudestrap is a managed-supply marketplace for custom products,{" "}
            <br className="desktop-break" />
            events and all your business requirements.
          </motion.p>

          <motion.div className="hero-actions" {...fadeIn(0.55)}>
            <Button asChild variant="ink" className="hero-cta">
              <a href={appHref}>
                <Smartphone aria-hidden="true" />
                Get the app
              </a>
            </Button>
            <Button asChild variant="glass" className="hero-cta">
              <a href="#how-it-works">
                See how it works
                <ArrowRight aria-hidden="true" />
              </a>
            </Button>
          </motion.div>

          <motion.nav className="hero-starters" aria-label="Start with a category" {...fadeIn(0.7)}>
            <p className="hero-starters-label" aria-hidden="true">
              what are you planning?
            </p>
            <ul>
              {starters.map(({ icon: Icon, label, href }) => (
                <li key={label}>
                  <a href={href} className="starter-pill">
                    <Icon aria-hidden="true" />
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.nav>
        </div>

        <div className="hero-art">
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
        </div>
      </div>
    </section>
  );
}
