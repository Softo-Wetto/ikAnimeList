import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Button } from "@/components/ui/button";

describe("Button", () => {
  it("renders a labelled button with polished focus and press feedback", () => {
    render(<Button>Save to list</Button>);

    const button = screen.getByRole("button", { name: "Save to list" });
    expect(button).toHaveClass("focus-visible:ring-2", "duration-300", "hover:-translate-y-px", "active:scale-[.98]");
    expect(button).not.toBeDisabled();
  });

  it("renders an accessible navigation link when href is provided", () => {
    render(<Button href="/discover">Explore the catalogue</Button>);

    expect(screen.getByRole("link", { name: "Explore the catalogue" })).toHaveAttribute("href", "/discover");
  });
});
