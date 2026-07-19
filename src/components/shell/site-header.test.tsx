import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ getSession: vi.fn() }));
vi.mock("@/lib/session", () => ({ getSession: mocks.getSession }));
vi.mock("@/components/shell/theme-toggle", () => ({ ThemeToggle: () => <button>Theme</button> }));
vi.mock("@/components/shell/sign-out-button", () => ({ SignOutButton: () => <button>Sign out</button> }));

import { SiteHeader } from "@/components/shell/site-header";

describe("SiteHeader", () => {
  it("gives guests a clear catalogue search entry point", async () => {
    mocks.getSession.mockResolvedValue(null);
    render(await SiteHeader());

    expect(screen.getByRole("link", { name: /search catalogue/i })).toHaveAttribute("href", "/discover");
  });
});
