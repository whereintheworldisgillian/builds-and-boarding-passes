import { HeroBackdrop } from "./HeroBackdrop";
import { CurrentStop } from "./CurrentStop";
import { Button } from "@/components/ui/Button";
import { SITE } from "@/content/site";
import { JOURNEY } from "@/content/journey";

/**
 * Full-viewport opening sequence.
 *
 * Layout intent: content sits low and left, the way a title card sits in a
 * travel documentary — the frame stays open on the right so the media is
 * still doing the talking.
 *
 * The heading and copy are ordinary server-rendered HTML sitting above the
 * decorative backdrop, so the page reads correctly before any media loads
 * and reads correctly if none of it ever does.
 */
export function Hero() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="relative flex min-h-dvh flex-col justify-end overflow-hidden"
    >
      <HeroBackdrop />

      {/* z-10 keeps all content above the backdrop's overlay stack. */}
      <div className="relative z-10 mx-auto w-full max-w-content px-6 pt-32 pb-12 sm:px-8 sm:pb-16">
        <div className="max-w-2xl">
          <p className="label-eyebrow text-on-media text-ink-muted">
            {SITE.name}
          </p>

          <h1
            id="hero-heading"
            className="text-on-media mt-5 text-[clamp(2.5rem,7.5vw,4.75rem)] leading-[1.04] font-semibold text-balance text-ink"
          >
            Check in. Step out.
            <span className="block text-accent">
              Build before you&rsquo;re ready.
            </span>
          </h1>

          <p className="text-on-media mt-6 max-w-xl text-base leading-relaxed text-ink-muted sm:text-lg">
            Join an interactive World Tour built around the livestream, the
            community, and the courage to try something new.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
            {/*
              Phase one: both actions are in-page anchors. No auth, no
              external integrations, nothing that pretends to work yet.
            */}
            <Button href="#join">Join the journey</Button>
            <Button href="#current-journey" variant="secondary">
              Watch the livestream
            </Button>
          </div>
        </div>

        <CurrentStop
          place={JOURNEY.currentStop}
          className="mt-14 sm:mt-20"
        />
      </div>
    </section>
  );
}
