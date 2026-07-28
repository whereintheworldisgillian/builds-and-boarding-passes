import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { Hero } from "@/components/hero/Hero";
import { CurrentJourney } from "@/components/sections/CurrentJourney";
import { PassportPreview } from "@/components/sections/PassportPreview";
import { CommunityPromise } from "@/components/sections/CommunityPromise";

/**
 * Homepage — phase one.
 *
 * Composition only: every section owns its own markup and content, so adding
 * or reordering sections later is a change to this list and nothing else.
 */
export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main id="main">
        <Hero />
        <CurrentJourney />
        <PassportPreview />
        <CommunityPromise />
      </main>
      <SiteFooter />
    </>
  );
}
