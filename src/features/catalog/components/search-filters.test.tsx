import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SearchFilters } from "@/features/catalog/components/search-filters";

describe("SearchFilters", () => {
  it("renders shareable GET filters with current values", () => {
    render(<SearchFilters genre="8" mediaType="manga" query="monster" sort="score" status="complete" />);

    const form = screen.getByRole("search");
    expect(form).toHaveAttribute("method", "get");
    expect(screen.getByRole("searchbox", { name: /search titles/i })).toHaveValue("monster");
    expect(screen.getByRole("combobox", { name: /media type/i })).toHaveValue("manga");
    expect(screen.getByRole("combobox", { name: /genre/i })).toHaveValue("8");
    expect(screen.getByRole("combobox", { name: /status/i })).toHaveValue("complete");
    expect(screen.getByRole("combobox", { name: /sort by/i })).toHaveValue("score");
    expect(screen.getByRole("button", { name: /show results/i })).toBeEnabled();
  });

  it("gives the results action a prominent responsive treatment", () => {
    render(<SearchFilters />);

    expect(screen.getByRole("button", { name: /show results/i })).toHaveClass("w-full", "sm:w-auto", "bg-gradient-to-r");
  });
});
