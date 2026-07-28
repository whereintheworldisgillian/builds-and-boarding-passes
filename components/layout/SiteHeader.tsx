"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { useScrolled } from "@/lib/useScrolled";
import { NAV_ITEMS } from "@/content/site";

/**
 * Transparent bar over the hero that firms up once the reader scrolls.
 *
 * Kept intentionally small: a wordmark, two destinations and one action.
 * There is no mobile menu because there is nothing to collapse — the two
 * nav items fit, and adding a hamburger for two links would be theatre.
 */
export function SiteHeader() {
  const scrolled = useScrolled();

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-cinematic ${
        scrolled
          ? "border-b border-line bg-canvas/80 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-18 max-w-content items-center justify-between gap-4 px-6 sm:px-8">
        {/* Wordmark — temporary text logo. */}
        {/* Sized down on small screens so it stays on one line beside the
            action rather than wrapping and pushing the bar out of shape. */}
        <Link
          href="/"
          className="text-on-media min-w-0 truncate font-display text-sm font-semibold tracking-tight whitespace-nowrap text-ink transition-opacity duration-300 hover:opacity-80 sm:text-base md:text-lg"
        >
          Builds &amp; Boarding Passes
        </Link>

        <div className="flex items-center gap-1 sm:gap-2">
          <nav aria-label="Primary" className="hidden items-center sm:flex">
            {NAV_ITEMS.map((item) =>
              item.upcoming ? (
                /*
                  Not a link. The Passport page does not exist yet, so this
                  announces itself as upcoming rather than being a control
                  that goes nowhere.
                */
                <span
                  key={item.label}
                  className="text-on-media flex cursor-default items-center gap-2 px-3 py-2 text-sm text-ink-faint"
                >
                  {item.label}
                  <span className="rounded-sm border border-line px-1.5 py-0.5 text-[0.625rem] tracking-wider uppercase">
                    Soon
                  </span>
                </span>
              ) : (
                <Link
                  key={item.label}
                  href={item.href}
                  className="text-on-media px-3 py-2 text-sm text-ink-muted transition-colors duration-300 hover:text-ink"
                >
                  {item.label}
                </Link>
              ),
            )}
          </nav>

          <Button href="#join" size="sm" className="ml-1">
            Join the journey
          </Button>
        </div>
      </div>
    </header>
  );
}
