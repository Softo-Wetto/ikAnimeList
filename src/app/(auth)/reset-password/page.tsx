import type { Metadata } from "next";
import { Card } from "@/components/ui/card";
import { PasswordRecovery } from "@/features/auth/components/password-recovery";

export const metadata: Metadata = { title: "Choose a new password" };

export default async function ResetPasswordPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const token = (await searchParams).token;
  return <Card className="mx-auto max-w-lg p-6 sm:p-9"><p className="text-sm font-bold uppercase tracking-[.2em] text-violet-300">Secure reset</p><h2 className="mt-3 text-3xl font-black">Choose a new password</h2><p className="mb-8 mt-2 text-zinc-400">All other sessions will be revoked after the change.</p>{token ? <PasswordRecovery mode="reset" token={token} /> : <p className="rounded-2xl border border-rose-300/15 bg-rose-300/8 p-4 text-sm text-rose-100">This reset link is missing its token. Request a new one.</p>}</Card>;
}
