# Builds & Boarding Passes

An interactive companion platform for the Builds & Boarding Passes livestream —
a virtual World Tour built around building in public, community, and stepping
outside the comfort zone.

> Check in. Step out. Build before you're ready.

**Phase one: a static homepage.** There is no authentication, no database, no
livestream integration, and no functional community features yet. Everything on
the page is literal markup in `app/page.tsx`.

## Design credit

The design was created by **notultra**, a viewer of the stream, who built it as
a redesign and shared the source. It was ported from a standalone Vite project
into this app on 2026-07-29 with the markup and stylesheet intact.

See [DESIGN.md](DESIGN.md) for what came from them and what was changed.

## Stack

- **Next.js 16** (App Router) + **React 19**
- **TypeScript** (strict)
- **Plain CSS.** No Tailwind, no CSS-in-JS, no animation library, no icon
  library, no UI kit. All motion is scroll-driven CSS — there is no JavaScript
  behind any of it.

## Running it

```bash
npm install
```

```bash
npm run dev
```

Then open http://localhost:3000. Other scripts: `npm run build`, `npm start`,
`npm run lint`.

## Deploying

The homepage is fully static (prerendered at build time). `vercel.json` pins
the Next.js framework preset; nothing else needs configuring.

## Project structure

```
app/
  layout.tsx     html shell, metadata, skip link
  page.tsx       THE ENTIRE PAGE — all content and structure
  terminal.tsx   floating terminal button + console panel (client component)
  hero-prompt.tsx the prompt in the hero — sends commands to the terminal
  commands.ts    the terminal's command set — THE FILE TO EDIT for commands
  departures.ts  the departure board's rows — read by page.tsx AND /board
  checkin.ts     Build Miles and the build phases — THE FILE TO EDIT for check-in
  checkin-dialog.tsx  the check-in modal (client component)
  journey.ts     what a passport holds — THE SHAPE THE BACKEND WILL STORE
  passport-dialog.tsx the passport (client component)
  globals.css    THE ENTIRE VISUAL SYSTEM — ~2200 lines of plain CSS
public/
  fonts/         Geist Sans + Geist Mono, self-hosted woff2
  hero/          the six hero slides, 01–06 in rotation order — two of them
                 are this repo's own code, rendered to an image
  *.jpg          the two in-page photographs
photo-originals/ full-resolution sources — gitignored, never served
```

Two files carry the site. That is deliberate, and it is how the design was
handed over.

## Editing

| What | Where |
| --- | --- |
| Any words, any section | `app/page.tsx` |
| The departure board's rows | `app/departures.ts` — changes the page *and* `/board` |
| Build Miles per check-in, or the build phases offered | `app/checkin.ts` |
| Tier names and their thresholds | `TIERS` in `app/journey.ts` |
| The terminal's commands, their text, and the links | `app/commands.ts` |
| The terminal's welcome text or button label | `app/terminal.tsx` |
| The hero prompt's placeholder or its chips | `app/hero-prompt.tsx` |
| Where the terminal button sits | `.terminal-launch` in `app/globals.css` |
| Any colour, spacing, type, motion | `app/globals.css` |
| The photographs | `public/*.jpg` — keep the filenames |
| A hero slideshow photo | swap the file in `public/hero/` — no code change |

Adding or removing a hero slide is **not** just a file change: the slide count
is baked into the keyframe percentages in `globals.css`. See the `HERO
SLIDESHOW` comment there, and [DESIGN.md](DESIGN.md) for why new photos must go
through the crop/re-encode pipeline first (EXIF GPS).

`/checkin` issues the visitor a boarding pass for their own build. Pick a phase,
press Board — there is no code to enter. `/passport` opens the document that
reads it back: one stamp slot per build phase, a running Build Miles total, and a
tier. Together they are the whole loop — check in, earn, watch it land.

Two things to know before running them on stream. **Nothing is saved yet**, so a
passport empties when the tab closes; both dialogs say so on screen. And **miles
are paid once per phase**, not once per check-in — a new phase pays, re-stamping
one you already hold re-dates it and pays nothing. That caps a full page at six
payouts. Both stop being true when the backend lands.

**`app/journey.ts` is worth reading before designing any table.** Its `Journey`
type is deliberately written as the row the backend will eventually store, so the
schema decision gets made after the product is understood rather than before.

A command's place in `/help` is not something you set. `/help` splits into
**Working now** and **Scheduled** by asking each command what it replies with —
a `pending` reply or a `null` link puts it under Scheduled. So a command cannot
be advertised as working without actually working, and filling in a URL in
`LINKS` promotes it on its own. Add `hidden: true` to keep a command out of
`/help`, the chips and tab completion but still runnable — that is how `/vibe`
stays findable rather than listed.

Reordering the slides is also not free. The rotation is a loop, and the order
holds two rules at once: tone alternates between consecutive slides, and the two
text slides (01 and 05) never sit next to each other in either direction.

Colours are custom properties in the `:root` block at the top of the
stylesheet: `--ink`, `--paper`, `--orange`, `--acid`. Change one there and the
whole site follows.

**Put new CSS below the `ADDED AFTER THE PORT` marker** at the bottom of
`globals.css`, so the ported design stays easy to diff against its source.

## A note on `npm audit`

`npm audit` reports a `brace-expansion` advisory. It is a devDependency of the
ESLint toolchain only — it is never shipped to the browser. Both offered fixes
were tried and rejected:

- Overriding `brace-expansion` to v5 breaks `minimatch` (`expand is not a
  function`), so ESLint will not run at all.
- `npm audit fix --force` installs `eslint@10`, which breaks the
  `eslint-plugin-react` bundled inside `eslint-config-next@16`.

`sharp` and `postcss` advisories *were* fixed, via the `overrides` block in
`package.json`. Revisit the ESLint one when `eslint-config-next` supports
ESLint 10.

## Not built yet (deliberately)

Authentication, accounts, database, livestream check-ins, boarding codes, admin
tools, the functional World Map, departure cards, events, payments,
leaderboards, messaging, and any YouTube/Twitch/Discord API integration.

The departures clock reads `18:03` because it is hardcoded, and the nav links
jump to sections on this page. Nothing off-page pretends to work yet.
