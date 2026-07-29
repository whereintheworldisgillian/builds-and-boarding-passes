import type { Metadata, Viewport } from "next";
import { DM_Serif_Display, Montserrat } from "next/font/google";
import { SITE } from "@/content/site";
import "./globals.css";

/* --------------------------------------------------------------------------
   TYPEFACES — Modern Passport Ink (see DESIGN.md)
   Both are open source and self-hosted at build time by next/font — no
   requests to Google at runtime, and no layout shift from font swapping.

   DM Serif Display — the headline voice. Emotional, editorial. Only ships
                      a 400 weight; italic is the accent.
   Montserrat       — interface labels and departure-board data.

   To swap either typeface, change it here. The rest of the project only
   ever refers to --font-display / --font-sans.
   -------------------------------------------------------------------------- */

const dmSerifDisplay = DM_Serif_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm-serif",
  weight: "400",
  style: ["normal", "italic"],
});

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-montserrat",
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
    <html lang="en" className={`${dmSerifDisplay.variable} ${montserrat.variable}`}>
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
