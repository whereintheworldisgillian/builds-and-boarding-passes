import { PassportStamp, PassportStampLocked } from "./PassportStamp";
import type { PassportData } from "@/content/passport";

type PassportCardProps = {
  passport: PassportData;
  className?: string;
};

/**
 * The community passport, as a modern digital collectible.
 *
 * Fully driven by the `passport` prop — it knows nothing about where the
 * data came from. Today that is the static preview in content/passport.ts;
 * when real accounts exist, the same component takes a real passport and
 * needs no changes.
 *
 * Deliberately not a facsimile of a government document: no crest, no
 * machine-readable strip, no navy-blue booklet cover.
 */
export function PassportCard({ passport, className = "" }: PassportCardProps) {
  const { username, memberSince, stamps, lockedSlots, history, message } =
    passport;

  return (
    <article
      className={`overflow-hidden rounded-xl border border-line bg-canvas-raised shadow-lifted ${className}`.trim()}
    >
      {/* Identity ------------------------------------------------------ */}
      {/* Stacks on narrow cards: "Community Passport" is wide enough to wrap
          against the date, which leaves the header looking broken. */}
      <header className="flex flex-col gap-1 border-b border-line bg-surface px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <div className="min-w-0">
          <p className="label-eyebrow text-ink-faint">Community Passport</p>
          <p className="mt-1.5 truncate font-display text-xl font-semibold text-ink">
            {username}
          </p>
        </div>
        <p className="shrink-0 text-xs text-ink-faint sm:text-right">
          {memberSince}
        </p>
      </header>

      {/* Stamps -------------------------------------------------------- */}
      <div className="px-6 py-6">
        <h3 className="label-eyebrow text-ink-faint">Stamps</h3>

        <ul className="mt-4 grid grid-cols-4 gap-3">
          {stamps.map((stamp, index) => (
            <PassportStamp
              key={stamp.id}
              stamp={stamp}
              // Alternating tilt keeps a filled row from looking like a grid.
              tilt={index % 2 === 0 ? -3 : 2.5}
            />
          ))}

          {Array.from({ length: lockedSlots }, (_, index) => (
            <PassportStampLocked
              key={`locked-${index}`}
              index={stamps.length + index + 1}
            />
          ))}
        </ul>
      </div>

      {/* Journey history ------------------------------------------------ */}
      <div className="border-t border-line px-6 py-5">
        <h3 className="label-eyebrow text-ink-faint">Journey history</h3>
        <ul className="mt-3 space-y-2">
          {history.map((entry) => (
            <li
              key={entry}
              className="flex items-start gap-2.5 text-sm text-ink-muted"
            >
              <span
                className="mt-1.5 size-1 shrink-0 rounded-full bg-accent"
                aria-hidden="true"
              />
              {entry}
            </li>
          ))}
        </ul>
      </div>

      {/* Closing line --------------------------------------------------- */}
      <footer className="border-t border-line bg-surface px-6 py-5">
        <p className="font-display text-base text-ink italic">{message}</p>
      </footer>
    </article>
  );
}
