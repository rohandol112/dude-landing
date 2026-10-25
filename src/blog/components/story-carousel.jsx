import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeftIcon, ArrowRightIcon, ChevronRightIcon } from "@heroicons/react/20/solid";

import { storyCallToAction } from "@/blog/format";
import { mediaPath, postPath } from "@/blog/paths";
import { cn } from "@/lib/utils";

/** One story: a tall image with a name over it, the title, and a link. */
function StoryCard({ post }) {
  const href = postPath(post.slug);
  const callToAction = storyCallToAction(post.card_label);
  return (
    <article className="group flex h-full flex-col">
      <a
        href={href}
        tabIndex={-1}
        aria-hidden="true"
        className="relative block aspect-[3/4] overflow-hidden rounded-[24px] bg-ink"
      >
        <img
          src={mediaPath(post.thumbnail.media_id)}
          alt={post.thumbnail.alt ?? ""}
          loading="lazy"
          decoding="async"
          className="size-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
        />
        {/* A soft shade under the name keeps it legible on any image. */}
        <span
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(to_top,rgba(10,11,12,0.62),rgba(10,11,12,0)_48%)]"
        />
        <span className="absolute inset-x-6 bottom-6 text-[clamp(1.4rem,2.2vw,1.9rem)] leading-[1.1] font-bold tracking-[-0.015em] text-white [text-shadow:0_1px_14px_rgba(0,0,0,0.25)]">
          {post.card_label || post.category.label}
        </span>
      </a>
      <h3 className="mt-6 text-[19px] leading-[1.5] text-pretty text-ink md:text-[20px]">
        <a href={href} className="decoration-brand decoration-[3px] underline-offset-[5px] hover:underline">
          {post.title}
        </a>
      </h3>
      <a
        href={href}
        aria-label={`${callToAction}: ${post.title}`}
        className="mt-auto inline-flex w-fit items-center gap-1 pt-5 text-[17px] font-semibold text-[#7a5800] transition-colors hover:text-[#4d3800]"
      >
        {callToAction}
        <ChevronRightIcon aria-hidden="true" className="size-5 transition-transform group-hover:translate-x-0.5" />
      </a>
    </article>
  );
}

const control =
  "grid size-14 place-items-center rounded-full transition-[background-color,box-shadow,transform,color] duration-200 enabled:cursor-pointer enabled:bg-brand enabled:text-ink enabled:shadow-[0_10px_24px_rgba(190,150,0,0.22)] enabled:hover:-translate-y-px enabled:hover:bg-[#ffe234] disabled:bg-white disabled:text-ink/30 disabled:ring-1 disabled:ring-ink/10 max-sm:size-11";

/**
 * A row of story cards with previous and next buttons. The cards are links
 * in the pre-rendered HTML, so crawlers and readers without JavaScript get
 * them all; the buttons only scroll the row.
 */
export function StoryCarousel({ id, title, accent, posts }) {
  const trackRef = useRef(null);
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(posts.length > 1);

  const measure = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    setCanGoBack(track.scrollLeft > 1);
    setCanGoForward(track.scrollLeft + track.clientWidth < track.scrollWidth - 1);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return undefined;
    measure();
    track.addEventListener("scroll", measure, { passive: true });
    const observer = new ResizeObserver(measure);
    observer.observe(track);
    return () => {
      track.removeEventListener("scroll", measure);
      observer.disconnect();
    };
  }, [measure]);

  const step = (direction) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector("li");
    const gap = Number.parseFloat(getComputedStyle(track).columnGap) || 0;
    const distance = card ? card.getBoundingClientRect().width + gap : track.clientWidth;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    track.scrollBy({ left: direction * distance, behavior: reduceMotion ? "auto" : "smooth" });
  };

  if (posts.length === 0) return null;

  return (
    <section aria-labelledby={id} className="mx-auto max-w-[1200px] px-5">
      <div className="mb-10 flex items-end justify-between gap-6">
        <h2 id={id} className="font-display text-[clamp(2rem,4vw,3rem)] leading-[1.05] tracking-[-0.015em] text-ink">
          {title} {accent ? <span className="text-ink/50">{accent}</span> : null}
        </h2>
        <div className="flex shrink-0 gap-3">
          <button
            type="button"
            className={control}
            onClick={() => step(-1)}
            disabled={!canGoBack}
            aria-label="Previous stories"
          >
            <ArrowLeftIcon aria-hidden="true" className="size-5" />
          </button>
          <button
            type="button"
            className={control}
            onClick={() => step(1)}
            disabled={!canGoForward}
            aria-label="Next stories"
          >
            <ArrowRightIcon aria-hidden="true" className="size-5" />
          </button>
        </div>
      </div>
      <ul
        ref={trackRef}
        className={cn(
          "grid snap-x snap-mandatory auto-cols-[82%] grid-flow-col gap-4 overflow-x-auto overscroll-x-contain pb-2 [scrollbar-width:none] sm:auto-cols-[calc((100%-24px)/2.2)] sm:gap-6 lg:auto-cols-[calc((100%-72px)/3.4)] [&::-webkit-scrollbar]:hidden",
        )}
      >
        {posts.map((post) => (
          <li key={post.slug} className="min-w-0 snap-start">
            <StoryCard post={post} />
          </li>
        ))}
      </ul>
    </section>
  );
}
