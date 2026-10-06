import { PerspectiveCamera, useTexture } from "@react-three/drei";
import { ThreeCanvas } from "@remotion/three";
import { useMemo } from "react";
import { AbsoluteFill, Composition, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import * as THREE from "three";
import { PHONE, Phone } from "../three/Phone";
import { StudioLights } from "../three/StudioLights";
import { useSoftShadowTexture, useTapeTexture } from "../three/paper";

/*
 * The hero background plate sits flat, static and pristine.
 * The 3D customer app phones rise gracefully from the clouds,
 * fanning apart in 3D with realistic soft shadows, and brand
 * yellow tape slaps across their corners.
 */

const FOV = 30;
const PLATE_H = 10;
const CAM_Z = PLATE_H / 2 / Math.tan(THREE.MathUtils.degToRad(FOV / 2));

type Variant = "wide" | "compact";

type PhoneSlot = {
  readonly screen: string;
  readonly x: number;
  readonly top: number;
  readonly z: number;
  readonly lean: number;
  readonly tape?: "left" | "right";
};

type CloudSlot = { readonly tex: number; readonly x: number; readonly y: number; readonly w: number };

const VARIANTS: Record<
  Variant,
  {
    plate: string;
    background: string;
    phoneScale: number;
    phones: PhoneSlot[];
    clouds: CloudSlot[];
  }
> = {
  wide: {
    plate: "hero/plate-2560.webp",
    background: "linear-gradient(180deg, #cde5f6 0%, #d7e9f4 42.6%, #eef2f3 62.4%, #fcfcfb 85.1%)",
    phoneScale: 0.85,
    phones: [
      { screen: "screens/customer-events.png", x: -2.35, top: -2.55, z: 0.35, lean: 0.17, tape: "left" },
      { screen: "screens/customer-products-rail.png", x: 2.35, top: -2.55, z: 0.35, lean: -0.17, tape: "right" },
      { screen: "screens/customer-home.png", x: 0, top: -2.2, z: 0.75, lean: 0 },
    ],
    clouds: [
      { tex: 1, x: -4.6, y: -4.15, w: 3.6 },
      { tex: 3, x: 4.7, y: -4.1, w: 3.6 },
      { tex: 2, x: -2.2, y: -4.55, w: 3.4 },
      { tex: 4, x: 2.3, y: -4.6, w: 3.4 },
    ],
  },
  compact: {
    plate: "hero/compact-1560.webp",
    background: "linear-gradient(180deg, #c9e4f7 0%, #cfe6f6 55%, #e4eff5 85%, #fcfcfb 100%)",
    phoneScale: 0.62,
    phones: [
      { screen: "screens/customer-events.png", x: -1.3, top: 0.05, z: 0.35, lean: 0.17, tape: "left" },
      { screen: "screens/customer-products-rail.png", x: 1.3, top: 0.05, z: 0.35, lean: -0.17, tape: "right" },
      { screen: "screens/customer-home.png", x: 0, top: 0.45, z: 0.75, lean: 0 },
    ],
    clouds: [
      { tex: 1, x: -2.3, y: -2.75, w: 3.4 },
      { tex: 3, x: 2.2, y: -2.85, w: 3.4 },
      { tex: 2, x: 0, y: -3.15, w: 3.6 },
    ],
  },
};

const PHONES_FROM = 10;
const CLOUDS_FROM = 4;
const TAPE_FROM = 52;
const SETTLED = 66;

type HeroProps = { readonly variant: Variant };

export const HeroUnfold: React.FC<HeroProps> = ({ variant }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const v = VARIANTS[variant];
  const plateW = PLATE_H * (width / height);
  const settled = frame >= SETTLED;
  const ease = (from: number, config: Parameters<typeof spring>[0]["config"], duration?: number) =>
    settled ? 1 : spring({ frame: frame - from, fps, config, durationInFrames: duration });

  return (
    <AbsoluteFill style={{ background: v.background }}>
      <ThreeCanvas
        width={width}
        height={height}
        gl={{ antialias: true, alpha: true }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.NeutralToneMapping;
        }}
      >
        <PerspectiveCamera makeDefault fov={FOV} position={[0, 0, CAM_Z]} />
        <StudioLights />

        {/* Flat, static background artwork — no folding */}
        <Plate src={staticFile(v.plate)} width={plateW} height={PLATE_H} />

        {/* 3D Customer App Phones rising through the clouds */}
        {v.phones.map((slot, i) => {
          const order = slot.lean === 0 ? 0 : 1;
          const rise = ease(PHONES_FROM + order * 6, { damping: 18, stiffness: 65, mass: 1.1 });
          const fan = ease(PHONES_FROM + 14 + order * 5, { damping: 16, stiffness: 75, mass: 1 });
          const s = v.phoneScale;
          const restY = slot.top - (PHONE.height / 2) * s;
          const startY = -PLATE_H / 2 - (PHONE.height / 2) * s - 0.4;
          return (
            <group
              key={slot.screen}
              position={[
                interpolate(fan, [0, 1], [0, slot.x]),
                interpolate(rise, [0, 1], [startY, restY]),
                slot.z - i * 0.001,
              ]}
              rotation={[0, interpolate(fan, [0, 1], [0, slot.lean * 1.4]), interpolate(fan, [0, 1], [0, slot.lean])]}
              scale={s}
            >
              <PaperShadow />
              <Phone screen={staticFile(slot.screen)} screenPower={1} />
              {slot.tape ? <Tape side={slot.tape} frame={frame - TAPE_FROM - (slot.tape === "right" ? 4 : 0)} /> : null}
            </group>
          );
        })}

        {v.clouds.map((c, i) => (
          <Cloud key={i} {...c} appear={ease(CLOUDS_FROM + i * 4, { damping: 200 }, 36)} />
        ))}
      </ThreeCanvas>
    </AbsoluteFill>
  );
};

/** Flat background plate displaying the clean collage artwork */
const Plate: React.FC<{ src: string; width: number; height: number }> = ({ src, width, height }) => {
  const map = useTexture(src, (t) => {
    t.colorSpace = THREE.SRGBColorSpace;
  });
  return (
    <mesh position={[0, 0, 0]}>
      <planeGeometry args={[width, height]} />
      <meshBasicMaterial map={map} toneMapped={false} />
    </mesh>
  );
};

/** Soft shadow the phone casts on the paper behind it. */
const PaperShadow: React.FC = () => {
  const map = useSoftShadowTexture();
  return (
    <mesh position={[0.35, -0.45, -0.6]} renderOrder={-1}>
      <planeGeometry args={[PHONE.width * 1.45, PHONE.height * 1.2]} />
      <meshBasicMaterial map={map} transparent opacity={0.3} depthWrite={false} toneMapped={false} />
    </mesh>
  );
};

/** Yellow tape slapped across the phone's outer top corner once it lands. */
const Tape: React.FC<{ side: "left" | "right"; frame: number }> = ({ side, frame }) => {
  const map = useTapeTexture(`tape-${side}`);
  const dir = side === "left" ? -1 : 1;
  const slap = interpolate(frame, [0, 7], [1.5, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: (t) => 1 - (1 - t) ** 3,
  });
  const opacity = interpolate(frame, [0, 3], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <mesh
      position={[dir * (PHONE.width / 2 - 0.12), PHONE.height / 2 - 0.16, PHONE.depth / 2 + 0.03]}
      rotation={[0, 0, dir * -0.78]}
      scale={slap}
    >
      <planeGeometry args={[1.3, 0.38]} />
      <meshBasicMaterial map={map} transparent opacity={opacity} depthWrite={false} toneMapped={false} />
    </mesh>
  );
};

/** One of the hero's cumulus sprites, drifting up into place in front of the phones. */
const Cloud: React.FC<CloudSlot & { appear: number }> = ({ tex, x, y, w, appear }) => {
  const map = useTexture(staticFile(`hero/cumulus-${tex}.webp`), (t) => {
    t.colorSpace = THREE.SRGBColorSpace;
  });
  const img = map.image as HTMLImageElement;
  const h = useMemo(() => (w * img.height) / img.width, [w, img]);
  return (
    <mesh position={[x, interpolate(appear, [0, 1], [y - 1.3, y]), 1.4]}>
      <planeGeometry args={[w, h]} />
      <meshBasicMaterial map={map} transparent opacity={appear} depthWrite={false} toneMapped={false} />
    </mesh>
  );
};

export const HeroCompositions: React.FC = () => {
  return (
    <>
      <Composition
        id="HeroUnfold"
        component={HeroUnfold}
        durationInFrames={75}
        fps={30}
        width={2560}
        height={1762}
        defaultProps={{ variant: "wide" as const }}
      />
      <Composition
        id="HeroUnfoldCompact"
        component={HeroUnfold}
        durationInFrames={75}
        fps={30}
        width={1560}
        height={1866}
        defaultProps={{ variant: "compact" as const }}
      />
    </>
  );
};
