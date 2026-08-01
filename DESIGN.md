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
**No JavaScript drives any of the page's motion**, which is worth knowing before
reaching for an observer hook. Browsers without support get the content
plainly, and `prefers-reduced-motion` flattens everything.

**The one exception is the passport's tilt**, and it is scoped to that document
inside its dialog. Even there the script only writes two custom properties on
`pointermove` — CSS owns the transform, nothing is measured per frame beyond one
rect, and it costs nothing until a mouse is over the document. See "The
passport" below.

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

`app/terminal.tsx` is one of **four client components**, with `hero-prompt.tsx`,
`checkin-dialog.tsx` and `passport-dialog.tsx`.
`page.tsx` stays a server component; the interactive corner is isolated so the
rest of the page still ships as static markup with nothing attached to it.

The command set lives in **`app/commands.ts`**, which is the file to edit. Adding
a command is one entry in `COMMANDS`; `terminal.tsx` renders whatever is there
and needs no changes.

Replies are typed as a small union — `help`, `lines`, `scroll`, `board`, `clear`,
`checkin`, `passport`, `open` — and each renders in one of three tones:

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

### /help groups itself

`/help` is split into **Working now** and **Scheduled**, the scheduled group
carrying the same amber as a pending reply — so the index and the replies tell
the same story.

**Membership is asked, not stored.** `isLive()` calls `command.reply()` and reads
the result: `lines` with `pending`, or `open` with a `null` URL, means scheduled.
`reply` is already call-time evaluated so `LINKS` can be edited without a
rebuild, and this rides on that — paste a Discord URL and `/discord` moves groups
by itself. A `status` field on the command would sit there lying about it.

The consequence: **a command's group is a side effect of how honest its reply
is.** That is deliberate. There is no way to advertise something as working
without also making it work.

### Commands that are found, not listed

`hidden: true` keeps a command out of `/help`, the chips and tab completion,
while `findCommand` still resolves it. `/vibe` is the only one.

### The /board printout

`/board` prints the board before sending you to it, and the rows come from
**`app/departures.ts`**, which `page.tsx` also renders. One source, so the
console and the page cannot drift apart.

The console shows three columns, the page shows five. That is a width decision:
five aligned columns need ~41 monospace characters and the log is ~42 wide on a
390px phone. It is a CSS grid rather than space-padded text so `DESTINATION` can
wrap instead of overflowing.

**`/board` does not close the panel on a desktop.** Plain `scroll` replies do —
on a phone the panel covers the destination. But this one printed something
first, and closing would throw it away, so the close is gated behind the same
`(hover: hover) and (pointer: fine)` query the stylesheet uses.

`.terminal-reply p` is `white-space: pre-wrap` so a reply can align itself into
columns — `/toolkit` pads its labels and would otherwise collapse to single
spaces. Still wraps at the panel edge, unlike plain `pre`.

## The check-in

`/checkin` issues the visitor a boarding pass for **their** build.

The first version of this routed people to Phuket, which was wrong: Phuket is
where the studio is, not where the viewer is, and a pass routed to it makes the
trip the point. The hero pass had already settled the question — `IDEA → SHIPPED`
is the viewer's journey. So the check-in asks where *their* build is, sends it to
SHIPPED, and collects no geography and no personal data. Nothing in it needs
editing when the studio moves.

**Checking in is a click.** A boarding code called out on stream gated this at
first, and it went for two reasons. It could not do the job — the answer ships
in the JS bundle for anyone to read, so it never proved attendance, only the
willingness to type. And it charged every visitor that typing tax up front, at
the one moment they had already decided to take part. Gating this properly needs
a server; until there is one, the open version is the honest one.

**`app/checkin.ts` is the file to edit** — the miles and the build phases.

**Nothing is persisted.** There is no account to attach a stamp to. The dialog
says so on screen, in the same amber the terminal gives anything scheduled — a
counter that silently reset would be exactly the thing this project's rule
forbids. When the backend lands, only the two `useState`s change.

Four things that are load-bearing:

- **It is a native `<dialog>` opened with `showModal()`.** The focus trap,
  Escape, the inert background, `::backdrop` and focus-return are the platform's,
  not ours. Backdrop-click is the only addition — a click whose `target` is the
  dialog came from the backdrop, which is why the dialog carries no padding of
  its own.
- **`.pass-issued` must keep `display: block`.** The hero's pass is
  `display: none` under 1100px because there is nowhere to put it. Without that
  override the issued pass inherits it and the whole flow ends on an invisible
  ticket on every phone.
- **The route and detail grids are re-columned for this pass.** The hero's are
  sized to strings it knows — `IDEA`, `BBP 001` — and `1fr` means `min-width:
  auto`, so with a visitor-supplied stamp they could not shrink and pushed 18px
  out of the dialog. `minmax(0, …)` lets them give, and the route type is
  `clamp()`ed because `.pass-route strong` is sized for seven characters.
- **Shipped routes to `NEXT ONE`.** A pass reading SHIPPED → SHIPPED is a dead
  end, and whoever just shipped is exactly who to point at the next thing.

Miles are paid **once per phase**, not once per submission, or "Change my pass"
would be a button that prints money. It was once per *session* until the passport
arrived — but six stamp slots and a tier ladder do not work with a single payout,
because you would earn 1,240, fill five more slots and never leave the first
tier. So the stamp and the miles now share one rule: a new phase pays, a re-stamp
re-dates and pays nothing. The ceiling is six payouts, which is one full page.

**`/checkin` always opens on the form**, never on the last receipt. It reset on
close at first, and that hook never ran — this element's `close` event does not
fire, so the reset lives in the open handler. Worth knowing before hanging
anything else off `onClose`.

## The passport

`/passport` opens the document that reads the check-in back. Where the boarding
pass is a warm `--paper-bright` ticket, the passport is an ink cover that opens
onto **cool security stock** — a wash from `#DDE3E2` to `#DFE5DA`. They are not
meant to look like the same paper: a ticket is warm and disposable, a document is
issued. What ties them together is vocabulary — `.barcode`, the dashed rules, the
mono label spec.

**`app/journey.ts` is the backend preview.** The `Journey` type is the row, and
the store is module-level with `subscribe`/`getSnapshot` read through
`useSyncExternalStore`. Not context: `page.tsx` is a server component and the two
dialogs are separate client islands under it, so a provider would mean wrapping
the page and giving up static rendering.

Five things that are load-bearing:

- **`--orange` is banned inside the passport.** It measures **2.3:1** on this
  stock and fails even the large-text bar. The newest stamp carries `#B23A22`
  instead, at 4.6:1 — which is also the commonest ink in a real passport. Every
  muted ink on the page is `rgba(16, 24, 26, 0.66)` for the same reason; 0.58 and
  0.55 both measured under 4.5.
- **Empty stamp slots are not dimmed with `opacity`.** That was the first version
  and it multiplied with every colour inside, landing "UNSTAMPED" near 1.9:1.
  Empty reads through the dashed border and a lighter ink instead.
- **The document is portrait at every width, and never reflows.** Both faces
  share one grid cell so the container is as tall as the taller of them — which
  is what makes the cover page-sized without a fixed height. A two-page landscape
  spread was the first plan, and it forced a landscape *cover*.
- **The face turned away is `inert`.** `backface-visibility` hides it from the
  eye but not from the tab order, so without that the holder field is reachable
  straight through a closed cover.
- **Focus is moved into the dialog by hand on open.** Every control on the back
  face is inert and the front face has no autofocus, so the browser leaves focus
  on `<body>` — which also swallows Escape, since there is nothing inside the
  dialog for the close request to reach. A button either way, never the holder
  field: focusing a text input on open throws up the keyboard on a phone.

The emblem is CSS only — a masked `repeating-conic-gradient` tick ring inside two
dashed circles, with the hero's own `✈` at its 12°. No image, painted once.

### Keyboard

Tab completes, ↑/↓ walk history, Esc closes, **⌘K / Ctrl+K opens from anywhere.**

Two things not to undo:

- **⌘K is a modifier combo on purpose.** A bare `/` would be a single-character
  shortcut, which WCAG 2.1.4 requires be remappable or focus-scoped. This one has
  no reason to be either.
- **Tab is only swallowed when it has something to complete.** On an empty or
  unmatched field it falls through to normal focus movement, or the input becomes
  a trap with no keyboard way out.

Unknown input names the near miss — `suggest()` tries prefix first, then a small
edit distance so `/boadr` still lands on `/board`.

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
