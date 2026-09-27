import { MotionConfig } from "motion/react";

import { Hero } from "@/components/hero";
import { AppDownload } from "@/components/sections/app-download";
import { ClosingCta } from "@/components/sections/closing-cta";
import { Faq } from "@/components/sections/faq";
import { Lanes } from "@/components/sections/lanes";
import { Pricing } from "@/components/sections/pricing";
import { Process } from "@/components/sections/process";
import { Showcase } from "@/components/sections/showcase";
import { Trust } from "@/components/sections/trust";
import { Vendors } from "@/components/sections/vendors";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

function App() {
  return (
    <MotionConfig reducedMotion="user">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <div className="page">
        <SiteHeader />
        <main id="main-content">
          <Hero />
          <Showcase />
          <Lanes />
          <Process />
          <Trust />
          <Pricing />
          <Vendors />
          <AppDownload />
          <Faq />
          <ClosingCta />
        </main>
        <SiteFooter />
      </div>
    </MotionConfig>
  );
}

export default App;
