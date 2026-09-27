import { BadgeCheck, BellRing, CalendarClock, Repeat, ShieldCheck, Stamp } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

import { SectionHeading } from "@/components/sections/section-heading";
import glyph from "@/assets/brand/glyph.png";
import { EASE_OUT, inView, revealUp, stagger } from "@/lib/motion";

const features = [
  { icon: BadgeCheck, title: "Vetted vendors", body: "Every vendor's documents, service areas and rate cards are reviewed before they take a job." },
  { icon: Repeat, title: "Automatic back-up", body: "If a vendor declines or misses an offer, the next best match is offered the job automatically." },
  { icon: Stamp, title: "Proof before production", body: "You approve the proof. Quality checks run before anything ships or goes live." },
  { icon: ShieldCheck, title: "Escrow and refunds", body: "Vendors are paid after delivery. Refunds and assurance claims are handled on the platform." },
  { icon: CalendarClock, title: "Your date, held", body: "Capacity is reserved when you order, so busy festival dates don't slip." },
  { icon: BellRing, title: "Updates everywhere", body: "WhatsApp, SMS, email and push: you hear as each step moves." },
];

const vendors = ["Apparel", "Print", "Stage & décor", "Photography", "Logistics"];

function Pulse({ path, begin, duration = 2.6 }) {
  return (
    <circle r="4" fill="#fed900">
      <animateMotion dur={`${duration}s`} begin={`${begin}s`} repeatCount="2" path={path} fill="freeze" keyPoints="0;1" keyTimes="0;1" calcMode="linear" />
      <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.1;0.85;1" dur={`${duration}s`} begin={`${begin}s`} repeatCount="2" fill="freeze" />
    </circle>
  );
}

const draw = {
  hidden: { pathLength: 0, opacity: 0 },
  show: (i = 0) => ({ pathLength: 1, opacity: 1, transition: { duration: 1.2, delay: 0.2 + i * 0.12, ease: EASE_OUT } }),
};

function Node({ x, y, r, label, hub, index = 0 }) {
  return (
    <motion.g
      initial={{ opacity: 0, scale: 0.6 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.3 + index * 0.1, ease: EASE_OUT }}
    >
      {hub ? <circle cx={x} cy={y} r={r + 16} fill="#fed900" opacity="0.12" /> : null}
      <circle cx={x} cy={y} r={r} fill={hub ? "#fed900" : "#16181a"} stroke={hub ? "none" : "rgba(255,255,255,0.18)"} />
      {hub ? (
        <image href={glyph} x={x - r * 0.42} y={y - r * 0.52} width={r * 0.84} height={r * 1.04} preserveAspectRatio="xMidYMid meet" />
      ) : null}
      {label ? (
        <text x={x} y={y + r + 22} textAnchor="middle" fill="rgba(255,255,255,0.72)" fontFamily="Google Sans Variable, Arial" fontSize="15">
          {label}
        </text>
      ) : null}
    </motion.g>
  );
}

function NetworkWide({ animate }) {
  const hub = { x: 500, y: 170 };
  const you = { x: 120, y: 170 };
  const vendorY = [40, 105, 170, 235, 300];
  const inbound = `M ${you.x + 30} ${you.y} C 280 ${you.y}, 330 ${hub.y}, ${hub.x - 48} ${hub.y}`;
  const outbound = vendorY.map((y) => `M ${hub.x + 48} ${hub.y} C 660 ${hub.y}, 700 ${y}, 846 ${y}`);
  return (
    <svg viewBox="0 0 1000 350" className="h-auto w-full" role="img" aria-label="Your request goes to Dudestrap, which routes it to vetted vendors">
      <motion.g initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.4 }}>
        <motion.path d={inbound} fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" variants={draw} />
        {outbound.map((d, i) => (
          <motion.path key={d} d={d} fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="1.6" variants={draw} custom={i + 1} />
        ))}
      </motion.g>
      {animate ? (
        <>
          <Pulse path={inbound} begin={0} duration={2.2} />
          {outbound.map((d, i) => (
            <Pulse key={d} path={d} begin={1.4 + i * 0.45} duration={2.4} />
          ))}
        </>
      ) : null}
      <Node x={you.x} y={you.y} r={30} label="You" />
      <Node x={hub.x} y={hub.y} r={46} hub label="Dudestrap" index={1} />
      {vendorY.map((y, i) => (
        <Node key={y} x={870} y={y} r={11} index={i + 2} />
      ))}
      {vendorY.map((y, i) => (
        <text key={vendors[i]} x={892} y={y + 5} fill="rgba(255,255,255,0.72)" fontFamily="Google Sans Variable, Arial" fontSize="15">
          {vendors[i]}
        </text>
      ))}
    </svg>
  );
}

function NetworkTall({ animate }) {
  const hub = { x: 180, y: 190 };
  const you = { x: 180, y: 50 };
  const vendorX = [36, 108, 180, 252, 324];
  const inbound = `M ${you.x} ${you.y + 26} L ${hub.x} ${hub.y - 44}`;
  const outbound = vendorX.map((x) => `M ${hub.x} ${hub.y + 44} C ${hub.x} 290, ${x} 280, ${x} 340`);
  return (
    <svg viewBox="0 0 360 420" className="mx-auto h-auto w-full max-w-sm" role="img" aria-label="Your request goes to Dudestrap, which routes it to vetted vendors">
      <motion.g initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.4 }}>
        <motion.path d={inbound} fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" variants={draw} />
        {outbound.map((d, i) => (
          <motion.path key={d} d={d} fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="1.6" variants={draw} custom={i + 1} />
        ))}
      </motion.g>
      {animate ? (
        <>
          <Pulse path={inbound} begin={0} duration={1.6} />
          {outbound.map((d, i) => (
            <Pulse key={d} path={d} begin={1 + i * 0.4} duration={2} />
          ))}
        </>
      ) : null}
      <Node x={you.x} y={you.y} r={26} label="" />
      <text x={you.x} y={you.y + 5} textAnchor="middle" fill="#fff" fontFamily="Google Sans Variable, Arial" fontSize="14">
        You
      </text>
      <Node x={hub.x} y={hub.y} r={42} hub index={1} />
      {vendorX.map((x, i) => (
        <Node key={x} x={x} y={352} r={10} index={i + 2} />
      ))}
      <text x="180" y="400" textAnchor="middle" fill="rgba(255,255,255,0.6)" fontFamily="Google Sans Variable, Arial" fontSize="13">
        Apparel · Print · Stage · Photo · Logistics
      </text>
    </svg>
  );
}

export function Trust() {
  const reduceMotion = useReducedMotion();
  return (
    <section id="trust" className="relative scroll-mt-24 overflow-hidden bg-ink py-24 text-white md:py-32" aria-labelledby="trust-title">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_40%_at_50%_0%,rgba(255,213,46,0.16),transparent_70%),radial-gradient(40%_40%_at_90%_80%,rgba(120,180,230,0.12),transparent_70%)]"
      />
      <SectionHeading
        id="trust-title"
        tone="dark"
        eyebrow="Managed supply"
        title="One accountable partner."
        accent="A vetted network behind it."
        lede="You never chase a vendor. We route every job to the right maker, keep a back-up ready and hold the money until it's done."
        className="relative px-5"
      />

      <div className="relative mx-auto mt-14 max-w-[1100px] px-5 md:mt-16">
        <div className="hidden md:block">
          <NetworkWide animate={!reduceMotion} />
        </div>
        <div className="md:hidden">
          <NetworkTall animate={!reduceMotion} />
        </div>
      </div>

      <div className="relative mx-auto mt-16 max-w-[1200px] px-5">
      <motion.ul
        className="grid gap-px overflow-hidden rounded-[28px] bg-white/10 ring-1 ring-white/10 sm:grid-cols-2 lg:grid-cols-3"
        variants={stagger(0.08)}
        initial="hidden"
        whileInView="show"
        viewport={inView}
      >
        {features.map(({ icon: Icon, title, body }) => (
          <motion.li key={title} variants={revealUp} className="flex flex-col gap-3 bg-ink p-7 transition-colors duration-300 hover:bg-[#121416]">
            <span className="grid size-10 place-items-center rounded-xl bg-brand/15 text-brand ring-1 ring-brand/25">
              <Icon className="size-5" aria-hidden="true" />
            </span>
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="text-[15px] leading-relaxed text-white/65">{body}</p>
          </motion.li>
        ))}
      </motion.ul>
      </div>
    </section>
  );
}
