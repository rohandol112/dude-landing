/**
 * Builds the blog into static pages, so search engines, link previews and AI crawlers read
 * every post without running JavaScript. Called by scripts/prerender.js after the client and
 * server builds.
 *
 * Posts come from the Dudestrap API (VITE_BLOG_API_URL, as the server build read it, so .env
 * files count). Without it the site builds with no blog and says so; with it, an API that
 * cannot answer fails the build rather than publishing
 * a site that silently lost its blog. The API asks Vercel to rebuild whenever a post goes
 * live, so new posts appear within a build of being approved.
 */
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";

const HEAD_MARKER = "<!--blog-head-->";
const ROOT_PLACEHOLDER = '<div id="root"></div>';

function sitemapLine({ loc, lastmod, changefreq, priority }) {
  const lastmodTag = lastmod ? `<lastmod>${lastmod}</lastmod>` : "";
  return `  <url><loc>${loc}</loc>${lastmodTag}<changefreq>${changefreq}</changefreq><priority>${priority}</priority></url>`;
}

/** Writes every blog page into dist/, adds them to sitemap.xml and writes the RSS feed. */
export async function prerenderBlog({ dist, server }) {
  const templatePath = path.join(dist, "blog.html");
  const apiUrl = server.BLOG_API_URL;

  if (!apiUrl) {
    await rm(templatePath, { force: true });
    console.log("blog: VITE_BLOG_API_URL is not set, so no blog pages were built");
    return;
  }

  const template = await readFile(templatePath, "utf8");
  for (const marker of [HEAD_MARKER, ROOT_PLACEHOLDER]) {
    if (!template.includes(marker)) throw new Error(`blog: ${marker} not found in dist/blog.html`);
  }

  const { site, pages } = await server.buildAllPages(apiUrl);
  // The template is dist/blog.html, the same name the blog's front page gets.
  await rm(templatePath, { force: true });

  // /blog/my-post is written as blog/my-post.html; vercel.json's cleanUrls serves it at the
  // path without the extension, which is the canonical URL.
  for (const page of pages) {
    const { html, head } = server.renderBlogPage(page);
    const document = template
      .replace(HEAD_MARKER, head)
      .replace(ROOT_PLACEHOLDER, `<div id="root">${html}</div>`);
    const file = path.join(dist, `${page.path.slice(1)}.html`);
    await mkdir(path.dirname(file), { recursive: true });
    await writeFile(file, document);
  }

  const sitemapPath = path.join(dist, "sitemap.xml");
  const sitemap = await readFile(sitemapPath, "utf8");
  if (!sitemap.includes("</urlset>")) throw new Error("blog: dist/sitemap.xml has no </urlset> to add posts before");
  const entries = server.blogSitemapUrls(pages).map(sitemapLine).join("\n");
  await writeFile(sitemapPath, sitemap.replace("</urlset>", `${entries}\n</urlset>`));

  await mkdir(path.join(dist, "blog"), { recursive: true });
  await writeFile(path.join(dist, "blog", "rss.xml"), server.blogRssFeed(site));

  const posts = pages.filter((page) => page.kind === "post").length;
  console.log(`blog: wrote ${pages.length} pages (${posts} posts) from ${apiUrl}`);
}
