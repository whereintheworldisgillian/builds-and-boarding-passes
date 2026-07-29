# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Remote livestream viewers of the Builds & Boarding Passes stream — people following along from anywhere, using this site as a live companion to the stream rather than attending any stop in person. Their job when they land here: check the current stop, the build in progress, boarding status, and their own passport progress.

## Product Purpose

A companion site for a livestream: a virtual "World Tour" built around building software in public while traveling. Phase one is a static, pre-launch hype page — its job is to make the World Tour feel real and grow an audience before any accounts, check-ins, or community features exist. Success right now is a page that reads as finished and makes people want to follow the journey, not a working product.

## Positioning

Combines two things that don't usually share a page: building in public (current build, boarding status, "Build Miles") and a travel/passport metaphor (stops, stamps, a route line). The mechanism a competitor couldn't casually copy is the passport-as-progress-tracker framing applied to a builder's journey, not just a devlog or just a travel blog.

## Operating Context

Designed to sit open in a browser tab alongside a livestream (the hero backdrop slideshow deliberately pauses when the tab is backgrounded). Solo creator project — the confirmed livestream and community destinations are YouTube and Discord (footer links are `#` placeholders today because those channels/servers aren't linked yet, not because the platforms are undecided).

## Capabilities and Constraints

Phase one is fully static, prerendered at build time (Next.js 16 App Router, React 19, TypeScript strict, Tailwind v4). No auth, no database, no livestream integration, no functional community features — deliberately. All copy and data live in `content/*.ts` so content edits don't require touching components. No animation, icon, or UI kit dependency; motion is CSS plus a small IntersectionObserver hook. Terminology: "stop" (a tour location), "current build" (what's being built right now), "boarding status," "Build Miles," "passport" and "stamps" (progress/gamification), "check-in."

Explicitly not built yet (per README): authentication, accounts, database, livestream check-ins, boarding codes, admin tools, a functional World Map, departure cards, events, payments, leaderboards, messaging, and any YouTube/Twitch/Discord API integration. The Passport nav item is intentionally rendered as non-functional ("soon") — nothing on the page should pretend to work.

## Brand Commitments

Name: "Builds & Boarding Passes." Tagline: "Check in. Step out. Build before you're ready." Creed (footer): "Dreams die in the comfort zone." Confirmed community/stream destinations: YouTube and Discord.

## Evidence on Hand

`content/journey.ts`, `content/passport.ts`, and `content/site.ts` hold the real (if early) copy: current stop is Phuket, Thailand; current build is this site; boarding status "Preparing for departure"; sample passport shows one earned stamp (Phuket) plus 3 locked slots. `public/hero/` contains four real, uncommitted travel photos (airplane window, mountain road, tropical coast, longtail boats) not yet wired into any component — likely intended to replace the placeholder hero art described in the README (`public/media/scenes/PLACEHOLDER-*.svg`). No testimonials, press, or case studies exist; none should be fabricated. The accent color (`--color-accent`, muted ember/clay) is explicitly documented as temporary, not a brand commitment.

## Product Principles

- Nothing on the page pretends to work — unbuilt features render as honestly unavailable rather than as broken links.
- Content and product logic stay separable: copy changes should never require touching component code.
- The site is a livestream companion first — behavior (like pausing the hero slideshow when backgrounded) should assume it's open in a tab next to a stream, not visited standalone.
- Placeholder is not the same as decided — the accent color and hero art are flagged in-repo as temporary and shouldn't be treated as locked brand facts.

## Accessibility & Inclusion

README documents that reduced-motion preference shows a single still poster with no timer or video, and the ink color tokens are checked against WCAG AA (4.5:1) for normal text. No further product-specific accessibility requirement has been established.
