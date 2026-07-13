import type { Metadata } from "next";
import { Card } from "@/components/ui/card";
import { AuthForm } from "@/features/auth/components/auth-form";

export const metadata: Metadata = { title: "Create account" };

export default function SignUpPage() {
  return (
    <Card className="mx-auto max-w-lg p-6 sm:p-9">
      <p className="text-sm font-bold uppercase tracking-[.2em] text-violet-300">Free forever</p>
      <h2 className="mt-3 text-3xl font-black tracking-tight">Start your collection</h2>
      <p className="mb-8 mt-2 text-zinc-400">Make your taste official.</p>
      <AuthForm mode="sign-up" />
    </Card>
  );
}
