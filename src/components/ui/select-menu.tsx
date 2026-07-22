"use client";

import { Check, ChevronDown } from "lucide-react";
import { createPortal } from "react-dom";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export type SelectOption = { label: string; value: string; disabled?: boolean };
type PanelPosition = { bottom?: number; left: number; maxHeight: number; top?: number; width: number };

const viewportGutter = 12;
const panelGap = 8;

export function SelectMenu({ ariaLabel, className, defaultValue = "", name, options, placeholder = "Choose an option", required = false }: { ariaLabel: string; className?: string; defaultValue?: string; name: string; options: SelectOption[]; placeholder?: string; required?: boolean }) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(defaultValue);
  const [panelPosition, setPanelPosition] = useState<PanelPosition>();
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const listboxId = useId();
  const selected = options.find((option) => option.value === value);

  const positionPanel = useCallback(() => {
    const bounds = trigger.current?.getBoundingClientRect();
    if (!bounds) return;

    const roomBelow = window.innerHeight - bounds.bottom - viewportGutter;
    const roomAbove = bounds.top - viewportGutter;
    const opensUpward = roomBelow < 192 && roomAbove > roomBelow;
    const availableRoom = opensUpward ? roomAbove : roomBelow;
    const width = Math.min(bounds.width, Math.max(0, window.innerWidth - viewportGutter * 2));
    const left = Math.max(viewportGutter, Math.min(bounds.left, window.innerWidth - width - viewportGutter));

    setPanelPosition({
      left,
      width,
      maxHeight: Math.min(256, Math.max(96, availableRoom - panelGap)),
      ...(opensUpward ? { bottom: window.innerHeight - bounds.top + panelGap } : { top: bounds.bottom + panelGap })
    });
  }, []);

  useEffect(() => {
    const close = (event: MouseEvent) => {
      const target = event.target as Node;
      if (!root.current?.contains(target) && !panel.current?.contains(target)) setOpen(false);
    };
    const escape = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", escape);
    return () => { document.removeEventListener("mousedown", close); document.removeEventListener("keydown", escape); };
  }, []);

  useEffect(() => {
    if (!open) return;
    positionPanel();
    window.addEventListener("resize", positionPanel);
    window.addEventListener("scroll", positionPanel, true);
    return () => { window.removeEventListener("resize", positionPanel); window.removeEventListener("scroll", positionPanel, true); };
  }, [open, positionPanel]);

  const optionPanel = open && panelPosition && typeof document !== "undefined" ? createPortal(
    <div aria-label={ariaLabel} className="animate-pop fixed z-[100] overflow-y-auto rounded-2xl border border-white/12 bg-zinc-950 p-1.5 shadow-[0_24px_60px_-20px_rgba(0,0,0,.7)]" id={listboxId} ref={panel} role="listbox" style={panelPosition}>
      {options.map((option) => <button aria-selected={value === option.value} className={cn("flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition duration-200", value === option.value ? "bg-violet-500/18 text-violet-100" : "text-zinc-300 hover:bg-white/[.07] hover:text-white", option.disabled && "cursor-not-allowed opacity-40")} disabled={option.disabled} key={option.value} onClick={() => { setValue(option.value); setOpen(false); }} role="option" type="button"><span>{option.label}</span>{value === option.value ? <Check aria-hidden="true" className="text-violet-300" size={16} /> : null}</button>)}
    </div>, document.body
  ) : null;

  return <div className={cn("relative", className)} ref={root}><input aria-hidden="true" className="sr-only" name={name} readOnly required={required} tabIndex={-1} value={value} /><button aria-controls={listboxId} aria-expanded={open} aria-haspopup="listbox" aria-label={ariaLabel} aria-required={required || undefined} className="flex h-11 w-full items-center justify-between gap-3 rounded-2xl border border-white/10 bg-zinc-950 px-4 text-left text-sm font-medium text-zinc-200 shadow-sm shadow-black/10 transition duration-300 hover:border-violet-400/40 hover:bg-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/35" onClick={() => { if (!open) positionPanel(); setOpen((current) => !current); }} ref={trigger} role="combobox" type="button"><span className={cn("truncate", !selected && "text-zinc-500")}>{selected?.label ?? placeholder}</span><ChevronDown aria-hidden="true" className={cn("shrink-0 text-violet-300 transition duration-300", open && "rotate-180")} size={17} /></button>{optionPanel}</div>;
}
