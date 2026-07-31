/* --------------------------------------------------------------------------
   The departure board's rows.

   Read twice: page.tsx renders the full five-column table, and the /board
   command prints a three-column summary into the terminal. They are the same
   board, so they read the same data — editing a row here changes both, and
   there is no way for the console and the page to disagree about what is
   departing.

   The console drops FLIGHT and GATE on purpose. The panel is about 323px wide
   on a phone, which is not enough for five columns, and /board sends the
   visitor to the page where all five are.
   -------------------------------------------------------------------------- */

export type Departure = {
  time: string;
  destination: string;
  flight: string;
  gate: string;
  remarks: string;
  /** Drives the row's colour in both surfaces. Undefined is an ordinary row. */
  status?: "boarding" | "open" | "cancelled";
};

export const DEPARTURES: Departure[] = [
  {
    time: "NOW",
    destination: "FIRST DEPARTURE",
    flight: "BBP 001",
    gate: "01",
    remarks: "BOARDING",
    status: "boarding",
  },
  {
    time: "OPEN",
    destination: "THE TERMINAL",
    flight: "CMD 001",
    gate: ">",
    remarks: "TYPE /HELP",
    status: "open",
  },
  {
    time: "TODAY",
    destination: "DEPARTURE CODE",
    flight: "???",
    gate: "—",
    remarks: "DECODE",
  },
  {
    time: "NEXT",
    destination: "UNFINISHED TERRITORY",
    flight: "BBP 002",
    gate: "—",
    remarks: "MILES NEEDED",
  },
  {
    time: "NEVER",
    destination: "WAITING FOR PERFECT",
    flight: "—",
    gate: "—",
    remarks: "CANCELLED",
    status: "cancelled",
  },
];
