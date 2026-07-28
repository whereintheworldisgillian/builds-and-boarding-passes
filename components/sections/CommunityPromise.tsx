import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";

/**
 * The emotional centre of the page, and the quietest part of it.
 *
 * One heading, one paragraph, one action, a lot of room around them. No
 * feature cards, no icons, no counters — the restraint is the point.
 *
 * Carries the #join anchor, since this is what the hero's primary action is
 * actually inviting people toward.
 */
export function CommunityPromise() {
  return (
    <Section id="join" ariaLabelledBy="promise-heading">
      <Reveal className="mx-auto max-w-2xl text-center">
        <h2
          id="promise-heading"
          className="text-[clamp(2rem,5.5vw,3.25rem)] leading-[1.1] font-semibold"
        >
          Safe enough to be brave.
        </h2>

        <p className="mx-auto mt-7 max-w-xl text-base leading-relaxed text-ink-muted sm:text-lg">
          A welcoming community for people who are building, learning,
          experimenting, and taking the next step before they feel completely
          ready.
        </p>

        <div className="mt-10 flex justify-center">
          <Button href="#current-journey" variant="secondary">
            See where we are now
          </Button>
        </div>
      </Reveal>
    </Section>
  );
}
