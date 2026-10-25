/**
 * The blog is built from the Dudestrap API at build time. Without
 * VITE_BLOG_API_URL the site builds with no blog pages and no links to them,
 * so the landing page ships safely before the API serves posts.
 *
 * The build, the pre-render and the dev server all read the URL from here, so
 * a value set in a .env file counts everywhere, not only in the browser bundle.
 */
export const BLOG_API_URL = (import.meta.env.VITE_BLOG_API_URL ?? "").trim().replace(/\/+$/, "");

export const BLOG_ENABLED = BLOG_API_URL !== "";
