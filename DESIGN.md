# Design

<!-- Rewritten 2026-07-29. The previous "Modern Passport Ink" system (navy +
     coral + parchment, Syne, then Geist) is gone. It is not an alternative
     to fall back on — it is history. `git log` has it if it is ever needed. -->

## Where this design came from

The design in this repo was **created by notultra**, a viewer of the stream,
who built it as a redesign and sent the source over. It arrived as a
standalone Vite + React project and was ported into this Next.js app on
2026-07-29 with the markup and stylesheet intact.

No licence came with the export, so if this project ever goes public-source
or the design gets reused elsewhere, that is worth settling with him first.

The port changed four things and nothing else:

1. `src/App.tsx` → `app/page.tsx` (renamed the function; markup untouched).
2. `src/main.tsx` + `index.html` → `app/layout.tsx` (title and description
   carried across verbatim).
3. A skip link was added, styled below the marker at the bottom of
   `app/globals.css`. It is invisible until focused.
4. `POLARIUM.md`, `vite.config.ts` and the Vite `package.json` were left
   behind in the export.

## How it is organised

Two files carry the whole site, deliberately:

- **`app/page.tsx`** — all content and structure. One component, no state,
  no props, no effects.
- **`app/globals.css`** — the entire visual system, ~1900 lines of plain
  CSS. No Tailwind, no CSS-in-JS.

Keep new CSS **below the `ADDED AFTER THE PORT` marker** at the bottom of
the stylesheet, so the ported design stays easy to diff against the source
it came from.

## Palette

Declared as custom properties in `:root`:

| Role | Token | Value |
| --- | --- | --- |
| Near-black (page ends, dark sections) | `--ink` | `#10181A` |
| Softer near-black | `--ink-soft` | `#1A2426` |
| Warm paper (light sections) | `--paper` | `#F1EEE5` |
| Bright paper (headline serif, cards) | `--paper-bright` | `#FBF8EF` |
| Orange (live/now signals, focus rings) | `--orange` | `#FF6534` |
| Acid lime (the nav chip, selection) | `--acid` | `#D9FF6F` |
| Hairlines | `--line` / `--white-line` | translucent |

The page alternates dark and light sections (`.dark-section` /
`.light-section`) rather than running one continuous background.

## Type

- **Geist** — everything. Variable, weights 100–900, **self-hosted** from
  `public/fonts/geist-sans.woff2` via `@font-face` at the top of
  `globals.css`. There is no `next/font` in this project on purpose; adding
  it would load the same typeface twice.
- **Geist Mono** — labels, codes, board data, meta text.
  `public/fonts/geist-mono.woff2`.
- **Georgia, italic** — the `<em>` half of each headline pair. A system
  serif, so it costs nothing to load.

Every headline is a two-part pair: a grotesk line and a serif-italic line.
That contrast is the identity — keep it when writing new sections.

## Motion

Scroll-driven CSS only — `animation-timeline: view()` for the `.reveal`
sections and `animation-timeline: scroll(root block)` for the nav morph.
**There is no JavaScript driving any of it**, which is worth knowing before
reaching for an observer hook. Browsers without support get the content
plainly, and `prefers-reduced-motion` flattens everything.

## Motion performance rules

This page is often open while streaming, so it shares a GPU with a video
encoder. A 2026-07-29 pass fixed several animations that were costing far
more than they looked. Keep to these:

- **Animate only `opacity`, `transform`, `translate`, `rotate`, `scale`.**
  Those stay on the compositor. `left`, `top`, `width`, `margin` force layout
  every frame; `box-shadow`, `filter` and `clip-path` force paint. Three
  infinite animations here were previously animating `left`, `margin-bottom`
  and `box-shadow`.
- **Use `translate`/`rotate`/`scale` rather than `transform`** when an
  element already has a `transform` — they are independent properties that
  compose instead of overwriting, which is what let the boarding-pass float
  move off `margin-bottom`.
- **No `backdrop-filter` on the fixed nav.** It sits over the hero photo,
  which animates continuously, so the blur would be recomputed every frame
  even when nothing is happening. Background opacity does the job.
- **An infinite animation must be visibly worth it.** The nav status dot ran
  a `box-shadow` pulse forever that rendered nothing at all, because the
  keyframes had no `0%` state to interpolate from.

## The hero slideshow

`image-breathe` is gone. The hero is now six photographs stacked in
`.hero-media`, crossfading on one shared 48s CSS loop with a slow alternating
zoom — 8s a slide, no JavaScript. Full notes are in the `HERO SLIDESHOW` block
at the bottom of `globals.css`; the two things worth knowing before touching it:

- **The outgoing slide never fades.** Opacity composites multiplicatively, so
  two slides at 0.5 cover only `1 - 0.5 × 0.5 = 0.75` of the background and the
  hero visibly dims at every transition. Instead the incoming slide fades in on
  top of a still-opaque outgoing one, which needs the animated `z-index` steps.
- **The slide count is baked into the keyframe percentages**, because keyframe
  selectors cannot be `calc()`. Changing it means editing the keyframes *and*
  the `nth-child` delays. The formula is in the comment.

Six full-viewport layers is the most expensive thing on the page, and it
replaced something that was already the most expensive thing. Two are
compositing at any moment and the rest sit idle at `opacity: 0`. Adding a
seventh photo is not free — weigh it against the fact that this page is usually
open next to a video encoder.

## Photographs

`public/hero/01-flight-window.jpg` is stock. **`02`–`06` are Gillian's own
travel photographs** and should not be replaced with stock.

All six are pre-cropped to 16:9 at 2000×1125 and encoded at JPEG q76 mozjpeg —
1.6 MB for the set. Pre-cropping rather than leaving it to `object-fit` means
the framing is chosen deliberately (four of the originals are portrait) and no
bytes are spent on pixels that get cropped away.

**Re-encoding also strips EXIF.** Every iPhone original carried a GPS IFD with
the exact coordinates of where it was taken. Anything in `public/` is publicly
downloadable, so originals live in `photo-originals/`, which is gitignored and
never served. Run any new photo through the same pipeline rather than dropping
a camera file straight into `public/hero/`.

## Still static, if you want it real later

- The departures clock (`18:03`) is a hardcoded `<time>`, not a live clock.
- The departure rows, route list and current-stop copy are all literal
  markup in `page.tsx`. Nothing reads from a data file yet.
