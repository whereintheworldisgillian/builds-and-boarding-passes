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

## Palette (user-pinned, darkened 2026-07-29)

Centralized in `app/globals.css` as `--color-passport-*` tokens:

| Role | Token | Value |
| --- | --- | --- |
| Near-black, faint navy cast (page base, scrims) | `--color-passport-navy` | `#0A0D13` |
| Deep indigo (gradient tint only) | `--color-passport-indigo` | `#1E2A44` |
| Dusty violet ink (rare accent) | `--color-passport-violet` | `#67527A` |
| Soft parchment (text, paper, CTA surface) | `--color-passport-parchment` | `#EEE8D8` |
| Muted coral — **ink on paper**, parchment only | `--color-passport-stamp` | `#B75A5E` |
| Hot coral — **the live state**, near-black only (7.4:1) | `--color-passport-signal` | `#FF7A5C` |
| Cool mist (labels, hairlines) | `--color-passport-mist` | `#AAB4C2` |

The base is near-black now, so photography and ONE hot accent carry the
whole contrast story. The two corals are not interchangeable: `stamp` is
ink that has dried on paper, `signal` means *this is happening right now*.
Spend `signal` rarely — in the hero it appears exactly twice. No neon, no
lime, no yellow.

## Type (user-pinned, replaced 2026-07-29)

- **Geist** (`--font-display` / `--font-sans`) — the whole interface.
  Variable, so headlines sit at 800 and labels at 500 from one file.
- **Geist Mono** (`--font-mono`) — board data, field labels, codes,
  timestamps, stamp lettering. The "printed at the gate" voice.
- **Georgia, italic only** (`--font-serif`) — the second headline line, and
  nothing else. A system serif: no webfont request. Never set body copy in
  it, never use it upright.

The bold-grotesk-over-serif-italic contrast **is** the headline treatment.
Do not add a fourth family. Previously pinned and now replaced: Syne, IBM
Plex Sans Condensed. Still banned: DM Serif Display, Montserrat, Inter,
Bricolage Grotesque, Playfair Display, digital-clock faces. Loaded via
`next/font` in `app/layout.tsx`; components refer only to the variables.

## Materials & components

- **Photography:** real, full-bleed travel photos (no SVG scenery, no
  gradients-as-scenery, no illustration, no WebGL). Dimmed/desaturated via
  CSS filter, soft navy gradient scrims for legibility — never one opaque
  rectangle. Config array in `content/hero-photos.ts`.
- **Departure board:** its own full-width section, not a panel in the hero.
  A real `<table>` with real columns (TIME / DESTINATION / FLIGHT / GATE /
  REMARKS), mist hairline rules, Geist Mono labels, destinations in Geist
  bold, and a live local clock in `signal`. Rows that cannot depart are
  struck through. A board earns the name by having columns — a label/value
  list wearing the word "departures" is what this replaced. Not
  glassmorphism, not a flip board, not a dashboard.
- **The hero object:** a **passport page** — parchment, a dashed sewn
  binding down the left, entry fields, one coral ink stamp landing across
  the corner in `mix-blend-multiply`. Deliberately *not* a boarding-pass
  ticket card: the pass is what you are handed, the stamp is proof you
  actually went. No barcodes, no notches, no stickers.
- **Passport stamp:** one circular coral stamp (SVG), a single curved arc
  plus one centred word. Two arcs turn to mush at this size.

## Motion

Slow and cinematic only: ~7s crossfades, very subtle zoom, a low-amplitude
status pulse. No arrows, dots, fast transitions, or animation libraries.
`prefers-reduced-motion` gets a single static photo and no timers.

## Refused (user-pinned anti-references)

Generic SaaS homepage, coding dashboard, Discord clone, corporate airline
site, futuristic sci-fi UI, one giant literal boarding pass, and the
previous boarding-pass-themed design.

## On the reference site (2026-07-29)

A viewer built their own take on this brief and the user liked it enough to
take direction from it. What was deliberately borrowed: the type SCALE, the
bold/italic headline contrast, the centred stack with one object offset into
a corner, near-black plus a single electric accent, and giving the departure
board its own full-width stage.

What was deliberately NOT borrowed, and should stay not-borrowed: their
accent (acid lime — ours is coral), their headline copy, their manifesto
lines, their board rows, and their hero object (a cream ticket card with a
barcode — ours is a passport page). If a future change makes any of those
five converge, the design has drifted into a copy and the change is wrong.
