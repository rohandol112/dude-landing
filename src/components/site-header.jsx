import { useEffect, useRef, useState } from "react";
import { ChevronDown, Menu, Smartphone, X } from "lucide-react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";

import { Button } from "@/components/ui/button";
import { Wordmark } from "@/components/wordmark";
import { DESKTOP_NAV_QUERY } from "@/lib/breakpoints";
import { useGetAppLink } from "@/lib/use-get-app-link";
import { useUiStore } from "@/store/use-ui-store";

const navigation = [
  { label: "Products", href: "#products" },
  { label: "Events", href: "#events" },
  { label: "Business", href: "#business" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
  { label: "Vendors", href: "#vendors" },
];

const resources = [
  { label: "Dashboard tour", href: "#platform", description: "Every request in one clear view" },
  { label: "Why Dudestrap", href: "#trust", description: "Vetted vendors, escrow and proof" },
  { label: "Questions", href: "#resources", description: "Straight answers before you order" },
];

function ResourcesMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onPointerDown = (event) => {
      if (!ref.current?.contains(event.target)) setOpen(false);
    };
    const onKeyDown = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={ref} className="nav-menu" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button
        type="button"
        className="nav-link"
        aria-expanded={open}
        aria-controls="resources-menu"
        onClick={() => setOpen((value) => !value)}
      >
        Resources
        <ChevronDown aria-hidden="true" data-open={open || undefined} />
      </button>
      <AnimatePresence>
        {open ? (
          <motion.div
            id="resources-menu"
            className="nav-dropdown"
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
          >
            {resources.map((item) => (
              <a key={item.label} href={item.href} onClick={() => setOpen(false)}>
                <span className="nav-dropdown-title">{item.label}</span>
                <span className="nav-dropdown-description">{item.description}</span>
              </a>
            ))}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

export function SiteHeader() {
  const isMenuOpen = useUiStore((state) => state.isMenuOpen);
  const toggleMenu = useUiStore((state) => state.toggleMenu);
  const closeMenu = useUiStore((state) => state.closeMenu);
  const [scrolled, setScrolled] = useState(false);
  const appHref = useGetAppLink();
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (value) => setScrolled(value > 24));

  useEffect(() => {
    if (!isMenuOpen) return undefined;

    const handleEscape = (event) => {
      if (event.key === "Escape") closeMenu();
    };
    const handleResize = () => {
      if (window.matchMedia(DESKTOP_NAV_QUERY).matches) closeMenu();
    };

    document.addEventListener("keydown", handleEscape);
    window.addEventListener("resize", handleResize);

    return () => {
      document.removeEventListener("keydown", handleEscape);
      window.removeEventListener("resize", handleResize);
    };
  }, [closeMenu, isMenuOpen]);

  return (
    <header className="site-header" data-scrolled={scrolled || undefined}>
      <motion.div
        className="nav-shell"
        initial={{ opacity: 0, y: -18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <a
          className="brand-pill"
          href="#top"
          aria-label="Dudestrap home"
          onClick={closeMenu}
        >
          <Wordmark className="brand-wordmark" decorative />
        </a>

        <nav className="desktop-nav" aria-label="Primary navigation">
          {navigation.map((item) => (
            <a key={item.label} href={item.href} className="nav-link">
              {item.label}
            </a>
          ))}
          <ResourcesMenu />
        </nav>

        <div className="desktop-actions">
          <Button size="sm" asChild className="get-started-button">
            <a href={appHref}>
              Get the app
              <Smartphone aria-hidden="true" />
            </a>
          </Button>
        </div>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="menu-button"
          aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-navigation"
          onClick={toggleMenu}
        >
          {isMenuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </Button>

        <div
          id="mobile-navigation"
          className="mobile-menu"
          data-open={isMenuOpen}
          aria-hidden={!isMenuOpen}
        >
          <nav aria-label="Mobile navigation">
            {navigation.map((item) => (
              <a key={item.label} href={item.href} onClick={closeMenu} tabIndex={isMenuOpen ? 0 : -1}>
                {item.label}
              </a>
            ))}
            <p className="mobile-menu-group">Resources</p>
            {resources.map((item) => (
              <a key={item.label} href={item.href} onClick={closeMenu} tabIndex={isMenuOpen ? 0 : -1}>
                {item.label}
              </a>
            ))}
          </nav>
          <div className="mobile-actions">
            <Button asChild variant="ink" size="lg">
              <a href={appHref} onClick={closeMenu} tabIndex={isMenuOpen ? 0 : -1}>
                Get the app
                <Smartphone aria-hidden="true" />
              </a>
            </Button>
          </div>
        </div>
      </motion.div>
    </header>
  );
}
