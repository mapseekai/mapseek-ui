import { readFile } from "node:fs/promises"
import { resolve } from "node:path"
import { describe, expect, it } from "vitest"

describe("ToggleConfigPopover", () => {
  it("uses the shared square Switch for its header control", async () => {
    const source = await readFile(resolve(import.meta.dirname, "ToggleConfigPopover.tsx"), "utf8")
    const header = source.slice(
      source.indexOf("<header"),
      source.indexOf("</header>") + "</header>".length,
    )

    expect(source).toContain('import { Switch } from "@/components/ui/switch"')
    expect(header).toContain("<Switch")
    expect(header).toContain('variant="square"')
    expect(header).not.toContain('role="switch"')
    expect(header).not.toContain("h-4 w-7")
  })
})
