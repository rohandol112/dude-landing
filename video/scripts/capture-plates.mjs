import puppeteer from "puppeteer-core";
import { readFileSync } from "node:fs";
import path from "node:path";

const cleanPlateWide = readFileSync("public/hero/plate-2560.webp");
const cleanPlateCompact = readFileSync("public/hero/compact-1560.webp");

const browser = await puppeteer.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: "new",
  args: ["--autoplay-policy=no-user-gesture-required", "--hide-scrollbars"],
});

// 1. Desktop wide capture (2560 x 1762 reference aspect)
{
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
  await page.setRequestInterception(true);
  page.on("request", (req) => {
    if (req.url().includes("plate-")) {
      req.respond({ status: 200, contentType: "image/webp", body: cleanPlateWide });
    } else {
      req.continue();
    }
  });

  await page.goto("http://localhost:4173/", { waitUntil: "networkidle0" });
  await page.evaluate(() => {
    // Hide header and keep hero static
    const header = document.querySelector("header");
    if (header) header.style.display = "none";
    const sky = document.querySelector(".hero-sky-layer");
    if (sky) sky.style.display = "none";
    const video = document.querySelector(".hero-intro");
    if (video) video.style.display = "none";
    const img = document.querySelector(".hero-backdrop img");
    if (img) img.style.opacity = "1";
    document.documentElement.dataset.motion = "lite";
  });

  await new Promise((r) => setTimeout(r, 800));
  const stage = await page.$(".hero-stage");
  if (stage) {
    await stage.screenshot({ path: "public/hero/hero-full-wide.png" });
    console.log("Captured public/hero/hero-full-wide.png");
  }
  await page.close();
}

// 2. Compact mobile capture
{
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
  await page.setRequestInterception(true);
  page.on("request", (req) => {
    if (req.url().includes("compact-")) {
      req.respond({ status: 200, contentType: "image/webp", body: cleanPlateCompact });
    } else {
      req.continue();
    }
  });

  await page.goto("http://localhost:4173/", { waitUntil: "networkidle0" });
  await page.evaluate(() => {
    const header = document.querySelector("header");
    if (header) header.style.display = "none";
    const sky = document.querySelector(".hero-sky-layer");
    if (sky) sky.style.display = "none";
    const video = document.querySelector(".hero-intro");
    if (video) video.style.display = "none";
    const img = document.querySelector(".hero-backdrop img");
    if (img) img.style.opacity = "1";
    document.documentElement.dataset.motion = "lite";
  });

  await new Promise((r) => setTimeout(r, 800));
  const hero = await page.$("#top");
  if (hero) {
    await hero.screenshot({ path: "public/hero/hero-full-compact.png" });
    console.log("Captured public/hero/hero-full-compact.png");
  }
  await page.close();
}

await browser.close();
console.log("Plate capture completed!");
