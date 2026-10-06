import { ArrowRightIcon, CheckIcon } from "@heroicons/react/20/solid";
import { motion } from "motion/react";

import { SectionHeading } from "@/components/sections/section-heading";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { inView, revealUp, stagger } from "@/lib/motion";
import { useGetAppLink } from "@/lib/use-get-app-link";

const plans = [
  {
    name: "Catalogue",
    summary: "Approved products with fixed prices. Any festival pricing is shown before you check out.",
    points: ["Instant quote", "Price locked when you order", "Pay online in one step"],
    cta: "Browse in the app",
  },
  {
    name: "Custom quote",
    summary: "Share your requirement and budget. You get a versioned quotation, and nothing changes without your sign-off.",
    points: ["Consultation with our team", "Versioned quotations", "Accept and sign online"],
    cta: "Request a quote in the app",
    featured: true,
  },
  {
    name: "Express",
    summary: "Need it sooner? Express orders get priority dispatch and faster vendor response windows.",
    points: ["Priority assignment", "Shorter offer windows", "Same proof and quality checks"],
    cta: "Order express in the app",
  },
];

export function Pricing() {
  const appHref = useGetAppLink();
  return (
    <section id="pricing" className="relative scroll-mt-24 bg-paper py-24 md:py-32" aria-labelledby="pricing-title">
      <SectionHeading
        id="pricing-title"
        eyebrow="Pricing"
        title="Pricing you can"
        accent="see before you pay."
        lede="Every price comes from reviewed rate cards and is confirmed before checkout. No surprises after you order."
        className="px-5"
      />
      <motion.div
        className="mx-auto mt-14 grid max-w-[1120px] gap-6 px-5 md:mt-20 lg:grid-cols-3"
        variants={stagger(0.12)}
        initial="hidden"
        whileInView="show"
        viewport={inView}
      >
        {plans.map((plan) => (
          <motion.article
            key={plan.name}
            variants={revealUp}
            className={cn(
              "card-hover relative flex min-w-0 flex-col gap-6 p-6 sm:p-8",
              plan.featured
                ? "rounded-[28px] bg-ink text-white shadow-[0_30px_70px_rgba(10,11,12,0.28)]"
                : "card-surface text-ink",
            )}
          >
            {plan.featured ? (
              <span className="absolute -top-3 left-8 rounded-full bg-brand px-3 py-1 text-xs font-semibold text-ink">For bigger projects</span>
            ) : null}
            <div className="flex flex-col gap-3">
              <h3 className="font-display text-3xl">{plan.name}</h3>
              <p className={cn("text-[15px] leading-relaxed", plan.featured ? "text-white/70" : "text-ink/65")}>{plan.summary}</p>
            </div>
            <ul className="flex flex-col gap-3">
              {plan.points.map((point) => (
                <li key={point} className="flex items-center gap-3 text-[15px]">
                  <span className={cn("grid size-5 place-items-center rounded-full", plan.featured ? "bg-brand text-ink" : "bg-brand/30 text-ink")}>
                    <CheckIcon className="size-3.5" aria-hidden="true" />
                  </span>
                  {point}
                </li>
              ))}
            </ul>
            <Button asChild variant={plan.featured ? "brand" : "light"} size="lg" className="group mt-auto h-auto min-h-12 justify-between py-3 text-left whitespace-normal">
              <a href={appHref}>
                {plan.cta}
                <ArrowRightIcon className="transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden="true" />
              </a>
            </Button>
          </motion.article>
        ))}
      </motion.div>
    </section>
  );
}
