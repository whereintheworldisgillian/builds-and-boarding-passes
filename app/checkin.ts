/* --------------------------------------------------------------------------
   The livestream check-in.

   THIS IS THE FILE TO EDIT. The miles and the build phases are what change;
   everything else is the shape of the flow.

   Checking in is a click. There was a boarding code called out on stream, and
   it went: it could only ever be a participation token, since the answer ships
   in the JS bundle for anyone to read, and it charged every visitor a typing
   tax to prove something it could not actually prove. Gating this needs a
   server, and until there is one the honest version is the open one.

   A check-in issues the visitor a boarding pass for THEIR build, not for the
   studio's current city. Phuket is where Gillian is — it is not where the
   viewer is, and a pass routed to it would make the trip the point. The hero
   pass already settled this: IDEA -> SHIPPED is the viewer's journey. So this
   collects no geography and no personal data, and nothing here needs editing
   when the studio moves.

   Nothing is stored yet. The dialog says so on screen rather than quietly
   forgetting people — see app/checkin-dialog.tsx.
   -------------------------------------------------------------------------- */

/**
 * Fired on `window` when a command wants the check-in dialog. terminal.tsx
 * dispatches it, checkin-dialog.tsx listens — the same route hero-prompt.tsx
 * uses to reach the terminal, because the two sit far apart in a
 * server-rendered tree.
 */
export const OPEN_CHECKIN = "bbp:open-checkin";

/** Build Miles one check-in is worth. Gillian's number to set. */
export const MILES_PER_CHECKIN = 1240;

/** Printed in the footer of every issued pass. Already a row on the departures
    board — "OPEN / THE TERMINAL / CMD 001" — so it reads as somewhere the site
    already goes, and it stays true at every stop. */
export const ISSUED_AT = { place: "The Terminal", flight: "CMD 001" };

export type Phase = {
  value: string;
  /** What the dropdown says. */
  label: string;
  /** What the pass says. `null` means "ask them to type it". */
  stamp: string | null;
};

export const PHASES: Phase[] = [
  { value: "idea", label: "Still an idea", stamp: "IDEA" },
  { value: "building", label: "Building it now", stamp: "BUILDING" },
  { value: "debugging", label: "Debugging it", stamp: "DEBUGGING" },
  { value: "almost", label: "Almost there", stamp: "ALMOST" },
  { value: "shipped", label: "Shipped it", stamp: "SHIPPED" },
  { value: "other", label: "Something else", stamp: null },
];

/**
 * Longer than this and the route line stops fitting on a phone.
 *
 * The field enforces it with maxLength so the limit is felt while typing.
 * toStamp() still slices, because a cap that only exists in the markup is one
 * paste away from not existing — but by then it is a backstop, not the UX.
 */
export const STAMP_MAX = 14;

/**
 * Where every pass is headed — except for someone who has already shipped.
 * A pass reading SHIPPED -> SHIPPED is a dead end, and the person who just
 * shipped is exactly who should be pointed at the next one.
 */
export function destinationFor(stamp: string): string {
  return stamp === "SHIPPED" ? "NEXT ONE" : "SHIPPED";
}

/** Board-style: uppercase, single-spaced, and short enough to fit the ticket. */
export function toStamp(raw: string): string {
  return raw.trim().replace(/\s+/g, " ").toUpperCase().slice(0, STAMP_MAX);
}

