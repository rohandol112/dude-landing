/**
 * Tells IndexNow search engines (Bing, Yandex, Seznam, Naver) the site changed, so they
 * recrawl within minutes. Run after a production deploy: `npm run indexnow`.
 */
import { site } from "../src/content/site.js";

const { host } = new URL(site.url);
const response = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({
    host,
    key: site.indexNowKey,
    keyLocation: `${site.url}/${site.indexNowKey}.txt`,
    urlList: [`${site.url}/`],
  }),
});

// 200 and 202 both mean accepted; 202 means the key file is still being verified.
console.log(`IndexNow: HTTP ${response.status} ${response.statusText}`);
if (!response.ok) process.exitCode = 1;
