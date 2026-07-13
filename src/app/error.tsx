"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <section className="mx-auto grid min-h-[65vh] max-w-xl place-items-center px-6 text-center">
      <div>
        <AlertTriangle aria-hidden="true" className="mx-auto mb-5 text-amber-300" size={40} />
        <h1 className="text-3xl font-black">That scene did not load.</h1>
        <p className="mt-3 text-zinc-400">The problem has been contained. Try the request once more.</p>
        <Button className="mt-7" onClick={reset}>Try again</Button>
      </div>
    </section>
  );
}
