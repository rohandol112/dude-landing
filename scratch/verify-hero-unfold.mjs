import puppeteer from "../video/node_modules/puppeteer-core/lib/esm/puppeteer/puppeteer.js";
import fs from "node:fs";
import path from "node:path";

const outDir = path.resolve("scratch/unfold-review");
fs.mkdirSync(outDir, { recursive: true });

async function verify() {
  const browser = await puppeteer.launch({
    executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
    headless: "new",
    args: ["--autoplay-policy=no-user-gesture-required", "--hide-scrollbars"],
  });

  // 1. Desktop full motion (1440x900)
  console.log("Checking desktop unfold progression...");
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto("http://localhost:4173/", { waitUntil: "networkidle0" });

  // t = 0.5s: Packet arriving folded
  await new Promise((r) => setTimeout(r, 600));
  await page.screenshot({ path: path.join(outDir, "1-desktop-packet-arrive.png") });

  // t = 2.0s: Vertical flip opening top half slowly
  await new Promise((r) => setTimeout(r, 1500));
  await page.screenshot({ path: path.join(outDir, "2-desktop-vertical-unfold.png") });

  // t = 3.8s: Horizontal accordion unfolding panel by panel
  await new Promise((r) => setTimeout(r, 1800));
  await page.screenshot({ path: path.join(outDir, "3-desktop-accordion-unfold.png") });

  // t = 6.0s: Sheet flat, 3D phones rising from clouds
  await new Promise((r) => setTimeout(r, 2200));
  await page.screenshot({ path: path.join(outDir, "4-desktop-phones-rising.png") });

  // t = 8.8s: Settled resting state with live HTML copy
  await new Promise((r) => setTimeout(r, 2800));
  await page.screenshot({ path: path.join(outDir, "5-desktop-settled-final.png") });

  const isDone = await page.evaluate(() => {
    const hero = document.querySelector(".hero");
    const copy = document.querySelector(".hero-copy");
    const video = document.querySelector(".hero-intro");
    const computed = window.getComputedStyle(copy);
    return {
      introDone: hero?.getAttribute("data-intro") === "done",
      copyOpacity: computed.opacity,
      videoVisibility: window.getComputedStyle(video).visibility,
    };
  });
  console.log("Desktop settled check:", isDone);
  await page.close();

  // 2. Mobile full motion (390x844)
  console.log("Checking mobile unfold...");
  const mobilePage = await browser.newPage();
  await mobilePage.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await mobilePage.goto("http://localhost:4173/", { waitUntil: "networkidle0" });
  await new Promise((r) => setTimeout(r, 2500));
  await mobilePage.screenshot({ path: path.join(outDir, "6-mobile-unfolding.png") });
  await new Promise((r) => setTimeout(r, 6500));
  await mobilePage.screenshot({ path: path.join(outDir, "7-mobile-settled.png") });
  await mobilePage.close();

  await browser.close();
  console.log("All screenshots captured to:", outDir);
}

verify().catch((err) => {
  console.error("Verification error:", err);
  process.exit(1);
});
