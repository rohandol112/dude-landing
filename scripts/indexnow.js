/**
 * Tells IndexNow search engines (Bing, Yandex, Seznam, Naver) the site changed, so they
 * recrawl within minutes. Run after a production deploy: `npm run indexnow`. It submits every
 * URL in the live sitemap, so new blog posts are included.
 */
import { site } from "../src/content/site.js";

const { host } = new URL(site.url);

// IndexNow accepts up to 10,000 URLs in one submission.
const MAX_URLS = 10000;

const sitemap = await fetch(`${site.url}/sitemap.xml`);
if (!sitemap.ok) throw new Error(`IndexNow: ${site.url}/sitemap.xml answered ${sitemap.status}`);
const urlList = [...(await sitemap.text()).matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]).slice(0, MAX_URLS);
if (urlList.length === 0) throw new Error("IndexNow: the live sitemap lists no URLs");

const response = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({
    host,
    key: site.indexNowKey,
    keyLocation: `${site.url}/${site.indexNowKey}.txt`,
    urlList,
  }),
});

// 200 and 202 both mean accepted; 202 means the key file is still being verified.
console.log(`IndexNow: HTTP ${response.status} ${response.statusText} for ${urlList.length} URLs`);
if (!response.ok) process.exitCode = 1;
