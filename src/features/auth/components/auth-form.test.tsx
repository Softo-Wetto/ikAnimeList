import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { AuthForm } from "@/features/auth/components/auth-form";

vi.mock("@/lib/auth-client", () => ({
  authClient: {
    signIn: { email: vi.fn() },
    signUp: { email: vi.fn() }
  }
}));

describe("AuthForm", () => {
  it("shows the complete account creation form", () => {
    render(<AuthForm mode="sign-up" />);

    expect(screen.getByRole("textbox", { name: /display name/i })).toBeRequired();
    expect(screen.getByRole("textbox", { name: /username/i })).toBeRequired();
    expect(screen.getByRole("textbox", { name: /email/i })).toBeRequired();
    expect(screen.getByLabelText(/^password/i)).toHaveAttribute("minLength", "8");
    expect(screen.getByRole("button", { name: /create account/i })).toBeEnabled();
  });

  it("keeps sign-in focused on returning members", () => {
    render(<AuthForm mode="sign-in" />);

    expect(screen.queryByRole("textbox", { name: /username/i })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sign in/i })).toBeEnabled();
    expect(screen.getByRole("link", { name: /create one/i })).toHaveAttribute("href", "/sign-up");
  });
});
