import { BellIcon, ChatBubbleOvalLeftIcon, CreditCardIcon, DocumentCheckIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { motion } from "motion/react";

import { StoreBadges } from "@/components/store-badges";
import { Wordmark } from "@/components/wordmark";
import { links } from "@/lib/links";
import { EASE_OUT, inView, revealUp, stagger } from "@/lib/motion";

import appIcon from "@/assets/brand/app-icon.png";

const features = [
  { icon: MagnifyingGlassIcon, text: "Browse the catalogue or start a custom request" },
  { icon: DocumentCheckIcon, text: "Review quotes and approve proofs in a tap" },
  { icon: CreditCardIcon, text: "Pay securely with Razorpay" },
  { icon: BellIcon, text: "Live updates from quote to delivery" },
];

const orders = [
  { title: "College Fest T-Shirts", meta: "Proof ready to review", tone: "bg-brand/35 text-[#7a5800]", status: "Action" },
  { title: "Stage & Decor", meta: "Quotation v2 · ₹ confirmed", tone: "bg-sky text-[#1f6fb2]", status: "Quote" },
  { title: "Employee Welcome Kit", meta: "Out for delivery", tone: "bg-[#d7f6e2] text-[#1a8a4c]", status: "Shipping" },
];

function PhonePreview() {
  return (
    <div className="relative mx-auto w-[280px] sm:w-[300px]" aria-hidden="true">
      <div className="rounded-[46px] bg-ink p-2.5 shadow-[0_40px_90px_rgba(10,11,12,0.28)]">
        <div className="relative overflow-hidden rounded-[38px] bg-[linear-gradient(180deg,#d4e9f8,#f3f8fb_42%,#fff)]">
          <div className="mx-auto mt-2.5 h-6 w-24 rounded-full bg-ink" />
          <div className="flex items-center justify-between px-5 pt-4">
            <Wordmark className="w-[92px]" decorative />
            <span className="grid size-8 place-items-center rounded-full bg-white shadow-sm">
              <BellIcon className="size-4 text-ink" strokeWidth={2} />
            </span>
          </div>
          <p className="px-5 pt-5 font-display text-[26px] leading-tight text-ink">
            Your <span className="text-ink/50">orders</span>
          </p>
          <div className="flex flex-col gap-2.5 px-4 pt-4 pb-5">
            {orders.map((order, index) => (
              <motion.div
                key={order.title}
                className="flex items-center justify-between gap-3 rounded-2xl bg-white p-3.5 shadow-[0_0_0_1px_rgba(10,11,12,0.05),0_6px_16px_-8px_rgba(28,40,52,0.2)]"
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.12, ease: EASE_OUT }}
              >
                <span className="flex min-w-0 flex-col">
                  <span className="truncate text-[13px] font-semibold text-ink">{order.title}</span>
                  <span className="truncate text-[11px] text-ink/55">{order.meta}</span>
                </span>
                <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${order.tone}`}>{order.status}</span>
              </motion.div>
            ))}
            <div className="mt-1 grid h-11 place-items-center rounded-full bg-ink text-[13px] font-semibold text-white">Start a request</div>
            <div className="flex items-center justify-center gap-1.5 pt-1 text-[11px] text-ink/50">
              <ChatBubbleOvalLeftIcon className="size-3.5" strokeWidth={2} />
              Updates also arrive on WhatsApp
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AppDownload() {
  return (
    <section id="get-app" className="relative scroll-mt-24 overflow-hidden bg-paper py-24 md:py-32" aria-labelledby="app-title">
      <div className="mx-auto grid max-w-[1200px] items-center gap-16 px-5 lg:grid-cols-[1.1fr_1fr]">
        <motion.div className="flex flex-col gap-7" variants={stagger(0.09)} initial="hidden" whileInView="show" viewport={inView}>
          <motion.img variants={revealUp} src={appIcon} alt="" width="72" height="72" className="size-[72px] rounded-[20px] shadow-[0_12px_30px_rgba(190,150,0,0.3)]" />
          <motion.h2 variants={revealUp} id="app-title" className="font-display text-[clamp(2.25rem,5.2vw,4.25rem)] leading-[1.02] text-balance text-ink">
            Your ideas, <span className="whitespace-nowrap text-ink/50">in your pocket.</span>
          </motion.h2>
          <motion.p variants={revealUp} className="max-w-xl text-[17px] leading-relaxed text-ink/65 md:text-lg">
            Get the Dudestrap app to order, approve and track everything from your phone.
          </motion.p>
          <motion.ul variants={revealUp} className="grid gap-3 sm:grid-cols-2">
            {features.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-start gap-3 text-[15px] text-ink/75">
                <span className="grid size-8 shrink-0 place-items-center rounded-xl bg-brand/30 text-ink">
                  <Icon className="size-4" strokeWidth={2} aria-hidden="true" />
                </span>
                <span className="pt-1">{text}</span>
              </li>
            ))}
          </motion.ul>
          <motion.div variants={revealUp} className="flex flex-col gap-4 pt-2">
            <StoreBadges appStoreHref={links.appStore} playStoreHref={links.playStore} audience="the Dudestrap app" />
            <p className="text-sm text-ink/55">
              Are you a vendor?{" "}
              <a href={links.vendorPlayStore} className="font-semibold text-ink underline decoration-brand decoration-2 underline-offset-4">
                Get the Dudestrap Vendor app
              </a>
            </p>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.9, ease: EASE_OUT }}
          className="relative"
        >
          <div aria-hidden="true" className="absolute inset-x-[10%] top-[12%] bottom-[8%] -z-0 rounded-full bg-[radial-gradient(closest-side,rgba(254,217,0,0.45),transparent)] blur-2xl" />
          <PhonePreview />
        </motion.div>
      </div>
    </section>
  );
}
