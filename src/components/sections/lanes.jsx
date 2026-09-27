import { ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";

import { SectionHeading } from "@/components/sections/section-heading";
import { inView, revealUp, stagger } from "@/lib/motion";
import { useGetAppLink } from "@/lib/use-get-app-link";

import businessImage from "@/assets/sections/lane-business.webp";
import eventsImage from "@/assets/sections/lane-events.webp";
import productsImage from "@/assets/sections/lane-products.webp";

const lanes = [
  {
    id: "products",
    label: "Products",
    title: "Custom products, made to spec.",
    body: "Apparel, merch and print. Browse approved products with prices up front, or send your design for a quote.",
    tags: ["T-shirts & hoodies", "Merch", "Print & banners"],
    image: productsImage,
    alt: "A cream T-shirt printed with “Your design here”",
    tone: "from-[#dcecf8] to-[#f4f8fb]",
  },
  {
    id: "events",
    label: "Events",
    title: "Events, run to the minute.",
    body: "Stages, décor, photography and crews, booked against real vendor capacity, checked before your date and checked in on the day.",
    tags: ["Stage & décor", "Photography", "On-ground crew"],
    image: eventsImage,
    alt: "An outdoor stage with Dudestrap banners and lighting rig",
    tone: "from-[#fff1b8] to-[#fffaf0]",
  },
  {
    id: "business",
    label: "Business",
    title: "Everything your business orders.",
    body: "Welcome kits, corporate gifts and bulk orders, with invoices and receipts for every order in one place.",
    tags: ["Welcome kits", "Corporate gifts", "Bulk orders"],
    image: businessImage,
    alt: "A cardboard shipping box printed with the Dudestrap logo",
    tone: "from-[#f3e7da] to-[#fbf8f4]",
  },
];

function LaneCard({ lane }) {
  const appHref = useGetAppLink();
  return (
    <motion.article id={lane.id} variants={revealUp} className="card-surface card-hover group relative flex scroll-mt-28 flex-col overflow-hidden">
      <div className={`relative h-64 overflow-hidden bg-gradient-to-b md:h-72 ${lane.tone}`}>
        <img
          src={lane.image}
          alt={lane.alt}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
        />
        <span className="absolute top-4 left-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-ink shadow-sm backdrop-blur">
          {lane.label}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-4 p-7">
        <h3 className="font-display text-[1.75rem] leading-tight text-ink">{lane.title}</h3>
        <p className="text-[15px] leading-relaxed text-ink/65">{lane.body}</p>
        <ul className="mt-auto flex flex-wrap gap-2 pt-2" aria-label={`${lane.label} examples`}>
          {lane.tags.map((tag) => (
            <li key={tag} className="rounded-full bg-mist px-3 py-1 text-[13px] text-ink/70">
              {tag}
            </li>
          ))}
        </ul>
        <a
          href={appHref}
          className="inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-ink underline decoration-brand decoration-2 underline-offset-4 transition-colors hover:text-[#8a6400]"
        >
          Order in the app
          <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
        </a>
      </div>
    </motion.article>
  );
}

export function Lanes() {
  return (
    <section className="relative bg-paper py-24 md:py-32" aria-labelledby="lanes-title">
      <SectionHeading
        id="lanes-title"
        eyebrow="What we deliver"
        title="One partner for"
        accent="everything you make."
        lede="Tell us what you need once. We handle the makers, the timelines and the quality checks behind it."
        className="px-5"
      />
      <motion.div
        className="mx-auto mt-14 grid max-w-[1200px] gap-6 px-5 md:mt-20 md:grid-cols-2 lg:grid-cols-3"
        variants={stagger(0.12)}
        initial="hidden"
        whileInView="show"
        viewport={inView}
      >
        {lanes.map((lane) => (
          <LaneCard key={lane.id} lane={lane} />
        ))}
      </motion.div>
    </section>
  );
}
