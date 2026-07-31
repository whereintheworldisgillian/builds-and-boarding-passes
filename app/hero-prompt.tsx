"use client";

import { useState } from "react";
import { COMMANDS, RUN_EVENT } from "./commands";

/* --------------------------------------------------------------------------
   The prompt in the hero, where the "Enter the journey" button used to be.

   A visitor arriving here is meant to recognise the page as something they can
   type into within a second, which a button cannot do. It runs the same command
   set as the corner terminal — it does not own any of it. Submitting dispatches
   RUN_EVENT on window; terminal.tsx listens, opens itself, and does the work.

   A custom event rather than shared state or a context provider: these two
   components sit in different parts of the tree with a whole server-rendered
   page between them, and this is the smaller of the two wirings.
   -------------------------------------------------------------------------- */

/** Starter commands, same source of truth as the terminal's own chips. */
const SUGGESTED = COMMANDS.filter((command) => command.suggested);

export default function HeroPrompt() {
  const [draft, setDraft] = useState("");

  const run = (raw: string) => {
    const text = raw.trim();
    if (!text) return;
    window.dispatchEvent(new CustomEvent(RUN_EVENT, { detail: text }));
    setDraft("");
  };

  return (
    <div className="hero-prompt-block">
      <form
        className="hero-prompt"
        onSubmit={(event) => {
          event.preventDefault();
          run(draft);
        }}
      >
        <label className="hero-prompt-label" htmlFor="hero-prompt-input">
          Run a terminal command
        </label>
        <span className="hero-prompt-caret" aria-hidden="true">
          &gt;
        </span>
        <input
          id="hero-prompt-input"
          className="hero-prompt-input"
          type="text"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="type /help to look around"
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
          enterKeyHint="go"
        />
        <button type="submit" className="hero-prompt-run">
          Run
        </button>
      </form>

      <ul className="hero-prompt-chips" aria-label="Suggested commands">
        {SUGGESTED.map((command) => (
          <li key={command.name}>
            <button
              type="button"
              className="hero-prompt-chip"
              onClick={() => run(command.name)}
            >
              /{command.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
