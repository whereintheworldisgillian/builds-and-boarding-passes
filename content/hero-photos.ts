/* ==========================================================================
   HERO PHOTOS — the full-screen background slideshow.

   To swap in your own photography (or, later, video clips):
   1. Drop the file into /public/hero/
   2. Point `src` at it below. Keep 3–5 entries.
   Landscape, ~2000px wide, JPG/WebP under ~800KB each is the sweet spot.

   `alt` stays "" on purpose: the photos are a decorative backdrop behind the
   real content, so screen readers should skip them entirely.
   ========================================================================== */

export type HeroPhoto = {
  src: string;
  alt: string;
};

export const HERO_PHOTOS: HeroPhoto[] = [
  { src: "/hero/01-airplane-window.jpg", alt: "" },
  { src: "/hero/02-mountain-road.jpg", alt: "" },
  { src: "/hero/03-tropical-coast.jpg", alt: "" },
  { src: "/hero/04-longtail-boats.jpg", alt: "" },
];

/** Seconds each photo holds before crossfading to the next. */
export const HERO_PHOTO_INTERVAL_MS = 7000;
