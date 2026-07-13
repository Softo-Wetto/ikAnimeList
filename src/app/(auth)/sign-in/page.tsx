import type { Metadata } from "next";
import { Card } from "@/components/ui/card";
import { safeCallbackUrl } from "@/features/auth/callback";
import { AuthForm } from "@/features/auth/components/auth-form";

export const metadata: Metadata = { title: "Sign in" };
export default async function SignInPage({ searchParams }: { searchParams: Promise<{ callbackURL?: string | string[] }> }) {
  const value = (await searchParams).callbackURL;
  const callbackURL = safeCallbackUrl(Array.isArray(value) ? value[0] : value);
  return <Card className="mx-auto max-w-lg p-6 sm:p-9"><p className="text-sm font-bold uppercase tracking-[.2em] text-violet-300">Welcome back</p><h2 className="mt-3 text-3xl font-black tracking-tight">Continue your list</h2><p className="mb-8 mt-2 text-zinc-400">Your next episode is waiting.</p><AuthForm callbackURL={callbackURL} mode="sign-in" /></Card>;
}
