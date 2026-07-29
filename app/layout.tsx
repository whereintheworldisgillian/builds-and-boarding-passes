import type { Metadata, Viewport } from "next";
import { IBM_Plex_Sans_Condensed, Syne } from "next/font/google";
import { SITE } from "@/content/site";
import "./globals.css";

/* --------------------------------------------------------------------------
   TYPEFACES — Modern Passport Ink (see DESIGN.md)
   Both are open source and self-hosted at build time by next/font — no
   requests to Google at runtime, and no layout shift from font swapping.

   Syne                    — the headline voice. Bold, modern travel
                             broadcast; strong enough to be show branding.
   IBM Plex Sans Condensed — brand lockup, departure-board labels and
                             values, stamp lettering, buttons.

   To swap either typeface, change it here. The rest of the project only
   ever refers to --font-display / --font-sans.
   -------------------------------------------------------------------------- */

const syne = Syne({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-syne",
});

const plexCondensed = IBM_Plex_Sans_Condensed({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-plex-condensed",
  // Plex Condensed ships static weights only; load just the ones in use.
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: `${SITE.name} — ${SITE.tagline}`,
    template: `%s — ${SITE.name}`,
  },
  description: SITE.description,
  openGraph: {
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#111826",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${syne.variable} ${plexCondensed.variable}`}>
      <body className="min-h-dvh antialiased">
        {/* Keyboard users land here first and can jump the header + hero. */}
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
