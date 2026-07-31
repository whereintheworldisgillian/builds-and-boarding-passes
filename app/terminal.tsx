"use client";

import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { COMMANDS, findCommand, RUN_EVENT, type Reply } from "./commands";

/* --------------------------------------------------------------------------
   The floating terminal launcher and its console panel.

   This is the only client component in the app. page.tsx stays a server
   component — the interactive corner is isolated here so the rest of the page
   still ships as static markup with no JavaScript attached to it.

   The command set itself lives in ./commands.ts. Nothing about a command is
   encoded here beyond how each reply kind is rendered, so adding a command
   never means touching this file.
   -------------------------------------------------------------------------- */

/* One line of transcript, before it is given an id. Kept separate from Entry
   because Omit<> over a discriminated union collapses it to the keys the members
   share, which loses `text` and `lines` entirely. */
type EntryBody =
  /** The command the visitor typed, echoed back. */
  | { kind: "echo"; text: string }
  | { kind: "lines"; lines: string[]; tone: "normal" | "pending" | "error" }
  | { kind: "help" };

type Entry = EntryBody & { id: number };

/** Enough scrollback to feel real, bounded so the DOM cannot grow forever. */
const MAX_ENTRIES = 60;

const SUGGESTED = COMMANDS.filter((command) => command.suggested);

export default function Terminal() {
  const [open, setOpen] = useState(false);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [draft, setDraft] = useState("");
  // Submitted commands, newest last, walked with the arrow keys.
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);

  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const nextId = useRef(0);

  const panelId = useId();
  const titleId = useId();
  const inputId = useId();

  const push = useCallback((...items: EntryBody[]) => {
    setEntries((current) => {
      const added: Entry[] = items.map((item) => ({ ...item, id: nextId.current++ }));
      return [...current, ...added].slice(-MAX_ENTRIES);
    });
  }, []);

  // The panel is a single piece of state, so there is no way to open a second
  // one; the launcher toggles rather than stacking.
  const close = useCallback(() => {
    // Only pull focus back to the launcher if focus is still inside the thing
    // being closed. Escape is bound at document level, so the visitor may well
    // be somewhere else on the page — yanking them to the corner would be rude.
    const active = document.activeElement;
    const focusWasInside =
      !active ||
      active === document.body ||
      active === buttonRef.current ||
      panelRef.current?.contains(active) === true;

    setOpen(false);
    if (focusWasInside) buttonRef.current?.focus();
  }, []);

  const run = useCallback(
    (rawInput: string) => {
      const raw = rawInput.trim();
      if (!raw) return;

      const command = findCommand(raw);

      // Echo the canonical "/name" when it resolves, whatever the visitor
      // actually typed or clicked, and the raw text when it does not — an error
      // should quote back exactly what was entered.
      push({ kind: "echo", text: command ? `/${command.name}` : raw });
      setHistory((current) => [...current, raw].slice(-MAX_ENTRIES));
      setHistoryIndex(null);
      setDraft("");

      if (!command) {
        push({
          kind: "lines",
          tone: "error",
          lines: [`${raw} is not a command. Type /help to see what is.`],
        });
        return;
      }

      const reply: Reply = command.reply();
      switch (reply.kind) {
        case "help":
          push({ kind: "help" });
          break;

        case "lines":
          push({
            kind: "lines",
            tone: reply.pending ? "pending" : "normal",
            lines: reply.lines,
          });
          break;

        case "open": {
          const pending = reply.url === null;
          push({
            kind: "lines",
            tone: pending ? "pending" : "normal",
            lines: pending ? reply.pendingLines : reply.lines,
          });
          // Runs inside the click/submit handler, so it is not a blocked popup.
          if (reply.url) window.open(reply.url, "_blank", "noopener,noreferrer");
          break;
        }

        case "scroll": {
          const target = document.querySelector(reply.selector);
          if (!target) {
            push({
              kind: "lines",
              tone: "error",
              lines: [`Cannot find ${reply.selector} on this page.`],
            });
            break;
          }
          push({ kind: "lines", tone: "normal", lines: reply.lines });
          // Close first: the visitor asked to go somewhere, and on a phone the
          // panel covers most of what they are being sent to.
          close();
          // No `behavior` on purpose — that defers to the stylesheet's
          // scroll-behavior, which already flattens under prefers-reduced-motion.
          target.scrollIntoView({ block: "start" });
          break;
        }
      }
    },
    [push, close],
  );

  // Focus the input rather than the dialog: the visitor opened a terminal, so
  // typing is the point. The log is a live region, so replies are still
  // announced.
  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  // Bring the newest exchange into view. Not scrollTop = scrollHeight: /help is
  // taller than the log, so scrolling to the bottom would land the visitor on
  // the last row of the table with the command they just typed off-screen above.
  // Putting the newest echo at the top shows the reply from its beginning.
  // Layout effect so it lands before paint, never as a visible jump.
  useLayoutEffect(() => {
    const log = logRef.current;
    if (!log) return;
    const echoes = log.querySelectorAll<HTMLElement>("[data-echo]");
    const newest = echoes[echoes.length - 1];
    log.scrollTop = newest ? newest.offsetTop : log.scrollHeight;
  }, [entries, open]);

  // Let the page know the console is up. The only listener is the hero prompt,
  // which the panel would otherwise sit on top of and cut in half — and which is
  // redundant while the real thing is open. An attribute rather than more
  // plumbing: the hero prompt is a sibling three levels away in server-rendered
  // markup, and this is styling, not state it needs to read.
  useEffect(() => {
    const root = document.documentElement;
    root.toggleAttribute("data-terminal-open", open);
    return () => root.removeAttribute("data-terminal-open");
  }, [open]);

  // The hero prompt sends its commands here rather than running them itself, so
  // there is exactly one implementation of what a command does. Opening first
  // means the transcript is on screen before the reply lands — including the
  // replies that close it again, like /board.
  useEffect(() => {
    const onRun = (event: Event) => {
      const text = (event as CustomEvent<string>).detail;
      if (typeof text !== "string") return;
      setOpen(true);
      run(text);
    };
    window.addEventListener(RUN_EVENT, onRun);
    return () => window.removeEventListener(RUN_EVENT, onRun);
  }, [run]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, close]);

  const onInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "ArrowUp" && event.key !== "ArrowDown") return;
    if (history.length === 0) return;
    event.preventDefault();

    const last = history.length - 1;
    if (event.key === "ArrowUp") {
      const next = historyIndex === null ? last : Math.max(0, historyIndex - 1);
      setHistoryIndex(next);
      setDraft(history[next]);
      return;
    }
    // ArrowDown walks back toward the empty draft the visitor started from.
    if (historyIndex === null) return;
    if (historyIndex >= last) {
      setHistoryIndex(null);
      setDraft("");
      return;
    }
    const next = historyIndex + 1;
    setHistoryIndex(next);
    setDraft(history[next]);
  };

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        className="terminal-launch"
        // The compact launcher is icon-only, so its accessible name states the
        // action and updates with the same open state as the visual glyph.
        aria-label={open ? "Close terminal" : "Open terminal"}
        aria-haspopup="dialog"
        aria-expanded={open}
        // Only reference the panel while it exists, or the relationship points
        // at a missing id.
        aria-controls={open ? panelId : undefined}
        onClick={() => (open ? close() : setOpen(true))}
      >
        <span className="terminal-launch-face" aria-hidden="true">
          {open ? (
            <span className="terminal-launch-dismiss">×</span>
          ) : (
            <span className="terminal-launch-prompt">
              &gt;<i className="terminal-caret" />
            </span>
          )}
          <i className="terminal-launch-status" />
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

          <div className="terminal-log" ref={logRef} aria-live="polite">
            <p className="terminal-greeting">Welcome aboard, traveler.</p>
            {entries.length === 0 && (
              <p className="terminal-panel-dim">
                Type a command, or pick one below. Nothing here is live yet —
                /help says what is.
              </p>
            )}

            {entries.map((entry) => {
              if (entry.kind === "echo") {
                return (
                  // data-echo is the scroll anchor: the newest one is pulled to
                  // the top of the log after every command.
                  <p className="terminal-echo" data-echo="" key={entry.id}>
                    <span aria-hidden="true">&gt;</span> {entry.text}
                  </p>
                );
              }

              if (entry.kind === "help") {
                return (
                  <dl className="terminal-help" key={entry.id}>
                    {COMMANDS.map((command) => (
                      <div key={command.name}>
                        <dt>
                          <button
                            type="button"
                            className="terminal-chip"
                            onClick={() => run(command.name)}
                          >
                            /{command.name}
                          </button>
                        </dt>
                        <dd>{command.summary}</dd>
                      </div>
                    ))}
                  </dl>
                );
              }

              return (
                <div
                  className="terminal-reply"
                  data-tone={entry.tone}
                  key={entry.id}
                >
                  {entry.lines.map((line, index) => (
                    <p key={index}>{line}</p>
                  ))}
                </div>
              );
            })}
          </div>

          {/* Pinned outside the scrolling log, so the "I do not know what to
              type" affordance never scrolls away or disappears after the first
              command. */}
          <div className="terminal-suggest">
            <span className="terminal-suggest-label" id={`${panelId}-try`}>
              Try
            </span>
            <ul aria-labelledby={`${panelId}-try`}>
              {SUGGESTED.map((command) => (
                <li key={command.name}>
                  <button
                    type="button"
                    className="terminal-chip"
                    onClick={() => run(command.name)}
                  >
                    /{command.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <form
            className="terminal-form"
            onSubmit={(event) => {
              event.preventDefault();
              run(draft);
            }}
          >
            <label className="terminal-form-label" htmlFor={inputId}>
              Terminal command
            </label>
            <span className="terminal-form-prompt" aria-hidden="true">
              &gt;
            </span>
            <input
              ref={inputRef}
              id={inputId}
              className="terminal-input"
              type="text"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={onInputKeyDown}
              placeholder="/help"
              autoComplete="off"
              autoCapitalize="off"
              spellCheck={false}
              enterKeyHint="go"
            />
            <button type="submit" className="terminal-run">
              Run
            </button>
          </form>
        </div>
      )}
    </>
  );
}
