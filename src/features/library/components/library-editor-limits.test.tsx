import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { LibraryEditor } from "@/features/library/components/library-editor";

vi.mock("@/features/library/server/actions", () => ({ upsertLibraryEntry: vi.fn() }));

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

describe("LibraryEditor limits", () => {
  it("opens the tracker above the surrounding page as a modal dialog", () => {
    render(<LibraryEditor media={media} />);
    fireEvent.click(screen.getByRole("button", { name: /add to my list/i }));

    expect(screen.getByRole("dialog", { name: /track cowboy bebop/i })).toHaveAttribute("aria-modal", "true");
  });

  it("caps typed progress and personal score at the title limits", () => {
    render(<LibraryEditor media={media} />);
    fireEvent.click(screen.getByRole("button", { name: /add to my list/i }));

    const progress = screen.getByLabelText("Progress");
    const score = screen.getByLabelText("Score / 10");
    fireEvent.change(progress, { target: { value: "27" } });
    fireEvent.change(score, { target: { value: "11" } });

    expect(progress).toHaveValue(26);
    expect(score).toHaveValue(10);
  });
});
