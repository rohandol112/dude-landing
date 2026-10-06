import { useId, useState } from "react";
import { PlusIcon } from "@heroicons/react/24/outline";
import { AnimatePresence, motion } from "motion/react";

import { faqs } from "@/content/faq";
import { SectionHeading } from "@/components/sections/section-heading";
import { EASE_OUT, inView, revealUp, stagger } from "@/lib/motion";

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
            <PlusIcon className="size-5" aria-hidden="true" />
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
          {faqs.map((item, index) => (
            <Item key={item.q} {...item} open={open === index} onToggle={() => setOpen(open === index ? -1 : index)} />
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
