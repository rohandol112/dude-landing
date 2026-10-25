import { MotionConfig } from "motion/react";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { StoreBadges } from "@/components/store-badges";
import { Island } from "@/blog/island";
import { links } from "@/lib/links";

/** The site header, hydrated on its own; its section links point home. */
export function HeaderIsland() {
  return (
    <MotionConfig reducedMotion="user">
      <SiteHeader linkBase="/" />
    </MotionConfig>
  );
}

/** "#get-app" only exists on the home page, so blog pages link there. */
const homeAnchor = (href) => (href.startsWith("#") ? `/${href}` : href);

/** The closing call to action, without motion: blog pages don't hydrate it. */
function BlogCta() {
  return (
    <section className="bg-paper px-4 pb-10 md:px-6" aria-labelledby="blog-cta-title">
      <div className="mx-auto flex max-w-[1320px] flex-col items-center gap-6 rounded-[36px] bg-[linear-gradient(180deg,#bfe0f6_0%,#d7ebf7_55%,#f3f8fb_100%)] px-6 py-20 text-center md:rounded-[44px] md:py-24">
        <p className="font-hand text-2xl text-ink/80 md:text-3xl" style={{ rotate: "-2deg" }}>
          from an idea… to real experiences
        </p>
        <h2 id="blog-cta-title" className="font-display text-[clamp(2.25rem,5vw,4rem)] leading-[1.04] text-ink">
          Got an idea? <span className="block text-ink/50">Let&apos;s make it real.</span>
        </h2>
        <p className="max-w-xl text-lg text-ink/65">
          Get the app, tell us what you need, and we&apos;ll come back with a clear quote and handle everything from there.
        </p>
        <StoreBadges
          appStoreHref={homeAnchor(links.appStore)}
          playStoreHref={homeAnchor(links.playStore)}
          audience="the Dudestrap app"
          className="justify-center"
        />
      </div>
    </section>
  );
}

/** Header, page, closing call to action and footer for every blog page. */
export function BlogLayout({ children }) {
  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <div className="page">
        <Island name="header">
          <HeaderIsland />
        </Island>
        <main id="main-content" className="bg-paper pt-28 pb-20 md:pt-36 md:pb-28">
          {children}
        </main>
        <BlogCta />
        <SiteFooter linkBase="/" />
      </div>
    </>
  );
}
