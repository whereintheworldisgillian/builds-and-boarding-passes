/* ==========================================================================
   HERO SCENES — the only place hero background media is configured.
   ==========================================================================

   >> THIS IS WHERE YOU REPLACE THE PLACEHOLDER MEDIA. <<

   Every scene needs a `poster`. The poster is what renders first, what shows
   while a video is still loading, and what shows permanently on mobile or
   when the visitor prefers reduced motion. It is never optional.

   `video` is optional. Leave it undefined and the scene stays a still image —
   which is exactly the state we are in right now, since the real footage does
   not exist yet.

   ---------------------------------------------------------------------------
   HOW TO ADD YOUR REAL FOOTAGE LATER
   ---------------------------------------------------------------------------
   1. Export each clip as MP4 (H.264), roughly 8–12 seconds, NO AUDIO TRACK.
      Target 1920x1080 and keep each file under ~4 MB if you can. These loop
      quietly behind text, so heavy bitrate buys you nothing.
   2. Export one still frame from each clip as a JPG or WebP — that becomes
      the poster, so the still and the video always match.
   3. Drop both into /public/media/scenes/.
   4. Update the scene below: point `poster` at your still, and add
      `video: "/media/scenes/your-clip.mp4"`.
   5. Delete the matching PLACEHOLDER-*.svg file from /public/media/scenes/.

   Keep this list at 3–5 scenes. Fewer feels thin; more means visitors never
   see the end of the loop anyway.

   Do not import media files into components directly — everything routes
   through this array so there is one place to look.
   ========================================================================== */

export type HeroScene = {
  /** Stable key for React. Not shown to anyone. */
  id: string;
  /**
   * Still image. Required — this is the load-first, reduced-motion and
   * mobile fallback. Path is relative to /public.
   */
  poster: string;
  /**
   * Optional looping clip layered over the poster once it can play.
   * Must be muted and audio-free. Leave undefined for a still-only scene.
   */
  video?: string;
  /**
   * Human-readable note for whoever maintains this file. Never rendered —
   * the backdrop is decorative and hidden from screen readers, so this is
   * not alt text.
   */
  note: string;
  /** Direction of the slow drift, alternated so the loop does not feel mechanical. */
  drift: "in" | "out";
};

export const HERO_SCENES: HeroScene[] = [
  {
    id: "dawn-horizon",
    poster: "/media/scenes/PLACEHOLDER-01-dawn-horizon.svg",
    // video: "/media/scenes/dawn-horizon.mp4",  <-- add your clip here
    note: "PLACEHOLDER. Swap for an early-morning departure / open water shot.",
    drift: "in",
  },
  {
    id: "ridge-line",
    poster: "/media/scenes/PLACEHOLDER-02-ridge-line.svg",
    // video: "/media/scenes/ridge-line.mp4",  <-- add your clip here
    note: "PLACEHOLDER. Swap for a landscape / travelling-toward-something shot.",
    drift: "out",
  },
  {
    id: "night-harbour",
    poster: "/media/scenes/PLACEHOLDER-03-night-harbour.svg",
    // video: "/media/scenes/night-harbour.mp4",  <-- add your clip here
    note: "PLACEHOLDER. Swap for an evening / arrival / working-late-building shot.",
    drift: "in",
  },
];

/**
 * How long each scene holds before crossfading, in milliseconds.
 * The brief calls for a slow 6–8s cadence; 7s sits in the middle.
 * The crossfade itself is --duration-scene in globals.css.
 */
export const SCENE_DURATION_MS = 7000;
