import { describe, expect, it } from "vitest"
import { bunCommand, resolveBunExecutable } from "../bun-command"

describe("bunCommand", () => {
  it("runs shadcn through this Linux Bun executable instead of a PATH launcher", () => {
    const command = bunCommand("x", "shadcn@4.8.0", "--version")

    expect(command).toEqual([resolveBunExecutable(), "x", "shadcn@4.8.0", "--version"])
    expect(command).not.toContain("bunx")
    expect(command).not.toContain("npx")
  })
})

describe("resolveBunExecutable", () => {
  it("resolves Bun from BUN_INSTALL when running under Node despite a hijacked PATH", () => {
    expect(resolveBunExecutable({
      isBun: false,
      environment: { BUN_INSTALL: "/home/zhang/.bun", PATH: "/mnt/d/develop/nodejs:/usr/bin" },
      platform: "linux",
    })).toBe("/home/zhang/.bun/bin/bun")
  })

  it("fails clearly outside Bun when BUN_INSTALL is unavailable", () => {
    expect(() => resolveBunExecutable({ isBun: false, environment: {}, platform: "linux" }))
      .toThrow("BUN_INSTALL")
  })
})
