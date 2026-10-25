/**
 * Turns the published posts into the blog's pages. The build renders every
 * page this returns; the dev server builds the one a request asks for.
 */
import { fetchAllCards, fetchCategories, fetchPost } from "./api.js";
import { ARCHIVE_PAGE_SIZE, archivePath, categoryPath, matchBlogRoute, postPath } from "./paths.js";

/** Featured posts after the lead one, shown in the stories carousel. */
const STORY_LIMIT = 8;
const LATEST_LIMIT = 9;
const CATEGORY_SECTIONS = 3;
const SECTION_SIZE = 3;
const RELATED_LIMIT = 3;
const DETAIL_CONCURRENCY = 6;

/** Every published card and the categories they fall in. */
export async function loadBlogSite(apiUrl) {
  const [cards, categories] = await Promise.all([fetchAllCards(apiUrl), fetchCategories(apiUrl)]);
  return { cards, categories };
}

/** The blog's front page. */
export function indexPage(site) {
  // The newest featured post leads; with none featured, the newest post does.
  const hero = site.cards.find((card) => card.featured) ?? site.cards[0] ?? null;
  const others = site.cards.filter((card) => card.slug !== hero?.slug);
  return {
    kind: "index",
    path: "/blog",
    categories: site.categories,
    hero,
    stories: others.filter((card) => card.featured).slice(0, STORY_LIMIT),
    latest: others.slice(0, LATEST_LIMIT),
    sections: site.categories
      .slice(0, CATEGORY_SECTIONS)
      .map((category) => ({
        category,
        posts: site.cards.filter((card) => card.category.slug === category.slug).slice(0, SECTION_SIZE),
      }))
      .filter((section) => section.posts.length > 0),
    lastModified: site.cards[0]?.updated_at ?? null,
  };
}

/** Numbered pages of every post, or of one category's posts. */
export function archivePages(site, category = null) {
  const posts = category ? site.cards.filter((card) => card.category.slug === category.slug) : site.cards;
  const totalPages = Math.max(1, Math.ceil(posts.length / ARCHIVE_PAGE_SIZE));
  return Array.from({ length: totalPages }, (_, index) => {
    const page = index + 1;
    const items = posts.slice(index * ARCHIVE_PAGE_SIZE, page * ARCHIVE_PAGE_SIZE);
    return {
      kind: "archive",
      path: category ? categoryPath(category.slug, page) : archivePath(page),
      page,
      totalPages,
      total: posts.length,
      category,
      categories: site.categories,
      posts: items,
      lastModified: items[0]?.updated_at ?? null,
    };
  });
}

/** One article and up to three more from its category. */
export function postPage(site, post) {
  return {
    kind: "post",
    path: postPath(post.slug),
    post,
    related: site.cards
      .filter((card) => card.category.slug === post.category.slug && card.slug !== post.slug)
      .slice(0, RELATED_LIMIT),
    lastModified: post.updated_at,
  };
}

async function mapLimited(items, limit, run) {
  const results = new Array(items.length);
  let next = 0;
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (next < items.length) {
      const index = next;
      next += 1;
      results[index] = await run(items[index]);
    }
  });
  await Promise.all(workers);
  return results;
}

/** Every page of the blog, for the build. */
export async function buildAllPages(apiUrl) {
  const site = await loadBlogSite(apiUrl);
  const posts = await mapLimited(site.cards, DETAIL_CONCURRENCY, async (card) => {
    const post = await fetchPost(apiUrl, card.slug);
    if (!post) throw new Error(`blog: "${card.slug}" was unpublished while the site built; run the build again`);
    return post;
  });
  const pages = [
    indexPage(site),
    ...archivePages(site),
    ...site.categories.flatMap((category) => archivePages(site, { slug: category.slug, label: category.label })),
    ...posts.map((post) => postPage(site, post)),
  ];
  return { site, pages };
}

/** The one page a URL names, for the dev server; null when it names none. */
export async function buildPage(apiUrl, pathname) {
  const route = matchBlogRoute(pathname);
  if (!route) return null;
  const site = await loadBlogSite(apiUrl);
  if (route.kind === "index") return indexPage(site);
  if (route.kind === "post") {
    const post = await fetchPost(apiUrl, route.slug);
    return post ? postPage(site, post) : null;
  }
  const category = route.category ? site.categories.find((entry) => entry.slug === route.category) : null;
  if (route.category && !category) return null;
  const pages = archivePages(site, category ? { slug: category.slug, label: category.label } : null);
  return pages[route.page - 1] ?? null;
}
