import type { PassportStamp as Stamp } from "@/content/passport";

/*
  Stamp cells are four-across at every width, which keeps the row reading as
  a row of stamps rather than a grid of tiles. That leaves roughly 50px of
  content width on a small phone, so the type is sized to fit there and
  scales up from there — if any line wraps, it forces the cell taller than
  its aspect-square and the whole row loses its rhythm.
*/

type EarnedProps = {
  stamp: Stamp;
  /** Small rotation so a row of stamps never looks like a form. */
  tilt?: number;
};

/**
 * An earned destination stamp.
 *
 * Reads as a collected mark rather than a border-control impression: soft
 * accent tint, no fake ink texture, no perforation, no barcode.
 */
export function PassportStamp({ stamp, tilt = -3 }: EarnedProps) {
  return (
    <li
      className="flex aspect-square items-center justify-center overflow-hidden rounded-lg border border-accent-line bg-accent-soft p-1.5 text-center transition-transform duration-500 ease-cinematic hover:rotate-0 sm:p-2"
      style={{ transform: `rotate(${tilt}deg)` }}
    >
      <div>
        <p className="font-display text-xs leading-tight font-semibold text-ink sm:text-sm md:text-base">
          {stamp.place}
        </p>
        <p className="mt-0.5 text-[0.625rem] leading-tight text-ink-muted sm:text-[0.6875rem]">
          {stamp.region}
        </p>
        <p className="mt-1 text-[0.5625rem] font-medium tracking-[0.1em] whitespace-nowrap text-accent uppercase sm:mt-1.5 sm:tracking-[0.16em]">
          {stamp.date}
        </p>
      </div>
    </li>
  );
}

/**
 * An empty slot for a stamp not yet earned.
 *
 * The dash is decorative; the state is given as real text so a screen reader
 * hears "Locked" rather than a punctuation mark.
 */
export function PassportStampLocked({ index }: { index: number }) {
  return (
    <li className="flex aspect-square items-center justify-center overflow-hidden rounded-lg border border-dashed border-line bg-surface p-1.5 text-center sm:p-2">
      <div>
        <p className="font-display text-base text-ink-faint sm:text-lg" aria-hidden="true">
          &mdash;
        </p>
        <p className="mt-1 text-[0.5625rem] font-medium tracking-[0.1em] whitespace-nowrap text-ink-faint uppercase sm:tracking-[0.16em]">
          Locked
        </p>
        <span className="sr-only">Stamp slot {index} — not yet earned</span>
      </div>
    </li>
  );
}
