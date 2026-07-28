import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";
type Size = "md" | "sm";

const BASE =
  "inline-flex items-center justify-center gap-2 rounded-md font-medium " +
  "whitespace-nowrap transition-colors duration-300 ease-cinematic " +
  "focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent";

const VARIANTS: Record<Variant, string> = {
  // The one loud element on the page. Used sparingly.
  primary: "bg-accent text-accent-contrast hover:bg-accent-hover",
  // Sits on top of hero media, so it needs its own quiet surface.
  secondary:
    "border border-line-strong bg-surface text-ink backdrop-blur-md hover:border-accent-line hover:bg-surface-strong",
  ghost: "text-ink-muted hover:text-ink",
};

const SIZES: Record<Size, string> = {
  md: "h-12 px-6 text-[0.9375rem]",
  sm: "h-9 px-4 text-sm",
};

type BaseProps = {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
};

type ButtonAsLink = BaseProps & {
  href: string;
} & Omit<ComponentPropsWithoutRef<"a">, keyof BaseProps | "href">;

type ButtonAsButton = BaseProps & {
  href?: undefined;
} & Omit<ComponentPropsWithoutRef<"button">, keyof BaseProps>;

type ButtonProps = ButtonAsLink | ButtonAsButton;

/**
 * The project's only button. Renders an anchor when given `href` and a real
 * <button> otherwise, so the element always matches what it actually does.
 *
 * Phase one: every call site passes an in-page anchor. Nothing here submits,
 * authenticates or calls out to a third party.
 */
export function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: ButtonProps) {
  const classes = `${BASE} ${VARIANTS[variant]} ${SIZES[size]} ${className}`.trim();

  if (typeof props.href === "string") {
    const { href, ...rest } = props as ButtonAsLink;
    return (
      <Link href={href} className={classes} {...rest}>
        {children}
      </Link>
    );
  }

  const { ...rest } = props as ButtonAsButton;
  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}
