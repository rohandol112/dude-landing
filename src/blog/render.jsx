import { renderToString } from "react-dom/server";

import { BlogDocument } from "@/blog/pages";
import { blogHead } from "@/blog/seo";

/** One blog page's body HTML and <head> tags. */
export function renderBlogPage(page) {
  return { html: renderToString(<BlogDocument page={page} />), head: blogHead(page) };
}
