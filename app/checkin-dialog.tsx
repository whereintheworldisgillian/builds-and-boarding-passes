"use client";

import { useEffect, useId, useRef, useState } from "react";
import {
  destinationFor,
  ISSUED_AT,
  MILES_PER_CHECKIN,
  OPEN_CHECKIN,
  PHASES,
  STAMP_MAX,
  toStamp,
} from "./checkin";

/* --------------------------------------------------------------------------
   The check-in dialog.

   A native <dialog> opened with showModal(), not a hand-rolled overlay. The
   platform already gives us the focus trap, Escape, an inert background,
   ::backdrop, and focus returning to whatever opened it — all of which is the
   most bug-prone code in frontend to write by hand. The only thing left to add
   is backdrop-click, which is one comparison.

   NOTHING IS PERSISTED. There is no account to attach a stamp to and no server
   to keep it on, so a check-in lives as long as the tab does. That is a real
   limitation and the panel says so on screen — this project's rule is that
   nothing pretends to work, and a counter that silently resets would be exactly
   that. It becomes permanent when the backend lands; no other change is needed
   here beyond where these two useStates read from.
   -------------------------------------------------------------------------- */

type Pass = { from: string; to: string; miles: number };

export default function CheckinDialog() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const selectRef = useRef<HTMLSelectElement>(null);

  const [phase, setPhase] = useState("");
  const [custom, setCustom] = useState("");
  const [error, setError] = useState<string | null>(null);

  const [pass, setPass] = useState<Pass | null>(null);
  const [miles, setMiles] = useState(0);
  // Miles are paid once per session, not once per submission — otherwise
  // "Change my pass" would be a button that prints money. The boarding code
  // used to be what bounded this; without it, the session is.
  const [earned, setEarned] = useState(false);

  const titleId = useId();
  const phaseId = useId();
  const customId = useId();
  const errorId = useId();

  const close = () => dialogRef.current?.close();

  useEffect(() => {
    const onOpen = () => {
      const dialog = dialogRef.current;
      // Guard: showModal() throws if the dialog is already open, and /checkin
      // can be run again while it is.
      if (!dialog || dialog.open) return;
      dialog.showModal();
      // The browser focuses the first focusable child, which is the close
      // button. Sending focus to the first real question is kinder.
      selectRef.current?.focus();
    };
    window.addEventListener(OPEN_CHECKIN, onOpen);
    return () => window.removeEventListener(OPEN_CHECKIN, onOpen);
  }, []);

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const chosen = PHASES.find((option) => option.value === phase);
    if (!chosen) {
      setError("Pick where your build is first.");
      return;
    }

    const stamp = chosen.stamp ?? toStamp(custom);
    if (!stamp) {
      // Kept short so it stays one line at 360px — the reserved slot below the
      // field is sized to one line, and the label already says "in a word or
      // two". See .checkin-error-slot.
      setError("Say where your build is.");
      return;
    }

    // Reissuing gives them the pass they meant, but only the first check-in of
    // the session pays.
    const payout = earned ? 0 : MILES_PER_CHECKIN;
    if (!earned) {
      setEarned(true);
      setMiles((current) => current + payout);
    }

    setError(null);
    setPass({ from: stamp, to: destinationFor(stamp), miles: payout });
  };

  const startOver = () => {
    setPass(null);
    setError(null);
    // Phase and custom text are kept on purpose — the usual reason to start
    // over is to try a different one, and retyping what you just chose is
    // busywork.
    window.setTimeout(() => selectRef.current?.focus(), 0);
  };

  return (
    <dialog
      ref={dialogRef}
      className="checkin"
      aria-labelledby={titleId}
      // The dialog has no padding of its own, so a click landing on the element
      // itself came from the backdrop rather than any content.
      onClick={(event) => {
        if (event.target === dialogRef.current) close();
      }}
      onClose={() => setError(null)}
    >
      <div className="checkin-inner">
        <header className="checkin-head">
          <div>
            <p className="checkin-eyebrow">Now boarding</p>
            <h2 id={titleId}>Check in</h2>
          </div>
          <button
            type="button"
            className="checkin-close"
            onClick={close}
            aria-label="Close check-in"
          >
            <span aria-hidden="true">×</span>
          </button>
        </header>

        {pass ? (
          <div className="checkin-aboard">
            {/* Reuses the hero's ticket wholesale — .pass-issued only undoes the
                three things the hero copy carries for its corner: absolute
                positioning, the tilt, and the float. */}
            <article className="boarding-pass pass-issued" aria-label="Your boarding pass">
              <div className="pass-heading">
                <span>Builds &amp; Boarding Passes</span>
                <span>BBP / 001</span>
              </div>
              <div className="pass-route">
                <div>
                  <strong>{pass.from}</strong>
                  <span>Where you are</span>
                </div>
                <div className="pass-flight" aria-hidden="true">
                  <span>✈</span>
                </div>
                <div>
                  <strong>{pass.to}</strong>
                  <span>Where you&rsquo;re going</span>
                </div>
              </div>
              <div className="pass-details">
                <div>
                  <span>Miles earned</span>
                  <strong>
                    {pass.miles ? `+${pass.miles.toLocaleString()}` : "—"}
                  </strong>
                </div>
                <div>
                  <span>Build miles</span>
                  <strong>{miles.toLocaleString()}</strong>
                </div>
                <div>
                  <span>Issued at</span>
                  <strong>{ISSUED_AT.place}</strong>
                </div>
                <div>
                  <span>Flight</span>
                  <strong>{ISSUED_AT.flight}</strong>
                </div>
              </div>
              <div className="pass-footer">
                <span>Build before you&rsquo;re ready</span>
                <span className="barcode" aria-hidden="true" />
              </div>
            </article>

            <p className="checkin-aboard-line">
              {pass.miles
                ? "You are aboard. Go build the thing."
                : "Pass reissued. You already boarded this session, so no extra miles."}
            </p>

            <div className="checkin-actions">
              <button type="button" className="checkin-board" onClick={close}>
                Done
              </button>
              <button type="button" className="checkin-again" onClick={startOver}>
                Change my pass
              </button>
            </div>
          </div>
        ) : (
          <form className="checkin-form" onSubmit={onSubmit} noValidate>
            <div className="checkin-field">
              <label htmlFor={phaseId}>Where is your build?</label>
              <select
                ref={selectRef}
                id={phaseId}
                value={phase}
                onChange={(event) => {
                  setPhase(event.target.value);
                  setError(null);
                }}
                // The code field used to carry these. The picker is now the
                // only thing that can be wrong, so the error points here.
                aria-describedby={error ? errorId : undefined}
                aria-invalid={error && phase === "" ? true : undefined}
              >
                <option value="">Choose one…</option>
                {PHASES.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {phase === "other" && (
              <div className="checkin-field">
                <label htmlFor={customId}>In a word or two</label>
                <input
                  id={customId}
                  type="text"
                  value={custom}
                  onChange={(event) => {
                    setCustom(event.target.value);
                    setError(null);
                  }}
                  placeholder="e.g. rewriting"
                  // Stops at the ticket's limit while they type, rather than
                  // silently lopping the end off once the pass is issued.
                  maxLength={STAMP_MAX}
                  autoComplete="off"
                  spellCheck={false}
                  enterKeyHint="go"
                  aria-describedby={error ? errorId : undefined}
                  aria-invalid={error && !custom.trim() ? true : undefined}
                />
              </div>
            )}

            {/* The slot is always in the DOM, empty or not. Two reasons: the
                panel keeps exactly one height, so an error never shoves the
                Board button down while someone is reaching for it; and a live
                region has to exist before its contents change or screen readers
                miss the first message. */}
            <div className="checkin-error-slot" id={errorId} role="alert">
              {error && <p className="checkin-error">{error}</p>}
            </div>

            <button type="submit" className="checkin-board">
              Board
            </button>
          </form>
        )}

        {/* The honest bit, in the same amber the terminal uses for things that
            are scheduled rather than built. */}
        <p className="checkin-note">
          Dry run. Stamps and miles are not saved yet — they start counting when
          accounts land.
        </p>
      </div>
    </dialog>
  );
}
