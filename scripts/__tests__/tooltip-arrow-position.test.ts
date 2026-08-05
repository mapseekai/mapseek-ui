import { readFile } from "node:fs/promises"
import { expect, it } from "vitest"

it("uses Base UI's clipped arrow geometry for every tooltip placement", async () => {
  const source = await readFile("registry/ui/tooltip.tsx", "utf8")

  expect(source).toContain('data-slot="tooltip-arrow"')
  expect(source).toContain("h-1.5 w-3 overflow-clip")
  expect(source).toContain("before:size-[8.485px]")
  expect(source).toContain("before:rotate-45")
  expect(source).toContain("data-[side=top]:-bottom-1.5")
  expect(source).toContain("data-[side=bottom]:-top-1.5")
  expect(source).toContain("data-[side=left]:-right-[9px]")
  expect(source).toContain("data-[side=right]:-left-[9px]")
})
