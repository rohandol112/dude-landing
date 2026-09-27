import { ArrowRight, BadgeIndianRupee, CalendarDays, Check, MapPin, Ruler } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

import { SectionHeading } from "@/components/sections/section-heading";
import { Button } from "@/components/ui/button";
import { EASE_OUT, inView, revealUp, stagger } from "@/lib/motion";
import { links } from "@/lib/links";

const benefits = [
  "Jobs matched to your categories and service areas",
  "Clear, reviewed rate cards for every category",
  "Payouts released as soon as the job is delivered",
  "Proof, quality and delivery steps built into every job",
];

function OfferTimer({ animate }) {
  const radius = 26;
  const circumference = 2 * Math.PI * radius;
  return (
    <div className="relative grid size-16 place-items-center">
      <svg viewBox="0 0 64 64" className="absolute inset-0 -rotate-90" aria-hidden="true">
        <circle cx="32" cy="32" r={radius} fill="none" stroke="rgba(10,11,12,0.08)" strokeWidth="5" />
        <motion.circle
          cx="32"
          cy="32"
          r={radius}
          fill="none"
          stroke="#ffd52e"
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: 0 }}
          whileInView={animate ? { strokeDashoffset: circumference * 0.3 } : undefined}
          viewport={{ once: true }}
          transition={{ duration: 2.4, delay: 0.6, ease: EASE_OUT }}
        />
      </svg>
      <span className="text-sm font-semibold text-ink tabular-nums">10:30</span>
    </div>
  );
}

export function Vendors() {
  const reduceMotion = useReducedMotion();
  return (
    <section id="vendors" className="relative scroll-mt-24 overflow-hidden bg-[linear-gradient(180deg,#fcfcfb,#fff8dd_55%,#fcfcfb)] py-24 md:py-32" aria-labelledby="vendors-title">
      <div className="mx-auto grid max-w-[1200px] items-center gap-16 px-5 lg:grid-cols-[1.05fr_1fr]">
        <div className="flex flex-col gap-8">
          <SectionHeading
            id="vendors-title"
            align="left"
            eyebrow="For vendors"
            title="Steady work for"
            accent="great makers."
            lede="Join Dudestrap's supply network. Get offered jobs that fit your categories and area, deliver with clear specs, and get paid on delivery."
            className="mx-0"
          />
          <motion.ul className="flex flex-col gap-3.5" variants={stagger(0.08)} initial="hidden" whileInView="show" viewport={inView}>
            {benefits.map((benefit) => (
              <motion.li key={benefit} variants={revealUp} className="flex items-start gap-3 text-[16px] text-ink/80">
                <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-ink text-brand">
                  <Check className="size-3.5" strokeWidth={3} aria-hidden="true" />
                </span>
                {benefit}
              </motion.li>
            ))}
          </motion.ul>
          <motion.div variants={revealUp} initial="hidden" whileInView="show" viewport={inView}>
            <Button asChild variant="ink" size="lg" className="group">
              <a href={links.vendorPlayStore}>
                Get the vendor app
                <ArrowRight className="transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden="true" />
              </a>
            </Button>
          </motion.div>
        </div>

        <div className="relative mx-auto w-full max-w-[460px]" aria-hidden="true">
          <motion.div
            className="relative z-10 flex flex-col gap-5 rounded-[28px] bg-white p-6 shadow-[0_30px_80px_rgba(60,50,20,0.16)] ring-1 ring-ink/5"
            initial={{ opacity: 0, y: 40, rotate: -3 }}
            whileInView={{ opacity: 1, y: 0, rotate: -1.5 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.9, ease: EASE_OUT }}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-col gap-1">
                <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-brand/30 px-2.5 py-1 text-xs font-semibold text-[#7a5800]">
                  <span className="size-1.5 rounded-full bg-[#e0a800]" />
                  New job offer
                </span>
                <h3 className="mt-2 text-xl font-semibold text-ink">Stage & décor setup</h3>
                <p className="text-sm text-ink/55">College fest · main stage</p>
              </div>
              <OfferTimer animate={!reduceMotion} />
            </div>
            <dl className="grid grid-cols-2 gap-3 text-sm">
              {[
                { icon: CalendarDays, label: "Event date", value: "Sat, 14 Nov" },
                { icon: MapPin, label: "Service area", value: "Within your zone" },
                { icon: Ruler, label: "Scope", value: "40 × 24 ft stage" },
                { icon: BadgeIndianRupee, label: "Payable", value: "Per your rate card" },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex flex-col gap-1 rounded-2xl bg-mist/70 p-3">
                  <dt className="flex items-center gap-1.5 text-xs text-ink/50">
                    <Icon className="size-3.5" />
                    {label}
                  </dt>
                  <dd className="font-medium text-ink">{value}</dd>
                </div>
              ))}
            </dl>
            <div className="grid grid-cols-2 gap-3">
              <span className="grid h-11 place-items-center rounded-full bg-ink text-sm font-semibold text-white">Accept job</span>
              <span className="grid h-11 place-items-center rounded-full bg-white text-sm font-semibold text-ink ring-1 ring-ink/10">Decline</span>
            </div>
          </motion.div>

          <motion.div
            className="absolute -right-3 -bottom-10 z-20 flex items-center gap-3 rounded-2xl bg-ink py-3 pr-5 pl-3 text-white shadow-[0_20px_50px_rgba(10,11,12,0.3)] sm:-right-8"
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, delay: 0.45, ease: EASE_OUT }}
          >
            <span className="grid size-9 place-items-center rounded-xl bg-brand text-ink">
              <BadgeIndianRupee className="size-5" />
            </span>
            <span className="flex flex-col">
              <span className="text-sm font-semibold">Payout released</span>
              <span className="text-xs text-white/60">Job delivered · proof recorded</span>
            </span>
          </motion.div>

          <div className="absolute -top-6 -left-6 -z-0 size-40 rounded-full bg-brand/40 blur-3xl" />
        </div>
      </div>
    </section>
  );
}
