import "server-only";
import { getServerEnv } from "@/lib/env";

export async function sendAuthEmail({ subject, text, to }: { subject: string; text: string; to: string }) {
  const environment = getServerEnv();

  if (environment.EMAIL_DELIVERY_MODE === "console") {
    console.info(`[auth-email] ${subject} to ${to}: ${text}`);
    return;
  }

  if (!environment.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is required when email delivery uses Resend");
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${environment.RESEND_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ from: environment.EMAIL_FROM, to: [to], subject, text })
  });

  if (!response.ok) throw new Error(`Email provider returned ${response.status}`);
}
