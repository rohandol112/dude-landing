import type { DocumentTextIcon } from "@heroicons/react/24/outline";
import { brand, fontFamily } from "../brand";

type HeroIcon = typeof DocumentTextIcon;

export type StatusCardProps = {
  readonly icon: HeroIcon;
  readonly title: string;
  readonly detail: string;
  readonly tint: { readonly bg: string; readonly fg: string };
  /** Pixels per site-pixel, so cards match the page's own callouts at display size. */
  readonly u: number;
};

/** The Showcase section's callout card (src/components/sections/showcase.jsx), redrawn for video. */
export const StatusCard: React.FC<StatusCardProps> = ({ icon: Icon, title, detail, tint, u }) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12 * u,
        padding: `${10 * u}px ${20 * u}px ${10 * u}px ${10 * u}px`,
        borderRadius: 18 * u,
        background: "#ffffff",
        boxShadow: [
          `0 ${18 * u}px ${40 * u}px rgba(28,40,52,0.14)`,
          `0 ${2 * u}px ${6 * u}px rgba(28,40,52,0.06)`,
          `0 0 0 ${u}px rgba(10,11,12,0.05)`,
          "0 1px 0 #fff inset",
        ].join(", "),
        fontFamily,
        whiteSpace: "nowrap",
      }}
    >
      <span
        style={{
          display: "grid",
          placeItems: "center",
          width: 38 * u,
          height: 38 * u,
          borderRadius: 12 * u,
          background: tint.bg,
          color: tint.fg,
        }}
      >
        <Icon style={{ width: 20 * u, height: 20 * u }} strokeWidth={1.75} />
      </span>
      <span style={{ display: "flex", flexDirection: "column", gap: 1 * u }}>
        <span style={{ fontSize: 16 * u, fontWeight: 600, color: brand.ink, lineHeight: 1.25 }}>{title}</span>
        <span style={{ fontSize: 13 * u, color: "rgba(10,11,12,0.55)", lineHeight: 1.3 }}>{detail}</span>
      </span>
    </div>
  );
};
