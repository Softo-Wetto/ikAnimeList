import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/headers", () => ({ headers: vi.fn().mockResolvedValue(new Headers()) }));
vi.mock("@/components/shell/scroll-reveal", () => ({ ScrollReveal: () => null }));
vi.mock("@/components/shell/site-footer", () => ({ SiteFooter: () => null }));
vi.mock("@/components/shell/site-header", () => ({ SiteHeader: () => null }));
vi.mock("@/components/shell/theme-provider", () => ({ ThemeProvider: ({ children }: { children: unknown }) => children }));

import RootLayout, { metadata } from "@/app/layout";

describe("root metadata", () => {
  it("defines product, discovery, and icon metadata for installed and shared links", () => {
    expect(metadata.applicationName).toBe("ikAnimeList");
    expect(metadata.manifest).toBe("/site.webmanifest");
    expect(metadata.icons).toMatchObject({ icon: [{ url: "/icon.svg", type: "image/svg+xml" }] });
    expect(metadata.openGraph).toMatchObject({ siteName: "ikAnimeList", type: "website" });
    expect(metadata.twitter).toMatchObject({ card: "summary" });
  });

  it("keeps a visible floating ambient scene behind the interactive application layer", async () => {
    render(await RootLayout({ children: <p>Page content</p> }));

    const scene = screen.getByTestId("ambient-scene");
    expect(scene).toHaveClass("fixed", "inset-0", "z-0", "pointer-events-none");
    expect(scene.querySelectorAll(".ambient")).toHaveLength(3);
    expect(screen.getByRole("main")).toHaveClass("relative", "z-10");
  });
});
