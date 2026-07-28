"use client";

import { useMediaQuery } from "./useMediaQuery";

/**
 * Tracks `prefers-reduced-motion`.
 *
 * globals.css already neutralises animation durations at the CSS level. This
 * hook exists so components can go further and never *start* the expensive
 * work — no scene timers, no <video> elements mounted at all.
 *
 * The server fallback is `true` so the first paint is the calm one. Starting
 * at `false` would kick off motion for a frame before correcting itself,
 * which is precisely what someone with this preference set does not want.
 */
export function useReducedMotion(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)", true);
}
