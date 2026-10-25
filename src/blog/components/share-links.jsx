import { useState } from "react";

const shareLink =
  "inline-flex h-10 items-center rounded-full bg-white px-4 text-[14px] font-medium text-ink ring-1 ring-ink/10 transition-[box-shadow] hover:ring-ink/35";

/** Share links that need no third-party script, and a copy button. */
export function ShareLinks({ url, title }) {
  const [copyState, setCopyState] = useState("idle");
  const encodedUrl = encodeURIComponent(url);
  const links = [
    { label: "WhatsApp", href: `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}` },
    { label: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}` },
    { label: "X", href: `https://x.com/intent/post?url=${encodedUrl}&text=${encodeURIComponent(title)}` },
  ];

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopyState("copied");
    } catch {
      // Say so: a silent failure leaves the reader pasting nothing.
      setCopyState("failed");
    }
    window.setTimeout(() => setCopyState("idle"), 2500);
  };

  return (
    <div className="mt-12 flex flex-wrap items-center gap-3 border-t border-ink/10 pt-8">
      <span className="text-[14px] font-semibold text-ink">Share</span>
      <ul className="flex flex-wrap gap-2">
        {links.map((link) => (
          <li key={link.label}>
            <a href={link.href} target="_blank" rel="noopener noreferrer" className={shareLink}>
              {link.label}
            </a>
          </li>
        ))}
        <li>
          <button type="button" onClick={copy} aria-live="polite" className={`${shareLink} cursor-pointer`}>
            {copyState === "copied" ? "Link copied" : copyState === "failed" ? "Copy failed" : "Copy link"}
          </button>
        </li>
      </ul>
    </div>
  );
}
