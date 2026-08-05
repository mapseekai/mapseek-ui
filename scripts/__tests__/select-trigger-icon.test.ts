import { readFile } from "node:fs/promises"
import { expect, it } from "vitest"

it("uses compact lightweight icons throughout Select", async () => {
  const select = await readFile("registry/ui/select.tsx", "utf8")

  expect(select).toMatch(/<IconSelector[\s\S]*size=\{16\}[\s\S]*stroke=\{1\.5\}/)
  expect(select).toContain("<IconCheck size={16} stroke={1.5} />")
  expect(select).toContain("<IconChevronUp size={16} stroke={1.5} />")
  expect(select).toContain("<IconChevronDown size={16} stroke={1.5} />")
})
