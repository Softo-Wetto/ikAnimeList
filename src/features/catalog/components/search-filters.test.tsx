import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SearchFilters } from "@/features/catalog/components/search-filters";

describe("SearchFilters", () => {
  it("renders shareable GET filters with current values", () => {
    render(<SearchFilters genre="8" mediaType="manga" query="monster" sort="score" status="complete" />);

    const form = screen.getByRole("search");
    expect(form).toHaveAttribute("method", "get");
    expect(screen.getByRole("searchbox", { name: /search titles/i })).toHaveValue("monster");
    expect(screen.getByRole("combobox", { name: /media type/i })).toHaveTextContent("Manga");
    expect(screen.getByRole("combobox", { name: /genre/i })).toHaveTextContent("Drama");
    expect(screen.getByRole("combobox", { name: /status/i })).toHaveTextContent("Completed");
    expect(screen.getByRole("combobox", { name: /sort by/i })).toHaveTextContent("Highest rated");
    expect(screen.getByRole("button", { name: /show results/i })).toBeEnabled();
  });

  it("opens an animated option panel and preserves the selected value for form submission", () => {
    render(<SearchFilters />);

    const type = screen.getByRole("combobox", { name: /media type/i });
    expect(type).toHaveAttribute("aria-expanded", "false");
    fireEvent.click(type);
    expect(screen.getByRole("listbox", { name: /media type/i })).toHaveClass("animate-pop");
    fireEvent.click(screen.getByRole("option", { name: "Manga" }));
    expect(type).toHaveTextContent("Manga");
    expect(document.querySelector('input[name="type"]')).toHaveValue("manga");
  });

  it("keeps the restrained results action on one line before the extra-wide filter layout", () => {
    render(<SearchFilters />);

    const form = screen.getByRole("search");
    const action = screen.getByRole("button", { name: /show results/i });
    expect(form).toHaveClass("md:grid-cols-2", "xl:grid-cols-[minmax(220px,1fr)_120px_150px_150px_160px_auto]");
    expect(action).toHaveClass("min-w-[10.5rem]", "whitespace-nowrap", "bg-violet-500", "text-oncover");
    expect(action).not.toHaveClass("bg-gradient-to-r");
  });
});
