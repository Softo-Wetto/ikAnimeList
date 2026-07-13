import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const projectFile = (name: string) => join(process.cwd(), name);

describe("one-command local production launcher", () => {
  it("provides a Windows entry point that starts the Docker stack", () => {
    const launcherPath = projectFile("run-website.cmd");

    expect(existsSync(launcherPath)).toBe(true);
    const launcher = readFileSync(launcherPath, "utf8");
    expect(launcher).toContain("docker compose up --build --detach");
    expect(launcher).toContain("http://localhost:3000/api/health");
    expect(launcher).toContain("initialize-env.ps1");
  });

  it("generates a cryptographically random auth secret on first run", () => {
    const initializerPath = projectFile("scripts/initialize-env.ps1");
    expect(existsSync(initializerPath)).toBe(true);

    const initializer = readFileSync(initializerPath, "utf8");
    expect(initializer).toContain("RandomNumberGenerator");
    expect(initializer).toContain("BETTER_AUTH_SECRET");
  });

  it("defines a containerized application with loopback-only ports and a required secret", () => {
    const dockerfilePath = projectFile("Dockerfile");
    const composePath = projectFile("docker-compose.yml");

    expect(existsSync(dockerfilePath)).toBe(true);
    expect(existsSync(composePath)).toBe(true);

    const dockerfile = readFileSync(dockerfilePath, "utf8");
    const compose = readFileSync(composePath, "utf8");

    expect(dockerfile).toContain("AS runner");
    expect(dockerfile).toContain("USER nextjs");
    expect(compose).toMatch(/app:\s/);
    expect(compose).toContain("condition: service_healthy");
    expect(compose).toContain('"127.0.0.1:3000:3000"');
    expect(compose).toContain('"127.0.0.1:5432:5432"');
    expect(compose).toContain("BETTER_AUTH_SECRET: ${BETTER_AUTH_SECRET:?");
    expect(compose).not.toContain("local-docker-secret-change-before-sharing");
  });
});
