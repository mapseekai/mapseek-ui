import { fileURLToPath } from "node:url"
import { describe, expect, it } from "vitest"
import { loadCatalog } from "../registry-model"

const foundationalPrimitives = [
  "accordion", "avatar", "badge", "button", "card", "collapsible", "dialog",
  "empty", "icon-button", "label", "separator", "skeleton", "tooltip",
] as const

const inputAndSelectionPrimitives = [
  "checkbox", "combobox", "command", "field", "input-group", "input",
  "pagination", "popover", "progress", "select", "slider", "switch",
  "tabs", "textarea", "toggle-group", "toggle",
] as const

const inputAndSelectionDependencies = {
  checkbox: ["@mapseek/utils"],
  combobox: ["@mapseek/input-group", "@mapseek/utils"],
  command: ["@mapseek/dialog", "@mapseek/input-group", "@mapseek/utils"],
  field: ["@mapseek/label", "@mapseek/separator", "@mapseek/utils"],
  "input-group": ["@mapseek/button", "@mapseek/input", "@mapseek/textarea", "@mapseek/utils"],
  input: ["@mapseek/utils"],
  pagination: ["@mapseek/button", "@mapseek/utils"],
  popover: ["@mapseek/utils"],
  progress: ["@mapseek/utils"],
  select: ["@mapseek/utils"],
  slider: ["@mapseek/utils"],
  switch: ["@mapseek/utils"],
  tabs: ["@mapseek/utils"],
  textarea: ["@mapseek/utils"],
  "toggle-group": ["@mapseek/toggle", "@mapseek/utils"],
  toggle: ["@mapseek/utils"],
} as const

const inputAndSelectionNpmDependencies = {
  checkbox: ["@base-ui/react", "@tabler/icons-react"],
  combobox: ["@base-ui/react", "@tabler/icons-react"],
  command: ["@tabler/icons-react", "cmdk"],
  field: ["class-variance-authority"],
  "input-group": ["class-variance-authority"],
  input: ["@base-ui/react"],
  pagination: ["@tabler/icons-react"],
  popover: ["@base-ui/react"],
  progress: ["@base-ui/react"],
  select: ["@base-ui/react", "@tabler/icons-react", "class-variance-authority"],
  slider: ["@base-ui/react"],
  switch: ["@base-ui/react"],
  tabs: ["@base-ui/react", "class-variance-authority"],
  textarea: [],
  "toggle-group": ["@base-ui/react", "class-variance-authority"],
  toggle: ["@base-ui/react", "class-variance-authority"],
} as const

const repoRoot = fileURLToPath(new URL("../..", import.meta.url))

describe("foundational primitive inventory", () => {
  it("registers every foundational primitive as portable themed UI", async () => {
    const items = await loadCatalog(repoRoot)
    const itemsByName = new Map(items.map((item) => [item.name, item]))

    for (const name of foundationalPrimitives) {
      const item = itemsByName.get(name)
      expect(item, `missing ${name}`).toBeDefined()
      expect(item?.type).toBe("registry:ui")
      expect(item?.files).toHaveLength(1)
      expect(item?.files[0]?.target).toMatch(/^@ui\//)
      expect(item?.registryDependencies).toContain("@mapseek/theme")
    }
  })
})

describe("input and selection primitive inventory", () => {
  it("registers every input and selection primitive with exact dependencies", async () => {
    const items = await loadCatalog(repoRoot)
    const itemsByName = new Map(items.map((item) => [item.name, item]))

    for (const name of inputAndSelectionPrimitives) {
      const item = itemsByName.get(name)
      expect(item, `missing ${name}`).toBeDefined()
      expect(item?.type).toBe("registry:ui")
      expect(item?.files).toHaveLength(1)
      expect(item?.files[0]?.target).toMatch(/^@ui\//)
      expect(item?.registryDependencies).toEqual([
        "@mapseek/theme",
        ...inputAndSelectionDependencies[name],
      ])
      expect(item?.dependencies ?? []).toEqual(inputAndSelectionNpmDependencies[name])
    }
  })
})
