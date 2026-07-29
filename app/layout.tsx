import type { Metadata, Viewport } from "next";
import "./globals.css";

/* --------------------------------------------------------------------------
   The design this app renders was built by a viewer of the stream and shared
   as source (Vite + React). It was ported here 2026-07-29 with the markup and
   stylesheet intact — see DESIGN.md for what is his and what is ours.

   There is no next/font here on purpose. Geist Sans and Geist Mono are
   self-hosted woff2 files declared with @font-face at the top of globals.css,
   exactly as he shipped them. Adding next/font on top would load the same
   typefaces twice.
   -------------------------------------------------------------------------- */

export const metadata: Metadata = {
  title: "Builds & Boarding Passes",
  description: "A moving studio, an open notebook, and a world tour.",
  openGraph: {
    title: "Builds & Boarding Passes",
    description: "A moving studio, an open notebook, and a world tour.",
    type: "website",
  },
};

export const viewport: Viewport = {
  // Matches --ink, the colour behind the page at both ends of the scroll.
  themeColor: "#10181a",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        {/* Reloading normally drops you back where you were scrolled to, which
            is wrong for a one-page site that opens on a full-screen hero — and
            it means the scroll-driven reveals start already spent. This has to
            run before first paint, so it is an inline script rather than an
            effect: by the time a hook fires the browser has already restored.
            A URL with a hash still wins, so #manifest links keep working. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "if('scrollRestoration' in history)history.scrollRestoration='manual'",
          }}
        />
      </head>
      <body>
        {/* The nav is fixed and the hero is a full screen, so keyboard users
            would otherwise tab through the whole header on every load. */}
        <a href="#top" className="skip-link">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
