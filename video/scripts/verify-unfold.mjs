import puppeteer from "puppeteer-core";
import fs from "node:fs";
import path from "node:path";

const outDir = path.resolve("../scratch/mobiles-review");
fs.mkdirSync(outDir, { recursive: true });

async function verify() {
  const browser = await puppeteer.launch({
    executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
    headless: "new",
    args: ["--autoplay-policy=no-user-gesture-required", "--hide-scrollbars"],
  });

  // 1. Desktop full motion (1440x900)
  console.log("Checking desktop 3-mobile animation on http://localhost:4173/ ...");
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto("http://localhost:4173/", { waitUntil: "networkidle0" });

  // t = 0.5s: Initial frame - copy is crisp and clean, phones start rising from clouds
  await new Promise((r) => setTimeout(r, 500));
  await page.screenshot({ path: path.join(outDir, "1-desktop-phones-rising.png") });

  // t = 1.8s: Mobiles fanned out in 3D with tape
  await new Promise((r) => setTimeout(r, 1300));
  await page.screenshot({ path: path.join(outDir, "2-desktop-phones-fanned.png") });

  // t = 3.2s: Settled resting state
  await new Promise((r) => setTimeout(r, 1400));
  await page.screenshot({ path: path.join(outDir, "3-desktop-settled-final.png") });

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
  console.log("Desktop check:", isDone);
  await page.close();

  // 2. Mobile (390x844)
  console.log("Checking mobile 3-mobile layout...");
  const mobilePage = await browser.newPage();
  await mobilePage.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await mobilePage.goto("http://localhost:4173/", { waitUntil: "networkidle0" });
  await new Promise((r) => setTimeout(r, 2000));
  await mobilePage.screenshot({ path: path.join(outDir, "4-mobile-phones-settled.png") });
  await mobilePage.close();

  await browser.close();
  console.log("All screenshots captured to:", outDir);
}

verify().catch((err) => {
  console.error("Verification error:", err);
  process.exit(1);
});
