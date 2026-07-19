import { Star } from "lucide-react";

export function ScoreRing({ score }: { score?: number }) {
  return (
    <div className="grid size-24 shrink-0 place-items-center rounded-full bg-[conic-gradient(#a78bfa_var(--score),var(--ring-track)_0)] p-1" style={{ "--score": `${Math.min((score ?? 0) * 10, 100)}%` } as React.CSSProperties}>
      <div className="grid size-full place-items-center rounded-full bg-zinc-950 text-center">
        <div>
          <Star aria-hidden="true" className="mx-auto text-amber-300" fill="currentColor" size={13} />
          <strong className="mt-1 block text-xl">{score?.toFixed(1) ?? "—"}</strong>
          <span className="text-[10px] uppercase tracking-widest text-zinc-500">score</span>
        </div>
      </div>
    </div>
  );
}
