import { describe, expect, it } from "vitest";
import { profileSettingsSchema } from "@/features/social/profile-settings";

describe("profile settings validation", () => {
  it("accepts editable profile and audience settings", () => {
    expect(profileSettingsSchema.parse({
      name: "Spike Spiegel",
      bio: "Whatever happens, happens.",
      location: "Mars",
      website: "https://example.com",
      visibility: "private",
      activityVisibility: "followers"
    })).toMatchObject({ visibility: "private", activityVisibility: "followers" });
  });

  it("rejects unsafe URLs and unknown audiences", () => {
    expect(profileSettingsSchema.safeParse({ name: "Spike", website: "javascript:alert(1)", visibility: "public", activityVisibility: "everyone" }).success).toBe(false);
  });
});
