import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SITE } from "@/content/site";
import "./globals.css";

/* --------------------------------------------------------------------------
   TYPEFACES — user-pinned 2026-07-29 (see DESIGN.md)

   Geist       — the whole interface. Variable, so the headline can sit at
                 800 and a label at 500 without loading two files.
   Geist Mono  — board data, field labels, codes, timestamps. The "printed
                 by a machine at the gate" voice.
   Georgia     — italic only, for the second headline line. A SYSTEM serif:
                 no webfont request, no variable to wire up. Referenced
                 directly from --font-serif in globals.css.

   Both webfonts are self-hosted at build time by next/font — no runtime
   request to Google, no swap-in layout shift. To change a typeface, change
   it here; the rest of the project only refers to --font-display /
   --font-sans / --font-mono / --font-serif.
   -------------------------------------------------------------------------- */

const geist = Geist({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist-mono",
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
  themeColor: "#0a0d13",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable} ${geistMono.variable}`}>
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
