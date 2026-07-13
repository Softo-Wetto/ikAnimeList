import type { Metadata } from "next";

export const metadata: Metadata = { title: "Terms" };

export default function TermsPage() {
  return <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6"><p className="text-xs font-black uppercase tracking-[.24em] text-violet-300">Terms</p><h1 className="mt-3 text-4xl font-black">Keep the community worth returning to.</h1><div className="mt-8 grid gap-8 leading-7 text-zinc-400"><Section title="Use the service responsibly">Do not abuse accounts, automate disruptive traffic, evade rate limits, impersonate others, or interfere with the service and its providers.</Section><Section title="Your contributions">You remain responsible for reviews, profile text, and other content you publish. Do not post harassment, illegal material, personal data without permission, or content that infringes another person’s rights.</Section><Section title="Moderation">Operators may hide or remove content and restrict accounts to protect the service and community. Production operators should publish an appeal and contact process before public launch.</Section><Section title="Catalogue and availability">Catalogue data is supplied by third parties and may be incomplete or temporarily unavailable. The service is provided without a guarantee of uninterrupted availability.</Section></div><p className="mt-12 text-xs text-zinc-600">This starter text is not legal advice; have counsel review it for the launch jurisdiction and operator.</p></article>;
}

function Section({ children, title }: { children: React.ReactNode; title: string }) { return <section><h2 className="text-xl font-black text-white">{title}</h2><p className="mt-2">{children}</p></section>; }
