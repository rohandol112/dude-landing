# Düdestrap Landing Page

Marketing site for Düdestrap, a managed-supply marketplace for custom products, events and business requirements. Bookings happen in the Düdestrap mobile apps; every call to action on this site leads to the app downloads.

## Stack

- React 19 with Vite
- Tailwind CSS 4
- Motion (Framer Motion) for one-time entrance animations
- three.js for the drifting clouds in the hero sky (lazy-loaded, skipped for reduced motion and Data Saver)
- shadcn-style Button, Card, Input, Badge and Table primitives
- Zustand for the mobile menu state
- Lucide icons
- Locally bundled Newsreader, Google Sans and Caveat fonts

## Commands

```bash
npm install
npm run dev
npm run lint
npm run build
npm run preview
```

## Structure

```text
src/
  assets/
    brand/                 Düdestrap wordmarks and app icon (from the customer app's brand kit)
    hero/                  hero backdrops and cloud textures
    sections/              lane card images
  components/
    ui/                    shadcn-style primitives
    sections/              page sections: showcase, lanes, process, trust, pricing,
                           vendors, app download, FAQ, closing CTA
    hero.jsx               hero copy, calls to action and backdrop
    hero-sky.jsx           decides when to load the cloud layer
    hero-clouds.jsx        three.js cloud sprites
    request-dashboard.jsx  dashboard preview used in the showcase
    site-header.jsx        navigation, Resources menu and mobile menu
    site-footer.jsx
    store-badges.jsx       App Store and Google Play buttons
    wordmark.jsx           brand wordmark in black, gold, white or yellow
  lib/
    breakpoints.js         media queries shared by CSS and JS
    links.js               app store links (placeholders until the listings are live)
    motion.js              shared easing and reveal presets
    use-get-app-link.js    picks the right store for the visitor's device
  store/
    use-ui-store.js        Zustand UI state
  App.jsx
  index.css
  main.jsx
```

`assets/` at the repository root holds the original hero reference artwork used to produce the backdrops; the page does not load it.

## Before launch

Set the real App Store and Google Play URLs for the customer and vendor apps in `src/lib/links.js`.
