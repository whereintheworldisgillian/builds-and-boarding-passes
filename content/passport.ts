/* ==========================================================================
   COMMUNITY PASSPORT — placeholder data for the preview.

   The PassportCard component is driven entirely by this shape. When real
   accounts exist in a later phase, the same object gets built from user data
   and the component is reused untouched. Nothing here implies a logged-in
   user today — this is a sample passport shown as a preview.
   ========================================================================== */

export type PassportStamp = {
  id: string;
  /** Short destination label, e.g. "Phuket". */
  place: string;
  /** Short country or region line. */
  region: string;
  /** Display date. Free text so "2026" or "Jul 2026" both work. */
  date: string;
};

export type PassportData = {
  /** Placeholder community handle. */
  username: string;
  /** Shown under the handle, e.g. member since. */
  memberSince: string;
  /** Stamps already earned, newest last. */
  stamps: PassportStamp[];
  /** How many empty stamp slots to render after the earned ones. */
  lockedSlots: number;
  /** Short lines summarising activity so far. */
  history: string[];
  /** The line that closes the card. */
  message: string;
};

export const PASSPORT_PREVIEW: PassportData = {
  username: "@newtraveller",
  memberSince: "Member since 2026",
  stamps: [
    {
      id: "phuket",
      place: "Phuket",
      region: "Thailand",
      date: "Jul 2026",
    },
  ],
  lockedSlots: 3,
  history: ["First check-in recorded", "First destination stamped"],
  message: "Your journey starts here.",
};
