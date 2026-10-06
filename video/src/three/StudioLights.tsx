import { Environment, Lightformer } from "@react-three/drei";
import { brand } from "../brand";

/** Product-shot lighting shared by every scene with a phone in it. */
export const StudioLights: React.FC = () => {
  return (
    <>
      {/* Diffuse light, so the yellow back reads as yellow while it faces the camera. */}
      <ambientLight intensity={0.55} />
      <directionalLight position={[4, 6, 10]} intensity={1.6} />

      {/* Studio reflections: overhead softbox, two strip lights for the titanium edges, warm bounce. */}
      <Environment resolution={512} frames={1}>
        <Lightformer form="rect" intensity={3} position={[0, 7, 4]} rotation-x={Math.PI / 2} scale={[12, 4, 1]} />
        <Lightformer form="rect" intensity={6} position={[-6, 0.5, 2]} rotation-y={Math.PI / 2} scale={[0.8, 14, 1]} />
        <Lightformer form="rect" intensity={6} position={[6, 0.5, 2]} rotation-y={-Math.PI / 2} scale={[0.8, 14, 1]} />
        <Lightformer
          form="rect"
          intensity={1.4}
          color={brand.yellow}
          position={[0, -6, 3]}
          rotation-x={-Math.PI / 2}
          scale={[12, 4, 1]}
        />
        <Lightformer form="ring" intensity={2.5} position={[0, 3, -9]} scale={5} />
      </Environment>
    </>
  );
};
