import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ getSession: vi.fn() }));
vi.mock("@/lib/session", () => ({ getSession: mocks.getSession }));
vi.mock("@/components/shell/theme-toggle", () => ({ ThemeToggle: () => <button>Theme</button> }));
vi.mock("@/components/shell/catalogue-search", () => ({ CatalogueSearch: () => <input aria-label="Search catalogue" role="searchbox" /> }));
vi.mock("@/components/shell/account-menu", () => ({ AccountMenu: ({ name }: { name: string }) => <button>{name}&apos;s account</button> }));

import { SiteHeader } from "@/components/shell/site-header";

describe("SiteHeader", () => {
  it("gives guests a smart catalogue search entry point", async () => {
    mocks.getSession.mockResolvedValue(null);
    render(await SiteHeader());

    expect(screen.getByRole("searchbox", { name: /search catalogue/i })).toBeVisible();
  });

  it("groups signed-in member actions in the account menu", async () => {
    mocks.getSession.mockResolvedValue({ user: { name: "Mina", username: "mina_reads" } });
    render(await SiteHeader());

    expect(screen.getByRole("button", { name: /mina's account/i })).toBeVisible();
    expect(screen.queryByRole("link", { name: /my library/i })).not.toBeInTheDocument();
  });
});
