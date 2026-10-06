import { PerspectiveCamera } from "@react-three/drei";
import { ThreeCanvas } from "@remotion/three";
import { CheckBadgeIcon, CreditCardIcon, DocumentTextIcon, TruckIcon } from "@heroicons/react/24/outline";
import {
  AbsoluteFill,
  Composition,
  Easing,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import * as THREE from "three";
import { brand } from "../brand";
import { PHONE, Phone } from "../three/Phone";
import { StudioLights } from "../three/StudioLights";
import { StatusCard, type StatusCardProps } from "./StatusCard";

const FOV = 26;
const CAM_Y = 0.9;

type Layout = "wide" | "tall";

/** A card's resting place: which frame edge it hangs from, and its vertical centre (fraction of height). */
type Slot = { readonly side: "left" | "right"; readonly top: number };

const LAYOUTS = {
  // Desktop and iPad landscape: cards flank the phone, overlapping its edges.
  wide: {
    camZ: 17,
    phoneY: 0.12,
    cardScale: 0.85,
    slots: [
      { side: "left", top: 0.25 },
      { side: "right", top: 0.44 },
      { side: "left", top: 0.64 },
      { side: "right", top: 0.82 },
    ],
  },
  // Phones and iPad portrait: the phone sits high and the cards fan out over its lower half.
  tall: {
    camZ: 24,
    phoneY: 1.6,
    cardScale: 2.1,
    slots: [
      { side: "left", top: 0.6 },
      { side: "right", top: 0.705 },
      { side: "left", top: 0.81 },
      { side: "right", top: 0.915 },
    ],
  },
} satisfies Record<Layout, { camZ: number; phoneY: number; cardScale: number; slots: Slot[] }>;

// Same four callouts the Showcase section shows today (src/components/sections/showcase.jsx).
const cards: Array<Omit<StatusCardProps, "u">> = [
  { icon: DocumentTextIcon, title: "Quotation v2 sent", detail: "Stage & Decor · awaiting sign-off", tint: { bg: brand.sky, fg: "#1f6fb2" } },
  { icon: CreditCardIcon, title: "Payment captured", detail: "Held in escrow until delivery", tint: { bg: "#d7f6e2", fg: "#1a8a4c" } },
  { icon: CheckBadgeIcon, title: "Proof approved", detail: "College Fest T-Shirts", tint: { bg: "rgba(254,217,0,0.4)", fg: "#8a6400" } },
  { icon: TruckIcon, title: "Delivered", detail: "Proof of delivery recorded", tint: { bg: "#efe7ff", fg: "#6b3fd1" } },
];

const CARDS_FROM = 56;
const CARD_STAGGER = 11;

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

type ShowcaseProps = { readonly layout: Layout };

export const Showcase: React.FC<ShowcaseProps> = ({ layout }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const { camZ, phoneY, cardScale, slots } = LAYOUTS[layout];
  const u = width / 1000;
  const cardU = u * cardScale;

  // The swing overshoots a little; the travel into place does not.
  const swing = spring({ frame, fps, durationInFrames: 66, config: { damping: 14, stiffness: 70, mass: 1.1 } });
  const travel = spring({ frame, fps, durationInFrames: 52, config: { damping: 200 } });
  const dolly = spring({ frame, fps, durationInFrames: 90, config: { damping: 200 } });

  // The phone's on-screen footprint at rest, for placing the cards and the floor shadow.
  const pxPerUnit = height / (2 * camZ * Math.tan(THREE.MathUtils.degToRad(FOV / 2)));
  const phone = {
    cx: width / 2,
    cy: height / 2 - phoneY * pxPerUnit,
    halfW: (PHONE.width / 2) * pxPerUnit,
    halfH: (PHONE.height / 2) * pxPerUnit,
  };

  return (
    <AbsoluteFill style={{ backgroundColor: brand.paper }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(${phone.halfW * 2.4}px ${phone.halfH * 1.25}px at ${phone.cx}px ${phone.cy}px, rgba(254,217,0,0.32), rgba(207,230,247,0.5) 52%, rgba(252,252,251,0) 100%)`,
          opacity: interpolate(frame, [0, 40], [0, 1], { ...clamp, easing: Easing.bezier(0.16, 1, 0.3, 1) }),
        }}
      />

      {/* Soft floor shadow; a contact shadow can't read under an upright phone. */}
      <div
        style={{
          position: "absolute",
          left: phone.cx - phone.halfW * 1.25,
          width: phone.halfW * 2.5,
          top: phone.cy + phone.halfH + 22 * u,
          height: 44 * u,
          background: "radial-gradient(closest-side, rgba(28,40,52,0.3), rgba(28,40,52,0.12) 55%, rgba(28,40,52,0) 100%)",
          opacity: interpolate(frame, [18, 50], [0, 1], clamp),
          scale: interpolate(travel, [0, 1], [0.4, 1]),
        }}
      />

      <ThreeCanvas
        width={width}
        height={height}
        gl={{ antialias: true, alpha: true }}
        onCreated={({ gl }) => {
          // Neutral keeps the brand yellow from drifting orange the way ACES does.
          gl.toneMapping = THREE.NeutralToneMapping;
        }}
      >
        <PerspectiveCamera
          makeDefault
          fov={FOV}
          position={[0, CAM_Y, interpolate(dolly, [0, 1], [camZ + 3, camZ])]}
          rotation={[-Math.atan(CAM_Y / camZ), 0, 0]}
        />

        <StudioLights />

        <group
          position={[
            interpolate(travel, [0, 1], [4.4, 0]),
            interpolate(travel, [0, 1], [-3.6, phoneY]),
            interpolate(travel, [0, 1], [-6, 0]),
          ]}
          rotation={[
            interpolate(swing, [0, 1], [0.55, 0.05]),
            interpolate(swing, [0, 1], [-2.7, -0.26]),
            interpolate(swing, [0, 1], [-0.32, 0]),
          ]}
        >
          <Phone
            screen={staticFile("screens/customer-home.png")}
            screenPower={interpolate(frame, [24, 46], [0, 1], {
              ...clamp,
              easing: Easing.bezier(0.33, 0, 0.2, 1),
            })}
          />
        </group>
      </ThreeCanvas>

      <AbsoluteFill style={{ perspective: 1400 * u }}>
        {cards.map((card, i) => {
          const { side, top } = slots[i];
          const local = frame - CARDS_FROM - i * CARD_STAGGER;
          const pop = spring({ frame: local, fps, config: { damping: 13, stiffness: 150, mass: 0.9 } });
          // +1 when the card sits left of the phone and should fly out leftwards.
          const dir = side === "left" ? 1 : -1;
          const edge =
            layout === "wide"
              ? side === "left"
                ? { right: width - (phone.cx - phone.halfW + 24 * u) }
                : { left: phone.cx + phone.halfW - 24 * u }
              : side === "left"
                ? { left: 52 * u }
                : { right: 52 * u };

          return (
            <div
              key={card.title}
              style={{
                position: "absolute",
                top: top * height,
                ...edge,
                transformOrigin: side === "left" ? "100% 50%" : "0% 50%",
                transform: `translateY(-50%) rotateY(${interpolate(pop, [0, 1], [-38 * dir, 7 * dir])}deg)`,
                translate: `${interpolate(pop, [0, 1], [110 * u * dir, 0])}px 0px`,
                scale: interpolate(pop, [0, 1], [0.6, 1]),
                opacity: interpolate(local, [0, 6], [0, 1], clamp),
              }}
            >
              <StatusCard {...card} u={cardU} />
            </div>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const ShowcaseCompositions: React.FC = () => {
  return (
    <>
      <Composition
        id="Showcase"
        component={Showcase}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1200}
        defaultProps={{ layout: "wide" as const }}
      />
      <Composition
        id="ShowcaseTall"
        component={Showcase}
        durationInFrames={150}
        fps={30}
        width={1080}
        height={1440}
        defaultProps={{ layout: "tall" as const }}
      />
    </>
  );
};
