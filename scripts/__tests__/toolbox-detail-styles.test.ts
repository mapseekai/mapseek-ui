import { readFile } from "node:fs/promises"
import { expect, it } from "vitest"

it("keeps the toolbox back action free of hover backgrounds", async () => {
  const detail = await readFile("registry/blocks/toolbox/ToolDetail.tsx", "utf8")

  expect(detail).toMatch(
    /variant="link"[\s\S]*className="[^"]*hover:no-underline"[\s\S]*onClick=\{onBack\}/,
  )
})
