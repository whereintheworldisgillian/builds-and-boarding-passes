"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";

/* --------------------------------------------------------------------------
   The floating terminal launcher and its console panel.

   This is the first client component in the app. page.tsx stays a server
   component — the interactive part is isolated here so the rest of the page
   still ships as static markup with no JavaScript attached to it.

   Phase one is deliberately a shell: the panel announces itself and says
   commands are coming. Nothing here parses input, and the project's rule is
   that nothing pretends to work, so there is no input field to type into yet.
   -------------------------------------------------------------------------- */

export default function Terminal() {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const panelId = useId();
  const titleId = useId();

  // The panel is a single piece of state, so there is no way to open a second
  // one; the launcher toggles rather than stacking.
  const close = useCallback(() => {
    // Only pull focus back to the launcher if focus is still inside the thing
    // being closed. Escape is bound at document level, so the user may well be
    // somewhere else on the page — yanking them to the corner would be rude.
    const active = document.activeElement;
    const focusWasInside =
      !active ||
      active === document.body ||
      active === buttonRef.current ||
      panelRef.current?.contains(active) === true;

    setOpen(false);
    if (focusWasInside) buttonRef.current?.focus();
  }, []);

  // Move focus into the panel on open. The dialog container takes focus rather
  // than the close button, so assistive tech announces the heading and body
  // before landing the user on a control.
  useEffect(() => {
    if (open) panelRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, close]);

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        className="terminal-launch"
        // The visible label is wrapped in spans next to a decorative prompt
        // glyph, so the name is stated outright rather than left to subtree
        // computation. It matches the visible text, which keeps "label in name"
        // satisfied for voice control.
        aria-label={open ? "Close terminal" : "Open terminal"}
        aria-haspopup="dialog"
        aria-expanded={open}
        // Only reference the panel while it exists, or the relationship points
        // at a missing id.
        aria-controls={open ? panelId : undefined}
        onClick={() => (open ? close() : setOpen(true))}
      >
        {/* The visible chip. The notched corner lives on this inner element and
            not on the button, because clip-path would crop the focus ring. */}
        <span className="terminal-launch-face">
          <span className="terminal-launch-prompt" aria-hidden="true">
            &gt;<i className="terminal-caret" />
          </span>
          <span>{open ? "Close terminal" : "Open terminal"}</span>
        </span>
      </button>

      {open && (
        <div
          ref={panelRef}
          id={panelId}
          className="terminal-panel"
          role="dialog"
          aria-labelledby={titleId}
          // Not aria-modal: the page behind stays available and focus is not
          // trapped, which is honest for a corner console and avoids promising
          // modal semantics the markup does not implement.
          tabIndex={-1}
        >
          <header className="terminal-panel-head">
            <span className="terminal-panel-title" id={titleId}>
              Builds &amp; Boarding Passes Terminal
            </span>
            <span className="terminal-panel-state">
              <i aria-hidden="true" />
              Standby
            </span>
            <button
              type="button"
              className="terminal-panel-close"
              onClick={close}
              aria-label="Close terminal"
            >
              <span aria-hidden="true">×</span>
            </button>
          </header>

          <div className="terminal-panel-body">
            <p>Welcome aboard, traveler.</p>
            <p>The Terminal is preparing for departure.</p>
            <p className="terminal-panel-dim">Commands are coming soon.</p>
            <p className="terminal-panel-prompt" aria-hidden="true">
              &gt;<i className="terminal-caret" />
            </p>
          </div>
        </div>
      )}
    </>
  );
}
