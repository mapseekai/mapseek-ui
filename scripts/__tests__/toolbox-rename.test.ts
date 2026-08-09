import { access } from "node:fs/promises"
import { expect, it } from "vitest"
import { blockShowcases } from "../../showcase/src/showcases/block-catalog"
import { requiredRegistryDocs } from "../docs-required-registry-docs"
import { loadCatalog } from "../registry-model"

it("publishes only the canonical toolbox source module", async () => {
  await expect(access("registry/blocks/toolbox/Toolbox.tsx")).resolves.toBeUndefined()
  await expect(access("registry/blocks/loom-toolbox")).rejects.toThrow()

  const modulePath = "../../registry/blocks/toolbox/index.ts"
  const toolboxModule = await import(modulePath)

  expect(toolboxModule.Toolbox).toBeTypeOf("function")
  expect(toolboxModule.TOOLBOX_LABELS_EN.title).toBe("Toolbox")
  expect(toolboxModule.TOOLBOX_LABELS_ZH_CN.title).toBe("工具箱")
})

it("uses toolbox as the only integrated registry and showcase identity", async () => {
  const catalog = await loadCatalog(process.cwd())
  const registryNames = catalog.map((item) => item.name)
  const showcaseIds = blockShowcases.map((entry) => entry.id)

  expect(registryNames).toContain("toolbox")
  expect(registryNames).not.toContain("loom-toolbox")
  expect(requiredRegistryDocs.has("toolbox")).toBe(true)
  expect(requiredRegistryDocs.has("loom-toolbox")).toBe(false)
  expect(showcaseIds).toContain("toolbox")
  expect(showcaseIds).not.toContain("loom-toolbox")

  const entry = blockShowcases.find((candidate) => candidate.id === "toolbox")
  const module = await entry?.loadModule()
  expect(module?.ToolboxDemo).toBeTypeOf("function")
})
