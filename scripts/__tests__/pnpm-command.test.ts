import { describe, expect, it } from "vitest"
import { dlxCommand, pnpmCommand } from "../pnpm-command"

describe("pnpmCommand", () => {
  it("runs package-manager commands through pnpm", () => {
    expect(pnpmCommand("install")).toEqual(["pnpm", "install"])
  })
})

describe("dlxCommand", () => {
  it("runs shadcn through pnpm dlx", () => {
    const command = dlxCommand("shadcn@4.8.0", "--version")

    expect(command).toEqual(["pnpm", "dlx", "shadcn@4.8.0", "--version"])
    expect(command).not.toContain("bunx")
    expect(command).not.toContain("npx")
  })
})
