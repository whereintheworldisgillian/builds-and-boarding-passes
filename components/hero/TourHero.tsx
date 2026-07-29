import { NOW_BOARDING } from "@/content/departures";
import { HeroSlideshow } from "./HeroSlideshow";

/* ==========================================================================
   THESIS: the opening title sequence of a live travel-and-building show —
   "we are going somewhere together." Refuses the centered SaaS text-stack
   by making the type enormous and putting a physical object in the frame
   with it.

   FORM (user-pinned, revised 2026-07-29): centred headline stack, one
   object offset bottom-right. The object is a PASSPORT PAGE — parchment,
   sewn binding, a coral entry stamp landing on it. Deliberately not a
   boarding-pass ticket card: the pass is the thing you are given, the
   stamp is the proof you actually went.

   TYPE: Geist at 800 for the first line, Georgia italic at the same size
   for the second. The contrast between the two IS the headline treatment —
   do not add a third face to this section.

   COLOUR: near-black base, parchment type, and coral used exactly twice
   (the live dot, the entry stamp). If a third coral appears here, one of
   them is decoration and should be cut.
   ========================================================================== */

export function TourHero() {
  return (
    <section className="relative flex min-h-svh flex-col overflow-hidden bg-passport-navy">
      <HeroSlideshow />

      {/* Legibility scrims. The composition is centred now, so the light is
          shaped as a vignette — dark at the edges, open in the middle where
          the photograph should still be visible through the type — plus a
          grounding fade at the base for the boarding strip. Never one
          opaque rectangle. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(115% 85% at 50% 42%, rgb(10 13 19 / 0.34) 0%, rgb(10 13 19 / 0.72) 58%, rgb(10 13 19 / 0.94) 100%)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3"
        style={{
          background:
            "linear-gradient(to top, rgb(10 13 19 / 0.92), transparent)",
        }}
      />

      <div className="relative z-10 mx-auto flex min-h-svh w-full max-w-content flex-col px-6 pt-7 pb-8 sm:px-10">
        {/* Brand lockup — no nav yet, deliberately. */}
        <header className="flex items-baseline gap-4">
          <p className="text-[0.9375rem] font-bold tracking-[0.02em] text-passport-parchment text-on-media">
            B&amp;BP
          </p>
          <span
            aria-hidden="true"
            className="h-3.5 w-px self-center bg-passport-mist/40"
          />
          <p className="font-mono text-[0.6875rem] leading-tight tracking-[0.2em] text-passport-mist uppercase text-on-media">
            World Tour
            <br />
            001
          </p>
        </header>

        {/* The centred stack. Everything here is optically centred on the
            photograph; the object below breaks that symmetry on purpose. */}
        <div className="flex flex-1 flex-col items-center justify-center py-12 text-center">
          <h1 className="max-w-5xl text-passport-parchment text-on-media">
            <span className="block font-display text-[clamp(2.25rem,7.4vw,6rem)] leading-[0.94] font-extrabold tracking-[-0.035em]">
              Check in. Step out.
            </span>
            {/* Georgia italic, optically sized up: a serif at the same
                declared size reads smaller than the grotesk above it. */}
            <span className="mt-1 block font-serif text-[clamp(2.4rem,7.9vw,6.4rem)] leading-[1.02] italic tracking-[-0.02em]">
              Build before you&rsquo;re ready.
            </span>
          </h1>

          <p className="mt-8 max-w-lg text-base leading-relaxed text-passport-parchment/90 text-on-media sm:text-lg">
            A livestream and a world tour, built in public from wherever we
            land. Dreams die in the comfort zone.
          </p>

          <div className="mt-10 flex flex-col items-center gap-6 sm:flex-row sm:gap-8">
            <button
              type="button"
              className="rounded-sm bg-passport-parchment px-8 py-4 text-sm font-bold tracking-[0.1em] text-passport-navy uppercase shadow-lifted transition-colors duration-200 hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-passport-parchment"
            >
              Join the journey
            </button>
            <a
              href="#departures"
              className="border-b border-passport-mist/40 pb-1 text-sm font-semibold tracking-[0.1em] text-passport-parchment uppercase text-on-media transition-colors duration-200 hover:border-passport-parchment"
            >
              See the board <span aria-hidden="true">&darr;</span>
            </a>
          </div>

          <PassportPage />
        </div>

        <NowBoardingStrip />
      </div>
    </section>
  );
}

/* --------------------------------------------------------------------------
   THE OBJECT — a passport page, not a ticket.

   In normal flow on small screens (where there is no room to float it), and
   offset into the bottom-right corner from `lg` up, where it breaks the
   centred symmetry of the headline. The rotation is small on purpose: a
   page lying on a table, not a sticker.
   -------------------------------------------------------------------------- */

const PAGE_FIELDS = [
  { label: "Entry", value: "07 · 2026" },
  { label: "Status", value: "Admitted" },
  { label: "Purpose", value: "Build" },
] as const;

function PassportPage() {
  return (
    <div className="relative mt-14 w-full max-w-[17rem] rotate-[-2deg] lg:absolute lg:right-6 lg:bottom-20 lg:mt-0 xl:right-12">
      <div className="relative overflow-hidden rounded-[0.2rem] bg-passport-parchment pt-5 pr-5 pb-5 pl-8 text-passport-navy shadow-lifted">
        {/* The sewn binding — a real passport page is stitched at the spine,
            which is also the cheapest possible way to say "page, not card"
            without a torn-paper mask. */}
        <span
          aria-hidden="true"
          className="absolute inset-y-3 left-3.5 border-l border-dashed border-passport-navy/35"
        />

        <div className="flex items-baseline justify-between font-mono text-[0.5625rem] tracking-[0.18em] text-passport-navy/55 uppercase">
          <span>Passport</span>
          <span>BBP / 001</span>
        </div>

        <p className="mt-4 font-display text-4xl leading-none font-extrabold tracking-[-0.04em]">
          HKT
        </p>
        <p className="mt-1.5 font-mono text-[0.625rem] tracking-[0.22em] text-passport-navy/60 uppercase">
          Phuket · Thailand
        </p>

        <dl className="mt-5 border-t border-passport-navy/15 pt-3">
          {PAGE_FIELDS.map((field) => (
            <div
              key={field.label}
              className="flex items-baseline justify-between gap-4 py-1"
            >
              <dt className="font-mono text-[0.5625rem] tracking-[0.18em] text-passport-navy/55 uppercase">
                {field.label}
              </dt>
              <dd className="font-mono text-[0.6875rem] font-medium tracking-[0.1em] text-passport-navy uppercase">
                {field.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <EntryStamp />
    </div>
  );
}

/* One restrained circular ink stamp, rotated, landing across the page's
   corner. `mix-blend-multiply` is what sells it: real ink darkens the paper
   and the printing underneath still shows through. Decorative only. */
function EntryStamp() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 140 140"
      className="pointer-events-none absolute -top-8 -right-7 w-32 -rotate-12 text-passport-stamp mix-blend-multiply"
      style={{ opacity: 0.9 }}
    >
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
      {/* ponytail: ONE arc, not two. A real entry stamp has text top and
          bottom, but at 128px on screen two arcs plus a centre word turned
          to mush. The arc runs clockwise so the text reads upright over the
          crown, and the flight number lives on the page below anyway. */}
      <path id="stamp-arc-top" d="M 15 70 A 55 55 0 0 1 125 70" fill="none" />
      <text
        fill="currentColor"
        fontSize="12.5"
        fontWeight="700"
        letterSpacing="4"
        fontFamily="var(--font-mono)"
        textAnchor="middle"
      >
        <textPath href="#stamp-arc-top" startOffset="50%">
          WORLD TOUR
        </textPath>
      </text>
      <text
        x="70"
        y="84"
        textAnchor="middle"
        fill="currentColor"
        fontSize="19"
        fontWeight="700"
        letterSpacing="2"
        fontFamily="var(--font-mono)"
      >
        ARRIVED
      </text>
    </svg>
  );
}

/* --------------------------------------------------------------------------
   The teaser: one row of the departure board, pulled to the bottom edge.
   Its whole job is to make the full board downstream feel inevitable, so it
   shows the live row and nothing else.
   -------------------------------------------------------------------------- */

function NowBoardingStrip() {
  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-passport-mist/15 pt-5 font-mono text-[0.6875rem] tracking-[0.18em] uppercase">
      <span className="flex items-center gap-2.5 text-passport-signal">
        <span
          aria-hidden="true"
          className="size-1.5 rounded-full bg-passport-signal"
          style={{ animation: "hero-status-pulse 2.4s ease-in-out infinite" }}
        />
        Now boarding
      </span>
      <span className="text-passport-parchment/80">
        {NOW_BOARDING.flight} · {NOW_BOARDING.destination} · Gate{" "}
        {NOW_BOARDING.gate}
      </span>
      <a
        href="#departures"
        className="ml-auto text-passport-mist transition-colors duration-200 hover:text-passport-parchment"
      >
        All departures <span aria-hidden="true">&darr;</span>
      </a>
    </div>
  );
}
