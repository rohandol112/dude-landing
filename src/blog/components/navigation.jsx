import { ChevronRightIcon } from "@heroicons/react/20/solid";

import { pageWindow } from "@/blog/format";
import { categoryPath } from "@/blog/paths";
import { cn } from "@/lib/utils";

const pill =
  "block rounded-full bg-white px-4 py-2 text-[15px] font-medium whitespace-nowrap text-ink ring-1 ring-ink/10 transition-[box-shadow,background-color] hover:ring-ink/35 aria-[current=page]:bg-ink aria-[current=page]:text-white aria-[current=page]:ring-ink";

/** All posts, then each category that has published posts. */
export function CategoryNav({ categories, active, className }) {
  return (
    <nav aria-label="Blog categories" className={className}>
      <ul className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-2 [scrollbar-width:none]">
        <li>
          <a href="/blog" aria-current={active ? undefined : "page"} className={pill}>
            All posts
          </a>
        </li>
        {categories.map((category) => (
          <li key={category.slug}>
            <a
              href={categoryPath(category.slug)}
              aria-current={active === category.slug ? "page" : undefined}
              className={pill}
            >
              {category.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/** Blog › section, above archive titles and articles. */
export function Breadcrumb({ items }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-1.5 text-[14px] text-ink/55">
        {items.map((item, index) => (
          <li key={item.label} className="flex items-center gap-1.5">
            {index > 0 ? <ChevronRightIcon aria-hidden="true" className="size-4 text-ink/35" /> : null}
            {item.href ? (
              <a href={item.href} className="font-medium text-ink/75 transition-colors hover:text-[#7a5800]">
                {item.label}
              </a>
            ) : (
              <span aria-current="page">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

const pageLink =
  "grid h-11 min-w-11 place-items-center rounded-full bg-white px-3 text-[15px] font-medium text-ink ring-1 ring-ink/10 transition-[box-shadow,background-color] hover:ring-ink/35 aria-[current=page]:bg-ink aria-[current=page]:text-white aria-[current=page]:ring-ink";

/** Numbered pages, each with its own crawlable URL. */
export function Pagination({ page, totalPages, hrefFor, className }) {
  if (totalPages <= 1) return null;
  return (
    <nav aria-label="Pagination" className={cn("flex flex-wrap items-center justify-center gap-2", className)}>
      {page > 1 ? (
        <a rel="prev" href={hrefFor(page - 1)} className={cn(pageLink, "px-5 font-semibold")}>
          Previous
        </a>
      ) : null}
      <ol className="flex flex-wrap gap-2">
        {pageWindow(page, totalPages).map((entry, index) =>
          entry === "gap" ? (
            <li key={`gap-${index}`} aria-hidden="true" className="grid h-11 place-items-center px-1 text-ink/40">
              …
            </li>
          ) : (
            <li key={entry}>
              <a href={hrefFor(entry)} aria-current={entry === page ? "page" : undefined} className={pageLink}>
                {entry}
              </a>
            </li>
          ),
        )}
      </ol>
      {page < totalPages ? (
        <a rel="next" href={hrefFor(page + 1)} className={cn(pageLink, "px-5 font-semibold")}>
          Next
        </a>
      ) : null}
    </nav>
  );
}
