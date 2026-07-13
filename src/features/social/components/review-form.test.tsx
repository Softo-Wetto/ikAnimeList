import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ReviewForm } from "@/features/social/components/review-form";

vi.mock("@/features/social/server/actions", () => ({ publishReview: vi.fn() }));

describe("ReviewForm", () => {
  it("offers rating, title, spoiler, and long-form review fields", async () => {
    const user = userEvent.setup();
    render(<ReviewForm media={{ id: 1, mediaType: "anime", title: "Frieren", imageUrl: "", malUrl: "", genres: [], themes: [], studios: [], creators: [] }} />);

    await user.click(screen.getByRole("button", { name: /write a review/i }));

    expect(screen.getByRole("combobox", { name: /rating/i })).toBeRequired();
    expect(screen.getByRole("textbox", { name: /review title/i })).toBeRequired();
    expect(screen.getByRole("textbox", { name: /your review/i })).toHaveAttribute("minLength", "40");
    expect(screen.getByRole("checkbox", { name: /spoilers/i })).not.toBeChecked();
    expect(screen.getByRole("button", { name: /publish review/i })).toBeEnabled();
  });
});
