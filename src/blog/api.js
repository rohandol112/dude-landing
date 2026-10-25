/**
 * Reads the Dudestrap API's public blog routes (/v1/blog/*). Runs at build
 * time and in the dev server, never in the browser.
 */

const LIST_PAGE_SIZE = 48;

async function request(apiUrl, path) {
  let response;
  try {
    response = await fetch(`${apiUrl}${path}`, { headers: { Accept: "application/json" } });
  } catch (error) {
    throw new Error(`blog: could not reach ${apiUrl}${path} (${error.message}); check VITE_BLOG_API_URL`, {
      cause: error,
    });
  }
  if (response.status === 404) return null;
  const body = await response.json().catch(() => null);
  if (!response.ok || !body?.success) {
    throw new Error(
      `blog: GET ${path} answered ${response.status}${body?.error ? `: ${body.error}` : ""}; is the API at ${apiUrl} up to date?`,
    );
  }
  return body.data;
}

async function requireData(apiUrl, path) {
  const data = await request(apiUrl, path);
  if (data === null) throw new Error(`blog: ${apiUrl} has no route ${path}; deploy the API's blog module first`);
  return data;
}

/** Every published post's card, newest first. */
export async function fetchAllCards(apiUrl) {
  const cards = [];
  for (let page = 1; ; page += 1) {
    const result = await requireData(apiUrl, `/v1/blog/posts?page=${page}&per_page=${LIST_PAGE_SIZE}`);
    cards.push(...result.items);
    if (page >= result.total_pages) return cards;
  }
}

/** Categories that hold published posts, busiest first. */
export async function fetchCategories(apiUrl) {
  const result = await requireData(apiUrl, "/v1/blog/categories");
  return result.categories;
}

/** One published post, or null when no published post has the slug. */
export function fetchPost(apiUrl, slug) {
  return request(apiUrl, `/v1/blog/posts/${encodeURIComponent(slug)}`);
}
