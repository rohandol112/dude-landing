/**
 * Writes the page's search and sharing metadata from src/content/site.js at build time:
 * <head> tags (title, description, canonical, Open Graph, Twitter), JSON-LD structured
 * data (@graph: Organization, OfferCatalog, WebSite, WebPage, FAQPage), plus robots.txt,
 * sitemap.xml, site.webmanifest, and IndexNow key file.
 */
import { faqs } from "../src/content/faq.js";
import { services } from "../src/content/services.js";
import { site } from "../src/content/site.js";

const absolute = (pathname) => new URL(pathname, site.url).href;

const meta = (attrs) => ({ tag: "meta", attrs, injectTo: "head" });
const link = (attrs) => ({ tag: "link", attrs, injectTo: "head" });

function structuredData() {
  const home = absolute("/");
  const organizationId = `${home}#organization`;
  const websiteId = `${home}#website`;
  const catalogId = `${home}#services`;

  const filled = (fields) =>
    Object.fromEntries(Object.entries(fields).filter(([, value]) => Boolean(value)));

  const organization = {
    "@type": "Organization",
    "@id": organizationId,
    name: site.name,
    alternateName: site.alternateName,
    url: `${site.url}/`,
    slogan: site.tagline,
    description: site.longDescription,
    logo: {
      "@type": "ImageObject",
      "@id": `${site.url}/#logo`,
      url: absolute(site.logo.square),
      contentUrl: absolute(site.logo.square),
      width: site.logo.width,
      height: site.logo.height,
    },
    image: {
      "@type": "ImageObject",
      url: site.ogImage.url || absolute(site.ogImage.path),
      width: site.ogImage.width,
      height: site.ogImage.height,
    },
    areaServed: site.areaServed,
    knowsAbout: [...new Set([...site.topics, ...services.map((service) => service.label)])],
    sameAs: site.sameAs,
    hasOfferCatalog: {
      "@id": catalogId,
    },
    ...filled(site.business),
    ...(site.contactPoints.length ? { contactPoint: site.contactPoints } : {}),
  };

  const catalogue = {
    "@type": "OfferCatalog",
    "@id": catalogId,
    name: `${site.name} Services`,
    itemListElement: site.services.map((service) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        "@id": `${site.url}/services/${service.id}/#service`,
        name: service.name,
        serviceType: service.serviceType,
        description: service.description,
        provider: {
          "@id": organizationId,
        },
        areaServed: site.areaServed,
      },
    })),
  };

  const website = {
    "@type": "WebSite",
    "@id": websiteId,
    url: `${site.url}/`,
    name: site.name,
    alternateName: site.alternateName,
    description: site.description,
    inLanguage: site.language,
    publisher: {
      "@id": organizationId,
    },
  };

  const webPage = {
    "@type": "WebPage",
    "@id": `${site.url}/#webpage`,
    url: `${site.url}/`,
    name: site.title,
    description: site.description,
    keywords: site.keywords.join(", "),
    inLanguage: site.language,
    isPartOf: {
      "@id": websiteId,
    },
    about: {
      "@id": organizationId,
    },
    primaryImageOfPage: {
      "@type": "ImageObject",
      url: site.ogImage.url || absolute(site.ogImage.path),
      width: site.ogImage.width,
      height: site.ogImage.height,
    },
  };

  const faqPage = {
    "@type": "FAQPage",
    "@id": `${home}#faq`,
    url: `${home}#faq`,
    mainEntity: faqs.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };

  // "<" is escaped so the JSON can never close the script element early
  return JSON.stringify({
    "@context": "https://schema.org",
    "@graph": [organization, website, catalogue, webPage, faqPage],
  }).replace(/</g, "\\u003c");
}

function crawlFiles() {
  const today = new Date().toISOString().slice(0, 10);
  const files = {
    "robots.txt": `User-agent: *\nAllow: /\n\nSitemap: ${absolute("/sitemap.xml")}\n`,
    "sitemap.xml": [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
      `  <url><loc>${absolute("/")}</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>1.0</priority></url>`,
      "</urlset>",
      "",
    ].join("\n"),
    "site.webmanifest": JSON.stringify(
      {
        name: site.name,
        short_name: site.name,
        description: site.description,
        start_url: "/",
        display: "standalone",
        theme_color: site.themeColor,
        background_color: site.backgroundColor,
        icons: [
          { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
          { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
        ],
      },
      null,
      2,
    ),
  };

  if (site.indexNowKey) {
    files[`${site.indexNowKey}.txt`] = site.indexNowKey;
  }

  return files;
}

const contentTypes = {
  "robots.txt": "text/plain",
  "sitemap.xml": "application/xml",
  "site.webmanifest": "application/manifest+json",
};

export function seoPlugin() {
  return {
    name: "dudestrap-seo",

    transformIndexHtml() {
      const home = absolute("/");
      const image = site.ogImage.url || absolute(site.ogImage.path);
      return [
        { tag: "title", children: site.title, injectTo: "head" },
        meta({ name: "description", content: site.description }),
        meta({ name: "keywords", content: site.keywords.join(", ") }),
        meta({
          name: "robots",
          content: "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1",
        }),
        ...(site.verification.google
          ? [meta({ name: "google-site-verification", content: site.verification.google })]
          : []),
        ...(site.verification.bing
          ? [meta({ name: "msvalidate.01", content: site.verification.bing })]
          : []),
        ...(site.verification.yandex
          ? [meta({ name: "yandex-verification", content: site.verification.yandex })]
          : []),
        meta({ name: "theme-color", content: site.themeColor }),
        meta({ name: "application-name", content: site.name }),
        meta({ name: "apple-mobile-web-app-title", content: site.name }),
        link({ rel: "canonical", href: home }),
        link({ rel: "manifest", href: "/site.webmanifest" }),

        meta({ property: "og:type", content: "website" }),
        meta({ property: "og:site_name", content: site.name }),
        meta({ property: "og:locale", content: site.locale }),
        meta({ property: "og:url", content: home }),
        meta({ property: "og:title", content: site.title }),
        meta({ property: "og:description", content: site.description }),
        meta({ property: "og:image", content: image }),
        meta({ property: "og:image:width", content: String(site.ogImage.width) }),
        meta({ property: "og:image:height", content: String(site.ogImage.height) }),
        meta({ property: "og:image:alt", content: site.ogImage.alt }),

        meta({ name: "twitter:card", content: "summary_large_image" }),
        meta({ name: "twitter:title", content: site.title }),
        meta({ name: "twitter:description", content: site.description }),
        meta({ name: "twitter:image", content: image }),
        meta({ name: "twitter:image:alt", content: site.ogImage.alt }),

        { tag: "script", attrs: { type: "application/ld+json" }, children: structuredData(), injectTo: "head" },
      ];
    },

    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const fileName = req.url?.split("?")[0].slice(1);
        const files = crawlFiles();
        if (!(fileName in files)) return next();
        const type = contentTypes[fileName] || "text/plain";
        res.setHeader("Content-Type", type);
        res.end(files[fileName]);
      });
    },

    generateBundle() {
      for (const [fileName, source] of Object.entries(crawlFiles())) {
        this.emitFile({ type: "asset", fileName, source });
      }
    },
  };
}
