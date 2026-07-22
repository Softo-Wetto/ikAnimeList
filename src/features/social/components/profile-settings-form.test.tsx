import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ProfileSettingsForm } from "@/features/social/components/profile-settings-form";

vi.mock("@/features/social/server/profile-actions", () => ({ updateProfileSettings: vi.fn() }));

describe("ProfileSettingsForm", () => {
  it("uses the animated shared dropdown control for privacy settings", () => {
    render(<ProfileSettingsForm initialValues={{ name: "Mina", bio: "", location: "", website: "", visibility: "public", activityVisibility: "followers" }} />);

    expect(screen.getByRole("combobox", { name: "Profile visibility" }).tagName).toBe("BUTTON");
    expect(screen.getByRole("combobox", { name: "Activity audience" })).toHaveTextContent("People who follow me");
  });
});
