import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { PasswordRecovery } from "@/features/auth/components/password-recovery";

vi.mock("@/lib/auth-client", () => ({ authClient: { requestPasswordReset: vi.fn(), resetPassword: vi.fn() } }));

describe("PasswordRecovery", () => {
  it("requests a reset without revealing account existence", () => {
    render(<PasswordRecovery mode="request" />);
    expect(screen.getByRole("textbox", { name: /email/i })).toBeRequired();
    expect(screen.getByRole("button", { name: /send reset link/i })).toBeEnabled();
  });

  it("accepts a strong replacement password for a reset token", () => {
    render(<PasswordRecovery mode="reset" token="secure-token" />);
    expect(screen.getByLabelText(/new password/i)).toHaveAttribute("minLength", "8");
    expect(screen.getByRole("button", { name: /set new password/i })).toBeEnabled();
  });
});
