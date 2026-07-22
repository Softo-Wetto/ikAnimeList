import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/components/shell/sign-out-button", () => ({ SignOutButton: () => <button>Sign out</button> }));

import { AccountMenu } from "@/components/shell/account-menu";

describe("AccountMenu", () => {
  it("groups member destinations and sign-out into an accessible account dropdown", () => {
    render(<AccountMenu name="Mina" username="mina_reads" />);

    fireEvent.click(screen.getByRole("button", { name: /open account menu/i }));
    expect(screen.getByRole("menu")).toBeVisible();
    expect(screen.getByRole("menuitem", { name: /view profile/i })).toHaveAttribute("href", "/users/mina_reads");
    expect(screen.getByRole("menuitem", { name: /my library/i })).toHaveAttribute("href", "/library");
    expect(screen.getByRole("menuitem", { name: /dashboard/i })).toHaveAttribute("href", "/dashboard");
    expect(screen.getByRole("menuitem", { name: /settings/i })).toHaveAttribute("href", "/settings");
    expect(screen.getByRole("button", { name: /sign out/i })).toBeVisible();
  });
});
