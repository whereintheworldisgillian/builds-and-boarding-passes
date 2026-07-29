"use client";

import { useEffect, useState } from "react";
import { DEPARTURES, type Departure } from "@/content/departures";

/* ==========================================================================
   THE DEPARTURE BOARD — its own full stage, not a panel in the hero.

   A board earns the name by having COLUMNS. The previous version was a
   label/value list wearing the word "departures"; this one is a real table
   with a real header row, which is also why it is marked up as a <table>:
   it is tabular data, and a screen reader should be able to say "row 4,
   destination, the comfort zone".

   The clock is live and local to the viewer. It is the only thing on the
   page that moves on its own, which is the point — it makes the board
   read as switched on rather than printed.

   Client component only because of that clock. Everything else here is
   static; if the clock ever goes, this goes back to the server.
   ========================================================================== */

/* Widths sum to 100 with every column showing. Below `sm` the two optional
   columns are dropped and the browser redistributes the rest — no second
   set of widths needed. */
const COLUMNS: { label: string; width: string; optional?: boolean }[] = [
  { label: "Time", width: "w-[12%]" },
  { label: "Destination", width: "w-[32%]" },
  { label: "Flight", width: "w-[16%]", optional: true },
  { label: "Gate", width: "w-[10%]", optional: true },
  { label: "Remarks", width: "w-[30%]" },
];

export function DepartureBoard() {
  return (
    <section
      id="departures"
      aria-labelledby="departures-heading"
      className="scroll-mt-24 bg-passport-navy px-6 py-section sm:px-10"
    >
      <div className="mx-auto w-full max-w-content">
        <div className="flex flex-wrap items-end justify-between gap-6 border-b border-passport-mist/20 pb-6">
          <div>
            <p className="font-mono text-[0.6875rem] tracking-[0.2em] text-passport-mist uppercase">
              World Tour 001 · Live route
            </p>
            <h2
              id="departures-heading"
              className="mt-3 font-display text-[clamp(2.5rem,7vw,5rem)] leading-none font-extrabold tracking-[-0.04em] text-passport-parchment"
            >
              Departures
            </h2>
          </div>
          <LocalClock />
        </div>

        {/* table-fixed, because auto layout hands every spare pixel to the
            destination column and opens a dead gap before FLIGHT. The
            widths below are what keep this reading as a board. */}
        <table className="w-full table-fixed border-collapse text-left">
          <thead>
            <tr className="border-b border-passport-mist/15">
              {COLUMNS.map((column) => (
                <th
                  key={column.label}
                  scope="col"
                  className={
                    "py-4 font-mono text-[0.625rem] font-medium tracking-[0.2em] text-passport-mist uppercase " +
                    column.width +
                    // Flight and Gate are the first things to go when the
                    // board is narrower than the data. Time, destination
                    // and status are what anyone actually reads.
                    (column.optional ? " hidden sm:table-cell" : "")
                  }
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {DEPARTURES.map((departure) => (
              <BoardRow key={departure.flight} departure={departure} />
            ))}
          </tbody>
        </table>

        <p className="mt-8 font-mono text-[0.6875rem] tracking-[0.2em] text-passport-mist uppercase">
          No fixed itinerary · Dreams die in the comfort zone
        </p>
      </div>
    </section>
  );
}

function BoardRow({ departure }: { departure: Departure }) {
  const live = departure.status === "boarding";
  const dead = departure.status === "cancelled";

  return (
    <tr className="border-b border-passport-mist/10 last:border-b-0">
      <td
        className={
          "py-5 pr-4 align-baseline font-mono text-sm tracking-[0.12em] uppercase " +
          (live
            ? "text-passport-signal"
            : dead
              ? "text-passport-mist/50"
              : "text-passport-parchment")
        }
      >
        {departure.time}
      </td>

      <td className="py-5 pr-4 align-baseline">
        <span
          className={
            "font-display text-xl font-bold tracking-[-0.02em] sm:text-2xl " +
            (dead
              ? "text-passport-mist/50 line-through decoration-1"
              : "text-passport-parchment")
          }
        >
          {departure.destination}
        </span>
      </td>

      <td
        className={
          "hidden py-5 pr-4 align-baseline font-mono text-sm tracking-[0.12em] uppercase sm:table-cell " +
          (dead ? "text-passport-mist/50" : "text-passport-parchment/80")
        }
      >
        {departure.flight}
      </td>

      <td
        className={
          "hidden py-5 pr-4 align-baseline font-mono text-sm tracking-[0.12em] uppercase sm:table-cell " +
          (dead ? "text-passport-mist/50" : "text-passport-parchment/80")
        }
      >
        {departure.gate}
      </td>

      <td className="py-5 align-baseline">
        <span
          className={
            "inline-flex items-center gap-2.5 font-mono text-xs tracking-[0.16em] uppercase " +
            (live
              ? "text-passport-signal"
              : dead
                ? "text-passport-mist/50"
                : "text-passport-parchment/80")
          }
        >
          {live && (
            <span
              aria-hidden="true"
              className="size-1.5 rounded-full bg-passport-signal"
              style={{
                animation: "hero-status-pulse 2.4s ease-in-out infinite",
              }}
            />
          )}
          {departure.remark}
        </span>
      </td>
    </tr>
  );
}

/* The viewer's own local time. Renders empty on the server and on the first
   client paint — the alternative is shipping a server timestamp that is
   wrong for everyone in a different timezone and then flickering when it
   corrects itself. `suppressHydrationWarning` is not needed because the
   first client render matches the server exactly. */
function LocalClock() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const tick = () =>
      setTime(
        new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }),
      );
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <p
      // Reserved width so the board header does not reflow when the clock
      // arrives after hydration.
      className="min-w-[5ch] font-mono text-3xl font-medium tracking-[0.08em] text-passport-signal tabular-nums sm:text-4xl"
    >
      {time ?? " "}
      <span className="sr-only"> local time</span>
    </p>
  );
}
