import { Compass } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <section className="mx-auto grid min-h-[65vh] max-w-xl place-items-center px-6 text-center">
      <div>
        <Compass aria-hidden="true" className="mx-auto mb-5 text-violet-300" size={44} />
        <p className="text-sm font-bold uppercase tracking-[0.28em] text-violet-300">404 · Lost episode</p>
        <h1 className="mt-3 text-4xl font-black">This page wandered off-script.</h1>
        <p className="mt-4 text-zinc-400">Head back to discovery and find something worth watching.</p>
        <Button className="mt-7" href="/discover">Browse the catalogue</Button>
      </div>
    </section>
  );
}
