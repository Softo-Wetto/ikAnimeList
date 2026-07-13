import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-11 w-full rounded-2xl border border-white/10 bg-zinc-950/70 px-4 text-sm text-white outline-none transition placeholder:text-zinc-500 focus:border-violet-400/60 focus:ring-2 focus:ring-violet-400/20 disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
}
