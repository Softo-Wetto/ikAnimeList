"use client";

import { LoaderCircle, Mail, ShieldCheck } from "lucide-react";
import { useState, useTransition, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";

type PasswordRecoveryProps = { mode: "request"; token?: never } | { mode: "reset"; token: string };

export function PasswordRecovery(props: PasswordRecoveryProps) {
  const [message, setMessage] = useState<string>();
  const [pending, startTransition] = useTransition();

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    startTransition(async () => {
      if (props.mode === "request") {
        await authClient.requestPasswordReset({ email: String(form.get("email")), redirectTo: "/reset-password" });
        setMessage("If an account uses that address, a reset link is on its way.");
        return;
      }
      const response = await authClient.resetPassword({ newPassword: String(form.get("password")), token: props.token });
      setMessage(response.error ? "This reset link is invalid or has expired." : "Password updated. You can sign in now.");
    });
  }

  const requesting = props.mode === "request";
  return <form className="grid gap-5" onSubmit={submit}><label className="grid gap-2 text-sm font-semibold">{requesting ? "Email" : "New password"}<Input autoComplete={requesting ? "email" : "new-password"} id={requesting ? "recovery-email" : "new-password"} minLength={requesting ? undefined : 8} name={requesting ? "email" : "password"} required type={requesting ? "email" : "password"} /></label>{message ? <p aria-live="polite" className="rounded-2xl border border-violet-300/15 bg-violet-300/8 p-4 text-sm text-violet-100">{message}</p> : null}<Button disabled={pending} size="lg" type="submit">{pending ? <LoaderCircle className="animate-spin" size={17} /> : requesting ? <Mail size={17} /> : <ShieldCheck size={17} />}{requesting ? "Send reset link" : "Set new password"}</Button></form>;
}
