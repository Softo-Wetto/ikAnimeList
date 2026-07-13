import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { LibraryEditor } from "@/features/library/components/library-editor";

vi.mock("@/features/library/server/actions", () => ({
  upsertLibraryEntry: vi.fn()
}));

const media = {
  id: 1,
  mediaType: "anime" as const,
  title: "Cowboy Bebop",
  imageUrl: "https://example.test/cowboy-bebop.webp",
  malUrl: "https://myanimelist.net/anime/1",
  format: "TV",
  progressTotal: 26,
  genres: ["Action"],
  themes: ["Space"],
  studios: ["Sunrise"],
  creators: []
};

describe("LibraryEditor", () => {
  it("prepopulates every editable field for an existing entry", () => {
    render(
      <LibraryEditor
        media={media}
        initialEntry={{
          status: "paused",
          progress: 12,
          score: 9,
          favourite: true,
          notes: "Continue with episode 13."
        }}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /edit my list/i }));

    expect(screen.getByLabelText("Status")).toHaveValue("paused");
    expect(screen.getByLabelText("Progress")).toHaveValue(12);
    expect(screen.getByLabelText("Score / 10")).toHaveValue(9);
    expect(screen.getByLabelText("Private notes")).toHaveValue("Continue with episode 13.");
    expect(screen.getByLabelText(/mark as favourite/i)).toBeChecked();
  });
});
