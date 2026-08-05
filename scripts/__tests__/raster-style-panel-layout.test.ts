import { readFile } from "node:fs/promises"
import { expect, it } from "vitest"

it("gives raster colormap options balanced vertical spacing", async () => {
  const picker = await readFile("registry/blocks/raster-style-panel/ColormapPicker.tsx", "utf8")

  expect(picker).toContain('cn("grid gap-1"')
  expect(picker).toContain("flex h-auto cursor-pointer flex-col gap-1")
  expect(picker).toContain("border border-transparent p-1")
})
