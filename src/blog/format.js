// India time, so the build machine and the browser print the same date.
const dateFormat = new Intl.DateTimeFormat("en-IN", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "Asia/Kolkata",
});

/** "16 October 2026". */
export function formatDate(iso) {
  return dateFormat.format(new Date(iso));
}

/** Two initials for an author avatar. */
export function initials(name) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
}

/** "Read Lovable's story" for a labelled card, otherwise "Read the story". */
export function storyCallToAction(label) {
  return label ? `Read ${label}’s story` : "Read the story";
}

/** The page numbers to show, with gaps, around the current page. */
export function pageWindow(current, total) {
  if (total <= 9) return Array.from({ length: total }, (_, index) => index + 1);
  const pages = [...new Set([1, 2, current - 1, current, current + 1, total - 1, total])]
    .filter((page) => page >= 1 && page <= total)
    .sort((a, b) => a - b);
  const window = [];
  for (const page of pages) {
    const previous = window[window.length - 1];
    if (typeof previous === "number" && page - previous > 1) window.push("gap");
    window.push(page);
  }
  return window;
}

/** A heading's text as an anchor id. */
export function anchorId(text) {
  return text
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
