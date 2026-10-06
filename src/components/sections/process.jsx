import { useRef } from "react";
import { ClipboardDocumentListIcon, PencilSquareIcon, ShieldCheckIcon, TruckIcon } from "@heroicons/react/24/outline";
import { motion, useScroll, useSpring } from "motion/react";

import { SectionHeading } from "@/components/sections/section-heading";
import { inView, revealUp, stagger } from "@/lib/motion";

const steps = [
  {
    icon: ClipboardDocumentListIcon,
    title: "Tell us what you need",
    body: "Pick from the catalogue, or share your requirement and budget and we take it from there.",
  },
  {
    icon: PencilSquareIcon,
    title: "Get a clear quote",
    body: "Catalogue prices are fixed up front. Custom work gets a versioned quotation you accept and sign.",
  },
  {
    icon: ShieldCheckIcon,
    title: "Pay securely",
    body: "Pay through Razorpay. Your payment is held in escrow until the job is delivered.",
  },
  {
    icon: TruckIcon,
    title: "We make it real",
    body: "A vetted vendor is assigned, you approve the proof, quality checks run, and it arrives with proof of delivery.",
  },
];

export function Process() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 55%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.4 });

  return (
    <section id="how-it-works" className="relative scroll-mt-24 overflow-hidden bg-mist/60 py-24 md:py-32" aria-labelledby="process-title">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(84,108,128,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(84,108,128,0.06)_1px,transparent_1px)] bg-[size:28px_28px] [mask-image:radial-gradient(70%_60%_at_50%_45%,#000,transparent)]"
      />
      <SectionHeading
        id="process-title"
        eyebrow="How it works"
        title="From idea to"
        accent="delivered, in four steps."
        lede="The same flow for a hundred T-shirts or a full event: clear quotes, protected payment and proof at every stage."
        className="relative px-5"
      />

      <div ref={ref} className="relative mx-auto mt-16 max-w-[1200px] px-5 md:mt-20">
        {/* progress rail: vertical on phones, horizontal from lg */}
        <div aria-hidden="true" className="absolute top-2 bottom-2 left-[43px] w-px bg-ink/10 lg:top-[27px] lg:right-[12.5%] lg:bottom-auto lg:left-[12.5%] lg:h-px lg:w-auto">
          <motion.div className="h-full w-full origin-top bg-brand lg:hidden" style={{ scaleY: progress }} />
          <motion.div className="hidden h-full w-full origin-left bg-brand lg:block" style={{ scaleX: progress }} />
        </div>

        <motion.ol
          className="relative grid gap-10 lg:grid-cols-4 lg:gap-6"
          variants={stagger(0.14)}
          initial="hidden"
          whileInView="show"
          viewport={inView}
        >
          {steps.map(({ icon: Icon, title, body }, index) => (
            <motion.li key={title} variants={revealUp} className="flex gap-5 lg:flex-col lg:items-center lg:text-center">
              <span className="relative z-10 grid size-14 shrink-0 place-items-center rounded-2xl bg-white shadow-[0_10px_30px_rgba(28,40,52,0.1)] ring-1 ring-ink/5">
                <Icon className="size-6 text-ink" aria-hidden="true" />
                <span className="absolute -top-2 -right-2 grid size-6 place-items-center rounded-full bg-brand text-xs font-bold text-ink">
                  {index + 1}
                </span>
              </span>
              <div className="flex flex-col gap-2 pt-1 lg:max-w-[250px] lg:pt-4">
                <h3 className="text-lg font-semibold text-ink">{title}</h3>
                <p className="text-[15px] leading-relaxed text-ink/65">{body}</p>
              </div>
            </motion.li>
          ))}
        </motion.ol>
      </div>
    </section>
  );
}
