import "server-only";
import { z } from "zod";

const optionalSecret = z.preprocess(
  (value) => value === "" ? undefined : value,
  z.string().min(1).optional()
);

const serverEnvironmentSchema = z.object({
  DATABASE_URL: z.string().url().refine((value) => value.startsWith("postgresql://") || value.startsWith("postgres://"), { message: "DATABASE_URL must use PostgreSQL" }),
  BETTER_AUTH_SECRET: z.string().min(32),
  BETTER_AUTH_URL: z.string().url(),
  NEXT_PUBLIC_APP_URL: z.string().url(),
  EMAIL_FROM: z.string().email().default("no-reply@example.com"),
  RESEND_API_KEY: optionalSecret,
  EMAIL_DELIVERY_MODE: z.enum(["console", "resend"]).optional(),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development")
}).transform((environment) => ({
  ...environment,
  EMAIL_DELIVERY_MODE:
    environment.EMAIL_DELIVERY_MODE ??
    (environment.NODE_ENV === "production" ? "resend" as const : "console" as const)
})).superRefine((environment, context) => {
  if (environment.EMAIL_DELIVERY_MODE === "resend" && !environment.RESEND_API_KEY) {
    context.addIssue({
      code: "custom",
      path: ["RESEND_API_KEY"],
      message: "RESEND_API_KEY is required when email delivery uses Resend"
    });
  }
});

export type ServerEnvironment = z.infer<typeof serverEnvironmentSchema>;

export function parseServerEnv(environment: Record<string, string | undefined>) {
  return serverEnvironmentSchema.parse(environment);
}

let cachedEnvironment: ServerEnvironment | undefined;

export function getServerEnv() {
  cachedEnvironment ??= parseServerEnv(process.env);
  return cachedEnvironment;
}
