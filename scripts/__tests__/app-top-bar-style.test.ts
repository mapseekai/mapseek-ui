import { readFile } from "node:fs/promises"
import { expect, it } from "vitest"

it("keeps the AppTopBar save action aligned and theme-bordered", async () => {
  const source = await readFile("registry/blocks/app-top-bar/AppTopBar.tsx", "utf8")

  expect(source).toContain(
    'className="m-0 h-[26px] gap-1.5 rounded-none border-primary bg-primary px-2.5',
  )
})
