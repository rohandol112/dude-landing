/**
 * Blog URLs. Every page lives under /blog, so a post's slug can never be
 * "page", "category" or "media"; the API refuses those slugs too.
 */
export const BLOG_PATH = "/blog";

/** Numbered archive pages hold this many posts each. */
export const ARCHIVE_PAGE_SIZE = 18;

export const postPath = (slug) => `${BLOG_PATH}/${slug}`;

export const archivePath = (page) => `${BLOG_PATH}/page/${page}`;

export const categoryPath = (slug, page = 1) =>
  page > 1 ? `${BLOG_PATH}/category/${slug}/page/${page}` : `${BLOG_PATH}/category/${slug}`;

/**
 * Where a page loads an uploaded image or video. vercel.json sends this path
 * to the API, which redirects to a fresh signed URL, so it never expires.
 */
export const mediaPath = (mediaId) => `${BLOG_PATH}/media/${mediaId}`;

/** Reads a blog URL into the page it names; null for anything else. */
export function matchBlogRoute(pathname) {
  const path = pathname.replace(/\/+$/, "") || "/";
  if (path === BLOG_PATH) return { kind: "index" };
  let match = path.match(/^\/blog\/page\/([1-9]\d{0,3})$/);
  if (match) return { kind: "archive", page: Number(match[1]) };
  match = path.match(/^\/blog\/category\/([a-z0-9]+(?:-[a-z0-9]+)*)$/);
  if (match) return { kind: "archive", category: match[1], page: 1 };
  match = path.match(/^\/blog\/category\/([a-z0-9]+(?:-[a-z0-9]+)*)\/page\/([1-9]\d{0,3})$/);
  if (match) return { kind: "archive", category: match[1], page: Number(match[2]) };
  match = path.match(/^\/blog\/([a-z0-9]+(?:-[a-z0-9]+)*)$/);
  if (match) return { kind: "post", slug: match[1] };
  return null;
}
