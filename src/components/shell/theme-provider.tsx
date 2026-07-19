"use client";

import type { ReactNode } from "react";
import { ThemeProvider as NextThemeProvider } from "next-themes";

export function ThemeProvider({ children, nonce }: { children: ReactNode; nonce?: string }) {
  return <NextThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange nonce={nonce}>{children}</NextThemeProvider>;
}
