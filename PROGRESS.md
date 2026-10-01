# Holey — build progress

> Resume with: **"Read PROGRESS.md and continue."**
> Dev server: `npm run dev` → http://localhost:5173 · Screenshots: `npm run shots` (dev server must be running)

## Checklist

- [x] **Step 1 — Analyze Vibe + mapping table + project setup + asset cleanup**
  - [x] Analyzed vibebevvy.com (home, product, collection, contact, 404) via WebFetch + raw HTML/CSS download
  - [x] Screenshotted Vibe with Playwright → `reference/vibe/*.png` (desktop scroll steps + mobile full pages)
  - [x] Vite + React + react-router + GSAP + Motion + Lenis + R3F/drei installed
  - [x] Sock backgrounds removed → `public/socks/clean/` (originals untouched)
  - [x] Responsive WebP → `public/img/**`, favicons/app icons/OG image → `public/icons/`
- [x] **Step 2 — Header / footer / home page (all sections)**
  - [x] Shell: top marquee, sticky header (transparent over hero → cream + rule), mega menu, search panel, mobile menu, footer, film grain, Lenis + ScrollTrigger, View Transitions
  - [x] Home: hero (3D sock turns with scroll), product row (hover tints section + logo), accordion, testimonials, light marquee, spinning sock over wiped "Holey Holey", banner, story, rituals, social wall
  - [x] Cart drawer + fly-to-cart + washing-machine spin + toast were built early (needed by quick-add); polished in step 4
  - [x] Screenshot-reviewed at 1440 and 375 against reference/vibe
- [x] **Step 3 — Product grid (collection) + product detail pages**
  - [x] /shop: title, filter pills (All / Pastel / Neutral), count ("6 Socks · 0 Pairs"), sort dropdown, ruled 4-col grid with Vibe's two wide cards, Motion layout animation, hover tints section
  - [x] /socks/:slug: thumbs + outlined main box (3D drag viewer default), overline, title, copy, fake specs, locked qty (wiggle + "It's one sock." tooltip), ADD TO CART, logo takes the sock's accent; then testimonials, banner, "You may also like…"
  - [x] Unknown slug renders the 404
- [x] **Step 4 — Cart drawer + checkout ending + 360° rotation + 3D hero**
  - [x] Cart drawer (focus trap, Esc, scroll lock, localStorage, cross-tab sync), fly-to-cart arc, washing-machine spin + bubble pop, duplicate-add toast
  - [x] /checkout: "Counting to one…" beat → "Your sock is on its way to find its other half." with the sock drifting toward a ghost twin, fake receipt; order kept in sessionStorage for reloads
  - [x] 360°: drag with inertia + fling, idle auto-rotate, hover pauses, arrow keys rotate; hero + spin section rotate with scroll
  - [x] `scripts/interactions.mjs` verifies qty tooltip, drag, fly/drawer, dupe toast, persistence, quick add, checkout, newsletter
- [x] **Step 5 — About / FAQ / 404 + mobile + motion polish + performance**
  - [x] /about manifesto (4 tenets, sticky parallax photo, numbers strip, spinning sock), /faq (11 Qs, sticky side + starburst), /contact (fake form + success), /legal/:page (terms, privacy, returns), 404 "This page has a hole in it." with a toe bobbing through the 0
  - [x] `scripts/overflow.mjs`: no horizontal scroll on any page at 375 / 768 / 1440
  - [x] Tablet PDP: thumbs move under the main box; 3D camera backs off when the frame is too narrow
  - [x] 3D lighting in π units so the sock matches the photo colours
  - [x] Reduced motion: no Lenis, no scrubs/intros, no auto-rotate, static marquees/grain; content fully visible
  - [x] Perf: ~200 KB gz initial JS; three.js/R3F (265 KB gz) only loads when a sock enters the viewport, after idle; all below-fold images lazy + responsive WebP
- [x] **Step 6 — Final pass: build, screenshot review, fixes, README**
  - [x] `.glb` drop-in verified with a temporary generated model (auto-detected, centred, scaled, lit) — removed afterwards
  - [x] Fixed: mobile menu tiles collapsing, cart icon spinning on mount under StrictMode
  - [x] `npm run build` passes; `vite preview` serves all routes; zero console errors across 10 routes × 3 widths; zero horizontal overflow
  - [x] README (run, checks, deploy to Vercel, replacing assets) + `vercel.json` (SPA rewrite, caching, glb content type)

## What Vibe is made of (analysis notes)

- **Fonts:** VC Henrietta (commercial, chunky soft serif, 400 + 600) for display *and* UI text; Space Mono for body/specs.
  → Holey uses **Fraunces** (Google, `SOFT 100`, `WONK 0`, weights 400/600) + **Space Mono** (Google).
- **Palette:** cream `#fff1e7` bg, plum `#1f0229` ink, lavender `#db98f9` logo/marquee, yellow `#fffc54` CTA.
  → Holey: Cream `#FBF1E8`, Ink `#1A0F1F`, Holey Green `#1F5B3A` (logo), Nail Pink `#F4A9BC` (marquee), Highlighter `#F5F56A` (CTA).
- **Grid:** everything sized in `vw` off a 1440 artboard (`x / 1440 * 100vw`), side gutters `1.5625vw` (22.5px @1440), mobile gutter 10px, breakpoint 750px.
- **Lines:** 1.5px ink rules; rounded boxes `border-radius: clamp(16px, 1.615vw, 34px)` with 1.5px ink outline.
- **CTA:** yellow ellipse SVG background with 1.5px ink stroke, uppercase underlined serif label + arrow, hover `translateY(-1px)` + `brightness(.94)`.
- **Headings:** scroll-scrubbed per-letter "wipe" (letters go from faded to ink as they scroll through).
- **Motion:** Lenis (lerp .1, desktop + fine pointer only), hero image parallax + scale (1 → 1.18) + bottom corners rounding as you scroll, media parallax in rounded boxes, marquees (35s linear), cross-document View Transitions between pages, fly-to-cart, cart bubble grow animation.
- **Header:** marquee strip on top; nav left (underlined serif links), wordmark centered, round outlined icon buttons right (search, account, cart with yellow count bubble). Transparent over the hero (cream), solid cream + bottom rule once scrolled. Mega menu under "Products" with product tiles. Mobile: "Menu" + full-screen menu with 2-col tiles.

## Vibe section → Holey section mapping

| # | Vibe (vibebevvy.com) | Holey | Notes |
|---|---|---|---|
| 1 | Top marquee (lavender): "Clean Buzz · Live Cultures · 40 Calories…" + globe icons | Top marquee (Nail Pink): "One sock only ✦ Hole included ✦ No pairs ✦ No refunds on feelings…" + nail-H icons | same 13px serif, 10px pad |
| 2 | Header: Home / Products▾ / Contact Us · Vibe wordmark · search/account/cart circles | Home / Socks▾ / About / FAQ · Holey wordmark (`currentColor`, green; shifts to sock accent on product hover/pages) · search(→shop)/cart circles | account icon dropped (no accounts in a fictional shop) |
| 3 | Mega menu (Bevvies / Merch / Shop All + can tiles) | Mega menu (All Socks / About / FAQ + 6 sock tiles on their colours) | |
| 4 | Hero: full-bleed pool video, mascot doodle, "Drink cultured." / "A cocktail your gut agrees with." / SHOP NOW | Hero: Holey Green ground + grain, **3D sock floating & rotating with scroll**, H! nail sticker as mascot, "Wear it holey." / "One sock. One hole. No notes." / SHOP THE SOCK | photo swapped for a solid ground because the two lifestyle photos are light-grey and cream text wouldn't read |
| 5 | Product grid "Every cocktail takes something. This one gives it back." 4 cards + hover photo + quick add + SEE ALL | "Every sock loses something. This one started there." 4 cards + hover = macro of the hole + quick add + SEE ALL; **hovering a card tints the section to that sock's colour** | |
| 6 | Accordion "Everything a cocktail should be. Nothing it usually is." + parallax photo | "Everything a sock should be. Minus a bit." 4 rows + parallax lifestyle photo | |
| 7 | Testimonial slider (3 quotes, avatar, arrows, dots, mascot peeking right) | Same, fake deadpan customers; avatars = nail icons on sock colours; H! sticker peeking | |
| 8 | Light marquee "Fermented, Not Forced" + big globe icons | "Worn In, Not Worn Out" + big nail icons | |
| 9 | Spinning can: scroll-scrubbed can over giant wiped "Vibe Vibe" | Scroll-scrubbed rotating sock over giant wiped "Holey Holey" | reuses the 3D/PNG sock component |
| 10 | Full-width banner photo (parallax, rounded) | Full-width banner = lifestyle photo #1 (two feet) | |
| 11 | Mascot + "Every can starts with a real ferment…" + OUR STORY | Pink bubble logo + "Every sock starts as a pair…" + OUR STORY → /about | |
| 12 | Recipes. (3 cards, yellow starburst "Probiotic cocktails") | Rituals. (3 cards: ways to wear one sock, starburst "One foot at a time") | white section bg like Vibe |
| 13 | "Seen in the wild." social marquee of UGC cards | "Seen in the wild." @holey.onesock, lifestyle crops + sock-on-colour cards | only 2 lifestyle photos supplied → crops reused |
| 14 | Footer: "Join the culture club." email, link cols, ice-cube stamp, giant "Drink cultured." lockup, legal | "Get notified when we lose more socks." (fake success), link cols, oval badge stamp, giant "Wear it holey." lockup, fake socials + fake legal, © Holey | |
| 15 | Cart drawer | Slide-in cart drawer (localStorage), fly-to-cart + washing-machine spin on the cart icon | |
| 16 | PDP: thumbs + outlined main image box, overline, title, rules, copy, price, qty pill, ADD TO CART; then testimonials, banner, "You may also like…", social | Same layout; main box = **drag-to-rotate 360° sock** (inertia, idle auto-rotate, hover pause); specs list; qty locked at 1 (wiggle + "It's one sock." tooltip) | |
| 17 | Collection /collections/all: title, pills, count, sort, 4-col ruled grid with 2 wide cards; accordion; social | /shop: same | |
| 18 | Contact page | /contact (fake form) | |
| 19 | 404 "Page not found" | "This page has a hole in it." | |
| — | (none) | /about manifesto, /faq, /checkout ending screen "Your sock is on its way to find its other half." | extra pages requested in brief |

## Decisions log

- `reference/` was empty (no screenshots, no `logo-sheet.png`) → captured Vibe with Playwright into `reference/vibe/` and used the SVGs themselves as the style reference.
- `public/models/` is empty → no .glb yet; the 3D component falls back to a PNG sock rendered as a stack of textured planes (fake thickness) in R3F. Dropping `public/models/sock-N.glb` in later is auto-detected (HEAD request, ignoring the SPA html fallback).
- Background removal: flood-fill from the image border on near-white pixels (so the white threads inside the hole survive), 0.9px feathered edge + white-fringe unmixing. Done in Node with `sharp` (no Python deps).
- Hover images for product cards: generated macro crops of each sock's hole on the sock's own colour (Vibe uses a second photo; we only have one photo per sock).
- Fonts: Fraunces (soft, chunky optical-size serif) is the closest free match for VC Henrietta.
- Page transitions: react-router `viewTransition` links (same View Transitions API Vibe uses cross-document), custom fade/rise keyframes, disabled for reduced motion.
- 3D fallback = puffy mesh generated from the PNG alpha (distance field → depth), front + back surfaces, Lambert lighting, ContactShadows. Hero sock sways idle instead of spinning freely so it never parks edge-on.
- Logo accent is a small stack (`src/lib/accent.js`); cards/tiles release on unmount because navigating mid-hover never fires pointerleave.
- CSS import order: global.css is imported first in main.jsx so component CSS can override shared utilities.
- Playwright runs against the system Google Chrome (`channel: 'chrome'`) — no browser download needed.

## What's next (all steps done)

Ideas / things to replace:
- Real `.glb` sock models in `public/models/` (currently a generated puffy mesh from the PNG; the back is the front mirrored).
- More lifestyle photos — only two exist, so the social wall, rituals and testimonial avatars reuse crops of them.
- A dedicated hero photo/video if you want Vibe's full-bleed photographic hero instead of the green ground.
- Lighthouse run on the deployed site.

---

# Redesign (branch `redesign`, started 2026-10-01)

Goal: keep the mood (cream, Holey Green / Nail Pink, grain, deadpan copy, logo, products, 360°) but stop looking like vibebevvy.com. `main` is untouched; merge only when the owner says "merge".

## Checklist
- [x] Branch `redesign`; new sock photos re-cut (cutout now also removes the grey floor shadow + speckles, keeps largest blob)
- [x] Type: Bagel Fat One (display, puffy — matches the bubble logo) + Nunito (body)
- [x] Tokens: 3px ink outlines, hard offset shadows, sticker/tape/stitch surfaces (`src/styles/global.css`)
- [x] Nav → floating clothing-tag pill with grommet hole + string, squishes on scroll velocity (spring), mobile drop-down tag menu (`Nav.jsx`)
- [x] Buttons → sticker + laundry-care-label variants, spring squash on press (`Btn.jsx`)
- [x] Product grid → physics clothesline: verlet rope + pendulum socks, cursor brushes swing them, drag/pull + fling, mobile horizontal swipe (`Clothesline.jsx`)
- [x] Hole cursor: frayed hole mask revealing a pink nail-pattern layer, springy size, grows on interactive elements, off on touch (`HoleCursor.jsx`)
- [x] Washing-machine page transition: iris closes with drum spin + bubbles, route swaps under it, iris opens (`WashTransition.jsx`, `App.jsx`)
- [x] Lost & Found memory game: pairs are always "near matches" (twin is mirrored + hue-shifted), funny end screen + CTA (`LostFound.jsx`)
- [x] Sticker board: all logo SVGs + 2 sock stickers, drag/fling with friction + wall bounce, stick where dropped, saved in localStorage, arrow-key accessible (`StickerBoard.jsx`)
- [x] MISSING poster: photocopied sock, 8 tear-off tabs that tear and fall, reset when all gone (`Missing.jsx`)
- [x] Jelly everywhere: buttons, basket icon catch, qty tooltip pop, chips, tags; add-to-cart flies into a **laundry basket**
- [x] Hero 3D sock now spins inside a washing-machine porthole; PDP 360° viewer restyled as a hang tag with a grommet
- [x] New section order — Home: machine hero → clothesline → crossing tapes → care label → MISSING → Lost & Found → receipts (reviews) → sticker board → green wavy footer with lost-sock-report form + hang-tag links
- [x] Other pages rebuilt: Shop (line + "laundry pile" tag cards), PDP, About (taped notes, round badges, polaroids), FAQ (tag accordion), Contact, Legal, 404, Checkout
- [x] Reduced motion: rope settles once and freezes, stickers just drop, transition is a fade, no bounce-in letters, cursor follows without spring
- [x] Checks: `node scripts/redesign-ix.mjs` (desktop + 375), overflow 0 at 375/768/1440, no console errors, build passes

## Decisions
- Physics hand-rolled (verlet + pendulums, simple sticker integrator) instead of matter.js: ~200 lines, no extra 80KB dependency, runs only while visible.
- Route transition swaps `<Routes location>` only once the door has closed, so the old page never visibly jumps.
- Lost & Found "twin" is the same photo mirrored + hue-rotated, so it *almost* matches.
