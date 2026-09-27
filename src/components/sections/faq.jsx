import { useId, useState } from "react";
import { Plus } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import { SectionHeading } from "@/components/sections/section-heading";
import { EASE_OUT, inView, revealUp, stagger } from "@/lib/motion";

const questions = [
  {
    q: "Do I deal with the vendors directly?",
    a: "No. Dudestrap is your single point of contact. We quote, assign and manage the vendor, check quality and deliver, so you never have to chase anyone.",
  },
  {
    q: "What if I need something that isn't in the catalogue?",
    a: "Start a custom request in the Dudestrap app. Share your requirement and budget and our team sends a quotation you can review, revise and accept right there.",
  },
  {
    q: "How is my payment protected?",
    a: "Payments go through Razorpay and are held until your order is delivered. If something goes wrong, refunds and assurance claims are handled on the platform.",
  },
  {
    q: "Can you handle festival season and tight timelines?",
    a: "Yes. Vendor capacity is reserved when you place your order, and express orders get priority dispatch with faster vendor response windows.",
  },
  {
    q: "How will I know what's happening with my order?",
    a: "Every step shows up in your dashboard, and you get updates on WhatsApp, SMS, email or push as quotes, proofs, payments and deliveries move.",
  },
  {
    q: "How do vendors join Dudestrap?",
    a: "Vendors apply, submit their documents and service areas, and get a reviewed rate card before they receive any job offers.",
  },
];

function Item({ q, a, open, onToggle }) {
  const id = useId();
  return (
    <motion.li variants={revealUp} className="border-b border-ink/10 last:border-b-0">
      <h3>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={`${id}-panel`}
          id={`${id}-button`}
          onClick={onToggle}
          className="flex w-full items-center justify-between gap-6 rounded-xl py-6 text-left text-lg font-medium text-ink transition-colors hover:text-[#7a5800] md:text-xl"
        >
          {q}
          <motion.span
            animate={{ rotate: open ? 45 : 0 }}
            transition={{ duration: 0.3, ease: EASE_OUT }}
            className="grid size-9 shrink-0 place-items-center rounded-full bg-mist text-ink"
          >
            <Plus className="size-5" aria-hidden="true" />
          </motion.span>
        </button>
      </h3>
      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            id={`${id}-panel`}
            role="region"
            aria-labelledby={`${id}-button`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE_OUT }}
            className="overflow-hidden"
          >
            <p className="max-w-2xl pb-6 text-[16px] leading-relaxed text-ink/65">{a}</p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.li>
  );
}

export function Faq() {
  const [open, setOpen] = useState(0);
  return (
    <section id="resources" className="relative scroll-mt-24 bg-paper py-24 md:py-32" aria-labelledby="faq-title">
      <div className="mx-auto grid max-w-[1200px] gap-12 px-5 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <SectionHeading
          id="faq-title"
          align="left"
          eyebrow="Questions"
          title="Good questions,"
          accent="straight answers."
          lede="Everything customers and vendors usually ask before their first order."
          className="mx-0 lg:sticky lg:top-32 lg:self-start"
        />
        <motion.ul className="flex flex-col" variants={stagger(0.06)} initial="hidden" whileInView="show" viewport={inView}>
          {questions.map((item, index) => (
            <Item key={item.q} {...item} open={open === index} onToggle={() => setOpen(open === index ? -1 : index)} />
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
