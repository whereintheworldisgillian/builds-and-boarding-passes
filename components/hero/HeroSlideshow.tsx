"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { HERO_PHOTOS, HERO_PHOTO_INTERVAL_MS } from "@/content/hero-photos";
import { useReducedMotion } from "@/lib/useReducedMotion";

/**
 * Full-bleed background slideshow: slow crossfades every ~7s with a very
 * subtle zoom on the active photo. No arrows, no dots, no library.
 *
 * Reduced motion: no timer ever starts and the first photo renders alone,
 * perfectly still. (useReducedMotion defaults to `true` on the server, so
 * the calm frame is also the first frame — motion only begins once the
 * client confirms the preference allows it.)
 */
export function HeroSlideshow() {
  const reducedMotion = useReducedMotion();
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (reducedMotion) return;
    const id = setInterval(
      () => setActive((i) => (i + 1) % HERO_PHOTOS.length),
      HERO_PHOTO_INTERVAL_MS,
    );
    return () => clearInterval(id);
  }, [reducedMotion]);

  const photos = reducedMotion ? HERO_PHOTOS.slice(0, 1) : HERO_PHOTOS;

  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      {photos.map((photo, i) => (
        <div
          key={photo.src}
          className="absolute inset-0 transition-opacity duration-[2000ms] ease-linear"
          style={{ opacity: i === active ? 1 : 0 }}
        >
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            sizes="100vw"
            priority={i === 0}
            className="object-cover"
            style={{
              // Dimmed and slightly desaturated so the foreground reads,
              // while the photograph stays rich and recognizable.
              filter: "brightness(0.72) saturate(0.82)",
              animation:
                i === active && !reducedMotion
                  ? "hero-photo-zoom 16s ease-out forwards"
                  : "none",
            }}
          />
        </div>
      ))}
    </div>
  );
}
