import type { Metadata } from "next";
import { headers } from "next/headers";
import type { ReactNode } from "react";
import { ScrollReveal } from "@/components/shell/scroll-reveal";
import { SiteFooter } from "@/components/shell/site-footer";
import { SiteHeader } from "@/components/shell/site-header";
import { ThemeProvider } from "@/components/shell/theme-provider";
import "./globals.css";

export const metadata: Metadata = { metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"), title: { default: "ikAnimeList - Find your next obsession", template: "%s | ikAnimeList" }, description: "Discover anime and manga, track every chapter and episode, and share what you love." };
export default async function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  const nonce = (await headers()).get("x-nonce") ?? undefined;
  return <html data-scroll-behavior="smooth" lang="en" suppressHydrationWarning><body><ThemeProvider nonce={nonce}><div className="relative flex min-h-dvh flex-col overflow-x-clip"><div aria-hidden="true" className="ambient ambient-one" /><div aria-hidden="true" className="ambient ambient-two" /><SiteHeader /><main className="relative flex-1">{children}</main><SiteFooter /><ScrollReveal /></div></ThemeProvider></body></html>;
}
