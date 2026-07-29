# Design

<!-- Rewritten 2026-07-29. The previous "Modern Passport Ink" system (navy +
     coral + parchment, Syne, then Geist) is gone. It is not an alternative
     to fall back on — it is history. `git log` has it if it is ever needed. -->

## Where this design came from

The design in this repo was **created by a viewer of the stream**, who built
it as a redesign and sent the source over. It arrived as a standalone Vite +
React project and was ported into this Next.js app on 2026-07-29 with the
markup and stylesheet intact.

> **TODO: credit the author by name.** The attribution line in `README.md` is
> a placeholder until the viewer's name or handle is confirmed, and how they
> want to be credited (and under what licence, if any) is worth asking them
> directly. Do not guess it from the repo — the export contains no author
> field.

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

## Still static, if you want it real later

- The departures clock (`18:03`) is a hardcoded `<time>`, not a live clock.
- The departure rows, route list and current-stop copy are all literal
  markup in `page.tsx`. Nothing reads from a data file yet.
