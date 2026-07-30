import { describe, expect, it } from "vitest"
import { bunCommand } from "../bun-command"

describe("bunCommand", () => {
  it("runs shadcn through this Linux Bun executable instead of a PATH launcher", () => {
    const command = bunCommand("x", "shadcn@4.8.0", "--version")

    expect(command).toEqual([process.execPath, "x", "shadcn@4.8.0", "--version"])
    expect(command).not.toContain("bunx")
    expect(command).not.toContain("npx")
  })
})
