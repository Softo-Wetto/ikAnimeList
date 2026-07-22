import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg" | "icon";
type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode; className?: string; href?: string; size?: ButtonSize; variant?: ButtonVariant; };

const variants: Record<ButtonVariant, string> = { primary: "border border-violet-300/25 bg-violet-500 text-oncover shadow-[0_12px_28px_-15px_rgba(139,92,246,.95)] hover:bg-violet-400 hover:shadow-[0_16px_34px_-15px_rgba(139,92,246,.95)]", secondary: "border border-white/12 bg-white/[.06] text-zinc-100 shadow-sm shadow-black/10 hover:border-violet-400/45 hover:bg-white/[.11]", ghost: "text-zinc-300 hover:bg-white/[.07] hover:text-white", danger: "border border-rose-400/15 bg-rose-500/12 text-rose-200 hover:bg-rose-500/22" };
const sizes: Record<ButtonSize, string> = { sm: "h-9 px-3 text-sm", md: "h-11 px-5 text-sm", lg: "h-12 px-6 text-base", icon: "size-10" };

export function Button({ children, className, href, size = "md", type = "button", variant = "primary", ...props }: ButtonProps) {
  const styles = cn("inline-flex shrink-0 items-center justify-center gap-2 rounded-full font-semibold transition-[transform,box-shadow,background-color,border-color,color] duration-300 ease-out hover:-translate-y-px active:translate-y-0 active:scale-[.98] motion-reduce:transform-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 disabled:pointer-events-none disabled:opacity-50", variants[variant], sizes[size], className);
  return href ? <Link className={styles} href={href}>{children}</Link> : <button className={styles} type={type} {...props}>{children}</button>;
}
