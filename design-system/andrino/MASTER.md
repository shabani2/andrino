# Andrino — Grounded Editorial Prestige

Source of truth: the six approved Stitch screens in project
`2457981840842964874`, archived in `design/stitch/`.
The supplied editorial context takes precedence over invented sample content in
the mockups. Never publish unverified performance figures, client assignments,
publication dates, social destinations, or professional credentials.

## Direction

An independent editorial portfolio for editors, cultural organisations,
communications teams and curious readers. Calm, contextual, literary and rooted
in Goma. The signature is an asymmetric photographic composition with fine
rules, small folio labels, generous margins and forest-green editorial panels.

## Tokens

- Canvas: `#f6fbf5` (the actual Stitch screen token).
- Main text: `#181d1a`; secondary text: `#424845`.
- Forest: `#1d3730`; forest panel: `#344e46`.
- Terracotta: `#914b32`; peach: `#ffdbcf`; gold: `#d7b27b`.
- Muted surfaces: `#f0f5f0`, `#ebefea`; rules: `#c1c8c4`.
- Newsreader regular and italic for headings; DM Sans for body and labels.
- Body: 16–18px, line-height 1.65; headings: 28/40/56px.
- Container: 1280px including 64px desktop gutters, 20px mobile gutters.
- Sections: 80px desktop, 48–56px mobile; header: 80px.
- Fine borders, small 4–8px radii, no ornamental drop shadows.

## Responsive and interaction rules

Keep the supplied desktop compositions and reflow to one column below 768px.
Use a real keyboard-operable mobile menu below the full navigation breakpoint.
All controls have visible focus, useful labels and comfortable touch targets.
Filters update the actual displayed collection and announce the result count.
No fake newsletter subscriptions, publication links or successful contact sends.
Respect reduced motion; hover effects may only change colour or image transform.

## Skill evidence

ECC `frontend-design-direction`: use product-specific hierarchy, existing
components, real reference assets, consistent tokens and explicit responsive
constraints. ECC `browser-qa`: verify local routes, navigation, forms, console,
screenshots at 375/768/1440px and automated accessibility.

UI UX Pro Max: initial design-system query returned generic Swiss suggestions;
the narrower verified result is `editorial-grid-magazine` from `styles.csv`
(query `editorial magazine serif`). Stitch's approved palette and typography
override generic dataset recommendations. Next.js stack guidance confirms
responsive `next/image`, `next/link` navigation and server-only secrets.

## Dark theme and languages

The light palette above remains the Stitch reference. Dark mode uses a deep
green canvas `#121e19`, cards `#192820`, warm light text `#e9eee9`, mint headings
`#d5e7dd` and terracotta accents `#e6ab93`. Dark editorial panels keep a stable
forest background instead of inheriting the light heading colour. Buttons use
paired foreground/background tokens, including focus, hover and error states.

Use `next-themes` for light/dark/system selection before hydration and persistent
preferences. Keep controls keyboard-accessible in the header on all screen
sizes and in the desktop footer. `next-intl` owns locale routing (`/en`, `/fr`), catalogs, links,
metadata and number/date formatting. French keeps the original editorial voice,
using “récits”, “regards” and “communication” consistently. Names, routes, image
paths, category query values and form option values remain stable identifiers.

Reading controls use a compact language pill with a Radix radio menu in the
header and an always-visible sun/moon/monitor segmented theme control.
On mobile, a second fixed header row exposes both controls without opening
navigation, with 44 px touch targets; hide the footer controls and omit them
from the navigation menu. Main content, anchors and the menu account for the
136 px mobile header height. The desktop footer uses labelled inline segments. Selected controls have
a raised canvas surface, a fine border and a restrained shadow; hover, focus,
pressed, pending and reduced-motion states are explicit. Keep the control order
consistent: language, appearance. No native select styling in these controls.
