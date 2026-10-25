import { hydrateRoot } from "react-dom/client";

import { ISLANDS } from "@/blog/islands";
import "@/index.css";
import "@/blog/blog.css";

// Blog pages are pre-rendered HTML (scripts/prerender.js); only the islands
// that need JavaScript hydrate, each as its own small root.
for (const element of document.querySelectorAll("[data-island]")) {
  const Component = ISLANDS[element.dataset.island];
  if (!Component) {
    console.error(`blog: no island is registered as "${element.dataset.island}"`);
    continue;
  }
  const props = element.dataset.props ? JSON.parse(element.dataset.props) : {};
  hydrateRoot(element, <Component {...props} />);
}
