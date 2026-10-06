import { useMemo } from "react";
import { random } from "remotion";
import * as THREE from "three";
import { brand } from "../brand";

/** A strip of yellow paper tape with torn ends, drawn once on a canvas (seeded, so every render matches). */
export function useTapeTexture(seed: string) {
  return useMemo(() => {
    const w = 512;
    const h = 150;
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d")!;

    const teeth = 9;
    const tear = (side: "l" | "r", i: number) => 6 + random(`${seed}-${side}-${i}`) * 18;
    ctx.beginPath();
    ctx.moveTo(tear("l", 0), 0);
    ctx.lineTo(w - tear("r", 0), 0);
    for (let i = 1; i <= teeth; i++) ctx.lineTo(w - tear("r", i), (h * i) / teeth);
    ctx.lineTo(tear("l", teeth), h);
    for (let i = teeth - 1; i >= 0; i--) ctx.lineTo(tear("l", i), (h * i) / teeth);
    ctx.closePath();
    ctx.fillStyle = brand.yellow;
    ctx.globalAlpha = 0.9;
    ctx.fill();

    // Faint fibres so it reads as paper rather than a flat swatch.
    ctx.globalAlpha = 0.08;
    ctx.strokeStyle = "#7a5a00";
    for (let i = 0; i < 26; i++) {
      const y = random(`${seed}-fibre-${i}`) * h;
      ctx.beginPath();
      ctx.moveTo(30, y);
      ctx.lineTo(w - 30, y + (random(`${seed}-fibre-tilt-${i}`) - 0.5) * 10);
      ctx.stroke();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }, [seed]);
}

/** Soft, blurred rounded-rectangle shadow for cut-outs lying on the paper. */
export function useSoftShadowTexture() {
  return useMemo(() => {
    const w = 256;
    const h = 512;
    const pad = 48;
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d")!;
    ctx.filter = "blur(18px)";
    ctx.fillStyle = "#1c2834";
    ctx.beginPath();
    ctx.roundRect(pad, pad, w - pad * 2, h - pad * 2, 40);
    ctx.fill();
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }, []);
}
