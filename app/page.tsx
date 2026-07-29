import { TourHero } from "@/components/hero/TourHero";

/**
 * Homepage — hero redesign phase (2026-07-29).
 *
 * Only the new TourHero is mounted while the rest of the page is redesigned
 * to match. The legacy phase-one sections are preserved untouched in the
 * repo and can be remounted from here when their turn comes:
 *
 *   SiteHeader        components/layout/SiteHeader.tsx
 *   Hero (legacy)     components/hero/Hero.tsx
 *   CurrentJourney    components/sections/CurrentJourney.tsx
 *   PassportPreview   components/sections/PassportPreview.tsx
 *   CommunityPromise  components/sections/CommunityPromise.tsx
 *   SiteFooter        components/layout/SiteFooter.tsx
 */
export default function HomePage() {
  return (
    <main id="main">
      <TourHero />
    </main>
  );
}
