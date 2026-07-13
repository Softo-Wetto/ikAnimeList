import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

describe("pnpm dependency build policy", () => {
  it("uses the pnpm 11 allowBuilds map for reviewed native dependencies", () => {
    const workspace = readFileSync(join(process.cwd(), "pnpm-workspace.yaml"), "utf8");

    expect(workspace).not.toContain("onlyBuiltDependencies:");
    expect(workspace).toContain("allowBuilds:");
    expect(workspace).toContain("esbuild: true");
    expect(workspace).toContain("sharp: true");
    expect(workspace).toContain("unrs-resolver: true");
  });
});
