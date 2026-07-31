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

## What the hero slides are

Not all six are photographs, and that is the point. The community's feedback on
the first version was that the page read as a travel site, because six
destination photographs are the visual grammar of a tourism board. The rotation
now says what the project is directly:

| | | |
| --- | --- | --- |
| 01 | `01-commit-diff.jpg` | a real commit from this repo, rendered |
| 02 | `02-attabad-lake.jpg` | Gillian's |
| 03 | `03-jet-bridge-night.jpg` | stock |
| 04 | `04-zhangjiajie-pillars.jpg` | Gillian's |
| 05 | `05-open-source.jpg` | a real file from this repo, rendered |
| 06 | `06-sunset-rays.jpg` | Gillian's |

**02, 04 and 06 are Gillian's own travel photographs** and should not be
replaced with stock.

The order carries two constraints at once, and it is a **loop** — 06 wraps back
to 01:

1. **Tone alternates.** No two consecutive slides sit at the same brightness.
2. **The two text slides sit at 01 and 05**, never adjacent in either direction.

Reordering by renaming the files is fine, but both constraints have to survive.

### The text slides

They are images, not markup — the slideshow is six `<img>` on one CSS loop and
adding a seventh kind of layer would cost more than it is worth. Two things
about making them:

- **Their contrast is baked into the image, not the CSS.** One `.hero-wash`
  serves all six slides, and there is no JavaScript driving the rotation, so a
  per-slide wash is not available. Type-heavy slides are therefore rendered at
  low alpha (~0.45 on near-black) so the shared wash is enough.
- **Keep the content in a narrow centred column.** `object-fit: cover` crops a
  2000×1125 slide to roughly its middle 500px on a phone. An earlier draft set
  in full-bleed lost the first characters of every line at 1280 and most of the
  slide on mobile. ~1180px of content centred in 2000px survives both.

## Photographs

All slides are pre-cropped to 16:9 at 2000×1125 and encoded at JPEG q76 mozjpeg
— 1.3 MB for the set. Pre-cropping rather than leaving it to `object-fit` means
the framing is chosen deliberately (four of the originals are portrait) and no
bytes are spent on pixels that get cropped away.

**Re-encoding also strips EXIF.** Every iPhone original carried a GPS IFD with
the exact coordinates of where it was taken. Anything in `public/` is publicly
downloadable, so originals live in `photo-originals/`, which is gitignored and
never served. Run any new photo through the same pipeline rather than dropping
a camera file straight into `public/hero/`.

## The hero prompt

`app/hero-prompt.tsx` replaced the "Enter the journey" button. A field a visitor
can type into is the object this audience recognises on sight, and it is the one
thing in the hero a travel site would never have. "See where we landed" stays
underneath as the path for anyone who would rather click than type.

It does not own any commands. Submitting dispatches `RUN_EVENT` on `window`;
`terminal.tsx` listens, opens itself and runs it, so **a command has exactly one
implementation**. A custom event rather than context or shared state: the two
components sit in different parts of the tree with a server-rendered page
between them.

Three things that are load-bearing:

- **No `backdrop-filter`.** It sits over six continuously animating photo
  layers, so a blur would be recomputed every frame forever. See the motion
  rules above.
- **The block narrows on short desktop viewports rather than moving.** Adding
  it made `.hero-copy` about 100px taller, and the old lift values then put the
  headline *behind* the fixed nav at 1280×720 while the prompt ran 116px into
  the boarding pass at 1101×700. No lift fixes both — the copy is simply taller
  than the band between nav and pass. So the copy sits closer to centre and
  `.hero-prompt-block` takes a width derived from the pass's own position.

  Cap the **block**, not the field: the chips are centred too, and constraining
  only the input let them run 15px into the pass at 1101px. The `2.6rem` in that
  `calc()` is not padding either — the pass's `rotate(2.5deg)` pushes its real
  left edge about 12px past its CSS box, and 1.5rem still left a 2px overlap.
- **It hides while the console is open.** The panel opens on top of it and cuts
  it in half. `visibility: hidden` rather than opacity, so the hidden field also
  leaves the tab order.

## The terminal

`app/terminal.tsx` is the **first and only client component** in the app.
`page.tsx` stays a server component; the interactive corner is isolated so the
rest of the page still ships as static markup with nothing attached to it.

The command set lives in **`app/commands.ts`**, which is the file to edit. Adding
a command is one entry in `COMMANDS`; `terminal.tsx` renders whatever is there
and needs no changes.

Replies are typed as a small union — `help`, `lines`, `scroll`, `open` — and each
renders in one of three tones:

| Tone | Colour | Means |
| --- | --- | --- |
| normal | paper | Real, working now |
| pending | board amber `#ebef48` | Exists as a plan, not yet built |
| error | soft orange | Unknown command, names the recovery |

That amber is the departures board's own "route open" colour, and the header
carries a `STANDBY` chip in it. Unbuilt reads as *scheduled*, not as broken —
which is the project's rule that nothing pretends to work, expressed in colour.

**Pending copy is visitor-facing.** `/live` says the livestream is not linked
yet, not "add it to LINKS.livestream" — wiring instructions live in the code
comment on `LINKS`, never on screen.

Two interaction details worth keeping:

- **The suggestion chips are pinned above the input, outside the scrolling log.**
  They started inside it and disappeared after the first command, which is
  exactly when someone who does not know what to type still needs them.
- **New output scrolls the newest echo to the top of the log, not the bottom.**
  `/help` is taller than the log, so scrolling to the bottom would land the
  visitor on the last row with the command they just ran off-screen above. This
  is why `.terminal-log` is `position: relative` — the anchoring reads
  `offsetTop`, which would otherwise be measured from the panel.

The panel's height is derived, not fixed: `--terminal-bottom`,
`--terminal-chrome` and `--terminal-headroom` feed the log's `max-height`, so the
panel can never grow past the top of the screen. **Add another pinned row and
`--terminal-chrome` must grow with it**, or that guarantee breaks.

Two details that are load-bearing and easy to undo by accident:

- **The notched corner lives on an inner `<span>`, not the button.** It is the
  nav chip's `clip-path`, and `clip-path` on a focusable element crops its own
  focus ring. The button stays unclipped so the orange ring can sit outside it.
- **The launcher owns the true bottom-right corner, at every width.** It is
  `position: fixed` at `1.15rem` from both edges and it does not move — that is
  where people look for a console. `.boarding-pass` used to sit there, and an
  earlier attempt stepped the launcher to the pass's left instead; that was
  wrong, because it moved the interactive element to accommodate decoration.

  **The pass yields, and it yields sideways.** It cannot be cleared vertically:
  it is `position: absolute` inside `.hero`, which runs 0–163px taller than the
  viewport depending on size, `pass-float` translates it continuously, and
  `rotate(2.5deg)` grows its box again. Three moving parts, none of them visible
  from a viewport-fixed launcher. Horizontal separation has none of that, so the
  pass sits at `right: max(4vw, 6.5rem)` — past the launcher's 4.65rem of width
  plus its own ~12px of rotation growth, keeping the original 4vw gutter on very
  wide screens where 4vw is already larger.

  **`.hero-prompt-block` derives its width from that same rule.** Change one and
  the other has to follow. Verified collision-free — launcher, panel, prompt and
  chips — at ten sizes from 1101×700 to 1920×1080, and at 390px.

The caret blinks only on hover, focus, or while open. A cursor blinking forever
in the corner would repaint for the life of the page for no reason.

## Still static, if you want it real later

- The departures clock (`18:03`) is a hardcoded `<time>`, not a live clock.
- The departure rows, route list and current-stop copy are all literal
  markup in `page.tsx`. Nothing reads from a data file yet.
