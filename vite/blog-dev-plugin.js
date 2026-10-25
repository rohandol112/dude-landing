/**
 * Serves /blog pages in `npm run dev` the way the build writes them: fetched from the
 * Dudestrap API, rendered on the server, then hydrated. Set VITE_BLOG_API_URL in
 * .env.development.local (or the shell) to preview the blog locally.
 */
import { readFile } from "node:fs/promises";
import path from "node:path";

const HEAD_MARKER = "<!--blog-head-->";
const ROOT_PLACEHOLDER = '<div id="root"></div>';

const isBlogPage = (pathname) =>
  (pathname === "/blog" || pathname.startsWith("/blog/")) && !pathname.startsWith("/blog/media/");

function sendHtml(res, status, html) {
  res.statusCode = status;
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.end(html);
}

export function blogDevPlugin() {
  return {
    name: "dudestrap-blog-dev",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const pathname = (req.url ?? "").split("?")[0];
        if (req.method !== "GET" || !isBlogPage(pathname)) return next();

        try {
          const entry = await server.ssrLoadModule("/src/entry-server.jsx");
          if (!entry.BLOG_API_URL) {
            sendHtml(res, 503, "<p>Set VITE_BLOG_API_URL to preview the blog, e.g. https://api.dudestrap.com</p>");
            return undefined;
          }
          const page = await entry.buildPage(entry.BLOG_API_URL, pathname);
          if (!page) {
            sendHtml(res, 404, `<p>No published blog page at ${pathname}.</p>`);
            return undefined;
          }
          const template = await readFile(path.resolve(server.config.root, "blog.html"), "utf8");
          const html = await server.transformIndexHtml(req.originalUrl ?? pathname, template);
          const { html: body, head } = entry.renderBlogPage(page);
          sendHtml(res, 200, html.replace(HEAD_MARKER, head).replace(ROOT_PLACEHOLDER, `<div id="root">${body}</div>`));
        } catch (error) {
          server.ssrFixStacktrace(error);
          next(error);
        }
        return undefined;
      });
    },
  };
}
