import { ArrowRightIcon } from "@heroicons/react/20/solid";

import { formatDate, initials } from "@/blog/format";
import { categoryPath, mediaPath, postPath } from "@/blog/paths";
import { cn } from "@/lib/utils";

export function Avatar({ name, large = false }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "grid shrink-0 place-items-center rounded-full bg-brand font-semibold text-ink",
        large ? "size-12 text-[15px]" : "size-9 text-[12.5px]",
      )}
    >
      {initials(name)}
    </span>
  );
}

/** Author, date and reading time. */
export function Byline({ author, publishedAt, minutes, className }) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <Avatar name={author.name} />
      <span className="flex min-w-0 flex-col">
        <span className="truncate text-[15px] font-semibold text-ink">{author.name}</span>
        <span className="text-[13.5px] text-ink/55">
          <time dateTime={publishedAt}>{formatDate(publishedAt)}</time>
          <span aria-hidden="true"> · </span>
          {minutes} min read
        </span>
      </span>
    </div>
  );
}

export function CategoryLink({ category, className }) {
  return (
    <a
      href={categoryPath(category.slug)}
      className={cn(
        "w-fit text-[12.5px] font-semibold tracking-[0.12em] text-[#8a6400] uppercase transition-colors hover:text-[#5c4300]",
        className,
      )}
    >
      {category.label}
    </a>
  );
}

const titleLink = "decoration-brand decoration-[3px] underline-offset-[6px] hover:underline";

/** One post in a grid: image, category, title, excerpt and byline. */
export function PostCard({ post, eager = false }) {
  const href = postPath(post.slug);
  return (
    <article className="group flex min-w-0 flex-col">
      {/* The title link names the post; the image is a larger target for pointers. */}
      <a href={href} tabIndex={-1} aria-hidden="true" className="block overflow-hidden rounded-[24px] bg-mist">
        <img
          src={mediaPath(post.thumbnail.media_id)}
          alt={post.thumbnail.alt ?? ""}
          loading={eager ? "eager" : "lazy"}
          decoding="async"
          className="aspect-[16/10] w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
        />
      </a>
      <div className="flex flex-1 flex-col pt-5">
        <CategoryLink category={post.category} />
        <h3 className="mt-3 font-display text-[26px] leading-[1.15] tracking-[-0.01em] text-balance text-ink">
          <a href={href} className={titleLink}>
            {post.title}
          </a>
        </h3>
        <p className="mt-3 line-clamp-3 text-[16px] leading-relaxed text-ink/65">{post.excerpt}</p>
        <Byline author={post.author} publishedAt={post.published_at} minutes={post.reading_minutes} className="mt-auto pt-6" />
      </div>
    </article>
  );
}

export function PostGrid({ posts, eagerFirst = 0 }) {
  return (
    <div className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((post, index) => (
        <PostCard key={post.slug} post={post} eager={index < eagerFirst} />
      ))}
    </div>
  );
}

/** The large card at the top of the blog. */
export function FeaturedPost({ post }) {
  const href = postPath(post.slug);
  return (
    <article className="card-surface group grid gap-8 p-3 md:grid-cols-[1.15fr_1fr] md:items-center md:gap-10 md:p-4">
      <a href={href} tabIndex={-1} aria-hidden="true" className="block overflow-hidden rounded-[22px] bg-mist">
        <img
          src={mediaPath(post.thumbnail.media_id)}
          alt={post.thumbnail.alt ?? ""}
          loading="eager"
          fetchPriority="high"
          className="aspect-[4/3] w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
        />
      </a>
      <div className="flex flex-col px-3 pb-5 md:px-0 md:py-6 md:pr-8">
        <CategoryLink category={post.category} />
        <h2 className="mt-4 font-display text-[clamp(2rem,3.6vw,3.25rem)] leading-[1.05] tracking-[-0.015em] text-balance text-ink">
          <a href={href} className={titleLink}>
            {post.title}
          </a>
        </h2>
        <p className="mt-5 text-[17px] leading-relaxed text-ink/65 md:text-lg">{post.excerpt}</p>
        <Byline author={post.author} publishedAt={post.published_at} minutes={post.reading_minutes} className="mt-7" />
        <a
          href={href}
          aria-label={`Read more: ${post.title}`}
          className="mt-8 inline-flex h-12 w-fit items-center gap-2 rounded-full bg-ink px-6 text-[15px] font-semibold text-white shadow-[0_10px_24px_rgba(10,11,12,0.18)] transition-[background-color,transform] duration-200 hover:-translate-y-px hover:bg-[#232527]"
        >
          Read more <ArrowRightIcon aria-hidden="true" className="size-4" />
        </a>
      </div>
    </article>
  );
}

/** A section title in the site's serif, with an optional link on the right. */
export function SectionTitle({ id, title, accent, action }) {
  return (
    <div className="mb-10 flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
      <h2 id={id} className="font-display text-[clamp(2rem,4vw,3rem)] leading-[1.05] tracking-[-0.015em] text-ink">
        {title} {accent ? <span className="text-ink/50">{accent}</span> : null}
      </h2>
      {action}
    </div>
  );
}

export function SectionLink({ href, children }) {
  return (
    <a
      href={href}
      className="inline-flex items-center gap-1.5 text-[15px] font-semibold text-ink transition-colors hover:text-[#7a5800]"
    >
      {children} <ArrowRightIcon aria-hidden="true" className="size-4" />
    </a>
  );
}
