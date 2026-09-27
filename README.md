# Dudestrap Landing Page

Responsive React implementation of the Dudestrap hero, based on the reference artwork in `assets/08_full_hero_reference.png`.

The visible hero is rendered with HTML, Tailwind CSS, shadcn-style UI primitives, and inline SVG artwork. The reference PNG and cropped source assets are retained for design comparison only and are not used by the page.

## Stack

- React 19 with Vite
- Tailwind CSS 4
- shadcn-style Button, Card, Input, Badge, and Table primitives
- Zustand for responsive navigation state
- Lucide icons
- Locally bundled DM Sans, Playfair Display, and Caveat fonts

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
  components/
    ui/                    shadcn-style primitives
    hero.jsx               hero copy and composition
    hero-artwork.jsx       vector product/event illustrations
    request-dashboard.jsx  responsive DOM dashboard preview
    site-header.jsx        desktop and mobile navigation
  store/
    use-ui-store.js        Zustand UI state
  App.jsx
  index.css
  main.jsx
```
