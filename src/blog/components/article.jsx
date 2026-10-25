import Markdown, { defaultUrlTransform } from "react-markdown";
import remarkGfm from "remark-gfm";

import { Avatar } from "@/blog/components/post-card";
import { anchorId, formatDate } from "@/blog/format";
import { mediaPath } from "@/blog/paths";
import { site } from "@/content/site";

const MEDIA_SCHEME = "media:";

function textOf(node) {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(textOf).join("");
  if (node && typeof node === "object" && "props" in node) return textOf(node.props.children);
  return "";
}

/** Keeps media:<id> references; every other URL gets the usual safety rules. */
function transformUrl(url) {
  return url.startsWith(MEDIA_SCHEME) ? url : defaultUrlTransform(url);
}

/**
 * A post's Markdown. Raw HTML in it is never rendered, so an editor cannot
 * put script on dudestrap.com; images and videos come from the post's own
 * uploads, named media:<id>.
 */
export function ArticleBody({ markdown, media }) {
  const usedAnchors = new Map();
  const anchorFor = (children) => {
    const base = anchorId(textOf(children)) || "section";
    const seen = usedAnchors.get(base) ?? 0;
    usedAnchors.set(base, seen + 1);
    return seen === 0 ? base : `${base}-${seen + 1}`;
  };

  const figure = (content, caption) => (
    <figure>
      {content}
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  );

  const components = {
    // The page title is the only h1, so a heading in the body starts at h2.
    h1: ({ children }) => <h2 id={anchorFor(children)}>{children}</h2>,
    h2: ({ children }) => <h2 id={anchorFor(children)}>{children}</h2>,
    h3: ({ children }) => <h3 id={anchorFor(children)}>{children}</h3>,
    // A paragraph holding only an image becomes a figure, which may not sit in a <p>.
    p: ({ node, children }) => {
      const only = node?.children.length === 1 ? node.children[0] : null;
      if (only?.type === "element" && only.tagName === "img") return children;
      return <p>{children}</p>;
    },
    img: ({ src, alt, title }) => {
      const source = typeof src === "string" ? src : "";
      if (!source.startsWith(MEDIA_SCHEME)) {
        return figure(<img src={source} alt={alt ?? ""} loading="lazy" decoding="async" />, title);
      }
      const file = media[source.slice(MEDIA_SCHEME.length)];
      // The file was removed after approval; say what it showed instead.
      if (!file) return alt ? <span className="blog-missing-media">{alt}</span> : null;
      if (file.kind === "VIDEO") {
        return figure(
          <video controls preload="metadata" playsInline aria-label={alt || undefined}>
            <source src={mediaPath(file.media_id)} type={file.content_type} />
          </video>,
          title,
        );
      }
      return figure(<img src={mediaPath(file.media_id)} alt={alt ?? ""} loading="lazy" decoding="async" />, title);
    },
    a: ({ href, children }) => {
      const target = href ?? "";
      if (target.startsWith(MEDIA_SCHEME)) {
        return <a href={mediaPath(target.slice(MEDIA_SCHEME.length))}>{children}</a>;
      }
      const external = /^https?:\/\//i.test(target) && !target.startsWith(site.url);
      return external ? (
        <a href={target} target="_blank" rel="noopener noreferrer">
          {children}
        </a>
      ) : (
        <a href={target}>{children}</a>
      );
    },
    table: ({ children }) => (
      <div className="blog-table">
        <table>{children}</table>
      </div>
    ),
  };

  return (
    <div className="blog-prose">
      <Markdown remarkPlugins={[remarkGfm]} components={components} urlTransform={transformUrl}>
        {markdown}
      </Markdown>
    </div>
  );
}

/** The article hero: an image, or a video that shows its poster first. */
export function Cover({ cover }) {
  if (cover.kind === "VIDEO") {
    return (
      <figure className="mx-auto mt-12 max-w-[1100px] px-5">
        <video
          controls
          playsInline
          preload="metadata"
          poster={cover.poster ? mediaPath(cover.poster.media_id) : undefined}
          aria-label={cover.alt}
          className="block aspect-video w-full rounded-[28px] bg-mist object-cover"
        >
          <source src={mediaPath(cover.media.media_id)} type={cover.media.content_type} />
        </video>
      </figure>
    );
  }
  return (
    <figure className="mx-auto mt-12 max-w-[1100px] px-5">
      <img
        src={mediaPath(cover.media.media_id)}
        alt={cover.alt}
        loading="eager"
        fetchPriority="high"
        className="block aspect-video w-full rounded-[28px] bg-mist object-cover"
      />
    </figure>
  );
}

/** Author, publish date, last update and reading time. */
export function AuthorBlock({ author, publishedAt, updatedAt, minutes }) {
  const updated = formatDate(updatedAt) !== formatDate(publishedAt);
  return (
    <div className="mt-10 flex items-center gap-4 border-y border-ink/10 py-5">
      <Avatar name={author.name} large />
      <div className="min-w-0">
        <p className="text-[16px] font-semibold text-ink">{author.name}</p>
        {author.role ? <p className="text-[14.5px] text-ink/60">{author.role}</p> : null}
        <p className="mt-0.5 text-[14px] text-ink/55">
          <time dateTime={publishedAt}>{formatDate(publishedAt)}</time>
          {updated ? (
            <>
              <span aria-hidden="true"> · </span>
              Updated <time dateTime={updatedAt}>{formatDate(updatedAt)}</time>
            </>
          ) : null}
          <span aria-hidden="true"> · </span>
          {minutes} min read
        </p>
      </div>
    </div>
  );
}
