import { SectionHeading } from "@/components/sections/section-heading";
import { SceneVideo } from "@/components/ui/scene-video";

export function Showcase() {
  return (
    <section id="platform" className="relative scroll-mt-28 overflow-hidden bg-paper pt-10 pb-24 md:pt-16 md:pb-36" aria-labelledby="platform-title">
      <SectionHeading
        id="platform-title"
        eyebrow="The Dudestrap app"
        title="Every request,"
        accent="one clear view."
        lede="Quotes, payments, production proofs and delivery updates for every order, in one place. When something moves, you hear about it on WhatsApp, SMS or email."
        className="px-5"
      />

      {/* 3D scene from video/src/showcase: the app swings in and each order update pops out beside it. */}
      <div className="mx-auto mt-10 w-full max-w-[1100px] px-4 md:mt-14 md:px-10">
        <SceneVideo
          name="showcase"
          alt="The Dudestrap app on a phone, with order updates beside it: quotation v2 sent, payment captured and held in escrow, production proof approved, delivered with proof of delivery."
        />
      </div>
    </section>
  );
}
