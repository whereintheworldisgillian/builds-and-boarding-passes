import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { RouteLine } from "./RouteLine";
import { JOURNEY } from "@/content/journey";

/**
 * One journey card, not a dashboard.
 *
 * Everything a visitor needs to understand the World Tour is here: where we
 * are, what is being built, whether we are moving, and that there is a next
 * stop. The route line does the explaining so the copy does not have to.
 *
 * Values come from content/journey.ts and are hand-edited for phase one.
 */
export function CurrentJourney() {
  return (
    <Section id="current-journey" ariaLabelledBy="current-journey-heading">
      <Reveal>
        <p className="label-eyebrow text-accent">The World Tour</p>
        <h2
          id="current-journey-heading"
          className="mt-4 max-w-2xl text-3xl leading-tight sm:text-4xl md:text-[2.75rem]"
        >
          One stop at a time, built in the open.
        </h2>
      </Reveal>

      <Reveal delay={120}>
        <article className="mt-12 overflow-hidden rounded-xl border border-line bg-surface shadow-soft backdrop-blur-sm">
          {/* Header strip: what is being built, and whether we are moving. */}
          <div className="flex flex-col gap-6 border-b border-line p-7 sm:flex-row sm:items-start sm:justify-between sm:p-9">
            <div>
              <p className="label-eyebrow text-ink-faint">Current build</p>
              <p className="mt-2 font-display text-2xl font-semibold text-ink sm:text-3xl">
                {JOURNEY.currentBuild}
              </p>
            </div>

            <p className="inline-flex shrink-0 items-center gap-2 self-start rounded-full border border-accent-line bg-accent-soft px-3.5 py-1.5 text-xs font-medium text-ink">
              <span
                className="size-1.5 rounded-full bg-accent"
                aria-hidden="true"
              />
              {JOURNEY.boardingStatus}
            </p>
          </div>

          {/* The route itself. */}
          <div className="p-7 pt-9 sm:p-9 sm:pt-11">
            <RouteLine stops={JOURNEY.route} />
          </div>

          {/* Supporting detail. Three facts, not a grid of metrics. */}
          <dl className="grid grid-cols-1 border-t border-line sm:grid-cols-3">
            <Detail label="Current stop" value={JOURNEY.currentStop} />
            <Detail label="Next stop" value={JOURNEY.nextStop} muted />
            <Detail label="Build Miles" value={JOURNEY.buildMiles} accent last />
          </dl>
        </article>
      </Reveal>
    </Section>
  );
}

type DetailProps = {
  label: string;
  value: string;
  muted?: boolean;
  accent?: boolean;
  last?: boolean;
};

function Detail({ label, value, muted, accent, last }: DetailProps) {
  return (
    <div
      className={`border-b border-line p-7 last:border-b-0 sm:p-9 sm:border-b-0 ${
        last ? "" : "sm:border-r"
      }`}
    >
      <dt className="label-eyebrow text-ink-faint">{label}</dt>
      <dd
        className={`mt-2.5 text-lg font-medium ${
          accent ? "text-accent" : muted ? "text-ink-muted" : "text-ink"
        }`}
      >
        {value}
      </dd>
    </div>
  );
}
