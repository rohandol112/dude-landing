/**
 * Each blog page's <head>: title, description, canonical URL, Open Graph and
 * Twitter cards, and JSON-LD that ties every post to the Dudestrap
 * Organization the home page already publishes. Also the sitemap entries and
 * the RSS feed. Written into the HTML at build time, so crawlers need no JS.
 */
import { site } from "../content/site.js";
import { categoryPath, mediaPath, postPath } from "./paths.js";

export const BLOG_NAME = "Dudestrap Blog";
export const BLOG_DESCRIPTION =
  "Guides, customer stories and news on events, custom merchandise and corporate gifting in India, from the Dudestrap team.";

const ROBOTS = "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1";
const RSS_ITEMS = 30;

const absolute = (path) => new URL(path, site.url).href;
const ORGANIZATION_ID = `${absolute("/")}#organization`;
const WEBSITE_ID = `${absolute("/")}#website`;
const BLOG_ID = `${absolute("/blog")}#blog`;

const ESCAPES = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (char) => ESCAPES[char]);

const attributes = (attrs) =>
  Object.entries(attrs)
    .map(([name, value]) => `${name}="${escapeHtml(value)}"`)
    .join(" ");
const meta = (attrs) => `<meta ${attributes(attrs)} />`;
const link = (attrs) => `<link ${attributes(attrs)} />`;

// "<" is escaped so the JSON can never close the script element early
const jsonLd = (data) =>
  `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, "\\u003c")}</script>`;

function breadcrumbs(items) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absolute(item.path),
    })),
  };
}

const HOME_CRUMB = { name: "Home", path: "/" };
const BLOG_CRUMB = { name: "Blog", path: "/blog" };

function archiveTitle(page) {
  const name = page.category ? page.category.label : "All posts";
  return page.page > 1 ? `${name}, page ${page.page}` : name;
}

/** What each kind of page says about itself. */
function describe(page) {
  if (page.kind === "post") {
    const { post } = page;
    return {
      title: `${post.seo.title} | Dudestrap`,
      description: post.seo.description,
      image: { url: absolute(mediaPath(post.thumbnail.media_id)), alt: post.thumbnail.alt || post.title },
    };
  }
  const image = { url: site.ogImage.url, alt: site.ogImage.alt, width: site.ogImage.width, height: site.ogImage.height };
  if (page.kind === "index") {
    return { title: "Dudestrap Blog: Event, Merch and Gifting Guides", description: BLOG_DESCRIPTION, image };
  }
  const description = page.category
    ? `${page.category.label} from the Dudestrap Blog. ${BLOG_DESCRIPTION}`
    : `Every post on the Dudestrap Blog, newest first. ${BLOG_DESCRIPTION}`;
  return { title: `${archiveTitle(page)} | ${BLOG_NAME}`, description, image };
}

function structuredData(page, url, description) {
  const blog = {
    "@type": "Blog",
    "@id": BLOG_ID,
    url: absolute("/blog"),
    name: BLOG_NAME,
    description: BLOG_DESCRIPTION,
    inLanguage: site.language,
    publisher: { "@id": ORGANIZATION_ID },
    isPartOf: { "@id": WEBSITE_ID },
  };

  if (page.kind === "index") {
    const posts = [page.hero, ...page.latest].filter(Boolean);
    return {
      "@context": "https://schema.org",
      "@graph": [
        {
          ...blog,
          blogPost: posts.map((post) => ({
            "@type": "BlogPosting",
            headline: post.title,
            url: absolute(postPath(post.slug)),
            datePublished: post.published_at,
          })),
        },
        breadcrumbs([HOME_CRUMB, BLOG_CRUMB]),
      ],
    };
  }

  if (page.kind === "archive") {
    const crumbs = [HOME_CRUMB, BLOG_CRUMB];
    if (page.category) crumbs.push({ name: page.category.label, path: categoryPath(page.category.slug) });
    return {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "CollectionPage",
          "@id": `${url}#page`,
          url,
          name: archiveTitle(page),
          description,
          isPartOf: { "@id": BLOG_ID },
          inLanguage: site.language,
        },
        breadcrumbs(crumbs),
      ],
    };
  }

  const { post } = page;
  const graph = [
    {
      "@type": "BlogPosting",
      "@id": `${url}#article`,
      headline: post.title,
      description,
      image: [absolute(mediaPath(post.thumbnail.media_id))],
      datePublished: post.published_at,
      dateModified: post.updated_at,
      author: { "@type": "Person", name: post.author.name, ...(post.author.role ? { jobTitle: post.author.role } : {}) },
      publisher: { "@id": ORGANIZATION_ID },
      mainEntityOfPage: { "@type": "WebPage", "@id": url },
      isPartOf: { "@id": BLOG_ID },
      articleSection: post.category.label,
      ...(post.tags.length ? { keywords: post.tags.join(", ") } : {}),
      inLanguage: site.language,
    },
    breadcrumbs([
      HOME_CRUMB,
      BLOG_CRUMB,
      { name: post.category.label, path: categoryPath(post.category.slug) },
      { name: post.title, path: postPath(post.slug) },
    ]),
  ];
  if (post.cover?.kind === "VIDEO") {
    graph.push({
      "@type": "VideoObject",
      name: post.title,
      description,
      thumbnailUrl: [absolute(mediaPath((post.cover.poster ?? post.thumbnail).media_id))],
      uploadDate: post.published_at,
      contentUrl: absolute(mediaPath(post.cover.media.media_id)),
    });
  }
  return { "@context": "https://schema.org", "@graph": graph };
}

/** The <head> tags for one blog page. */
export function blogHead(page) {
  const url = absolute(page.path);
  const { title, description, image } = describe(page);
  const post = page.kind === "post" ? page.post : null;

  const tags = [
    `<title>${escapeHtml(title)}</title>`,
    meta({ name: "description", content: description }),
    meta({ name: "robots", content: ROBOTS }),
    link({ rel: "canonical", href: url }),
    link({ rel: "alternate", type: "application/rss+xml", title: BLOG_NAME, href: absolute("/blog/rss.xml") }),
  ];
  if (page.kind === "archive" && page.page > 1) {
    const previous = page.category ? categoryPath(page.category.slug, page.page - 1) : `/blog/page/${page.page - 1}`;
    tags.push(link({ rel: "prev", href: absolute(previous) }));
  }
  if (page.kind === "archive" && page.page < page.totalPages) {
    const next = page.category ? categoryPath(page.category.slug, page.page + 1) : `/blog/page/${page.page + 1}`;
    tags.push(link({ rel: "next", href: absolute(next) }));
  }

  tags.push(
    meta({ property: "og:type", content: post ? "article" : "website" }),
    meta({ property: "og:site_name", content: site.name }),
    meta({ property: "og:locale", content: site.locale }),
    meta({ property: "og:url", content: url }),
    meta({ property: "og:title", content: post ? post.seo.title : title }),
    meta({ property: "og:description", content: description }),
    meta({ property: "og:image", content: image.url }),
    meta({ property: "og:image:alt", content: image.alt }),
  );
  if (image.width) {
    tags.push(
      meta({ property: "og:image:width", content: String(image.width) }),
      meta({ property: "og:image:height", content: String(image.height) }),
    );
  }
  if (post) {
    tags.push(
      meta({ property: "article:published_time", content: post.published_at }),
      meta({ property: "article:modified_time", content: post.updated_at }),
      meta({ property: "article:section", content: post.category.label }),
      ...post.tags.map((tag) => meta({ property: "article:tag", content: tag })),
    );
  }
  tags.push(
    meta({ name: "twitter:card", content: "summary_large_image" }),
    meta({ name: "twitter:title", content: post ? post.seo.title : title }),
    meta({ name: "twitter:description", content: description }),
    meta({ name: "twitter:image", content: image.url }),
    meta({ name: "twitter:image:alt", content: image.alt }),
    jsonLd(structuredData(page, url, description)),
  );
  return tags.join("\n    ");
}

/** sitemap.xml entries for every blog page. */
export function blogSitemapUrls(pages) {
  return pages.map((page) => ({
    loc: absolute(page.path),
    lastmod: page.lastModified ? page.lastModified.slice(0, 10) : null,
    changefreq: page.kind === "post" ? "monthly" : "daily",
    priority: page.kind === "post" ? "0.7" : page.kind === "index" ? "0.8" : "0.5",
  }));
}

/** RSS 2.0 feed of the newest posts. */
export function blogRssFeed(blog) {
  const items = blog.cards
    .slice(0, RSS_ITEMS)
    .map((post) => {
      const url = absolute(postPath(post.slug));
      return [
        "    <item>",
        `      <title>${escapeHtml(post.title)}</title>`,
        `      <link>${url}</link>`,
        `      <guid isPermaLink="true">${url}</guid>`,
        `      <pubDate>${new Date(post.published_at).toUTCString()}</pubDate>`,
        `      <category>${escapeHtml(post.category.label)}</category>`,
        `      <description>${escapeHtml(post.excerpt)}</description>`,
        "    </item>",
      ].join("\n");
    })
    .join("\n");
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    "  <channel>",
    `    <title>${BLOG_NAME}</title>`,
    `    <link>${absolute("/blog")}</link>`,
    `    <description>${escapeHtml(BLOG_DESCRIPTION)}</description>`,
    "    <language>en-in</language>",
    `    <atom:link href="${absolute("/blog/rss.xml")}" rel="self" type="application/rss+xml" />`,
    items,
    "  </channel>",
    "</rss>",
    "",
  ].join("\n");
}
