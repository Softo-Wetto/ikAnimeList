import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MediaDetailNav } from "@/features/catalog/components/media-detail-nav";

describe("MediaDetailNav", () => {
  it("links the detail-page sections without showing unavailable trailer navigation", () => {
    render(<MediaDetailNav hasTrailer={false} />);

    expect(screen.getByRole("navigation", { name: /media sections/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Overview" })).toHaveAttribute("href", "#overview");
    expect(screen.getByRole("link", { name: "Characters" })).toHaveAttribute("href", "#characters");
    expect(screen.queryByRole("link", { name: "Trailer" })).not.toBeInTheDocument();
  });

  it("includes the trailer shortcut when a trailer is available", () => {
    render(<MediaDetailNav hasTrailer />);

    expect(screen.getByRole("link", { name: "Trailer" })).toHaveAttribute("href", "#trailer");
  });
});
