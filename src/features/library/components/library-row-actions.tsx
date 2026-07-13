"use client";

import { MinusCircle, Plus } from "lucide-react";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { incrementProgress, removeLibraryEntry } from "@/features/library/server/actions";

export function LibraryRowActions({ id, canIncrement }: { id: string; canIncrement: boolean }) {
  const [pending, startTransition] = useTransition();
  return (
    <div className="flex gap-2">
      {canIncrement ? <Button aria-label="Increment progress" disabled={pending} onClick={() => startTransition(async () => { await incrementProgress(id); })} size="icon" variant="secondary"><Plus size={16} /></Button> : null}
      <Button aria-label="Remove from list" disabled={pending} onClick={() => startTransition(async () => { await removeLibraryEntry(id); })} size="icon" variant="ghost"><MinusCircle size={16} /></Button>
    </div>
  );
}
