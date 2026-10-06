import { Folder } from "remotion";
import { HeroCompositions } from "./hero/HeroUnfold";
import { ShowcaseCompositions } from "./showcase/Showcase";

export const RemotionRoot: React.FC = () => {
  return (
    <Folder name="Sections">
      <HeroCompositions />
      <ShowcaseCompositions />
    </Folder>
  );
};
