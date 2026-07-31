/* --------------------------------------------------------------------------
   The livestream check-in.

   THIS IS THE FILE TO EDIT between streams. The boarding code and the miles are
   the two lines that change; everything else is the shape of the flow.

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

/**
 * Called out live on stream. Change it per session.
 *
 * This ships inside the JS bundle, so anyone in devtools can read it. That is
 * fine for what it does — it gives people a reason to actually be watching —
 * but it is a participation token, not security. A code that cannot be read
 * needs a server to check it against.
 */
export const BOARDING_CODE = "HKT001";

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

/**
 * Punctuation and case go, then the characters people genuinely confuse are
 * folded together: O becomes zero, I and l become one.
 *
 * This code gets read aloud on a livestream and typed by someone half-watching.
 * "HKT001" is zero-zero-one, but "HKTOO1" is a completely reasonable thing to
 * hear and type, and there is no version of this where rejecting it is correct
 * — the person is in the audience, which is the only thing the code is proving.
 * Airlines leave O/0/I/1 out of booking references for exactly this reason; the
 * folding is what buys that back without changing the code.
 *
 * Applied to both sides, so it works whichever way round the ambiguity falls.
 * The trade-off: O and 0 become the same character, so two codes differing only
 * by one could not coexist. Fine while one is live at a time.
 */
function canonical(raw: string): string {
  return raw
    .replace(/[^a-z0-9]/gi, "")
    .toUpperCase()
    .replace(/O/g, "0")
    .replace(/[IL]/g, "1");
}

/** Tolerant: "hkt 001", "HKT-001", " hkt001 " and "HKTOO1" are all the code. */
export function isBoardingCode(raw: string): boolean {
  return canonical(raw) === canonical(BOARDING_CODE);
}
