import { renderToString } from "react-dom/server";

import App from "./App.jsx";

/** Renders the page to HTML at build time; see scripts/prerender.js. */
export function render() {
  return renderToString(<App />);
}
