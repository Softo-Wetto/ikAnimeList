import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg" | "icon";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  className?: string;
  href?: string;
  size?: ButtonSize;
  variant?: ButtonVariant;
};

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-violet-500 text-white shadow-[0_10px_30px_-12px_rgba(139,92,246,.9)] hover:bg-violet-400",
  secondary:
    "border border-white/12 bg-white/7 text-zinc-100 hover:border-violet-400/45 hover:bg-white/11",
  ghost: "text-zinc-300 hover:bg-white/7 hover:text-white",
  danger: "bg-rose-500/15 text-rose-200 hover:bg-rose-500/25"
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-base",
  icon: "size-10"
};

export function Button({
  children,
  className,
  href,
  size = "md",
  type = "button",
  variant = "primary",
  ...props
}: ButtonProps) {
  const styles = cn(
    "inline-flex shrink-0 items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 disabled:pointer-events-none disabled:opacity-50",
    variants[variant],
    sizes[size],
    className
  );

  if (href) {
    return (
      <Link className={styles} href={href}>
        {children}
      </Link>
    );
  }

  return (
    <button className={styles} type={type} {...props}>
      {children}
    </button>
  );
}
