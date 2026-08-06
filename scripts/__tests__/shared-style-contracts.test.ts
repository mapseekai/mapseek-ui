import { readFile } from "node:fs/promises"
import { resolve } from "node:path"
import { describe, expect, it } from "vitest"

const repoRoot = resolve(import.meta.dirname, "../..")

describe("shared theme surface contract", () => {
  it("uses the semantic foreground for solid primary surfaces in both themes", async () => {
    const registry = JSON.parse(
      await readFile(resolve(repoRoot, "registry/theme/registry.json"), "utf8"),
    ) as {
      items: Array<{
        cssVars: {
          light: Record<string, string>
          dark: Record<string, string>
        }
        css: Record<string, Record<string, Record<string, string>>>
      }>
    }
    const theme = registry.items[0]

    expect(theme?.cssVars.light["--primary-foreground"]).toBe("oklch(1 0 0)")
    expect(theme?.cssVars.dark["--primary-foreground"]).toBe("oklch(0.1500 0.0100 149)")
    expect(theme?.css["@layer utilities"]?.[".bg-primary"]?.color).toBe(
      "var(--primary-foreground)",
    )
  })
})

describe("shared dialog composition contract", () => {
  it("keeps content, header, and actions spaced by the shared primitive", async () => {
    const source = await readFile(resolve(repoRoot, "registry/ui/dialog.tsx"), "utf8")

    expect(source).toContain('title ? "gap-0 p-0" : "gap-4 p-4"')
    expect(source).toContain("max-w-[calc(100%-2rem)]")
    expect(source).toContain("flex flex-col gap-1 text-start")
    expect(source).toContain("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end")
  })
})
