"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { useMediaQuery } from "@/lib/useMediaQuery";
import {
  HERO_SCENES,
  SCENE_DURATION_MS,
  type HeroScene,
} from "@/content/hero-scenes";

/* ==========================================================================
   HERO BACKDROP — the reusable cinematic slideshow.
   ==========================================================================

   Scenes come from content/hero-scenes.ts. This component never references a
   media file directly, so replacing the placeholder art with real footage is
   a content edit, not a code edit.

   Behaviour, in order of how much the visitor's device has to do:

     reduced motion  -> one still poster. No timer, no video, no drift.
     small screens   -> posters crossfade. Still no video: phones on mobile
                        data should not pay for background footage.
     everything else -> posters crossfade, and any scene that has a `video`
                        fades its clip in on top once it can actually play.

   In every case the poster renders first and stays underneath, so the hero
   is readable immediately and never shifts layout while media loads.
   ========================================================================== */

type HeroBackdropProps = {
  scenes?: HeroScene[];
  durationMs?: number;
};

export function HeroBackdrop({
  scenes = HERO_SCENES,
  durationMs = SCENE_DURATION_MS,
}: HeroBackdropProps) {
  const reducedMotion = useReducedMotion();

  // Active and outgoing live in one piece of state so advancing is a single
  // pure update. (Calling a second setState from inside another's updater
  // makes the updater impure, which StrictMode's double-invocation is
  // specifically designed to catch.)
  const [scene, setScene] = useState<{ active: number; previous: number | null }>(
    { active: 0, previous: null },
  );

  // Background footage is for larger screens only — phones on mobile data
  // should not pay for it. Defaults to false so we never load a clip and
  // then discover we should not have.
  const allowVideo = useMediaQuery("(min-width: 768px)", false);

  // Advance the slideshow. Pauses entirely while the tab is in the
  // background — this page is meant to sit open beside a livestream.
  useEffect(() => {
    if (reducedMotion || scenes.length < 2) return;

    let timer: number | undefined;

    const advance = () => {
      setScene(({ active }) => ({
        active: (active + 1) % scenes.length,
        previous: active,
      }));
    };

    const start = () => {
      window.clearInterval(timer);
      timer = window.setInterval(advance, durationMs);
    };

    const onVisibilityChange = () => {
      if (document.hidden) {
        window.clearInterval(timer);
      } else {
        start();
      }
    };

    if (!document.hidden) start();
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [reducedMotion, scenes.length, durationMs]);

  // Under reduced motion the hero is a single still image and nothing else.
  const visibleScenes = reducedMotion ? scenes.slice(0, 1) : scenes;

  return (
    /*
      aria-hidden: this is decoration. The hero's meaning lives in the real
      heading and copy layered on top, so screen readers should skip all of
      it rather than announce a stack of images.
    */
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
      {visibleScenes.map((sceneItem, index) => {
        // Pinned to the first scene under reduced motion. Without this, a
        // visitor who turns the preference on mid-visit would collapse the
        // list to one layer while `active` still pointed at scene 2 or 3 —
        // leaving no layer marked active, and a black hero.
        const isActive = reducedMotion ? index === 0 : index === scene.active;
        const isOutgoing = !reducedMotion && index === scene.previous;

        return (
          <div
            key={sceneItem.id}
            className="absolute inset-0 transition-opacity ease-cinematic"
            style={{
              opacity: isActive ? 1 : 0,
              // The crossfade. Long and slow; the outgoing scene is still
              // painted throughout so there is never a flash of canvas.
              transitionDuration: reducedMotion ? "0ms" : "2200ms",
              // Keep the active scene on top of the one it is replacing.
              zIndex: isActive ? 2 : isOutgoing ? 1 : 0,
            }}
          >
            <SceneLayer
              scene={sceneItem}
              isActive={isActive}
              // Only the current and outgoing scenes keep a <video> mounted,
              // so at most two clips are ever in memory.
              mountVideo={allowVideo && !reducedMotion && (isActive || isOutgoing)}
              playVideo={isActive}
              animate={!reducedMotion}
              durationMs={durationMs}
              eager={index === 0}
            />
          </div>
        );
      })}

      <ReadabilityOverlays />
    </div>
  );
}

/* -------------------------------------------------------------------------- */

type SceneLayerProps = {
  scene: HeroScene;
  isActive: boolean;
  mountVideo: boolean;
  playVideo: boolean;
  animate: boolean;
  durationMs: number;
  eager: boolean;
};

function SceneLayer({
  scene,
  isActive,
  mountVideo,
  playVideo,
  animate,
  durationMs,
  eager,
}: SceneLayerProps) {
  const [videoReady, setVideoReady] = useState(false);

  const hasVideo = Boolean(scene.video) && mountVideo;

  // The slow drift runs only on the scene currently on screen, so idle
  // layers cost nothing. Slightly longer than the scene so it never
  // visibly stops before the crossfade takes over.
  const drift =
    animate && isActive
      ? `scene-drift-${scene.drift} ${durationMs + 2600}ms var(--ease-cinematic) both`
      : undefined;

  return (
    <div className="absolute inset-0" style={{ animation: drift }}>
      {/*
        A plain <img> rather than next/image: this is a decorative,
        full-bleed SVG. The image optimiser has nothing to do with vector
        art, and `fill` would add a wrapper we do not need. When these are
        swapped for real JPG/WebP stills, revisit whether next/image earns
        its place here.
      */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={scene.poster}
        alt=""
        aria-hidden="true"
        draggable={false}
        loading={eager ? "eager" : "lazy"}
        fetchPriority={eager ? "high" : "low"}
        decoding="async"
        className="h-full w-full object-cover"
      />

      {hasVideo && (
        <video
          // Muted + playsInline + autoPlay is the combination browsers allow
          // to start without a gesture. Clips must have no audio track.
          src={scene.video}
          poster={scene.poster}
          autoPlay={playVideo}
          muted
          loop
          playsInline
          preload="none"
          disablePictureInPicture
          tabIndex={-1}
          aria-hidden="true"
          onCanPlay={() => setVideoReady(true)}
          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-cinematic"
          // Stays invisible until it can genuinely play, so a stalled or
          // failed clip simply leaves the poster showing.
          style={{ opacity: videoReady ? 1 : 0 }}
        />
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */

/**
 * The readability system: a left-to-right gradient behind the text column,
 * a bottom gradient that hands off to the page, and a light overall dim.
 * No opaque panel — the media stays visible through all of it.
 */
function ReadabilityOverlays() {
  return (
    <>
      {/* Slightly reduced media brightness, evenly. Light touch — the
          gradients below do the real work where the text actually sits. */}
      <div className="absolute inset-0 z-3 bg-canvas/15" />

      {/* Dark on the left behind the headline, clearing well before the
          right edge so the media keeps its brightest area visible. */}
      <div className="absolute inset-0 z-3 bg-linear-to-r from-canvas/88 from-5% via-canvas/45 via-45% to-transparent to-75%" />

      {/* Bottom fade: seats the hero into the section beneath it. */}
      <div className="absolute inset-x-0 bottom-0 z-3 h-1/3 bg-linear-to-t from-canvas via-canvas/40 to-transparent" />

      {/* A touch of top shade so the transparent header stays legible. */}
      <div className="absolute inset-x-0 top-0 z-3 h-28 bg-linear-to-b from-canvas/60 to-transparent" />
    </>
  );
}
