# Andrino — Grounded Editorial Prestige

Source of truth: the six approved Stitch screens in project
`2457981840842964874`, archived in `design/stitch/`.
The owner's dark palette request of 3 November 2026 supersedes the original
Stitch colours. Palette implementation: `src/styles/theme.css`; contrast and
verification notes: `design/THEME.md`. Preserve the existing compositions.
The supplied editorial context takes precedence over invented sample content in
the mockups. Never publish unverified performance figures, client assignments,
publication dates, social destinations, or professional credentials.

## Direction

An independent editorial portfolio for editors, cultural organisations,
communications teams and curious readers. Calm, contextual, literary and rooted
in Goma. The signature is an asymmetric photographic composition with fine
rules, small folio labels, generous margins and slate editorial panels.

## Tokens

- Canvas and surfaces: `--color-bg`, `--color-surface` from `theme.css`.
- Main and secondary text: `--color-text`, `--color-text-muted`.
- Brand blue: `--color-primary`; accessible text links: `--color-link`.
- Orange actions: `--color-accent`, with dark ink text; use orange sparingly.
- Fine separators: `--color-border`; identifiable form borders: `--input`.
- Newsreader regular and italic for headings; DM Sans for body and labels.
- Body: 16–18px, line-height 1.65; headings: 28/40/56px.
- Container: 1280px including 64px desktop gutters, 20px mobile gutters.
- Sections: 80px desktop, 48–56px mobile; header: 80px.
- Cards: 16px radii, faint single borders and diffuse token-based shadows.
- Card content has 20–40px of padding according to size and viewport; home work
  and article cards use `--card-padding-compact`, including inset images.
- Buttons and compact controls retain their existing smaller radii.

## Responsive and interaction rules

Keep the supplied desktop compositions and reflow to one column below 768px.
Use a real keyboard-operable mobile menu below the full navigation breakpoint.
All controls have visible focus, useful labels and comfortable touch targets.
Filters update the actual displayed collection and announce the result count.
No fake newsletter subscriptions, publication links or successful contact sends.
Respect reduced motion; colour and shadow transitions last 150–250ms.

## Skill evidence

ECC `frontend-design-direction`: use product-specific hierarchy, existing
components, real reference assets, consistent tokens and explicit responsive
constraints. ECC `browser-qa`: verify local routes, navigation, forms, console,
screenshots at 375/768/1440px and automated accessibility.

UI UX Pro Max: initial design-system query returned generic Swiss suggestions;
the narrower verified result is `editorial-grid-magazine` from `styles.csv`
(query `editorial magazine serif`). The owner's palette and Stitch typography
override generic dataset recommendations. Next.js stack guidance confirms
responsive `next/image`, `next/link` navigation and server-only secrets.

## Dark theme and languages

Dark mode uses the owner's navy/slate, blue and orange palette centralised in
`src/styles/theme.css`. Light mode remains available through a coordinated
variant in the same file. Dark editorial panels keep paired text/link tokens
in either theme. Buttons include paired foreground/background tokens, including
focus, hover, active, disabled and error states. New visits default to dark;
stored light/dark/system choices remain respected. See `design/THEME.md` for
the contrast adjustments and media that were deliberately left unchanged.

Use `next-themes` for light/dark/system selection before hydration and persistent
preferences. Keep controls keyboard-accessible in the header on all screen
sizes. The footer contains social profiles and contact details, without page
navigation or reading preferences. `next-intl` owns locale routing (`/en`, `/fr`), catalogs, links,
metadata and number/date formatting. French keeps the original editorial voice,
using “récits”, “regards” and “communication” consistently. Names, routes, image
paths, category query values and form option values remain stable identifiers.

Reading controls use a compact language pill with a Radix radio menu in the
header and an always-visible sun/moon/monitor segmented theme control.
On mobile, a second fixed header row exposes both controls without opening
navigation, with 44 px touch targets; hide the footer controls and omit them
from the navigation menu. Main content, anchors and the menu account for the
136 px mobile header height. Selected controls have
a raised canvas surface, a fine border and a restrained shadow; hover, focus,
pressed, pending and reduced-motion states are explicit. Keep the control order
consistent: language, appearance. No native select styling in these controls.
