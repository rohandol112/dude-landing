/**
 * Site identity and search metadata. Read by the page and by the SEO build plugin
 * (vite/seo-plugin.js), which writes the head tags, structured data, robots.txt,
 * sitemap.xml and web manifest from it.
 */
export const site = {
  // The address Vercel serves as primary; dudestrap.com redirects here. Keep in sync with Vercel → Domains.
  url: "https://www.dudestrap.com",
  name: "Dudestrap",
  alternateName: "Düdestrap",
  tagline: "Your Ideas, Our Execution.",
  title: "Dudestrap — Custom Merch, Corporate Gifts & Event Setup",
  description:
    "Dudestrap is a managed-supply marketplace for custom apparel, corporate gifts, print and event setup: clear quotes, escrow-protected payments, vetted vendors.",
  keywords: [
    "custom t-shirts",
    "custom merchandise",
    "corporate gifts",
    "employee welcome kits",
    "event setup",
    "stage and decor",
    "event photography",
    "print and branding",
    "bulk orders",
    "managed marketplace",
  ],
  locale: "en_IN",
  language: "en-IN",
  themeColor: "#fed900",
  backgroundColor: "#fcfcfb",
  ogImage: { path: "/og-image.jpg", width: 1200, height: 630, alt: "Dudestrap — Your Ideas, Our Execution." },
};
