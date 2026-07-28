"use client";

import { useEffect, useState } from "react";

/**
 * True once the page has scrolled past `threshold` pixels.
 * Used by the header to firm up from fully transparent to a readable,
 * slightly solid bar.
 *
 * Uses a passive listener and only sets state when the boolean actually
 * flips, so scrolling does not cause a re-render on every frame.
 */
export function useScrolled(threshold = 40): boolean {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled((current) => {
        const next = window.scrollY > threshold;
        return next === current ? current : next;
      });
    };

    onScroll(); // account for a restored scroll position on reload
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  return scrolled;
}
