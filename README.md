# Düdestrap Landing Page

Marketing site for Düdestrap, a managed-supply marketplace for custom products, events and business requirements. Bookings happen in the Düdestrap mobile apps; every call to action on this site leads to the app downloads.

## Stack

- React 19 with Vite
- Tailwind CSS 4
- Motion (Framer Motion) for one-time entrance animations
- three.js for the drifting clouds in the hero sky (lazy-loaded, skipped for reduced motion and Data Saver)
- shadcn-style Button, Card, Input, Badge and Table primitives
- Zustand for the mobile menu state
- Lucide icons
- Locally bundled Newsreader, Google Sans and Caveat fonts

## Commands

```bash
npm install
npm run dev
npm run lint
npm run build      # client build, server build, then pre-render into dist/ (with the blog when VITE_BLOG_API_URL is set)
npm run preview
npm run indexnow   # after a production deploy: ask Bing and other IndexNow engines to recrawl every URL in the live sitemap
```

## Structure

```text
src/
  assets/
    brand/                 Düdestrap wordmarks and app icon (from the customer app's brand kit)
    hero/                  hero backdrops and cloud textures
    sections/              lane card images
  blog/
    components/            blog layout, post cards, stories carousel, article body, share links
    api.js                 reads the API's public blog routes at build time
    site.js                turns the posts into the index, archive, category and post pages
    seo.js                 head tags, JSON-LD, sitemap entries and the RSS feed for blog pages
    pages.jsx              the blog page components
    main.jsx               hydrates the header, stories carousel and share buttons only
  content/
    site.js                site URL, title, description and share image (single source for SEO)
    faq.js                 FAQ copy, shown on the page and published as structured data
    services.js            service list, shown as the hero pills and published as structured data
  components/
    ui/                    shadcn-style primitives
    sections/              page sections: showcase, lanes, process, trust, pricing,
                           vendors, app download, FAQ, closing CTA
    hero.jsx               hero copy, calls to action and backdrop
    hero-sky.jsx           decides when to load the cloud layer
    hero-clouds.jsx        three.js cloud sprites
    request-dashboard.jsx  dashboard preview used in the showcase
    site-header.jsx        navigation, Resources menu and mobile menu
    site-footer.jsx
    store-badges.jsx       App Store and Google Play buttons
    wordmark.jsx           brand wordmark in black, gold, white or yellow
  lib/
    breakpoints.js         media queries shared by CSS and JS
    links.js               app store links (placeholders until the listings are live)
    motion.js              shared easing and reveal presets
    use-get-app-link.js    picks the right store for the visitor's device
  store/
    use-ui-store.js        Zustand UI state
  App.jsx
  index.css
  main.jsx
```

`vite/seo-plugin.js` writes the page title, meta description, canonical URL, Open Graph and Twitter cards, JSON-LD structured data (Organization, WebSite, FAQPage), `robots.txt`, `sitemap.xml` and `site.webmanifest` from `src/content/` at build time. If the primary domain changes, update `site.url` in `src/content/site.js`.

The page is pre-rendered: `npm run build` renders `src/entry-server.jsx` to HTML (`scripts/prerender.js`) and the browser hydrates it, so crawlers and link previews get the full content without running JavaScript. `vercel.json` pins that build command and permanently redirects `dude-landing.vercel.app` to the canonical domain.

Add official profile URLs (Instagram, LinkedIn, YouTube, app store listings) to `site.sameAs` as they go live.

`assets/` at the repository root holds the original hero reference artwork used to produce the backdrops; the page does not load it.

## Blog

The blog at `/blog` is written in the admin console by the Ops team and goes live once a Super Admin approves it. At build time the site reads published posts from the Dudestrap API's public routes (`/v1/blog/*`) and writes every blog page as static HTML, so search engines and link previews read posts without running JavaScript:

- `/blog`: the lead post, the featured stories carousel, the latest posts and a section per category
- `/blog/page/1`, `/blog/page/2`, ...: every post, 18 to a page
- `/blog/category/<slug>`, `/blog/category/<slug>/page/2`, ...: one category
- `/blog/<slug>`: one post
- `/blog/rss.xml`: the feed. Every blog page is also added to `sitemap.xml`.

Set `VITE_BLOG_API_URL` (for example `https://api.dudestrap.com`) in the Vercel project for Production and Preview. Without it the site builds with no blog and hides the Blog links in the header and footer. With it, a build fails if the API cannot answer, rather than deploying a site that has silently lost its posts.

New posts appear after a rebuild. In Vercel, create a Deploy Hook for the production branch (Settings → Git → Deploy Hooks) and give its URL to the API as `WEBSITE_REBUILD_HOOK_URL`, with `WEBSITE_REBUILD_HOOK_ENABLED=true`. The API calls it when a post is approved (at the scheduled time for a scheduled post), archived or restored.

Post images and videos load from `/blog/media/<id>`, which `vercel.json` rewrites to the API; the API answers with a short-lived signed link to the file. `cleanUrls` serves `blog/my-post.html` at `/blog/my-post`, which is the canonical URL.

With `VITE_BLOG_API_URL` in `.env.local` (or the shell), `npm run dev` renders blog pages from the API on each request (`vite/blog-dev-plugin.js`) and proxies `/blog/media` to it, so a post can be checked before a deploy.

Post bodies are Markdown. Raw HTML in a post is never rendered, and only the header, the stories carousel and the share buttons hydrate on blog pages; the rest is static HTML.

## Before launch

Set the real App Store and Google Play URLs for the customer and vendor apps in `src/lib/links.js`.
