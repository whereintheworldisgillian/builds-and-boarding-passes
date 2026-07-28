type CurrentStopProps = {
  place: string;
  className?: string;
};

/**
 * Small "you are here" marker near the base of the hero.
 * Quiet by design — it is a detail the eye finds second, not a badge.
 */
export function CurrentStop({ place, className = "" }: CurrentStopProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`.trim()}>
      {/* Marker dot with a soft halo. Decorative, so it carries no label. */}
      <span className="relative flex size-2 shrink-0" aria-hidden="true">
        <span
          className="absolute inset-0 rounded-full bg-accent"
          style={{ animation: "marker-pulse 3.6s var(--ease-cinematic) infinite" }}
        />
        <span className="relative size-2 rounded-full bg-accent" />
      </span>

      <div className="text-on-media">
        <p className="label-eyebrow text-ink-muted">Current stop</p>
        <p className="mt-0.5 text-sm font-medium text-ink sm:text-base">
          {place}
        </p>
      </div>
    </div>
  );
}
