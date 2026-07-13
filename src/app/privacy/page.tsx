import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy" };

export default function PrivacyPage() {
  return <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6"><p className="text-xs font-black uppercase tracking-[.24em] text-violet-300">Privacy</p><h1 className="mt-3 text-4xl font-black">Your data, in plain language.</h1><div className="mt-8 grid gap-8 leading-7 text-zinc-400"><Section title="What we store">Account details, secure session records, list entries, private notes, reviews, follows, likes, activity events, and dismissed recommendations. Passwords are stored only as slow password hashes by Better Auth.</Section><Section title="What is public">Your display name, username, public profile, shared list snapshots, reviews, follows, and public activity may be visible to other visitors. Private notes and account credentials are never public.</Section><Section title="External services">Jikan supplies catalogue data and receives catalogue requests without your account details. The configured email provider receives the destination address and verification or reset message needed to deliver account email.</Section><Section title="Retention and control">Account and related records remain until removed under the service’s retention process. Production operators should publish a support address for access and deletion requests before launch.</Section></div></article>;
}

function Section({ children, title }: { children: React.ReactNode; title: string }) { return <section><h2 className="text-xl font-black text-white">{title}</h2><p className="mt-2">{children}</p></section>; }
