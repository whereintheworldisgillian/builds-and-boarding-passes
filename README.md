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
  globals.css    THE ENTIRE VISUAL SYSTEM — ~1900 lines of plain CSS
public/
  fonts/         Geist Sans + Geist Mono, self-hosted woff2
  *.jpg          the three photographs
```

Two files carry the site. That is deliberate, and it is how the design was
handed over.

## Editing

| What | Where |
| --- | --- |
| Any words, any section, the departure rows | `app/page.tsx` |
| Any colour, spacing, type, motion | `app/globals.css` |
| The photographs | `public/*.jpg` — keep the filenames |

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
