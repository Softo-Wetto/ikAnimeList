import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { MobileNav } from "@/components/shell/mobile-nav";

vi.mock("next/navigation", () => ({ useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }) }));
vi.mock("@/lib/auth-client", () => ({ authClient: { signOut: vi.fn() } }));

describe("MobileNav", () => {
  it("shows member destinations and account controls when signed in", () => {
    render(<MobileNav authenticated />);
    fireEvent.click(screen.getByRole("button", { name: /open navigation/i }));
    expect(screen.getByRole("link", { name: /my library/i })).toHaveAttribute("href", "/library");
    expect(screen.getByRole("link", { name: /dashboard/i })).toHaveAttribute("href", "/dashboard");
    expect(screen.getByRole("link", { name: /settings/i })).toHaveAttribute("href", "/settings");
    expect(screen.getByRole("button", { name: /sign out/i })).toBeEnabled();
    expect(screen.queryByRole("link", { name: /join free/i })).not.toBeInTheDocument();
  });
});
