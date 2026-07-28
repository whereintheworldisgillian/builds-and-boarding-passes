import { FOOTER_LINKS, SITE } from "@/content/site";

/**
 * Minimal close. Wordmark, two placeholder destinations, and the line the
 * whole project is built around. Nothing else belongs down here.
 */
export function SiteFooter() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-content flex-col gap-8 px-6 py-12 sm:px-8 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-display text-base font-semibold text-ink">
            {SITE.name}
          </p>
          <p className="mt-2 text-sm text-ink-faint italic">{SITE.creed}</p>
        </div>

        <nav aria-label="Community" className="flex items-center gap-6">
          {FOOTER_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm text-ink-muted transition-colors duration-300 hover:text-ink"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
