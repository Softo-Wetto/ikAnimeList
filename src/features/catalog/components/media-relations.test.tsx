import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MediaRelations } from "@/features/catalog/components/media-relations";

describe("MediaRelations", () => {
  it("renders canonical internal links for related anime and manga", () => {
    render(<MediaRelations relations={[{ relation: "Sequel", id: 5, mediaType: "anime", title: "A sequel" }, { relation: "Adaptation", id: 25, mediaType: "manga", title: "The manga" }]} />);
    expect(screen.getByRole("link", { name: /a sequel/i })).toHaveAttribute("href", "/anime/5");
    expect(screen.getByRole("link", { name: /the manga/i })).toHaveAttribute("href", "/manga/25");
  });
});
