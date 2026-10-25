import { HeaderIsland } from "@/blog/components/blog-layout";
import { ShareLinks } from "@/blog/components/share-links";
import { StoryCarousel } from "@/blog/components/story-carousel";

/** Every part of a blog page that hydrates, by its data-island name. */
export const ISLANDS = {
  header: HeaderIsland,
  stories: StoryCarousel,
  share: ShareLinks,
};
