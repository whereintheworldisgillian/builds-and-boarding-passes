import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { PassportCard } from "@/components/passport/PassportCard";
import { PASSPORT_PREVIEW } from "@/content/passport";

/**
 * Explains the passport idea by showing one, rather than describing it.
 *
 * The card on the right is a sample, not the visitor's own — the copy on the
 * left says so plainly, so nothing here implies an account exists yet.
 */
export function PassportPreview() {
  return (
    <Section id="passport" ariaLabelledBy="passport-heading">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <p className="label-eyebrow text-accent">Community Passport</p>
          <h2
            id="passport-heading"
            className="mt-4 text-3xl leading-tight sm:text-4xl md:text-[2.75rem]"
          >
            Collect the places you showed up for.
          </h2>
          <p className="mt-6 max-w-md text-base leading-relaxed text-ink-muted">
            Every stop on the World Tour leaves a mark. Check in during the
            livestream, take on a challenge, and your passport fills in behind
            you — a record of where you went and what you tried.
          </p>
          <p className="mt-6 text-sm text-ink-faint">
            A preview of how passports will look. Yours arrives in a later
            stop.
          </p>
        </Reveal>

        <Reveal delay={140}>
          <PassportCard
            passport={PASSPORT_PREVIEW}
            className="mx-auto w-full max-w-md"
          />
        </Reveal>
      </div>
    </Section>
  );
}
