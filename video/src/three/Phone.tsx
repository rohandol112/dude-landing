import { RoundedBox, useTexture } from "@react-three/drei";
import { useMemo } from "react";
import * as THREE from "three";
import { brand } from "../brand";

/** Pro Max proportions in scene units (1 unit ≈ 26 mm). */
export const PHONE = {
  width: 2.93,
  height: 6.1,
  depth: 0.32,
  radius: 0.46,
} as const;

const { width: W, height: H, depth: D, radius: R } = PHONE;
const BEZEL = 0.085;

function roundedRect(w: number, h: number, r: number) {
  const s = new THREE.Shape();
  const x = -w / 2;
  const y = -h / 2;
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y);
  s.absarc(x + w - r, y + r, r, -Math.PI / 2, 0, false);
  s.lineTo(x + w, y + h - r);
  s.absarc(x + w - r, y + h - r, r, 0, Math.PI / 2, false);
  s.lineTo(x + r, y + h);
  s.absarc(x + r, y + h - r, r, Math.PI / 2, Math.PI, false);
  s.lineTo(x, y + r);
  s.absarc(x + r, y + r, r, Math.PI, Math.PI * 1.5, false);
  return s;
}

/** Flat rounded rectangle whose UVs span 0..1, so a texture fills it edge to edge. */
function roundedPlane(w: number, h: number, r: number) {
  const g = new THREE.ShapeGeometry(roundedRect(w, h, r), 32);
  const pos = g.attributes.position;
  const uv = new Float32Array(pos.count * 2);
  for (let i = 0; i < pos.count; i++) {
    uv[i * 2] = pos.getX(i) / w + 0.5;
    uv[i * 2 + 1] = pos.getY(i) / h + 0.5;
  }
  g.setAttribute("uv", new THREE.BufferAttribute(uv, 2));
  return g;
}

/** Rounded slab centred on z = 0 with softened edges. */
function roundedSlab(w: number, h: number, r: number, depth: number, bevel: number) {
  const g = new THREE.ExtrudeGeometry(roundedRect(w - 2 * bevel, h - 2 * bevel, r - bevel), {
    depth: depth - 2 * bevel,
    bevelEnabled: true,
    bevelThickness: bevel,
    bevelSize: bevel,
    bevelSegments: 8,
    curveSegments: 48,
  });
  g.translate(0, 0, -(depth - 2 * bevel) / 2);
  return g;
}

type PhoneProps = {
  /** Screenshot shown on the display. */
  readonly screen: string;
  /** 0 = display off, 1 = full brightness. */
  readonly screenPower: number;
};

export const Phone: React.FC<PhoneProps> = ({ screen, screenPower }) => {
  const map = useTexture(screen, (t) => {
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 16;
  });

  // Fit the screenshot inside the bezel without stretching it.
  const img = map.image as HTMLImageElement;
  const aspect = img.width / img.height;
  const screenH = H - 2 * BEZEL;
  const screenW = screenH * aspect;

  const geo = useMemo(
    () => ({
      body: roundedSlab(W, H, R, D, 0.06),
      screen: roundedPlane(screenW, screenH, R - (W - screenW) / 2),
      back: roundedPlane(W - 0.02, H - 0.02, R - 0.01),
      island: roundedPlane(0.8, 0.235, 0.1175),
      plateau: roundedSlab(1.32, 1.36, 0.36, 0.07, 0.025),
    }),
    [screenW, screenH],
  );

  const mat = useMemo(
    () => ({
      frame: new THREE.MeshPhysicalMaterial({
        color: "#4b4d53",
        metalness: 1,
        roughness: 0.28,
        clearcoat: 0.4,
        clearcoatRoughness: 0.2,
      }),
      blackGlass: new THREE.MeshPhysicalMaterial({
        color: "#050506",
        roughness: 0.12,
        clearcoat: 1,
        clearcoatRoughness: 0.05,
      }),
      backGlass: new THREE.MeshPhysicalMaterial({
        color: brand.yellow,
        roughness: 0.5,
        clearcoat: 1,
        clearcoatRoughness: 0.32,
      }),
      plateauGlass: new THREE.MeshPhysicalMaterial({
        color: brand.yellow,
        roughness: 0.14,
        clearcoat: 1,
        clearcoatRoughness: 0.05,
      }),
      lens: new THREE.MeshPhysicalMaterial({
        color: "#0b0d14",
        roughness: 0.05,
        clearcoat: 1,
        clearcoatRoughness: 0,
        iridescence: 0.6,
        iridescenceIOR: 1.6,
      }),
    }),
    [],
  );

  const lenses: Array<[number, number]> = [
    // Seen from the back the camera sits top-left, which is +x in the phone's own frame.
    [0.29, 0.3],
    [0.29, -0.3],
    [-0.3, 0],
  ];

  return (
    <group>
      {/* Frame and front glass: caps (group 0) get glass, sides (group 1) get titanium. */}
      <mesh geometry={geo.body} material={[mat.blackGlass, mat.frame]} />

      {/* Display. Unlit and not tone-mapped so the app's colours stay exact. */}
      <mesh geometry={geo.screen} position={[0, 0, D / 2 + 0.002]}>
        <meshPhysicalMaterial
          color="#000000"
          emissive="#ffffff"
          emissiveMap={map}
          emissiveIntensity={screenPower}
          roughness={0.2}
          clearcoat={1}
          clearcoatRoughness={0.04}
          toneMapped={false}
        />
      </mesh>
      <mesh
        geometry={geo.island}
        material={mat.blackGlass}
        position={[0, screenH / 2 - 0.07 - 0.1175, D / 2 + 0.004]}
      />

      {/* Back glass and camera plateau. */}
      <mesh
        geometry={geo.back}
        material={mat.backGlass}
        position={[0, 0, -D / 2 - 0.002]}
        rotation={[0, Math.PI, 0]}
      />
      <group position={[W / 2 - 0.16 - 0.66, H / 2 - 0.16 - 0.68, -D / 2 - 0.035]}>
        <mesh geometry={geo.plateau} material={mat.plateauGlass} />
        {lenses.map(([x, y]) => (
          <group key={`${x}:${y}`} position={[x, y, -0.06]} rotation={[Math.PI / 2, 0, 0]}>
            <mesh material={mat.frame}>
              <cylinderGeometry args={[0.235, 0.245, 0.09, 48]} />
            </mesh>
            <mesh material={mat.lens} position={[0, -0.03, 0]}>
              <cylinderGeometry args={[0.175, 0.175, 0.04, 48]} />
            </mesh>
          </group>
        ))}
        <mesh material={mat.frame} position={[-0.3, 0.42, -0.04]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.07, 0.07, 0.02, 24]} />
        </mesh>
        <mesh material={mat.lens} position={[-0.3, -0.42, -0.04]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.07, 0.07, 0.02, 24]} />
        </mesh>
      </group>

      {/* Buttons: action and volume on the left, side button on the right. */}
      <RoundedBox args={[0.06, 0.24, 0.12]} radius={0.025} material={mat.frame} position={[-W / 2 - 0.012, 1.85, 0]} />
      <RoundedBox args={[0.06, 0.44, 0.12]} radius={0.025} material={mat.frame} position={[-W / 2 - 0.012, 1.2, 0]} />
      <RoundedBox args={[0.06, 0.44, 0.12]} radius={0.025} material={mat.frame} position={[-W / 2 - 0.012, 0.62, 0]} />
      <RoundedBox args={[0.06, 0.66, 0.12]} radius={0.025} material={mat.frame} position={[W / 2 + 0.012, 1.0, 0]} />
    </group>
  );
};
