import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import type { ReactNode } from "react";
import { ScrollReveal } from "@/components/shell/scroll-reveal";
import { SiteFooter } from "@/components/shell/site-footer";
import { SiteHeader } from "@/components/shell/site-header";
import { ThemeProvider } from "@/components/shell/theme-provider";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
  applicationName: "ikAnimeList",
  title: { default: "ikAnimeList - Find your next obsession", template: "%s | ikAnimeList" },
  description: "Discover anime and manga, track every chapter and episode, and share what you love.",
  keywords: ["anime", "manga", "anime tracker", "manga tracker", "anime discovery", "watchlist"],
  category: "entertainment",
  manifest: "/site.webmanifest",
  alternates: { canonical: "/" },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    shortcut: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/icon.svg", type: "image/svg+xml" }]
  },
  openGraph: { type: "website", locale: "en_AU", url: "/", siteName: "ikAnimeList", title: "ikAnimeList - Find your next obsession", description: "Discover anime and manga, track every chapter and episode, and share what you love." },
  twitter: { card: "summary", title: "ikAnimeList - Find your next obsession", description: "Discover anime and manga, track every chapter and episode, and share what you love." },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } }
};

export const viewport: Viewport = { themeColor: "#08080b", colorScheme: "dark light" };

export default async function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  const nonce = (await headers()).get("x-nonce") ?? undefined;
  return <html data-scroll-behavior="smooth" lang="en" suppressHydrationWarning><body><ThemeProvider nonce={nonce}><div className="relative isolate min-h-dvh overflow-x-clip"><div aria-hidden="true" className="ambient-scene fixed inset-0 z-0 pointer-events-none" data-testid="ambient-scene"><div className="ambient ambient-one" /><div className="ambient ambient-two" /><div className="ambient ambient-three" /></div><div className="relative z-10 flex min-h-dvh flex-col"><SiteHeader /><main className="relative z-10 flex-1">{children}</main><SiteFooter /></div><ScrollReveal /></div></ThemeProvider></body></html>;
}
