"use client";

import { useEffect, useId, useRef, useState } from "react";
import {
  BOARDING_CODE,
  destinationFor,
  isBoardingCode,
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
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);

  const [pass, setPass] = useState<Pass | null>(null);
  const [miles, setMiles] = useState(0);
  // Which codes have already paid out this session. Miles are per code, not per
  // submission, so redoing a pass to try another phase cannot farm them.
  const [earned, setEarned] = useState<string[]>([]);

  const titleId = useId();
  const phaseId = useId();
  const customId = useId();
  const codeId = useId();
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
      setError("Say where your build is, in a word or two.");
      return;
    }

    if (!isBoardingCode(code)) {
      setError(
        code.trim()
          ? "That is not the boarding code. It is called out on the stream."
          : "Enter the boarding code from the stream.",
      );
      return;
    }

    // Same code twice: reissue the pass so they can change their phase, but do
    // not pay again.
    const alreadyEarned = earned.includes(BOARDING_CODE);
    const payout = alreadyEarned ? 0 : MILES_PER_CHECKIN;
    if (!alreadyEarned) {
      setEarned((current) => [...current, BOARDING_CODE]);
      setMiles((current) => current + payout);
    }

    setError(null);
    setPass({ from: stamp, to: destinationFor(stamp), miles: payout });
  };

  const startOver = () => {
    setPass(null);
    setCode("");
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
      onClose={() => {
        setError(null);
        setCode("");
      }}
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
                : "Pass reissued. You already boarded on this code, so no extra miles."}
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
                />
              </div>
            )}

            <div className="checkin-field">
              <label htmlFor={codeId}>Boarding code</label>
              <input
                id={codeId}
                type="text"
                value={code}
                onChange={(event) => {
                  setCode(event.target.value);
                  setError(null);
                }}
                placeholder="called out on the stream"
                autoComplete="off"
                autoCapitalize="characters"
                spellCheck={false}
                enterKeyHint="go"
                aria-describedby={error ? errorId : undefined}
                aria-invalid={error ? true : undefined}
              />
            </div>

            {error && (
              <p className="checkin-error" id={errorId} role="alert">
                {error}
              </p>
            )}

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
