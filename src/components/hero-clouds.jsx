import { useEffect, useRef } from "react";
import { PerspectiveCamera, Scene, Sprite, SpriteMaterial, SRGBColorSpace, TextureLoader, Timer, WebGLRenderer } from "three";

import cumulus1 from "@/assets/hero/cumulus-1.webp";
import cumulus2 from "@/assets/hero/cumulus-2.webp";
import cumulus3 from "@/assets/hero/cumulus-3.webp";
import cumulus4 from "@/assets/hero/cumulus-4.webp";

const TEXTURES = [cumulus1, cumulus2, cumulus3, cumulus4];
const CAMERA_Z = 12;
const FOV = 40;

/*
 * Clouds as fractions of the hero: x -0.5 (left) … 0.5 (right), y -0.5 (bottom) … 0.5 (top),
 * w = width as a fraction of the hero width. `drift` is hero widths per second; clouds with
 * drift wrap around, the rest only sway a few pixels so they never slide over the artwork.
 */
const DESKTOP = [
  // along the top edge, seen through the glass nav
  { tex: 0, x: -0.37, y: 0.47, z: -2, w: 0.2, drift: 0.0035 },
  { tex: 2, x: 0.02, y: 0.51, z: -5, w: 0.17, drift: 0.0025, opacity: 0.9 },
  { tex: 1, x: 0.36, y: 0.45, z: -2, w: 0.19, drift: 0.003 },
  { tex: 3, x: -0.12, y: 0.41, z: -8, w: 0.1, drift: 0.002, opacity: 0.7 },
  // between the handwritten notes and the headline
  { tex: 3, x: -0.265, y: 0.19, z: -1, w: 0.085 },
  { tex: 0, x: 0.265, y: 0.25, z: -1, w: 0.08 },
  // rolling over the painted cloud sea
  { tex: 1, x: -0.3, y: -0.44, z: 0, w: 0.26, drift: 0.002 },
  { tex: 2, x: 0.08, y: -0.47, z: -1, w: 0.28, drift: 0.0016 },
  { tex: 0, x: 0.42, y: -0.5, z: 0, w: 0.24, drift: 0.0018 },
];

const COMPACT = [
  { tex: 0, x: -0.32, y: 0.46, z: -2, w: 0.46, drift: 0.004 },
  { tex: 1, x: 0.34, y: 0.45, z: -3, w: 0.42, drift: 0.0032 },
  { tex: 2, x: -0.18, y: -0.46, z: 0, w: 0.6, drift: 0.0022 },
  { tex: 3, x: 0.38, y: -0.48, z: -1, w: 0.5, drift: 0.0018 },
];

/** Plain three.js sprite clouds: a handful of draw calls, no per-frame allocations. */
export default function HeroClouds({ compact, active, onReady }) {
  const hostRef = useRef(null);
  const loopRef = useRef(null);
  const rendererRef = useRef(null);
  const activeRef = useRef(active);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return undefined;

    let disposed = false;
    const renderer = new WebGLRenderer({ alpha: true, antialias: false, powerPreference: "low-power" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, compact ? 1.25 : 1.5));
    renderer.outputColorSpace = SRGBColorSpace;
    renderer.domElement.setAttribute("aria-hidden", "true");
    host.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const scene = new Scene();
    const camera = new PerspectiveCamera(FOV, 1, 0.1, 100);
    camera.position.z = CAMERA_Z;

    const layout = compact ? COMPACT : DESKTOP;
    const materials = [];
    const clouds = [];
    let textures = [];
    let aspect = 1;

    // visible size of the view plane at depth z
    const frameAt = (z) => {
      const height = 2 * Math.tan((FOV * Math.PI) / 360) * (CAMERA_Z - z);
      return { height, width: height * aspect };
    };

    const place = () => {
      for (const cloud of clouds) {
        const { width, height } = frameAt(cloud.z);
        const image = cloud.sprite.material.map.image;
        const w = cloud.w * width;
        cloud.sprite.scale.set(w, (w * image.height) / image.width, 1);
        cloud.sprite.position.set(cloud.x * width, cloud.y * height, cloud.z);
      }
    };

    const resize = () => {
      const { clientWidth, clientHeight } = host;
      if (!clientWidth || !clientHeight) return;
      renderer.setSize(clientWidth, clientHeight, false);
      aspect = clientWidth / clientHeight;
      camera.aspect = aspect;
      camera.updateProjectionMatrix();
      place();
      renderer.render(scene, camera);
    };

    const timer = new Timer();
    const loop = (timestamp) => {
      timer.update(timestamp);
      const delta = Math.min(timer.getDelta(), 0.1);
      const elapsed = timer.getElapsed();
      for (const cloud of clouds) {
        if (cloud.drift) {
          cloud.x += cloud.drift * delta;
          const edge = 0.5 + cloud.w / 2 + 0.02;
          if (cloud.x > edge) cloud.x = -edge;
        }
        const { width, height } = frameAt(cloud.z);
        const sway = cloud.drift ? 0 : Math.sin(elapsed * 0.25 + cloud.tex) * 0.004;
        cloud.sprite.position.x = (cloud.x + sway) * width;
        cloud.sprite.position.y = cloud.y * height;
      }
      renderer.render(scene, camera);
    };
    loopRef.current = loop;

    const loader = new TextureLoader();
    Promise.all(TEXTURES.map((url) => loader.loadAsync(url)))
      .then((loaded) => {
        if (disposed) {
          loaded.forEach((texture) => texture.dispose());
          return;
        }
        textures = loaded;
        textures.forEach((texture) => {
          texture.colorSpace = SRGBColorSpace;
        });
        for (const spec of layout) {
          const material = new SpriteMaterial({ map: textures[spec.tex], transparent: true, depthWrite: false, opacity: spec.opacity ?? 1 });
          materials.push(material);
          const sprite = new Sprite(material);
          sprite.renderOrder = -spec.z;
          scene.add(sprite);
          clouds.push({ ...spec, sprite });
        }
        resize();
        renderer.setAnimationLoop(activeRef.current ? loop : null);
        requestAnimationFrame(() => onReady?.());
      })
      .catch(() => {
        // the painted clouds in the hero art remain; nothing else to do
      });

    const observer = new ResizeObserver(resize);
    observer.observe(host);

    return () => {
      disposed = true;
      observer.disconnect();
      renderer.setAnimationLoop(null);
      materials.forEach((material) => material.dispose());
      textures.forEach((texture) => texture.dispose());
      renderer.dispose();
      renderer.domElement.remove();
      rendererRef.current = null;
      loopRef.current = null;
    };
  }, [compact, onReady]);

  // pause the loop while the hero is off-screen
  useEffect(() => {
    activeRef.current = active;
    const renderer = rendererRef.current;
    if (renderer && loopRef.current) renderer.setAnimationLoop(active ? loopRef.current : null);
  }, [active]);

  return <div ref={hostRef} className="hero-sky-canvas" />;
}
