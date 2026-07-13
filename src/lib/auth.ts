import "server-only";
import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { betterAuth } from "better-auth/minimal";
import { nextCookies } from "better-auth/next-js";
import { username } from "better-auth/plugins";
import { db } from "@/db/client";
import * as schema from "@/db/schema";
import { sendAuthEmail } from "@/lib/email";
import { getServerEnv } from "@/lib/env";

const environment = getServerEnv();
const playwrightTesting = process.env.PLAYWRIGHT_TEST_MODE === "1";

export const auth = betterAuth({
  appName: "ikAnimeList",
  baseURL: environment.BETTER_AUTH_URL,
  secret: environment.BETTER_AUTH_SECRET,
  trustedOrigins: [environment.NEXT_PUBLIC_APP_URL],
  database: drizzleAdapter(db, { provider: "pg", schema }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    maxPasswordLength: 128,
    requireEmailVerification: environment.EMAIL_DELIVERY_MODE === "resend",
    revokeSessionsOnPasswordReset: true,
    sendResetPassword: async ({ user, url }) => {
      await sendAuthEmail({ to: user.email, subject: "Reset your ikAnimeList password", text: `Reset your password using this secure link: ${url}` });
    }
  },
  emailVerification: {
    sendOnSignUp: environment.EMAIL_DELIVERY_MODE === "resend",
    sendVerificationEmail: async ({ user, url }) => {
      await sendAuthEmail({ to: user.email, subject: "Verify your ikAnimeList email", text: `Verify your email using this secure link: ${url}` });
    }
  },
  session: { expiresIn: 60 * 60 * 24 * 30, updateAge: 60 * 60 * 24, cookieCache: { enabled: true, maxAge: 60 * 5 } },
  rateLimit: {
    enabled: true,
    window: 60,
    max: 100,
    customRules: playwrightTesting ? { "/sign-up/email": { window: 10, max: 20 } } : undefined
  },
  plugins: [username({ minUsernameLength: 3, maxUsernameLength: 30 }), nextCookies()]
});
