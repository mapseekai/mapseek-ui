import { access } from "node:fs/promises"
import { expect, it } from "vitest"

it("publishes only the canonical toolbox source module", async () => {
  await expect(access("registry/blocks/toolbox/Toolbox.tsx")).resolves.toBeUndefined()
  await expect(access("registry/blocks/loom-toolbox")).rejects.toThrow()

  const modulePath = "../../registry/blocks/toolbox/index.ts"
  const toolboxModule = await import(modulePath)

  expect(toolboxModule.Toolbox).toBeTypeOf("function")
  expect(toolboxModule.TOOLBOX_LABELS_EN.title).toBe("Toolbox")
  expect(toolboxModule.TOOLBOX_LABELS_ZH_CN.title).toBe("工具箱")
})
