import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import { SITE } from "@/content/site";
import "./globals.css";

/* --------------------------------------------------------------------------
   TYPEFACES
   Both are open source and self-hosted at build time by next/font — no
   requests to Google at runtime, and no layout shift from font swapping.

   Fraunces  — editorial display serif. Warm, high contrast, a bit of
               character. Carries the headlines.
   Inter     — neutral interface sans. Carries everything else.

   To swap either typeface, change it here. The rest of the project only
   ever refers to --font-display / --font-sans.
   -------------------------------------------------------------------------- */

const fraunces = Fraunces({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-fraunces",
  // Weight range only — no SOFT/WONK/opsz axes. Nothing in the design uses
  // them, and every extra axis makes the variable font meaningfully heavier.
  weight: ["400", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
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
  themeColor: "#0c0b0a",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable}`}>
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
