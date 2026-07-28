"use client";

import { useCallback, useState } from "react";
import { useReducedMotion } from "./useReducedMotion";

/**
 * Reports when an element first scrolls into view, then stops watching.
 *
 * Uses a callback ref rather than useRef + useEffect so the element can be
 * measured the moment it attaches, before the browser paints.
 *
 * The important case this handles: an element that is ALREADY on screen or
 * already scrolled past when it mounts — a restored scroll position, an
 * "#anchor" deep link, or someone scrolling faster than the page hydrates.
 * An IntersectionObserver alone would never fire for those, leaving the
 * section stranded at opacity 0 forever. So anything at or above the fold
 * is revealed immediately and only genuinely-below-the-fold content is
 * observed.
 *
 * Under reduced motion nothing is observed at all and `inView` is true from
 * the start, so callers skip their entrance animation rather than play it at
 * zero duration.
 */
export function useInView<T extends HTMLElement = HTMLDivElement>() {
  const reducedMotion = useReducedMotion();
  const [observed, setObserved] = useState(false);

  const ref = useCallback(
    (node: T | null) => {
      if (!node || reducedMotion) return;

      if (node.getBoundingClientRect().top < window.innerHeight) {
        setObserved(true);
        return;
      }

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) return;
          setObserved(true);
          observer.disconnect();
        },
        // Fire slightly before the element is fully on screen so the motion
        // finishes about when the reader's eye arrives.
        { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
      );

      observer.observe(node);
      return () => observer.disconnect();
    },
    [reducedMotion],
  );

  return { ref, inView: reducedMotion || observed, reducedMotion };
}
