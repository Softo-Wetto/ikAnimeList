import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { SelectMenu } from "@/components/ui/select-menu";

describe("SelectMenu", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("portals its solid option panel above clipping surfaces and flips it into the available viewport space", () => {
    Object.defineProperty(window, "innerHeight", { configurable: true, value: 500 });
    render(<div className="overflow-hidden"><SelectMenu ariaLabel="Status" name="status" options={[{ value: "watching", label: "Watching" }]} /></div>);

    const trigger = screen.getByRole("combobox", { name: "Status" });
    vi.spyOn(trigger, "getBoundingClientRect").mockReturnValue({ bottom: 470, height: 40, left: 20, right: 200, top: 430, width: 180, x: 20, y: 430, toJSON: () => ({}) });
    fireEvent.click(trigger);

    const panel = screen.getByRole("listbox", { name: "Status" });
    expect(panel.parentElement).toBe(document.body);
    expect(panel).toHaveClass("fixed", "z-[100]", "bg-zinc-950");
    expect(panel).not.toHaveClass("bg-zinc-950/95");
    expect(panel.style.bottom).toBe("78px");
  });
});
