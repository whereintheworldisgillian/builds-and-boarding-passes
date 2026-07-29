/* ==========================================================================
   THE DEPARTURE BOARD — every row on the board, in board order.

   This is the voice of the show more than it is data. Two of these flights
   are real (Phuket, the stream) and three are the joke that is also the
   whole point: the comfort zone has no return flight, and "someday" never
   leaves the gate. Keep that ratio when you edit — a board of only real
   rows reads like an airport, and a board of only jokes reads like a
   T-shirt.

   `time` is a string on purpose. "NOW" and "--:--" are as valid as "21:00",
   and none of it should ever be parsed as a real timestamp.
   ========================================================================== */

export type DepartureStatus = "boarding" | "scheduled" | "open" | "cancelled";

export type Departure = {
  time: string;
  destination: string;
  flight: string;
  gate: string;
  remark: string;
  status: DepartureStatus;
};

export const DEPARTURES: Departure[] = [
  {
    time: "NOW",
    destination: "Phuket",
    flight: "BBP 001",
    gate: "01",
    remark: "Boarding",
    status: "boarding",
  },
  {
    time: "21:00",
    destination: "The livestream",
    flight: "BBP 002",
    gate: "07",
    remark: "On time",
    status: "scheduled",
  },
  {
    time: "--:--",
    destination: "Wherever next",
    flight: "BBP 003",
    gate: "--",
    remark: "Route open",
    status: "open",
  },
  {
    time: "--:--",
    destination: "The comfort zone",
    flight: "BBP 000",
    gate: "--",
    remark: "No return flight",
    status: "cancelled",
  },
  {
    time: "NEVER",
    destination: "Someday",
    flight: "--- ---",
    gate: "--",
    remark: "Does not depart",
    status: "cancelled",
  },
];

/** The one row the hero teases. Always the live one. */
export const NOW_BOARDING = DEPARTURES[0];
