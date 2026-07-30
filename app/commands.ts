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

/** What the terminal does in response to a command. */
export type Reply =
  /** Render the full command table. */
  | { kind: "help" }
  /** Print lines. `pending` styles them as not-yet-built. */
  | { kind: "lines"; lines: string[]; pending?: boolean }
  /** Print lines, close the panel, and scroll to a section on the page. */
  | { kind: "scroll"; selector: string; lines: string[] }
  /** Open a URL in a new tab, or explain that there is not one yet. */
  | { kind: "open"; url: string | null; lines: string[]; pendingLines: string[] };

export type Command = {
  /** Without the leading slash. */
  name: string;
  /** The one-line description shown by /help. */
  summary: string;
  /** Offered as a starter chip to people who do not know what to type. */
  suggested?: boolean;
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
    summary: "Opens the current departure board",
    suggested: true,
    reply: () => ({
      kind: "scroll",
      selector: "#board",
      lines: ["Departure board, coming up."],
    }),
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
    summary: "Opens the Claude resources, skills, tools, and tips",
    reply: () => ({
      kind: "lines",
      pending: true,
      lines: [
        "Toolkit — coming in Phase 1.",
        "The skills, tools and prompts used to build this, written up.",
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
    summary: "Eventually begins the livestream check-in flow",
    reply: () => ({
      kind: "lines",
      pending: true,
      lines: [
        "Check-in — coming in Phase 1.",
        "It needs accounts and a live stream to check in to. Neither exists yet.",
      ],
    }),
  },
];

/** Tolerant lookup: accepts "/help", "\help", "help", and stray whitespace or case. */
export function findCommand(raw: string): Command | undefined {
  const name = raw.trim().toLowerCase().replace(/^[\\/]+/, "");
  return COMMANDS.find((command) => command.name === name);
}
