"use client";

import { ArrowRight, LoaderCircle } from "lucide-react";
import Link from "next/link";
import { useState, useTransition, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { safeCallbackUrl } from "@/features/auth/callback";
import { authClient } from "@/lib/auth-client";

type AuthMode = "sign-in" | "sign-up";
export function AuthForm({ mode, callbackURL = "/dashboard" }: { mode: AuthMode; callbackURL?: string }) {
  const [error, setError] = useState<string>(); const [pending, startTransition] = useTransition(); const creatingAccount = mode === "sign-up"; const destination = safeCallbackUrl(callbackURL);
  function handleSubmit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); setError(undefined); const form = new FormData(event.currentTarget); startTransition(async () => {
    const email = String(form.get("email") ?? ""); const password = String(form.get("password") ?? "");
    const response = creatingAccount ? await authClient.signUp.email({ email, password, name: String(form.get("name") ?? ""), username: String(form.get("username") ?? ""), callbackURL: destination }) : await authClient.signIn.email({ email, password, callbackURL: destination });
    if (response.error) { setError(creatingAccount ? "We could not create that account. Check the details or try another email." : "The email or password did not match an account."); return; }
    window.location.assign(destination);
  }); }
  return <form className="grid gap-5" onSubmit={handleSubmit}>{creatingAccount ? <div className="grid gap-4 sm:grid-cols-2"><Field label="Display name" name="name"><Input autoComplete="name" id="name" maxLength={80} name="name" required /></Field><Field label="Username" name="username"><Input autoCapitalize="none" autoComplete="username" id="username" maxLength={30} minLength={3} name="username" pattern="[A-Za-z0-9_.]+" required /></Field></div> : null}<Field label="Email" name="email"><Input autoComplete="email" id="email" name="email" required type="email" /></Field><Field label="Password" name="password"><Input autoComplete={creatingAccount ? "new-password" : "current-password"} id="password" maxLength={128} minLength={8} name="password" required type="password" /></Field>{!creatingAccount ? <div className="flex justify-end"><Link className="text-sm font-medium text-violet-300 hover:text-violet-200" href="/forgot-password">Forgot password?</Link></div> : <p className="text-xs leading-5 text-zinc-500">By creating an account, you agree to our <Link className="text-zinc-300" href="/terms">terms</Link> and <Link className="text-zinc-300" href="/privacy">privacy policy</Link>.</p>}{error ? <p aria-live="polite" className="rounded-2xl border border-rose-400/20 bg-rose-400/10 p-3 text-sm text-rose-200" role="alert">{error}</p> : null}<Button className="w-full" disabled={pending} size="lg" type="submit">{pending ? <LoaderCircle aria-hidden="true" className="animate-spin" size={18} /> : null}{creatingAccount ? "Create account" : "Sign in"}{!pending ? <ArrowRight aria-hidden="true" size={18} /> : null}</Button><p className="text-center text-sm text-zinc-500">{creatingAccount ? "Already collecting favourites?" : "New to ikAnimeList?"} <Link className="font-semibold text-violet-300 hover:text-violet-200" href={creatingAccount ? "/sign-in" : "/sign-up"}>{creatingAccount ? "Sign in" : "Create one"}</Link></p></form>;
}
function Field({ children, label, name }: { children: React.ReactNode; label: string; name: string }) { return <div className="grid gap-2"><label className="text-sm font-semibold text-zinc-200" htmlFor={name}>{label}</label>{children}</div>; }
