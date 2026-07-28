import type { ReactNode } from "react";

type SectionProps = {
  children: ReactNode;
  /** Anchor target. Also what the nav links point at. */
  id?: string;
  /** Accessible name for the section landmark. */
  ariaLabelledBy?: string;
  className?: string;
};

/**
 * Consistent page section: one max content width, one vertical rhythm,
 * one gutter. Everything below the hero goes through this so the spacing
 * stays even as sections get added in later phases.
 */
export function Section({
  children,
  id,
  ariaLabelledBy,
  className = "",
}: SectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={ariaLabelledBy}
      className={`px-6 py-20 sm:px-8 md:py-section ${className}`.trim()}
    >
      <div className="mx-auto w-full max-w-content">{children}</div>
    </section>
  );
}
