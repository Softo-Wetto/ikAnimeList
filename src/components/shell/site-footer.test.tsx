import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SiteFooter } from "@/components/shell/site-footer";

describe("SiteFooter", () => {
  it("organises product navigation into clear discovery and account sections", () => {
    render(<SiteFooter />);

    expect(screen.getByRole("heading", { name: "Explore" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Your space" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Discover titles" })).toHaveAttribute("href", "/discover");
  });
});
