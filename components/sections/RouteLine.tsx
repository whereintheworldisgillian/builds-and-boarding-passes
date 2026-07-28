"use client";

import { useInView } from "@/lib/useInView";
import type { RouteStop } from "@/content/journey";

type RouteLineProps = {
  stops: RouteStop[];
};

/**
 * The route: a single horizontal track with a marker per stop.
 *
 * The travelled portion draws itself in when the section is first seen —
 * the one piece of motion in this section, and the one that actually says
 * something ("we have come from there, we are here, more to come").
 *
 * Rendered as an ordered list so it is a sequence to a screen reader too,
 * with each marker's state spelled out in text rather than in colour alone.
 */
export function RouteLine({ stops }: RouteLineProps) {
  const { ref, inView, reducedMotion } = useInView();

  const currentIndex = stops.findIndex((stop) => stop.status === "current");
  // Track is drawn between the first and last marker centres, so progress
  // is measured across the gaps rather than across the whole width.
  const lastIndex = Math.max(stops.length - 1, 1);
  const progress = currentIndex <= 0 ? 0 : currentIndex / lastIndex;

  return (
    /*
      Horizontal padding equal to half a marker (dot + ring), so the first
      and last markers sit flush with the track ends without spilling past
      the card's edge.
    */
    <div ref={ref} className="px-2.5">
      {/* Track ------------------------------------------------------- */}
      <div className="relative h-2" aria-hidden="true">
        {/* Full route, faint. */}
        <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-line-strong" />

        {/* Travelled so far, in accent. Draws from the left on first view. */}
        <div
          className="absolute top-1/2 left-0 h-px origin-left -translate-y-1/2 bg-accent"
          style={{
            width: `${progress * 100}%`,
            animation:
              inView && !reducedMotion
                ? "route-draw 1600ms var(--ease-cinematic) 200ms both"
                : undefined,
            // Reduced motion: already drawn, no animation to skip.
            transform: reducedMotion ? "scaleX(1) translateY(-50%)" : undefined,
          }}
        />

        {/* Markers, positioned along the track. */}
        {stops.map((stop, index) => {
          const position = (index / lastIndex) * 100;
          return (
            <span
              key={stop.id}
              className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${position}%` }}
            >
              <Marker status={stop.status} />
            </span>
          );
        })}
      </div>

      {/* Labels ------------------------------------------------------ */}
      <ol className="mt-4 grid grid-cols-3 gap-2">
        {stops.map((stop, index) => (
          <li
            key={stop.id}
            className={
              index === 0
                ? "text-left"
                : index === stops.length - 1
                  ? "text-right"
                  : "text-center"
            }
          >
            <p
              className={`text-xs leading-snug sm:text-sm ${
                stop.status === "current"
                  ? "font-medium text-ink"
                  : "text-ink-faint"
              }`}
            >
              {stop.label}
            </p>
            {/* State in words, not just in colour. */}
            <p className="label-eyebrow mt-1 text-ink-faint">
              {STATUS_LABEL[stop.status]}
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
}

const STATUS_LABEL: Record<RouteStop["status"], string> = {
  visited: "Departed",
  current: "Here",
  upcoming: "Ahead",
};

function Marker({ status }: { status: RouteStop["status"] }) {
  if (status === "current") {
    return (
      <span className="relative flex size-3">
        <span
          className="absolute inset-0 rounded-full bg-accent"
          style={{ animation: "marker-pulse 3.6s var(--ease-cinematic) infinite" }}
        />
        <span className="relative size-3 rounded-full bg-accent ring-4 ring-canvas" />
      </span>
    );
  }

  if (status === "visited") {
    return <span className="block size-2.5 rounded-full bg-accent ring-4 ring-canvas" />;
  }

  // Hollow rather than dashed: a dashed border on a 10px circle renders as a
  // handful of ragged blobs. A solid outline reads cleanly as "not yet", and
  // the "Ahead" label underneath carries the actual meaning.
  return (
    <span className="block size-2.5 rounded-full border border-line-strong bg-canvas ring-4 ring-canvas" />
  );
}
