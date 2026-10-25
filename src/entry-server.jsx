import { renderToString } from "react-dom/server";

import App from "./App.jsx";

/** Renders the page to HTML at build time; see scripts/prerender.js. */
export function render() {
  return renderToString(<App />);
}

// The blog, built from the Dudestrap API at build time; see scripts/blog-prerender.js.
export { BLOG_API_URL } from "./blog/config.js";
export { renderBlogPage } from "./blog/render.jsx";
export { buildAllPages, buildPage } from "./blog/site.js";
export { blogRssFeed, blogSitemapUrls } from "./blog/seo.js";
