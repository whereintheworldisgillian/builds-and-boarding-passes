/* --------------------------------------------------------------------------
   The terminal's command set.

   This is the file to edit. Adding a command means adding one entry to
   COMMANDS; app/terminal.tsx renders whatever is here and needs no changes.

   Everything is honest about what exists. A command that has no destination or
   no content yet replies "pending" rather than pretending — that is the
   project's rule, and it is why /live and /discord read their URLs from LINKS
   below instead of having anything hardcoded.
   -------------------------------------------------------------------------- */

/**
 * Real destinations. `null` means "not linked yet", and the matching command
 * will say so instead of going nowhere. Paste missing URLs in here when their
 * destinations come online.
 */
export const LINKS: Record<"livestream" | "discord", string | null> = {
  // The channel-level route always targets the current livestream instead of
  // requiring this file to be updated for every new broadcast.
  livestream: "https://www.youtube.com/@whereintheworldisgillian/live",
  discord: null,
};

/**
 * Fired on `window` when something outside the terminal wants a command run —
 * the hero prompt is the only sender today. `detail` is the raw text, which
 * findCommand() below is tolerant about. terminal.tsx listens, opens itself and
 * runs it, so the terminal stays the single place a command is ever executed.
 */
export const RUN_EVENT = "bbp:run-command";

/** What the terminal does in response to a command. */
export type Reply =
  /** Render the full command table. */
  | { kind: "help" }
  /** Print lines. `pending` styles them as not-yet-built. */
  | { kind: "lines"; lines: string[]; pending?: boolean }
  /** Print lines, close the panel, and scroll to a section on the page. */
  | { kind: "scroll"; selector: string; lines: string[] }
  /** Print the departure board, then scroll to the real one. */
  | { kind: "board"; selector: string; lines: string[] }
  /** Wipe the transcript. Prints nothing — the empty log is the confirmation. */
  | { kind: "clear" }
  /** Print lines, close the console, and open the check-in dialog over the page. */
  | { kind: "checkin"; lines: string[] }
  /** Open a URL in a new tab, or explain that there is not one yet. */
  | { kind: "open"; url: string | null; lines: string[]; pendingLines: string[] };

export type Command = {
  /** Without the leading slash. */
  name: string;
  /** The one-line description shown by /help. */
  summary: string;
  /** Offered as a starter chip to people who do not know what to type. */
  suggested?: boolean;
  /**
   * Kept out of /help, the starter chips, and tab completion — but still
   * runnable. For things that are meant to be found rather than listed.
   */
  hidden?: boolean;
  /** Evaluated at call time, so LINKS can be edited without a rebuild. */
  reply: () => Reply;
};

export const COMMANDS: Command[] = [
  {
    name: "help",
    summary: "Shows the available commands",
    suggested: true,
    reply: () => ({ kind: "help" }),
  },
  {
    name: "board",
    summary: "Prints the departure board, then goes to it",
    suggested: true,
    // Prints first, because reading a departures board inside a terminal is
    // the most on-brand thing this site can do, then sends them to the full
    // five-column version on the page. Rows come from ./departures.
    reply: () => ({
      kind: "board",
      selector: "#board",
      lines: ["Full board on the page."],
    }),
  },
  {
    name: "clear",
    summary: "Clears the terminal",
    // Clears the screen, not the history — /clear in a real shell leaves the
    // arrow keys alone, and losing what you just typed would be a worse
    // surprise than a full log. The greeting renders whenever the transcript is
    // empty, so wiping it lands back on the welcome state for free.
    reply: () => ({ kind: "clear" }),
  },
  {
    name: "today",
    summary: "Shows the current build, stream goal, or daily update",
    suggested: true,
    // Every line here is already stated elsewhere on the page, so nothing is
    // invented. It is hand-updated, and says so.
    reply: () => ({
      kind: "lines",
      lines: [
        "Stop 001 — Phuket, Thailand (HKT).",
        "Build — this site, in public.",
        "Boarding — now. Next stop intentionally unknown.",
        "Updated by hand, not yet by anything live.",
      ],
    }),
  },
  {
    name: "live",
    summary: "Takes viewers to the current livestream",
    suggested: true,
    reply: () => ({
      kind: "open",
      url: LINKS.livestream,
      lines: ["Opening the livestream in a new tab."],
      // Visitor-facing copy. The instruction for wiring it up belongs in the
      // LINKS comment above, not on screen.
      pendingLines: [
        "The livestream is not linked yet.",
        "It goes live with the tour — check back at the next stop.",
      ],
    }),
  },
  {
    name: "discord",
    summary: "Opens Builds & Boarding Passes on Discord",
    reply: () => ({
      kind: "open",
      url: LINKS.discord,
      lines: ["Opening Discord in a new tab."],
      pendingLines: [
        "The Discord is not open yet.",
        "It opens in Phase 1, alongside check-ins.",
      ],
    }),
  },
  {
    name: "passport",
    summary: "Opens the community passport preview",
    reply: () => ({
      kind: "lines",
      pending: true,
      lines: [
        "Passport — coming in Phase 1.",
        "Stamps, Build Miles, and one slot per stop.",
      ],
    }),
  },
  {
    name: "toolkit",
    summary: "Shows what this site is actually built with",
    // Deliberately not a starter chip. A fifth chip measures ~318px against
    // ~323px of usable row on a 390px phone, so it wraps to a second line —
    // and the pinned rows are budgeted in --terminal-chrome, which the log's
    // max-height is derived from. /help lists it under "Working now" instead.
    // Every line is checkable against package.json and the tree, which is the
    // point — the honest answer to "what did you use to make this?" rather
    // than a promise of a write-up that does not exist yet.
    //
    // The labels are padded to align in the panel's mono face. Keep any line
    // under about 42 characters or it wraps on a phone.
    reply: () => ({
      kind: "lines",
      lines: [
        "What this site is actually built with:",
        "Framework   Next.js 16",
        "UI          React 19",
        "Types       TypeScript, strict",
        "Styling     Plain CSS",
        "Model       Claude Opus 5",
        "No UI kit, no CSS-in-JS, no animation library.",
        "One page, one stylesheet, one client component.",
      ],
    }),
  },
  {
    name: "decode",
    summary: "Opens the current code or puzzle",
    reply: () => ({
      kind: "lines",
      pending: true,
      lines: ["Decode — coming in Phase 1.", "No puzzle is running yet."],
    }),
  },
  {
    name: "checkin",
    summary: "Issues you a boarding pass for your own build",
    // Not a starter chip, for the same reason /toolkit is not: a fifth chip
    // wraps the pinned row at 390px, and --terminal-chrome budgets that row's
    // height. The hero prompt reads the same SUGGESTED list, so it would wrap
    // into the boarding pass there too.
    // No longer pending, so isLive() moves it into /help's "Working now" on its
    // own. What it is honest about now lives on the dialog itself: the pass is
    // real, and nothing is saved yet. See app/checkin.ts.
    reply: () => ({
      kind: "checkin",
      lines: ["Opening check-in."],
    }),
  },
  {
    // Hidden on purpose. Not in /help, not a chip, not tab-completable — the
    // reward is for trying the word this whole project is named after.
    name: "vibe",
    summary: "—",
    hidden: true,
    reply: () => ({
      kind: "lines",
      lines: [
        "VIBE CHECK — PASSED",
        "Commits: unsquashed. Variables: named `thing2`.",
        "Tests: aspirational. Shipped anyway.",
        "That is the whole method.",
      ],
    }),
  },
];

/** Strips the slash, case and padding so "/Help", "\help" and " help " all match. */
function normalize(raw: string): string {
  return raw.trim().toLowerCase().replace(/^[\\/]+/, "");
}

/** Tolerant lookup: accepts "/help", "\help", "help", and stray whitespace or case. */
export function findCommand(raw: string): Command | undefined {
  const name = normalize(raw);
  return COMMANDS.find((command) => command.name === name);
}

/** Everything /help, the chips and tab completion are allowed to reveal. */
export const LISTED = COMMANDS.filter((command) => !command.hidden);

/**
 * Whether a command does something today.
 *
 * Derived by asking the command rather than stored on it, because `reply` is
 * evaluated at call time so LINKS can be edited without a rebuild. Paste a
 * Discord URL into LINKS and /discord moves itself out of the scheduled group;
 * a hardcoded flag would sit there lying about it.
 */
export function isLive(command: Command): boolean {
  const reply = command.reply();
  if (reply.kind === "lines") return !reply.pending;
  if (reply.kind === "open") return reply.url !== null;
  return true;
}

/** Names starting with what has been typed so far. Drives tab completion. */
export function completions(raw: string): string[] {
  const typed = normalize(raw);
  if (!typed) return [];
  return LISTED.filter((command) => command.name.startsWith(typed)).map(
    (command) => command.name,
  );
}

/**
 * What the visitor probably meant. Prefix matches first — the common case is a
 * half-typed name — then a small edit-distance pass so transpositions like
 * "boadr" still land on /board.
 */
export function suggest(raw: string): string[] {
  const typed = normalize(raw);
  if (!typed) return [];
  const prefix = completions(typed);
  if (prefix.length > 0) return prefix;
  return LISTED.filter((command) => distance(command.name, typed) <= 2).map(
    (command) => command.name,
  );
}

/** Levenshtein, one row at a time. Command names are short; this is never hot. */
function distance(a: string, b: string): number {
  let previous = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const row = [i];
    for (let j = 1; j <= b.length; j++) {
      row[j] = Math.min(
        previous[j] + 1,
        row[j - 1] + 1,
        previous[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1),
      );
    }
    previous = row;
  }
  return previous[b.length];
}
