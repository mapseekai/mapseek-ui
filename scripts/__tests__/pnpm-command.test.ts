import { describe, expect, it } from "vitest"
import { dlxCommand, npmCommand, pnpmCommand, tsxCommand } from "../pnpm-command"

describe("pnpmCommand", () => {
  it("runs package-manager commands through pnpm", () => {
    const executable = process.platform === "win32" ? "pnpm.cmd" : "pnpm"
    expect(pnpmCommand("install")).toEqual([executable, "install"])
  })
})

describe("dlxCommand", () => {
  it("runs shadcn through pnpm dlx", () => {
    const command = dlxCommand("shadcn@4.8.0", "--version")
    const executable = process.platform === "win32" ? "pnpm.cmd" : "pnpm"

    expect(command).toEqual([executable, "dlx", "shadcn@4.8.0", "--version"])
    expect(command).not.toContain("bunx")
    expect(command).not.toContain("npx")
  })
})

describe("platform package executables", () => {
  it("uses portable npm and tsx launchers", () => {
    const npm = process.platform === "win32" ? "npm.cmd" : "npm"

    expect(npmCommand("run", "build")).toEqual([npm, "run", "build"])
    expect(tsxCommand("scripts/example.ts")).toEqual([
      process.execPath,
      "--import",
      "tsx",
      "scripts/example.ts",
    ])
  })
})
