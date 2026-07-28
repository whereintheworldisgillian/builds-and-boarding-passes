/* ==========================================================================
   CURRENT JOURNEY — static placeholder values for phase one.

   These are hand-edited for now. In a later phase this shape is what a real
   data source would return, so the component does not need to change.
   ========================================================================== */

export type RouteStop = {
  id: string;
  /** City, Country — or "To be announced" for an unknown future stop. */
  label: string;
  status: "visited" | "current" | "upcoming";
};

export type Journey = {
  currentStop: string;
  currentBuild: string;
  boardingStatus: string;
  nextStop: string;
  /** Displayed as-is. Kept a string so "—" or "1,240" both work. */
  buildMiles: string;
  route: RouteStop[];
};

export const JOURNEY: Journey = {
  currentStop: "Phuket, Thailand",
  currentBuild: "Builds & Boarding Passes",
  boardingStatus: "Preparing for departure",
  nextStop: "To be announced",
  buildMiles: "1,200",
  route: [
    { id: "origin", label: "Departure", status: "visited" },
    { id: "phuket", label: "Phuket, Thailand", status: "current" },
    { id: "next", label: "To be announced", status: "upcoming" },
  ],
};
