import { HeroSlideshow } from "./HeroSlideshow";

/* ==========================================================================
   THESIS: the opening title sequence of a live travel-and-building show —
   "we are going somewhere together." Refuses the centered SaaS text-stack.

   OWN-WORLD: real travel photography full-bleed; passport-ink navy panels
   with mist hairlines; parchment text; one coral ink stamp; DM Serif
   Display headlines over Montserrat board data.

   STORY: visitor lands mid-departure — the tour is real and already
   boarding. Believe it, then join.

   FIRST VIEWPORT: brand lockup top-left; editorial headline + CTA on the
   left; modern departure board on the right with the stamp overlapping its
   corner. Photography breathing behind everything.

   FORM: user-pinned brief (2026-07-29). No concept roll — the brief is the
   authority.
   ========================================================================== */

const BOARD_ROWS = [
  { label: "Flight", value: "BBP 001", code: true },
  { label: "Current stop", value: "HKT — Phuket", feature: true },
  { label: "Current build", value: "Builds & Boarding Passes" },
  { label: "Status", value: "Boarding soon", live: true },
  { label: "Next stop", value: "Locked", muted: true },
] as const;

export function TourHero() {
  return (
    <section className="relative flex min-h-svh flex-col overflow-hidden bg-passport-navy">
      <HeroSlideshow />

      {/* Legibility scrims — soft gradients, never one opaque rectangle.
          Ink-toned: navy from the left where the headline sits, a whisper of
          indigo, and a grounding fade at the base. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(100deg, rgb(17 24 38 / 0.82) 0%, rgb(17 24 38 / 0.45) 45%, rgb(40 58 102 / 0.18) 100%)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5"
        style={{
          background:
            "linear-gradient(to top, rgb(17 24 38 / 0.75), transparent)",
        }}
      />

      <div className="relative z-10 mx-auto flex min-h-svh w-full max-w-content flex-col px-6 pt-7 pb-10 sm:px-10">
        {/* Brand lockup — no nav yet, deliberately. */}
        <header className="flex flex-col gap-1.5 sm:flex-row sm:items-baseline sm:gap-4">
          <p className="text-[0.9375rem] font-semibold tracking-[0.16em] text-passport-parchment text-on-media">
            BUILDS &amp; BOARDING PASSES
          </p>
          <span
            aria-hidden="true"
            className="hidden h-px w-8 self-center bg-passport-mist/50 sm:block"
          />
          <p className="text-xs font-medium tracking-[0.24em] whitespace-nowrap text-passport-mist text-on-media">
            WORLD TOUR
          </p>
        </header>

        {/* Composed editorial split: words left, board right. */}
        <div className="my-auto grid items-center gap-14 pt-16 pb-6 lg:grid-cols-[1.15fr_0.85fr] lg:gap-10">
          <div className="max-w-2xl">
            {/* Syne ExtraBold, mixed case, deliberate breaks — a show title,
                not a quote floated over a photo. */}
            <h1 className="font-display text-[clamp(1.875rem,4.6vw,4.25rem)] leading-[1.02] font-extrabold tracking-[-0.015em] text-passport-parchment text-on-media">
              Check in.
              <br />
              Step out.
              <br />
              Build before
              <br />
              you&rsquo;re ready.
            </h1>

            <button
              type="button"
              className="mt-10 inline-block rounded-sm bg-passport-parchment px-8 py-4 text-sm font-bold tracking-[0.12em] text-passport-navy shadow-lifted transition-colors duration-200 hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-passport-parchment"
            >
              JOIN THE JOURNEY
            </button>
          </div>

          <DepartureBoard />
        </div>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------------------
   Modern editorial departure board. Near-opaque navy (no backdrop blur — this
   is a board, not glass), mist hairline dividers, uppercase Montserrat
   labels, the destination code enlarged. One coral ink stamp overlaps the
   top corner.
   -------------------------------------------------------------------------- */

function DepartureBoard() {
  return (
    <div className="relative w-full max-w-md justify-self-start lg:justify-self-end">
      <dl className="rounded-md border border-passport-mist/25 bg-passport-navy/90 px-7 py-2 shadow-lifted">
        {BOARD_ROWS.map((row) => (
          <div
            key={row.label}
            className="flex items-baseline justify-between gap-6 border-b border-passport-mist/15 py-4 last:border-b-0"
          >
            <dt className="shrink-0 text-[0.6875rem] font-medium tracking-[0.18em] text-passport-mist uppercase">
              {row.label}
            </dt>
            <dd
              className={
                "feature" in row && row.feature
                  ? "text-right text-2xl font-bold tracking-[0.06em] text-passport-parchment uppercase"
                  : "code" in row && row.code
                    ? "text-right text-[0.9375rem] font-bold tracking-[0.1em] text-passport-parchment uppercase"
                    : "live" in row && row.live
                      ? "flex items-baseline gap-2.5 text-right text-sm font-semibold tracking-[0.1em] text-passport-stamp-bright uppercase"
                      : "muted" in row && row.muted
                        ? "text-right text-sm font-medium tracking-[0.1em] text-passport-mist uppercase"
                        : "text-right text-sm font-semibold tracking-[0.1em] text-passport-parchment uppercase"
              }
            >
              {"live" in row && row.live && (
                <span
                  aria-hidden="true"
                  className="size-1.5 self-center rounded-full bg-passport-stamp-bright"
                  style={{ animation: "hero-status-pulse 2.4s ease-in-out infinite" }}
                />
              )}
              {row.value}
            </dd>
          </div>
        ))}
      </dl>

      <PassportInkStamp />
    </div>
  );
}

/* One restrained circular ink stamp, slightly rotated, overlapping the
   board's corner. Decorative only. */
function PassportInkStamp() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 140 140"
      className="absolute -top-21 -right-3 w-[7.5rem] -rotate-12 text-passport-stamp sm:-right-9"
      style={{ opacity: 0.92 }}
    >
      {/* Open center — ink rings overlap the board's print without hiding
          it, the way a real entry stamp lands on a passport page. */}
      <circle
        cx="70"
        cy="70"
        r="64"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
      />
      <circle
        cx="70"
        cy="70"
        r="53"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
      />
      {/* Curved lettering paths. Top arc runs clockwise so the text reads
          upright over the crown; bottom arc runs counterclockwise so it
          reads upright along the base — both keep the glyphs between the
          two rings, like a real entry stamp. */}
      <path id="stamp-arc-top" d="M 15 70 A 55 55 0 0 1 125 70" fill="none" />
      <path
        id="stamp-arc-bottom"
        d="M 6.5 78 A 64 64 0 0 0 133.5 78"
        fill="none"
      />
      <text
        fill="currentColor"
        fontSize="12.5"
        fontWeight="700"
        letterSpacing="4"
        fontFamily="var(--font-sans)"
        textAnchor="middle"
      >
        <textPath href="#stamp-arc-top" startOffset="50%">
          WORLD TOUR
        </textPath>
        <textPath href="#stamp-arc-bottom" startOffset="50%">
          BBP 001
        </textPath>
      </text>
      <text
        x="70"
        y="75"
        textAnchor="middle"
        fill="currentColor"
        fontSize="15"
        fontWeight="700"
        letterSpacing="3"
        fontFamily="var(--font-sans)"
      >
        PHUKET
      </text>
    </svg>
  );
}
