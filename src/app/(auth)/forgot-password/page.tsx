import type { Metadata } from "next";
import { Card } from "@/components/ui/card";
import { PasswordRecovery } from "@/features/auth/components/password-recovery";

export const metadata: Metadata = { title: "Reset password" };

export default function ForgotPasswordPage() {
  return <Card className="mx-auto max-w-lg p-6 sm:p-9"><p className="text-sm font-bold uppercase tracking-[.2em] text-violet-300">Account recovery</p><h2 className="mt-3 text-3xl font-black">Find your way back</h2><p className="mb-8 mt-2 text-zinc-400">We’ll email a secure, short-lived reset link.</p><PasswordRecovery mode="request" /></Card>;
}
