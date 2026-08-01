"use client";

import { useEffect, useId, useRef, useState } from "react";
import { PHASES } from "./checkin";
import {
  countryNames,
  formatStampDate,
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

   The document itself is a cover that opens. Both faces are stacked in one grid
   cell so the container is the height of the taller one and the cover is
   naturally page-sized, which is what a passport is. The face turned away is
   `inert`: backface-visibility hides it from the eye but NOT from the tab order,
   so without that the holder field is reachable through a closed cover.

   Nothing is persisted. See app/journey.ts.
   -------------------------------------------------------------------------- */

/** Fixed per-slot angles. A stamp is struck by hand; a grid of level ones is a
    table. Same list every render, so a stamp never jumps when its neighbour
    changes. */
const ANGLES = [-3.1, 2.2, -1.4, 2.8, -2.3, 1.6];

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

  // The open-handler below is registered once, so its closure would see the
  // first `open` forever. This mirror is what it reads instead.
  const openRef = useRef(open);
  useEffect(() => {
    openRef.current = open;
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
      // stays on <body>: every control on the back face is inert, the front
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
    stage.style.setProperty("--tilt-y", `${(px - 0.5) * 16}deg`);
    stage.style.setProperty("--tilt-x", `${(0.5 - py) * 12}deg`);
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
  // several stamped in one sitting still order correctly.
  const newest = Object.entries(journey.stamps).sort((a, b) =>
    b[1].at.localeCompare(a[1].at),
  )[0]?.[0];

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
              {/* Front face. A real button, so Enter and Space open it for free. */}
              <button
                type="button"
                className="passport-cover"
                ref={coverRef}
                onClick={() => setOpen(true)}
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

              {/* Back face. */}
              <div className="passport-spread" inert={!open}>
                <span className="passport-sheen" aria-hidden="true" />

                <div className="passport-data">
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

                  <div className="passport-rows">
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
                </div>

                <div className="passport-stamps">
                  <p className="passport-stamps-head">
                    <span>Stamps</span>
                    <strong>
                      {stamped} / {PHASES.length}
                    </strong>
                  </p>
                  <ul className="passport-slots">
                    {PHASES.map((phase, index) => {
                      const stamp = journey.stamps[phase.value];
                      return (
                        <li
                          key={phase.value}
                          className="passport-slot"
                          data-stamped={Boolean(stamp)}
                          data-newest={phase.value === newest}
                          style={{ "--angle": `${ANGLES[index]}deg` } as React.CSSProperties}
                        >
                          {stamp ? (
                            <>
                              <strong>{stamp.label}</strong>
                              <span>{formatStampDate(stamp.at)}</span>
                            </>
                          ) : (
                            <>
                              <strong>{phase.stamp ?? "Your own"}</strong>
                              <span>Unstamped</span>
                            </>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>

                <div className="passport-strip">
                  <span className="passport-creed">Dreams die in the comfort zone</span>
                  <span className="barcode" aria-hidden="true" />
                  <button
                    type="button"
                    className="passport-flip-back"
                    onClick={() => {
                      setOpen(false);
                      // Focus follows the face that is now in front, or it sits
                      // on a button that just became inert.
                      window.setTimeout(() => coverRef.current?.focus(), 0);
                    }}
                  >
                    Close cover
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <p className="checkin-note">
          Dry run. This passport is not saved yet — stamps and miles start
          counting when accounts land.
        </p>
      </div>
    </dialog>
  );
}
