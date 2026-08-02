"use client";

import { useEffect, useId, useRef, useState } from "react";
// The stamp's arcs read the same issuing station the boarding pass prints, so
// the two documents cannot disagree about where a check-in happened.
import { ISSUED_AT, PHASES } from "./checkin";
import {
  countryNames,
  formatStampDate,
  mrzLines,
  OPEN_PASSPORT,
  setHolder,
  setNationality,
  tierFor,
  useJourney,
} from "./journey";

/* --------------------------------------------------------------------------
   The passport.

   A native <dialog> opened with showModal(), same as the check-in — the focus
   trap, Escape, the inert background, ::backdrop and focus-return are the
   platform's rather than ours.

   IT OPENS LIKE A BOOK, and the physics are the real ones: the cover is hinged
   on its left edge and swings a full 180deg, so the surface you end up reading
   on the left IS THE BACK OF THE COVER. That is why the stamps live inside the
   cover element rather than beside it — in a real passport the first thing the
   opened cover shows you is its own inside face. Trying to reveal a separate
   left page underneath does not work: the cover lands on top of it.

   Desktop gets the spread. A phone gets one page, because two pages on a 390px
   screen are two 160px pages, and nothing on them would be readable.

   Nothing is persisted. See app/journey.ts.
   -------------------------------------------------------------------------- */

/* ---- The security paper ------------------------------------------------ */

/**
 * A hypotrochoid — the curve a real guilloche plate is cut with. Computed once
 * at module scope: it is the same every render, and it is a few hundred points.
 */
function hypotrochoid(cx: number, cy: number, R: number, r: number, d: number): string {
  let path = "";
  const k = (R - r) / r;
  for (let deg = 0; deg <= r * 360; deg += 4) {
    const t = (deg * Math.PI) / 180;
    const x = cx + (R - r) * Math.cos(t) + d * Math.cos(k * t);
    const y = cy + (R - r) * Math.sin(t) - d * Math.sin(k * t);
    path += `${deg ? "L" : "M"}${x.toFixed(2)},${y.toFixed(2)}`;
  }
  return `${path}Z`;
}

/*
   DO NOT TILE THE ROSETTE. That was the first two attempts and both failed the
   same way: a hypotrochoid is hollow in the middle, so repeating it prints a
   regular grid of pale discs and the page reads as polka-dot wallpaper. Filling
   the centres with smaller rosettes did not fix it either — the density still
   peaks and troughs on the tile's rhythm.

   A real data page is not rosette wallpaper. It is a very fine line field with
   ONE large rosette laid over it as a watermark, plus a microprint band. Three
   layers, only two of which tile, and the one that would show a grid does not
   repeat at all.
*/

/** The line field. Period divides the tile width, so it joins seamlessly. */
const LINE_TILE = 120;

const LINES = (() => {
  const rows: string[] = [];
  for (let y = 0; y < LINE_TILE; y += 5) {
    let path = `M0,${y}`;
    for (let x = 4; x <= LINE_TILE; x += 4) {
      path += `L${x},${(y + Math.sin((x / 60) * Math.PI * 2) * 1.6).toFixed(2)}`;
    }
    rows.push(path);
  }
  return rows;
})();

/** One per page, centred, never repeated. */
const WATERMARK = [
  { d: hypotrochoid(0, 0, 108, 35, 54), opacity: 0.85 },
  { d: hypotrochoid(0, 0, 108, 27, 62), opacity: 0.6 },
  { d: hypotrochoid(0, 0, 88, 19, 44), opacity: 0.45 },
  { d: hypotrochoid(0, 0, 52, 15, 26), opacity: 0.5 },
  // Fills the rosette's own hollow centre, which otherwise sits on the page as
  // one pale disc.
  { d: hypotrochoid(0, 0, 22, 7, 11), opacity: 0.45 },
];

/** Repeating anti-copy microtext, in the project's own name. */
const MICROPRINT = "BUILDS&BOARDINGPASSES·";

/**
 * Guilloche line-work plus a microprint layer, tiled in user units so the
 * pattern keeps its real size whatever the page is. No viewBox on purpose —
 * that makes one SVG unit one CSS pixel, so the rosettes do not scale up on a
 * wide page and turn into wallpaper.
 */
function SecurityPaper() {
  const id = useId().replace(/:/g, "");
  return (
    <svg className="passport-paper" aria-hidden="true" focusable="false">
      <defs>
        <pattern
          id={`lines-${id}`}
          width={LINE_TILE}
          height={LINE_TILE}
          patternUnits="userSpaceOnUse"
        >
          {LINES.map((d, index) => (
            <path key={index} d={d} fill="none" stroke="#2c4a45" strokeWidth="0.3" />
          ))}
        </pattern>
        <pattern id={`micro-${id}`} width="176" height="17" patternUnits="userSpaceOnUse">
          <text x="0" y="8" className="passport-microprint">
            {MICROPRINT.repeat(4)}
          </text>
        </pattern>
      </defs>
      {/* Faint on purpose. Every colour on this page was measured against the
          wash, and the pattern eats into that margin — raising any of these
          means measuring the whole page again. */}
      <rect width="100%" height="100%" fill={`url(#lines-${id})`} opacity="0.2" />
      <rect width="100%" height="100%" fill={`url(#micro-${id})`} opacity="0.14" />
      {/* A nested svg is how you centre without a viewBox: x/y take percentages,
          and the rosette is drawn around its own origin with overflow visible. */}
      <svg x="50%" y="46%" width="0" height="0" overflow="visible">
        {WATERMARK.map((rosette, index) => (
          <path
            key={index}
            d={rosette.d}
            fill="none"
            stroke="#2c4a45"
            strokeWidth="0.4"
            opacity={rosette.opacity * 0.22}
          />
        ))}
      </svg>
    </svg>
  );
}

/* ---- Stamps ------------------------------------------------------------ */

/** Fixed per-slot angles. A stamp is struck by hand; a grid of level ones is a
    table. Same list every render, so a stamp never shifts when a neighbour
    changes. */
const ANGLES = [-7.5, 5.2, -3.4, 6.8, -5.6, 3.9];

/**
 * The arcs carry fixed text and the middle carries the phase.
 *
 * That split is what makes an arced stamp survive real content: text on a path
 * cannot wrap or shrink, and DEBUGGING alone already crowds a ring this size —
 * a 14-character custom stamp would run right around it. So the curve gets the
 * two strings that never change, and the visitor's word sits flat in the
 * middle as ordinary HTML, free to wrap and to size itself down.
 */
function Stamp({
  label,
  date,
  angle,
  newest,
}: {
  label: string;
  date: string;
  angle: number;
  newest: boolean;
}) {
  const id = useId().replace(/:/g, "");
  const size = label.length > 10 ? "0.46rem" : label.length > 7 ? "0.54rem" : "0.64rem";
  return (
    <div
      className="passport-stamp"
      data-newest={newest}
      style={{ rotate: `${angle}deg` }}
    >
      <svg viewBox="0 0 100 100" aria-hidden="true" focusable="false">
        <defs>
          <path id={`top-${id}`} d="M50,50 m-36,0 a36,36 0 1,1 72,0" fill="none" />
          <path id={`bottom-${id}`} d="M50,50 m37,0 a37,37 0 1,1 -74,0" fill="none" />
        </defs>
        <circle cx="50" cy="50" r="44.5" fill="none" strokeWidth="2.4" />
        <circle cx="50" cy="50" r="38.5" fill="none" strokeWidth="1" />
        <text className="passport-stamp-arc">
          <textPath href={`#top-${id}`} startOffset="50%" textAnchor="middle">
            {ISSUED_AT.place}
          </textPath>
        </text>
        <text className="passport-stamp-arc passport-stamp-arc-small">
          <textPath href={`#bottom-${id}`} startOffset="50%" textAnchor="middle">
            {ISSUED_AT.flight}
          </textPath>
        </text>
        {/* The rules a real stamp carries either side of its centre block. */}
        <line x1="21" y1="50" x2="33" y2="50" strokeWidth="1.5" />
        <line x1="67" y1="50" x2="79" y2="50" strokeWidth="1.5" />
      </svg>
      <span className="passport-stamp-face">
        <span className="passport-stamp-word" style={{ fontSize: size }}>
          {label}
        </span>
        <span className="passport-stamp-date">{date}</span>
      </span>
    </div>
  );
}

function EmptySlot({ label }: { label: string }) {
  return (
    <div className="passport-stamp" data-empty="true">
      <svg viewBox="0 0 100 100" aria-hidden="true" focusable="false">
        <circle
          cx="50"
          cy="50"
          r="44.5"
          fill="none"
          strokeWidth="1.2"
          strokeDasharray="4 4"
        />
      </svg>
      <span className="passport-stamp-face">
        <span className="passport-stamp-word" style={{ fontSize: "0.5rem" }}>
          {label}
        </span>
        <span className="passport-stamp-date">Unstamped</span>
      </span>
    </div>
  );
}

/* ---- The document ------------------------------------------------------ */

export default function PassportDialog() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const coverRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const journey = useJourney();

  const [open, setOpen] = useState(false);
  // Built on first open, never during prerender. Intl.DisplayNames resolves
  // names from the platform's own ICU, and Node's does not always agree with
  // the browser's — rendering 250 of them on the server is a hydration mismatch
  // waiting to happen. The passport can only open from a click, so this list
  // never exists server-side.
  const [countries, setCountries] = useState<{ code: string; name: string }[]>([]);

  const titleId = useId();
  const holderId = useId();
  const nationId = useId();

  const close = () => dialogRef.current?.close();

  // The open handler below is registered once, so its closure would see the
  // first `open` forever. This mirror is what it reads instead.
  const openRef = useRef(open);
  // Set by the two controls that turn the leaf, so this effect only moves focus
  // for a flip the visitor asked for — not on mount, and not on every render.
  const flipped = useRef(false);

  /*
     Focus follows the face that is now in front, and it has to happen HERE
     rather than in the click handler. A setTimeout(…, 0) next to setOpen fires
     before React has committed, so the face being turned toward the reader is
     still marked inert — and calling focus() on an inert element does nothing
     at all, silently. Focus fell to <body>, which also swallows Escape.

     An effect on `open` runs after the commit, when the inert flags match what
     is on screen.
  */
  useEffect(() => {
    openRef.current = open;
    if (!dialogRef.current?.open || !flipped.current) return;
    flipped.current = false;
    // A button either way, never the holder field: focusing a text input throws
    // up the keyboard on a phone before anyone asked to type.
    (open ? closeRef.current : coverRef.current)?.focus();
  }, [open]);

  useEffect(() => {
    const onOpen = () => {
      const dialog = dialogRef.current;
      // showModal() throws if it is already open, and /passport can be run again
      // while it is.
      if (!dialog || dialog.open) return;
      setCountries((current) => (current.length ? current : countryNames()));
      dialog.showModal();
      // Focus has to land on the face that is actually in front. Without this it
      // stays on <body>: every control on the hidden face is inert, the front
      // face has no autofocus, and the browser gives up — which also swallows
      // Escape, because there is nothing focused inside the dialog for the
      // close request to reach.
      //
      // A button either way, never the holder field: focusing a text input on
      // open throws up the keyboard on a phone before anyone asked to type.
      window.setTimeout(() => {
        const target = openRef.current ? closeRef.current : coverRef.current;
        target?.focus();
      }, 0);
    };
    window.addEventListener(OPEN_PASSPORT, onOpen);
    return () => window.removeEventListener(OPEN_PASSPORT, onOpen);
  }, []);

  /* The tilt. JS writes four numbers onto one element and CSS does the rest —
     no style property is set directly, nothing is measured per frame beyond the
     one rect, and it only runs while a mouse is actually over the document.
     The stylesheet gates the transform behind (hover: hover) and flattens it
     under prefers-reduced-motion. */
  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse") return;
    const stage = stageRef.current;
    if (!stage) return;
    const box = stage.getBoundingClientRect();
    const px = (event.clientX - box.left) / box.width;
    const py = (event.clientY - box.top) / box.height;
    stage.style.setProperty("--px", px.toFixed(3));
    stage.style.setProperty("--py", py.toFixed(3));
    stage.style.setProperty("--tilt-y", `${(px - 0.5) * 13}deg`);
    stage.style.setProperty("--tilt-x", `${(0.5 - py) * 10}deg`);
    stage.dataset.lit = "true";
  };

  const rest = () => {
    const stage = stageRef.current;
    if (!stage) return;
    stage.style.setProperty("--tilt-x", "0deg");
    stage.style.setProperty("--tilt-y", "0deg");
    delete stage.dataset.lit;
  };

  const stamped = PHASES.filter((phase) => journey.stamps[phase.value]).length;
  // The most recent stamp carries the deep red. `at` is a full timestamp, so
  // several struck in one sitting still order correctly.
  const newest = Object.entries(journey.stamps).sort((a, b) =>
    b[1].at.localeCompare(a[1].at),
  )[0]?.[0];

  const [mrz1, mrz2] = mrzLines(journey);

  return (
    <dialog
      ref={dialogRef}
      className="passport"
      aria-labelledby={titleId}
      // The dialog carries no padding, so a click on the element itself can only
      // have come from the backdrop.
      onClick={(event) => {
        if (event.target === dialogRef.current) close();
      }}
    >
      {/* One roughening filter for every stamp on the page. feTurbulence is
          expensive to define and free to reuse, and it is static — painted once,
          never animated. */}
      <svg className="passport-defs" aria-hidden="true" focusable="false">
        <filter id="passport-ink" x="-15%" y="-15%" width="130%" height="130%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.55"
            numOctaves="4"
            seed="19"
            result="noise"
          />
          {/* 3.2 was enough displacement to turn the arc text into scribble at
              9px. 1.7 still breaks the ring's edge convincingly while leaving
              the lettering readable — the wear should look like ink, not like a
              printing fault. */}
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale="1.7"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </svg>

      <div className="passport-inner">
        <header className="passport-head">
          <div>
            <p className="passport-eyebrow">Travel document</p>
            <h2 id={titleId}>Passport</h2>
          </div>
          <button
            type="button"
            className="checkin-close"
            ref={closeRef}
            onClick={close}
            aria-label="Close passport"
          >
            <span aria-hidden="true">×</span>
          </button>
        </header>

        <div
          className="passport-stage"
          ref={stageRef}
          onPointerMove={onPointerMove}
          onPointerLeave={rest}
        >
          <div className="passport-tilt">
            <div className="passport-book" data-open={open}>
              {/* THE LEAF — cover on the front, stamp page on its back. It is
                  one element because in a real passport those two surfaces are
                  one piece of card. */}
              <div className="passport-leaf">
                <button
                  type="button"
                  className="passport-cover"
                  ref={coverRef}
                  onClick={() => {
                    flipped.current = true;
                    setOpen(true);
                  }}
                  inert={open}
                  aria-label="Open passport"
                >
                  <span className="passport-sheen" aria-hidden="true" />
                  <span className="passport-authority">Builds &amp; Boarding Passes</span>

                  <span className="passport-crest">
                    <span className="passport-seal" aria-hidden="true">
                      <span className="passport-seal-ring" />
                      <span className="passport-seal-plane">✈</span>
                    </span>
                    <span className="passport-wordmark">Passport</span>
                    <span className="passport-no">No. {journey.passportNo}</span>
                  </span>

                  <span className="passport-hint">Press to open</span>
                </button>

                {/* The inside of the cover: the stamp page. */}
                <div className="passport-page passport-page-stamps" inert={!open}>
                  <SecurityPaper />
                  <div className="passport-page-ink">
                    <p className="passport-page-head">
                      <span>Stamps</span>
                      <strong>
                        {stamped} / {PHASES.length}
                      </strong>
                    </p>

                    <div className="passport-slots">
                      {PHASES.map((phase, index) => {
                        const stamp = journey.stamps[phase.value];
                        return stamp ? (
                          <Stamp
                            key={phase.value}
                            label={stamp.label}
                            date={formatStampDate(stamp.at)}
                            angle={ANGLES[index]}
                            newest={phase.value === newest}
                          />
                        ) : (
                          <EmptySlot key={phase.value} label={phase.stamp ?? "Your own"} />
                        );
                      })}
                    </div>

                    {/* The project's own creed, in the strip's voice. */}
                    <p className="passport-declaration">
                      DREAMS&lt;DIE&lt;IN&lt;THE&lt;COMFORT&lt;ZONE&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;
                    </p>
                  </div>
                </div>
              </div>

              {/* THE DATA PAGE — the right-hand page, revealed as the leaf
                  swings off it. */}
              <div className="passport-page passport-page-data" inert={!open}>
                <SecurityPaper />
                <div className="passport-page-ink">
                  <p className="passport-page-head">
                    <span>Passport</span>
                    <strong>Type P · BBP</strong>
                  </p>

                  <div className="passport-identity">
                    {/* Where a real data page carries the portrait. Ours carries
                        the same seal as the cover, printed rather than pressed. */}
                    <span className="passport-portrait" aria-hidden="true">
                      <span className="passport-seal">
                        <span className="passport-seal-ring" />
                        <span className="passport-seal-plane">✈</span>
                      </span>
                    </span>

                    <div className="passport-fields">
                      <div className="passport-field">
                        <label htmlFor={holderId}>Holder</label>
                        <input
                          id={holderId}
                          type="text"
                          value={journey.holder}
                          onChange={(event) => setHolder(event.target.value)}
                          placeholder="Bearer unknown"
                          maxLength={18}
                          autoComplete="off"
                          spellCheck={false}
                        />
                      </div>

                      <div className="passport-field">
                        <label htmlFor={nationId}>Nationality</label>
                        <select
                          id={nationId}
                          value={journey.nationality}
                          onChange={(event) => setNationality(event.target.value)}
                        >
                          <option value="">—</option>
                          {countries.map((country) => (
                            <option key={country.code} value={country.code}>
                              {country.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="passport-rows">
                    <div>
                      <span>Passport no.</span>
                      <strong>{journey.passportNo}</strong>
                    </div>
                    <div>
                      <span>Authority</span>
                      <strong>{ISSUED_AT.place}</strong>
                    </div>
                    <div>
                      <span>Issued</span>
                      <strong>
                        {journey.issued ? formatStampDate(journey.issued) : "Not issued"}
                      </strong>
                    </div>
                    <div>
                      <span>Build miles</span>
                      <strong>{journey.miles.toLocaleString()}</strong>
                    </div>
                  </div>

                  <p className="passport-tier">
                    <span>Tier</span>
                    <strong>{tierFor(journey.miles)}</strong>
                  </p>

                  {/* ICAO 9303. Real check digits — see mrzLines(). */}
                  <p className="passport-mrz" aria-label="Machine readable zone">
                    <span>{mrz1}</span>
                    <span>{mrz2}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {open && (
          <div className="passport-controls">
            <button
              type="button"
              className="passport-flip-back"
              onClick={() => {
                flipped.current = true;
                setOpen(false);
              }}
            >
              Close cover
            </button>
          </div>
        )}

        <p className="checkin-note">
          Dry run. This passport is not saved yet — stamps and miles start
          counting when accounts land.
        </p>
      </div>
    </dialog>
  );
}
