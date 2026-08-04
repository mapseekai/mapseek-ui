import { readFile } from "node:fs/promises"
import { describe, expect, it } from "vitest"

async function blockRegistryItem(name: string) {
  const registry = JSON.parse(await readFile("registry/blocks/registry.json", "utf8")) as {
    items: Array<{ name: string; registryDependencies?: string[] }>
  }
  const item = registry.items.find((entry) => entry.name === name)
  if (!item) throw new Error(`Missing block registry item: ${name}`)
  return item
}

function namedExports(source: string): Set<string> {
  const names = new Set<string>()
  for (const match of source.matchAll(/\bexport\s+(?:function|const)\s+([A-Za-z0-9_]+)/g)) {
    names.add(match[1] ?? "")
  }
  for (const match of source.matchAll(/\bexport\s*\{([^}]+)\}/g)) {
    for (const name of (match[1] ?? "").split(",")) {
      const parts = name.trim().split(/\s+as\s+/)
      const exported = parts[1] ?? parts[0]
      if (exported) names.add(exported.trim())
    }
  }
  return names
}

describe("registry component composition", () => {
  it("renders one Base UI slider thumb for scalar values", async () => {
    const slider = await readFile("registry/ui/slider.tsx", "utf8")

    expect(slider).toContain(": [value ?? defaultValue ?? min]")
    expect(slider).toContain("key={thumb.key}")
    expect(slider).not.toContain(": [min, max]")
  })

  it("forwards the accessible title and description to CommandDialog", async () => {
    const command = await readFile("registry/ui/command.tsx", "utf8")

    expect(command).toContain("title={title}")
    expect(command).toContain("description={description}")
  })

  it("groups layer-style actions inside DropdownMenuGroup", async () => {
    const editor = await readFile("registry/blocks/layer-style-editor/LayerStyleEditor.tsx", "utf8")

    expect(editor).toContain("DropdownMenuGroup")
    expect(editor).toMatch(/<DropdownMenuGroup>[\s\S]*actions\.map[\s\S]*<\/DropdownMenuGroup>/)
  })

  it("composes schema forms with Field primitives", async () => {
    const schemaForm = await readFile("registry/blocks/schema-form/SchemaForm.tsx", "utf8")
    const registryItem = await blockRegistryItem("schema-form")

    expect(schemaForm).toContain("FieldGroup")
    expect(schemaForm).toContain("FieldSet")
    expect(schemaForm).toContain("FieldLabel")
    expect(schemaForm).not.toContain("@/components/ui/label")
    expect(registryItem.registryDependencies).toEqual(
      expect.arrayContaining(["@mapseek/field", "@mapseek/checkbox", "@mapseek/input"]),
    )
  })

  it("composes add-field forms with Field and ToggleGroup primitives", async () => {
    const addFieldForm = await readFile("registry/blocks/add-field-form/AddFieldForm.tsx", "utf8")
    const registryItem = await blockRegistryItem("add-field-form")

    expect(addFieldForm).toContain("FieldGroup")
    expect(addFieldForm).toContain("FieldSet")
    expect(addFieldForm).toContain("FieldLegend")
    expect(addFieldForm).toContain("ToggleGroup")
    expect(addFieldForm).not.toContain("const fieldLabel")
    expect(registryItem.registryDependencies).toEqual(
      expect.arrayContaining(["@mapseek/field", "@mapseek/toggle-group"]),
    )
  })

  it("composes loom toolbox detail with Separator Alert and Field", async () => {
    const toolDetail = await readFile("registry/blocks/loom-toolbox/ToolDetail.tsx", "utf8")
    const registryItem = await blockRegistryItem("loom-toolbox")

    expect(toolDetail).toContain("Separator")
    expect(toolDetail).toContain("Alert")
    expect(toolDetail).toContain("FieldGroup")
    expect(toolDetail).toContain("FieldLabel")
    expect(toolDetail).not.toContain("border-t border-border")
    expect(toolDetail).not.toContain("bg-primary/10")
    expect(registryItem.registryDependencies).toEqual(
      expect.arrayContaining(["@mapseek/alert", "@mapseek/field", "@mapseek/separator"]),
    )
  })

  it("uses Empty for loom toolbox and layer-panel empty states", async () => {
    const [toolList, layerPanel] = await Promise.all([
      readFile("registry/blocks/loom-toolbox/ToolList.tsx", "utf8"),
      readFile("registry/blocks/loom-layer-panel/LoomLayerPanel.tsx", "utf8"),
    ])

    expect(toolList).toContain("Empty")
    expect(toolList).toContain("EmptyTitle")
    expect(toolList).not.toContain("text-center text-xs text-muted-foreground")
    expect(layerPanel).toContain("Empty")
    expect(layerPanel).toContain("EmptyTitle")
    expect(layerPanel).not.toContain("text-center text-xs text-muted-foreground")
  })

  it("exposes Select as standard named composition pieces", async () => {
    const select = await readFile("registry/ui/select.tsx", "utf8")
    const exports = namedExports(select)

    expect(Array.from(exports)).toEqual(
      expect.arrayContaining([
        "Select",
        "SelectTrigger",
        "SelectValue",
        "SelectContent",
        "SelectGroup",
        "SelectLabel",
        "SelectItem",
      ]),
    )
    expect(select).not.toContain("itemsCache")
    expect(select).not.toMatch(/Object\.assign\([\s\S]*\bItem\s*:/)
    expect(select).not.toMatch(/\bSelect\.Item\b/)
  })

  it("keeps Tooltip on explicit composition without content/asChild compatibility props", async () => {
    const tooltip = await readFile("registry/ui/tooltip.tsx", "utf8")
    const exports = namedExports(tooltip)

    expect(Array.from(exports)).toEqual(
      expect.arrayContaining(["Tooltip", "TooltipProvider", "TooltipTrigger", "TooltipContent"]),
    )
    expect(tooltip).not.toMatch(/\bcontent\??\s*:/)
    expect(tooltip).not.toMatch(/\basChild\??\s*:/)
    expect(tooltip).not.toMatch(/\bpopupClassName\??\s*:/)
  })
})
