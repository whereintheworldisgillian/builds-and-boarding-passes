# Design — Modern Passport Ink

<!-- Established 2026-07-29 by a user-pinned hero redesign brief. This world
     replaces the previous "cinematic neutral + ember accent" system. The old
     tokens remain in globals.css only because the legacy phase-one sections
     (SiteHeader, legacy Hero, CurrentJourney, PassportPreview,
     CommunityPromise, SiteFooter) are preserved but unmounted; they are
     anti-reference, not authority. New work follows THIS file. -->

## World

The opening sequence of a live travel-and-building show. Real travel
photography carries the color; the interface sits on it in passport-ink
tones. Feeling: "we are going somewhere together." Editorial, emotional,
live — never corporate, never SaaS, never sci-fi.

## Palette (user-pinned)

Centralized in `app/globals.css` as `--color-passport-*` tokens:

| Role | Token | Value |
| --- | --- | --- |
| Near-black navy (panels, scrims) | `--color-passport-navy` | `#111826` |
| Deep indigo (gradient tint, subtle accents) | `--color-passport-indigo` | `#283A66` |
| Dusty violet ink (rare accent) | `--color-passport-violet` | `#67527A` |
| Soft parchment (text, CTA surface) | `--color-passport-parchment` | `#EEE8D8` |
| Muted coral (stamp ink) | `--color-passport-stamp` | `#B75A5E` |
| Coral tint for small text on navy (AA-safe) | `--color-passport-stamp-bright` | `#D68A8D` |
| Cool mist (labels, hairlines) | `--color-passport-mist` | `#AAB4C2` |

Use selectively — photography provides most of the visual color. No neon, no
yellow as a major color.

## Type (user-pinned, revised 2026-07-29 typeset pass)

- **Syne** (`--font-display`) — headlines only, Bold/ExtraBold, mixed case
  with intentional line breaks. Modern travel broadcast: strong enough to
  work as show branding. No italic treatment.
- **IBM Plex Sans Condensed** (`--font-sans`) — brand lockup, WORLD TOUR
  label, departure-board labels and values, stamp lettering, buttons.
  Stronger weights (700) for destination codes and flight numbers;
  secondary labels lighter (500) but never faint.

No more than these two families. Explicitly banned: DM Serif Display,
Montserrat, Inter, Bricolage Grotesque, Playfair Display, digital-clock
faces. Loaded via `next/font` in `app/layout.tsx`; components refer only
to `--font-display` / `--font-sans`.

## Materials & components

- **Photography:** real, full-bleed travel photos (no SVG scenery, no
  gradients-as-scenery, no illustration, no WebGL). Dimmed/desaturated via
  CSS filter, soft navy gradient scrims for legibility — never one opaque
  rectangle. Config array in `content/hero-photos.ts`.
- **Departure board:** near-opaque navy panel, thin mist hairline dividers,
  Montserrat uppercase labels in mist, values in parchment, destination code
  enlarged. Not glassmorphism (no backdrop blur), not a flip board, not a
  paper ticket, not a dashboard.
- **Passport stamp:** one circular coral ink stamp (SVG), curved text,
  slight rotation, overlapping a panel corner. Restrained — no icon clutter,
  no barcodes, no stickers.

## Motion

Slow and cinematic only: ~7s crossfades, very subtle zoom, a low-amplitude
status pulse. No arrows, dots, fast transitions, or animation libraries.
`prefers-reduced-motion` gets a single static photo and no timers.

## Refused (user-pinned anti-references)

Generic SaaS homepage, coding dashboard, Discord clone, corporate airline
site, futuristic sci-fi UI, one giant literal boarding pass, and the
previous boarding-pass-themed design.
