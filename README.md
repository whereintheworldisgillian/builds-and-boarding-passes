# Builds & Boarding Passes

An interactive companion platform for the Builds & Boarding Passes livestream —
a virtual World Tour built around building in public, community, and stepping
outside the comfort zone.

> Check in. Step out. Build before you're ready.

**Phase one: a static homepage concept.** There is no authentication, no
database, no livestream integration, and no functional community features yet.
Everything on the page is static content rendered from `content/`.

## Stack

- **Next.js 16** (App Router) + **React 19**
- **TypeScript** (strict)
- **Tailwind CSS v4** — design tokens live in CSS, see below
- No animation library, no icon library, no UI kit, no carousel package.
  All motion is CSS; scroll reveal is a small IntersectionObserver hook.

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

The homepage is fully static (prerendered at build time), so it deploys to
Vercel with no configuration — import the repo and accept the defaults.

## Project structure

```
app/
  layout.tsx        fonts, metadata, skip link
  page.tsx          homepage — composes sections, nothing else
  globals.css       DESIGN TOKENS + base styles + keyframes
components/
  layout/           SiteHeader, SiteFooter
  hero/             Hero, HeroBackdrop (the slideshow), CurrentStop
  sections/         CurrentJourney, RouteLine, PassportPreview, CommunityPromise
  passport/         PassportCard, PassportStamp   (reusable, prop-driven)
  ui/               Button, Section, Reveal
lib/                useMediaQuery, useReducedMotion, useInView, useScrolled
content/            ALL editable copy and data
public/media/scenes PLACEHOLDER hero art
```

## Editing content

You should not need to touch component code to change what the page says.

| What | Where |
| --- | --- |
| Hero background media | `content/hero-scenes.ts` |
| Current stop, build, status, Build Miles, route | `content/journey.ts` |
| Passport username, stamps, history | `content/passport.ts` |
| Nav items, footer links, taglines | `content/site.ts` |

## Replacing the placeholder hero media

The hero currently shows three placeholder scenes — hand-built SVG gradient
artwork in `public/media/scenes/`, named `PLACEHOLDER-*`. They are a few KB
each, need no network requests, and exist purely so the hero looks finished
before the real footage does.

To swap in real clips, open **`content/hero-scenes.ts`** — full instructions
are in the comment at the top of the file. Short version:

1. Export each clip as MP4 (H.264), ~8–12s, **no audio track**, ideally under
   ~4 MB.
2. Export a matching still frame as JPG/WebP — that becomes the `poster`.
3. Drop both into `public/media/scenes/`.
4. Point the scene's `poster` at your still and add
   `video: "/media/scenes/your-clip.mp4"`.
5. Delete the matching `PLACEHOLDER-*.svg`.

Keep the list at 3–5 scenes. Every scene needs a poster; `video` is optional,
so a still-only scene is a valid, finished state.

### How the backdrop behaves

| Condition | Behaviour |
| --- | --- |
| Reduced motion | One still poster. No timer, no video, no drift. |
| Screens under 768px | Posters crossfade. **No video is loaded at all.** |
| Everything else | Posters crossfade; a scene's clip fades in once it can play. |

Posters always render first and stay underneath, so the hero is readable
immediately and never shifts layout. At most two clips are in memory at once,
a stalled clip just leaves its poster showing, and the slideshow pauses
entirely while the tab is in the background — this page is meant to sit open
next to a livestream.

## Changing the colours

Every colour, radius, shadow, and spacing value in the project resolves to a
token in the `@theme` block at the top of **`app/globals.css`**. Nothing is
hardcoded in a component.

The accent is deliberately temporary — a muted ember/clay. It is one variable:

```css
--color-accent: #c96a45;
```

Change that (plus `--color-accent-hover` beside it) and the whole site follows:
buttons, focus rings, the route line, stamps, the current-stop marker. A few
alternatives are listed in a comment right there.

**One caveat:** the three `--color-ink*` values are documented with their
contrast ratios. They currently clear WCAG AA (4.5:1) for normal text against
both surface colours, which matters because `--color-ink-faint` carries the
small uppercase labels. If you darken any of them, re-check the contrast.

Typefaces are **Fraunces** (display) and **Inter** (UI), self-hosted at build
time by `next/font` — no runtime requests to Google, no layout shift. To swap
either one, edit `app/layout.tsx`; the rest of the project only refers to
`--font-display` / `--font-sans`.

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

The Passport nav item renders as plain text with a "Soon" marker rather than a
link, and the footer's YouTube/Discord links are `#` placeholders — nothing on
the page pretends to work.
