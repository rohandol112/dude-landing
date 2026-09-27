/**
 * Pre-renders the page into dist/index.html so the content is in the HTML before any
 * JavaScript runs: search engines, link previews and AI crawlers read it directly, and
 * the browser hydrates it instead of rendering from an empty root.
 *
 * Runs after `vite build` (client) and `vite build --ssr src/entry-server.jsx --outDir dist-ssr`.
 */
import { readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const htmlPath = path.join(root, "dist", "index.html");
const serverDir = path.join(root, "dist-ssr");

const { render } = await import(pathToFileURL(path.join(serverDir, "entry-server.js")).href);
const appHtml = render();

const template = await readFile(htmlPath, "utf8");
const placeholder = '<div id="root"></div>';
if (!template.includes(placeholder)) throw new Error(`prerender: ${placeholder} not found in dist/index.html`);

await writeFile(htmlPath, template.replace(placeholder, `<div id="root">${appHtml}</div>`));
await rm(serverDir, { recursive: true, force: true });

console.log(`prerender: wrote ${(appHtml.length / 1024).toFixed(1)} kB of HTML into dist/index.html`);
