import { describe, expect, it } from "vitest"
import { loadCatalog } from "../registry-model"

describe("toolbar complete rename", () => {
  it("publishes only the Toolbar registry contract", async () => {
    const catalog = await loadCatalog(process.cwd())
    const toolbar = catalog.find((item) => item.name === "toolbar")

    expect(toolbar).toEqual({
      name: "toolbar",
      type: "registry:block",
      registryDependencies: ["@mapseek/badge", "@mapseek/button", "@mapseek/utils"],
      files: [
        {
          path: "registry/blocks/toolbar/Toolbar.tsx",
          type: "registry:block",
          target: "@components/blocks/toolbar/Toolbar.tsx",
        },
        {
          path: "registry/blocks/toolbar/index.ts",
          type: "registry:block",
          target: "@components/blocks/toolbar/index.ts",
        },
        {
          path: "registry/blocks/toolbar/labels.ts",
          type: "registry:block",
          target: "@components/blocks/toolbar/labels.ts",
        },
        {
          path: "registry/blocks/toolbar/types.ts",
          type: "registry:block",
          target: "@components/blocks/toolbar/types.ts",
        },
      ],
      dependencies: ["@tabler/icons-react"],
    })
    expect(catalog.some((item) => item.name === "loom-toolbar")).toBe(false)
  })
})
