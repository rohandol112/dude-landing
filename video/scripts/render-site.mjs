// Renders the website's scenes: PNG frames from Remotion, then H.264 video, posters and
// stills with the system FFmpeg. Remotion's bundled FFmpeg is blocked on this machine
// (Windows Smart App Control kills it), so encoding happens here instead.
//
//   node scripts/render-site.mjs                    # everything
//   node scripts/render-site.mjs hero-wide          # one target
//
// Env: FFMPEG (default "ffmpeg").
//
// Every video stays inside H.264 High@4.0 (at most 8192 macroblocks a frame, 1080p class) so
// low-end phones decode it in hardware. No WebM: VP9 came out larger, and every browser plays H.264.

import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, rmSync } from "node:fs";
import path from "node:path";

const ffmpeg = process.env.FFMPEG ?? "ffmpeg";
const videos = path.resolve("../public/videos");
const heroAssets = path.resolve("../src/assets/hero");

/**
 * name → composition and outputs.
 *   width    encoded video width (height follows the aspect, rounded to even)
 *   crf      x264 quality (lower = better, bigger)
 *   posters  write <name>-start.webp and <name>-end.webp next to the video
 *   stills   images cut from the last frame: [file, width, webp quality]
 */
const TARGETS = {
  "showcase-wide": { id: "Showcase", width: 1728, crf: 24, posters: true },
  "showcase-tall": { id: "ShowcaseTall", width: 1080, crf: 24, posters: true },
  // The hero's last frame is the static hero artwork (src/assets/hero), at the sizes the
  // <picture> srcset asks for, so the video hands over to the image without a visible change.
  "hero-wide": {
    id: "HeroUnfold",
    width: 1600,
    crf: 25,
    stills: [
      [path.join(heroAssets, "plate-2560.webp"), 2560, 74],
      [path.join(heroAssets, "plate-1920.webp"), 1920, 76],
      [path.join(heroAssets, "plate-1280.webp"), 1280, 78],
    ],
  },
  "hero-compact": {
    id: "HeroUnfoldCompact",
    width: 900,
    crf: 25,
    stills: [
      [path.join(heroAssets, "compact-1560.webp"), 1560, 74],
      [path.join(heroAssets, "compact-1170.webp"), 1170, 76],
      [path.join(heroAssets, "compact-780.webp"), 780, 78],
    ],
  },
};

const run = (cmd, args) => execFileSync(cmd, args, { stdio: ["ignore", "ignore", "inherit"], shell: cmd === "npx" });
const quiet = ["-y", "-loglevel", "error"];

mkdirSync(videos, { recursive: true });
const names = process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(TARGETS);

for (const name of names) {
  const target = TARGETS[name];
  if (!target) throw new Error(`Unknown target "${name}". Known: ${Object.keys(TARGETS).join(", ")}`);
  const seq = path.resolve("out/seq", name);
  if (existsSync(seq)) rmSync(seq, { recursive: true });

  console.log(`▸ ${name}: rendering ${target.id}`);
  run("npx", ["remotion", "render", target.id, seq, "--sequence", "--image-format=png", "--log=error"]);

  const frames = readdirSync(seq).filter((f) => f.endsWith(".png")).sort();
  const pattern = frames[0].replace(/\d+(?=\.png$)/, (d) => `%0${d.length}d`);
  const first = path.join(seq, frames[0]);
  const last = path.join(seq, frames.at(-1));

  console.log(`▸ ${name}: encoding ${frames.length} frames at ${target.width}px`);
  run(ffmpeg, [
    ...quiet, "-framerate", "30", "-i", path.join(seq, pattern),
    // Downscale in RGB, then tag as BT.709 limited range so browsers convert colours back exactly.
    "-vf", `scale=${target.width}:-2:flags=lanczos:out_color_matrix=bt709:out_range=tv,format=yuv420p`,
    "-colorspace", "bt709", "-color_primaries", "bt709", "-color_trc", "bt709", "-color_range", "tv",
    "-c:v", "libx264", "-preset", "slow", "-crf", String(target.crf),
    "-profile:v", "high", "-level:v", "4.0", "-maxrate", "6M", "-bufsize", "12M",
    "-movflags", "+faststart", "-an",
    path.join(videos, `${name}.mp4`),
  ]);

  const webp = (input, output, width, quality) =>
    run(ffmpeg, [...quiet, "-i", input, ...(width ? ["-vf", `scale=${width}:-1:flags=lanczos`] : []), "-quality", String(quality), "-compression_level", "6", output]);

  if (target.posters) {
    // Start: what shows before playback. End: the resting frame (reduced motion, low-end, no JS).
    webp(first, path.join(videos, `${name}-start.webp`), target.width, 80);
    webp(last, path.join(videos, `${name}-end.webp`), target.width, 84);
  }
  for (const [file, width, quality] of target.stills ?? []) webp(last, file, width, quality);
}
