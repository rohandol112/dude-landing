import { Wordmark } from "@/components/wordmark";

const columns = [
  {
    title: "What we do",
    links: [
      { label: "Products", href: "#products" },
      { label: "Events", href: "#events" },
      { label: "Business", href: "#business" },
      { label: "Pricing", href: "#pricing" },
    ],
  },
  {
    title: "Dudestrap",
    links: [
      { label: "How it works", href: "#how-it-works" },
      { label: "Why Dudestrap", href: "#trust" },
      { label: "For vendors", href: "#vendors" },
      { label: "Questions", href: "#resources" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="bg-paper px-5 pt-16 pb-10">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-12 md:flex-row md:justify-between">
        <div className="flex max-w-sm flex-col gap-4">
          <a href="#top" className="w-fit rounded-full bg-brand px-5 py-2.5" aria-label="Düdestrap home">
            <Wordmark className="w-[132px]" decorative />
          </a>
          <p className="text-[15px] leading-relaxed text-ink/60">
            A managed-supply marketplace for custom products, events and everything your business needs. Your ideas, our execution.
          </p>
        </div>
        <nav className="grid grid-cols-2 gap-10 sm:gap-16" aria-label="Footer">
          {columns.map((column) => (
            <div key={column.title} className="flex flex-col gap-4">
              <h2 className="text-sm font-semibold text-ink">{column.title}</h2>
              <ul className="flex flex-col gap-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="text-[15px] text-ink/60 transition-colors hover:text-ink">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>
      <div className="mx-auto mt-14 flex max-w-[1200px] flex-col gap-2 border-t border-ink/10 pt-6 text-sm text-ink/50 sm:flex-row sm:justify-between">
        <p>© {new Date().getFullYear()} Dudestrap. All rights reserved.</p>
        <p>Your ideas, our execution.</p>
      </div>
    </footer>
  );
}
