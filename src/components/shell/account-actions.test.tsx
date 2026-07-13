import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SignOutButton } from "@/components/shell/sign-out-button";
import { ThemeToggle } from "@/components/shell/theme-toggle";

const mocks = vi.hoisted(() => ({ push: vi.fn(), refresh: vi.fn(), signOut: vi.fn().mockResolvedValue(undefined), setTheme: vi.fn() }));
vi.mock("next/navigation", () => ({ useRouter: () => ({ push: mocks.push, refresh: mocks.refresh }) }));
vi.mock("@/lib/auth-client", () => ({ authClient: { signOut: mocks.signOut } }));
vi.mock("next-themes", () => ({ useTheme: () => ({ resolvedTheme: "dark", setTheme: mocks.setTheme }) }));

describe("account shell actions", () => {
  it("signs out and returns to the home page", async () => {
    render(<SignOutButton />);
    fireEvent.click(screen.getByRole("button", { name: /sign out/i }));
    await waitFor(() => expect(mocks.signOut).toHaveBeenCalledOnce());
    expect(mocks.push).toHaveBeenCalledWith("/");
    expect(mocks.refresh).toHaveBeenCalledOnce();
  });

  it("switches between light and dark themes", () => {
    render(<ThemeToggle />);
    fireEvent.click(screen.getByRole("button", { name: /use light theme/i }));
    expect(mocks.setTheme).toHaveBeenCalledWith("light");
  });
});
