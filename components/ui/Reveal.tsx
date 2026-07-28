"use client";

import type { ReactNode } from "react";
import { useInView } from "@/lib/useInView";

type RevealProps = {
  children: ReactNode;
  /** Stagger within a group, in milliseconds. Keep these small. */
  delay?: number;
  className?: string;
};

/**
 * Fades and lifts its children in the first time they scroll into view.
 *
 * Content is always in the DOM and always readable — this only touches
 * opacity and transform, so nothing is hidden from screen readers or search
 * engines if the animation never runs. Under reduced motion it renders its
 * children plainly.
 */
export function Reveal({ children, delay = 0, className = "" }: RevealProps) {
  const { ref, inView, reducedMotion } = useInView();

  if (reducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? undefined : 0,
        animation: inView
          ? `reveal-rise 900ms var(--ease-cinematic) ${delay}ms both`
          : undefined,
      }}
    >
      {children}
    </div>
  );
}
