import { useTexture } from "@react-three/drei";
import { useMemo } from "react";
import * as THREE from "three";
import { useSoftShadowTexture } from "./paper";

type AccordionProps = {
  /** Artwork printed across the folded sheet. */
  readonly src: string;
  readonly width: number;
  readonly height: number;
  readonly strips: number;
  /** Fold angle of each strip in radians; 0 everywhere lays the sheet flat. */
  readonly angles: number[];
  /** Fold angle along the horizontal centerline (radians, ~Math.PI when folded down, 0 when open). */
  readonly topAngle?: number;
  /** 0..1, the drop shadow under the sheet (fade it out as the sheet fills the frame). */
  readonly shadow: number;
};

/** Paper thickness, so folded panels show a crisp white edge. Invisible once the sheet lies flat. */
const THICKNESS = 0.035;
const PAPER = "#f6f3ec";
const PAPER_BACK = "#ece6d8";

/** Horizontal fade from shade to clear, drawn once: the shadow that pools in a crease. */
function useCreaseTexture() {
  return useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 4;
    const ctx = canvas.getContext("2d")!;
    const g = ctx.createLinearGradient(0, 0, 256, 0);
    g.addColorStop(0, "rgba(0,0,0,0)");
    g.addColorStop(0.55, "rgba(0,0,0,0.25)");
    g.addColorStop(1, "rgba(0,0,0,1)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 256, 4);
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }, []);
}

/**
 * An image folded like a real paper map: vertical strips hinged edge to edge (accordion)
 * AND folded in half horizontally along the centerline.
 * First flips open vertically, then unfolds horizontally panel by panel!
 * Flat, it is a single unlit quad that reproduces the image exactly.
 */
export const Accordion: React.FC<AccordionProps> = ({
  src,
  width,
  height,
  strips,
  angles,
  topAngle = 0,
  shadow,
}) => {
  const map = useTexture(src, (t) => {
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 16;
  });
  const crease = useCreaseTexture();
  const shadowMap = useSoftShadowTexture();
  const w = width / strips;
  const hHalf = height / 2;

  const geo = useMemo(() => {
    const full = new THREE.PlaneGeometry(width, height);

    // Bottom panels: y from 0 down to -hHalf
    const bottomFaces = Array.from({ length: strips }, (_, i) => {
      const g = new THREE.PlaneGeometry(w, hHalf);
      g.translate(w / 2, -hHalf / 2, 0);
      const uv = g.attributes.uv;
      for (let k = 0; k < uv.count; k++) {
        uv.setX(k, (i + uv.getX(k)) / strips);
        uv.setY(k, uv.getY(k) * 0.5); // lower half
      }
      return g;
    });

    // Top panels: y from 0 up to +hHalf (hinged at y = 0)
    const topFaces = Array.from({ length: strips }, (_, i) => {
      const g = new THREE.PlaneGeometry(w, hHalf);
      g.translate(w / 2, hHalf / 2, 0);
      const uv = g.attributes.uv;
      for (let k = 0; k < uv.count; k++) {
        uv.setX(k, (i + uv.getX(k)) / strips);
        uv.setY(k, 0.5 + uv.getY(k) * 0.5); // upper half
      }
      return g;
    });

    const bottomBody = new THREE.BoxGeometry(w, hHalf, THICKNESS).translate(w / 2, -hHalf / 2, -THICKNESS / 2 - 0.004);
    const topBody = new THREE.BoxGeometry(w, hHalf, THICKNESS).translate(w / 2, hHalf / 2, -THICKNESS / 2 - 0.004);
    const creasePlane = new THREE.PlaneGeometry(w, hHalf).translate(w / 2, -hHalf / 2, 0.004);

    return { full, bottomFaces, topFaces, bottomBody, topBody, creasePlane };
  }, [width, height, strips, w, hHalf]);

  const mat = useMemo(
    () => ({
      body: [PAPER, PAPER, PAPER, PAPER, PAPER, PAPER_BACK].map(
        (color) => new THREE.MeshBasicMaterial({ color, toneMapped: false }),
      ),
    }),
    [],
  );

  // Flat: one quad, so no strip seam can ever show in the resting frame.
  if (angles.every((a) => a === 0) && topAngle === 0) {
    return (
      <mesh geometry={geo.full}>
        <meshBasicMaterial map={map} toneMapped={false} />
      </mesh>
    );
  }

  // Walk the hinges left to right, then centre the bundle on the origin.
  let x = 0;
  let z = 0;
  const placed = angles.map((angle, i) => {
    const ry = i % 2 === 0 ? angle : -angle;
    const at = { x, z, ry };
    x += w * Math.cos(ry);
    z -= w * Math.sin(ry);
    return at;
  });
  const zs = [...placed.map((p) => p.z), z];
  const zMid = (Math.max(...zs) + Math.min(...zs)) / 2;

  const isTopFolded = topAngle > 0.001;

  return (
    <group>
      {/* Soft shadow on the surface behind the sheet, sized to how far it has opened. */}
      <mesh position={[0.3, -0.42, Math.min(...zs) - zMid - 1.2]} renderOrder={-2}>
        <planeGeometry args={[Math.max(x * 1.12 + 0.6, 2), height * (isTopFolded ? 0.65 : 1.08)]} />
        <meshBasicMaterial map={shadowMap} transparent opacity={0.42 * shadow} depthWrite={false} toneMapped={false} />
      </mesh>

      {placed.map((p, i) => {
        const turn = Math.sin(Math.abs(p.ry));
        // Light comes from the upper left: right-facing panels fall into shade.
        const shade = 1 - (p.ry > 0 ? 0.34 : 0.06) * turn;
        const color = new THREE.Color(shade, shade, shade);
        const receding = p.ry > 0 ? 1 : -1;

        return (
          <group key={i} position={[p.x - x / 2, 0, p.z - zMid]} rotation={[0, p.ry, 0]}>
            {/* Bottom half of strip */}
            <mesh geometry={geo.bottomBody} material={mat.body} />
            <mesh geometry={geo.bottomFaces[i]}>
              <meshBasicMaterial map={map} color={color} toneMapped={false} />
            </mesh>
            <mesh geometry={geo.creasePlane} scale={[receding, 1, 1]} position={[receding > 0 ? 0 : w, 0, 0]}>
              <meshBasicMaterial
                map={crease}
                color="#1b2733"
                transparent
                side={THREE.DoubleSide}
                opacity={0.55 * turn}
                depthWrite={false}
                toneMapped={false}
              />
            </mesh>

            {/* Top half of strip — hinged at y = 0 along the horizontal crease! */}
            <group position={[0, 0, 0.005]} rotation={[-topAngle, 0, 0]}>
              <mesh geometry={geo.topBody} material={mat.body} />
              <mesh geometry={geo.topFaces[i]}>
                <meshBasicMaterial map={map} color={color} toneMapped={false} />
              </mesh>
            </group>
          </group>
        );
      })}
    </group>
  );
};
