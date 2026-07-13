import "server-only";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { enforceRateLimit } from "@/lib/rate-limit";

export async function getSession() {
  return auth.api.getSession({ headers: await headers() });
}

export async function requireSession() {
  const requestHeaders = await headers();
  const session = await auth.api.getSession({ headers: requestHeaders });
  if (!session) redirect("/sign-in");
  if (requestHeaders.has("next-action")) {
    enforceRateLimit(`mutation:${session.user.id}`, { limit: 60, windowMs: 60_000 });
  }
  return session;
}
