# Pre-Push Checklist

## Source — Pages
- [ ] `src/pages/index.astro` — home page renders, bento grid layout correct
- [ ] `src/pages/art.astro` — art page renders, back link works

## Source — Layout
- [ ] `src/layouts/Layout.astro` — theme toggle script, global styles, font imports

## Source — Components (Shared)
- [ ] `src/components/ThemeToggle.astro` — toggles light/dark on both pages

## Source — Components (Bento)
- [ ] `src/components/bento/HeaderBox.astro` — name renders in Myflora font
- [ ] `src/components/bento/PhotoBox.astro` — profile photo loads and covers card
- [ ] `src/components/bento/AboutBox.astro` — bio text, education cards, social links, interests, skills grid
- [ ] `src/components/bento/MapBox.astro` — Leaflet map loads, pin animates, theme switches tile layer
- [ ] `src/components/bento/ArtLink.astro` — links to /art, heat-flow hover effect works

## Source — Components (Projects)
- [ ] `src/components/projects/ProjectCard.astro` — card themes, live badge, stack icons
- [ ] `src/components/projects/ProjectsSection.astro` — grid layout, scroll-reveal animation fires

## Source — Components (Art)
- [ ] `src/components/art/FeaturedSection.astro` — logos display, invert filter in dark mode
- [ ] `src/components/art/Gallery.astro` — photo grid renders all images
- [ ] `src/components/art/Lightbox.astro` — opens on click, closes on ×/Escape/backdrop

## Config
- [ ] `astro.config.mjs` — build settings correct
- [ ] `package.json` — dependencies & scripts up to date
- [ ] `tsconfig.json` — TypeScript config valid

## Content — `public/config/`
- [ ] `projects.json` — all projects have title, subtitle, link, live, image, colorTheme

## Assets — `public/`
- [ ] `fonts/Myflora.otf` — custom font loads
- [ ] `me/owen.png` — profile photo present
- [ ] `edu/gg.png` — uOttawa logo present
- [ ] `logos/kinaxis-logo.png` — Kinaxis logo present
- [ ] `featured_in/` — globe.webp, parks_canada.png, rom.png all present
- [ ] `photos/` — all gallery photos present (aa–az)
- [ ] `projects/` — oc-transpo.png, africa.jpeg, chardrop.jpeg, liszty.jpeg
- [ ] `stack/` — all 15 skill icons present
- [ ] `resume.pdf` — resume file exists (linked from social links)

## Cross-Cutting
- [ ] Dark/light theme persists across page navigation
- [ ] Mobile responsive — bento grid stacks, gallery switches to 2-col/1-col
- [ ] Load-in animations play on first visit
- [ ] No console errors in browser dev tools
- [ ] `npm run build` passes cleanly

## Cleanup
- [ ] No `.DS_Store` files committed
- [ ] No unused files in `src/`
- [ ] `public/mode/` — cloud.png, ice.png, moon.png — still used? (verify or remove)
- [ ] `public/featured_in/parks_canada.jpg` — duplicate of .png? (verify or remove)
