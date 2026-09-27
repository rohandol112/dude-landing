import { useRef } from "react";
import { BadgeCheck, CreditCard, FileText, PackageCheck } from "lucide-react";
import { motion, useInView } from "motion/react";

import { RequestDashboard } from "@/components/request-dashboard";
import { SectionHeading } from "@/components/sections/section-heading";
import { EASE_OUT } from "@/lib/motion";

// Each callout sits beside the row it describes; positions are % of the dashboard frame.
const callouts = [
  { icon: FileText, title: "Quotation v2 sent", detail: "Stage & Decor · awaiting sign-off", tint: "bg-sky text-[#1f6fb2]", position: "left-[-4%] top-[6%]" },
  { icon: CreditCard, title: "Payment captured", detail: "Held in escrow until delivery", tint: "bg-[#d7f6e2] text-[#1a8a4c]", position: "right-[-4%] top-[40%]" },
  { icon: BadgeCheck, title: "Proof approved", detail: "College Fest T-Shirts", tint: "bg-brand/40 text-[#8a6400]", position: "left-[-3%] bottom-[14%]" },
  { icon: PackageCheck, title: "Delivered", detail: "Proof of delivery recorded", tint: "bg-[#efe7ff] text-[#6b3fd1]", position: "right-[6%] bottom-[-6%]" },
];

function Callout({ icon: Icon, title, detail, tint, position, index, play }) {
  return (
    <motion.div
      className={`absolute z-10 hidden md:block ${position}`}
      initial={{ opacity: 0, scale: 0.8, y: 12 }}
      animate={play ? { opacity: 1, scale: 1, y: 0 } : undefined}
      transition={{ type: "spring", stiffness: 380, damping: 22, delay: 1.1 + index * 0.28 }}
    >
      <div className="flex items-center gap-3 rounded-2xl bg-white/95 py-2.5 pr-4 pl-2.5 shadow-[0_18px_40px_rgba(28,40,52,0.14),0_1px_0_#fff_inset] ring-1 ring-ink/5 backdrop-blur">
        <span className={`grid size-9 place-items-center rounded-xl ${tint}`}>
          <Icon className="size-[18px]" aria-hidden="true" />
        </span>
        <span className="flex flex-col">
          <span className="text-sm font-semibold text-ink">{title}</span>
          <span className="text-xs text-ink/55">{detail}</span>
        </span>
      </div>
    </motion.div>
  );
}

export function Showcase() {
  const ref = useRef(null);
  const play = useInView(ref, { once: true, amount: 0.35 });

  return (
    <section id="platform" className="relative scroll-mt-28 overflow-hidden bg-paper pt-10 pb-24 md:pt-16 md:pb-36" aria-labelledby="platform-title">
      <SectionHeading
        id="platform-title"
        eyebrow="The Dudestrap dashboard"
        title="Every request,"
        accent="one clear view."
        lede="Quotes, payments, production proofs and delivery updates for every order, in one place. When something moves, you hear about it on WhatsApp, SMS or email."
        className="px-5"
      />

      <div ref={ref} className="relative mx-auto mt-14 w-full max-w-[1100px] px-4 md:mt-20 md:px-10">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-[8%] top-[14%] bottom-[-6%] -z-10 rounded-[48px] bg-[radial-gradient(60%_60%_at_50%_40%,rgba(254,217,0,0.28),rgba(207,230,247,0.5)_55%,transparent_75%)] blur-2xl"
        />
        <motion.div
          initial={{ opacity: 0, y: 36, scale: 0.97 }}
          animate={play ? { opacity: 1, y: 0, scale: 1 } : undefined}
          transition={{ duration: 0.9, ease: EASE_OUT }}
        >
          <RequestDashboard play={play} />
        </motion.div>
        {callouts.map((callout, index) => (
          <Callout key={callout.title} {...callout} index={index} play={play} />
        ))}
      </div>
    </section>
  );
}
