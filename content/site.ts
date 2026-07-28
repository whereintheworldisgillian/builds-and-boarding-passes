/* ==========================================================================
   SITE CONTENT — navigation, footer, and the copy that appears in more
   than one place. Static for phase one.
   ========================================================================== */

export const SITE = {
  name: "Builds & Boarding Passes",
  /** Used for the <title> and social previews. */
  tagline: "Check in. Step out. Build before you're ready.",
  description:
    "An interactive World Tour built around the livestream, the community, and the courage to try something new.",
  /** The philosophy line. Appears in the footer. */
  creed: "Dreams die in the comfort zone.",
} as const;

export type NavItem = {
  label: string;
  href: string;
  /**
   * True when the destination does not exist yet. Rendered as plain text
   * with a "soon" marker rather than a link, so nothing on the page lies
   * about being clickable.
   */
  upcoming?: boolean;
};

export const NAV_ITEMS: NavItem[] = [
  { label: "World Tour", href: "#current-journey" },
  { label: "Passport", href: "#passport", upcoming: true },
];

export type FooterLink = {
  label: string;
  /** Placeholder until the real destinations are wired up. */
  href: string;
};

export const FOOTER_LINKS: FooterLink[] = [
  // Replace "#" with the real URLs when you are ready to point people there.
  { label: "YouTube", href: "#" },
  { label: "Discord", href: "#" },
];
