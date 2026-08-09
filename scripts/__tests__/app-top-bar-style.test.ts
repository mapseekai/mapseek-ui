import { readFile } from "node:fs/promises"
import { expect, it } from "vitest"

it("keeps the AppTopBar save action on the semantic body control scale", async () => {
  const source = await readFile("registry/blocks/app-top-bar/AppTopBar.tsx", "utf8")

  expect(source).toContain("size={sizeConfig.saveButtonSize}")
  expect(source).toContain(
    'className="m-0 rounded-none border-primary bg-primary text-body-md-medium text-primary-foreground hover:bg-primary/90"',
  )
})
