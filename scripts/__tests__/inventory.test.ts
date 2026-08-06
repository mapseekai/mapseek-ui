import { readFile } from "node:fs/promises"
import { fileURLToPath } from "node:url"
import { describe, expect, it } from "vitest"
import { loadCatalog } from "../registry-model"

const foundationalPrimitives = [
  "accordion",
  "avatar",
  "alert",
  "badge",
  "button",
  "copy-button",
  "card",
  "card-tabs",
  "collapsible",
  "dialog",
  "empty",
  "icon-button",
  "label",
  "separator",
  "skeleton",
  "tooltip",
] as const

const inputAndSelectionPrimitives = [
  "calendar",
  "checkbox",
  "color-input",
  "combobox",
  "command",
  "field",
  "input-group",
  "input",
  "input-number",
  "pagination",
  "popover",
  "progress",
  "radio-group",
  "button-radio-group",
  "select",
  "slider",
  "switch",
  "tabs",
  "textarea",
  "toggle-group",
  "toggle",
] as const

const overlayDataAndFeedbackPrimitives = [
  "chart",
  "confirm-dialog",
  "context-menu",
  "dropdown-menu",
  "json-viewer",
  "sheet",
  "sonner",
  "table",
  "alert-dialog",
  "aspect-ratio",
  "breadcrumb",
  "button-group",
  "hover-card",
  "item",
  "kbd",
  "menubar",
  "native-select",
  "navigation-menu",
  "scroll-area",
  "spinner",
] as const

const overlayDataAndFeedbackDependencies = {
  chart: ["@mapseek/utils"],
  "confirm-dialog": ["@mapseek/button", "@mapseek/dialog", "@mapseek/utils"],
  "context-menu": ["@mapseek/utils"],
  "dropdown-menu": ["@mapseek/utils"],
  "json-viewer": ["@mapseek/button", "@mapseek/collapsible", "@mapseek/utils"],
  sheet: ["@mapseek/utils"],
  sonner: [],
  table: ["@mapseek/utils"],
  "alert-dialog": ["@mapseek/utils", "@mapseek/button"],
  "aspect-ratio": ["@mapseek/utils"],
  breadcrumb: ["@mapseek/utils"],
  "button-group": ["@mapseek/utils", "@mapseek/separator"],
  "hover-card": ["@mapseek/utils"],
  item: ["@mapseek/utils", "@mapseek/separator"],
  kbd: ["@mapseek/utils"],
  menubar: ["@mapseek/utils", "@mapseek/dropdown-menu"],
  "native-select": ["@mapseek/utils"],
  "navigation-menu": ["@mapseek/utils"],
  "scroll-area": ["@mapseek/utils"],
  spinner: ["@mapseek/utils"],
} as const

const overlayDataAndFeedbackNpmDependencies = {
  chart: ["recharts"],
  "confirm-dialog": ["@tabler/icons-react"],
  "context-menu": ["@base-ui/react", "@tabler/icons-react"],
  "dropdown-menu": ["@base-ui/react", "@tabler/icons-react"],
  "json-viewer": ["@tabler/icons-react"],
  sheet: ["@base-ui/react", "@tabler/icons-react", "class-variance-authority"],
  sonner: ["@tabler/icons-react", "next-themes", "sonner"],
  table: [],
  "alert-dialog": ["@base-ui/react"],
  "aspect-ratio": [],
  breadcrumb: ["@tabler/icons-react"],
  "button-group": ["class-variance-authority"],
  "hover-card": ["@base-ui/react"],
  item: ["class-variance-authority"],
  kbd: [],
  menubar: ["@base-ui/react"],
  "native-select": ["@tabler/icons-react"],
  "navigation-menu": ["@base-ui/react", "@tabler/icons-react"],
  "scroll-area": ["@base-ui/react"],
  spinner: ["@tabler/icons-react"],
} as const

const basePrimitives = [
  ...foundationalPrimitives,
  ...inputAndSelectionPrimitives,
  ...overlayDataAndFeedbackPrimitives,
] as const

const inputAndSelectionDependencies = {
  calendar: ["@mapseek/button", "@mapseek/utils"],
  checkbox: ["@mapseek/utils"],
  "color-input": [
    "@mapseek/button",
    "@mapseek/input",
    "@mapseek/popover",
    "@mapseek/select",
    "@mapseek/utils",
  ],
  combobox: ["@mapseek/input-group", "@mapseek/utils"],
  command: ["@mapseek/dialog", "@mapseek/input-group", "@mapseek/utils"],
  field: ["@mapseek/label", "@mapseek/separator", "@mapseek/utils"],
  "input-group": ["@mapseek/button", "@mapseek/input", "@mapseek/textarea", "@mapseek/utils"],
  input: ["@mapseek/utils"],
  "input-number": ["@mapseek/utils"],
  pagination: ["@mapseek/button", "@mapseek/utils"],
  popover: ["@mapseek/utils"],
  progress: ["@mapseek/utils"],
  "radio-group": ["@mapseek/utils"],
  "button-radio-group": ["@mapseek/utils"],
  select: ["@mapseek/utils"],
  slider: ["@mapseek/utils"],
  switch: ["@mapseek/utils"],
  tabs: ["@mapseek/utils"],
  textarea: ["@mapseek/utils"],
  "toggle-group": ["@mapseek/toggle", "@mapseek/utils"],
  toggle: ["@mapseek/utils"],
} as const

const inputAndSelectionNpmDependencies = {
  calendar: ["@tabler/icons-react", "date-fns", "react-day-picker"],
  checkbox: ["@base-ui/react", "@tabler/icons-react"],
  "color-input": ["@base-ui/react", "@tabler/icons-react", "color"],
  combobox: ["@base-ui/react", "@tabler/icons-react"],
  command: ["@tabler/icons-react", "cmdk"],
  field: ["class-variance-authority"],
  "input-group": ["@base-ui/react", "class-variance-authority"],
  input: ["@base-ui/react"],
  "input-number": ["@base-ui/react", "@tabler/icons-react"],
  pagination: ["@tabler/icons-react"],
  popover: ["@base-ui/react"],
  progress: ["@base-ui/react"],
  "radio-group": ["@base-ui/react", "@tabler/icons-react"],
  "button-radio-group": ["@base-ui/react"],
  select: ["@base-ui/react", "@tabler/icons-react", "class-variance-authority"],
  slider: ["@base-ui/react"],
  switch: ["@base-ui/react"],
  tabs: ["@base-ui/react", "class-variance-authority"],
  textarea: [],
  "toggle-group": ["@base-ui/react", "class-variance-authority"],
  toggle: ["@base-ui/react", "class-variance-authority"],
} as const

const applicationShellStatusAndResourceBlocks = [
  "app-top-bar",
  "layout",
  "loading-screen",
  "product-logo",
  "placeholder-glyph",
  "notification-center",
  "processing-timeline",
  "service-status",
  "service-endpoint-row",
  "resource-status",
  "resource-grid",
  "resource-sidebar",
  "resource-detail-drawer",
  "linked-ref-list",
] as const

const applicationShellStatusAndResourceDependencies = {
  "app-top-bar": ["@mapseek/button", "@mapseek/tooltip", "@mapseek/utils"],
  layout: ["@mapseek/label", "@mapseek/utils"],
  "loading-screen": ["@mapseek/utils", "@mapseek/labels"],
  "product-logo": ["@mapseek/utils"],
  "placeholder-glyph": ["@mapseek/utils"],
  "notification-center": [
    "@mapseek/button",
    "@mapseek/dropdown-menu",
    "@mapseek/empty",
    "@mapseek/icon-button",
    "@mapseek/skeleton",
    "@mapseek/utils",
  ],
  "processing-timeline": [
    "@mapseek/badge",
    "@mapseek/button",
    "@mapseek/copy-button",
    "@mapseek/utils",
  ],
  "service-status": ["@mapseek/switch", "@mapseek/utils", "@mapseek/labels"],
  "service-endpoint-row": [
    "@mapseek/copy-button",
    "@mapseek/icon-button",
    "@mapseek/input-group",
    "@mapseek/tooltip",
  ],
  "resource-status": ["@mapseek/utils"],
  "resource-grid": [
    "@mapseek/badge",
    "@mapseek/button",
    "@mapseek/checkbox",
    "@mapseek/utils",
    "@mapseek/placeholder-glyph",
    "@mapseek/labels",
  ],
  "resource-sidebar": ["@mapseek/button", "@mapseek/tooltip", "@mapseek/utils"],
  "resource-detail-drawer": [
    "@mapseek/button",
    "@mapseek/checkbox",
    "@mapseek/sheet",
    "@mapseek/svg-data-uri",
    "@mapseek/textarea",
    "@mapseek/utils",
    "@mapseek/placeholder-glyph",
    "@mapseek/resource-grid",
  ],
  "linked-ref-list": [
    "@mapseek/card-tabs",
    "@mapseek/icon-button",
    "@mapseek/tooltip",
    "@mapseek/utils",
  ],
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

    expect(itemsByName.get("collapsible")?.dependencies).toEqual(["@base-ui/react"])
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
      expect(item?.files).toHaveLength(name === "color-input" ? 4 : 1)
      expect(item?.files.every((file) => file.target?.startsWith("@ui/"))).toBe(true)
      expect(item?.registryDependencies).toEqual([
        "@mapseek/theme",
        ...inputAndSelectionDependencies[name],
      ])
      expect(item?.dependencies ?? []).toEqual(inputAndSelectionNpmDependencies[name])
    }
  })
})

describe("orientation-dependent primitive styles", () => {
  it("uses the generated shadcn orientation variants", async () => {
    const files = ["separator", "slider", "tabs", "toggle-group"]

    for (const file of files) {
      const source = await readFile(`${repoRoot}/registry/ui/${file}.tsx`, "utf8")

      expect(source, `${file} must use shadcn orientation variants`).not.toContain(
        "data-[orientation=",
      )
      expect(source, `${file} must include an orientation variant`).toMatch(
        /(?:group-)?data-(?:horizontal|vertical)/,
      )
    }
  })
})

describe("base primitive inventory", () => {
  it("registers the complete ordered base catalog", async () => {
    const items = await loadCatalog(repoRoot)

    expect(items.filter((item) => item.type === "registry:ui").map((item) => item.name)).toEqual(
      basePrimitives,
    )
  })
})

describe("overlay, data, and feedback primitive inventory", () => {
  it("registers every primitive with exact registry and npm dependencies", async () => {
    const items = await loadCatalog(repoRoot)
    const itemsByName = new Map(items.map((item) => [item.name, item]))

    for (const name of overlayDataAndFeedbackPrimitives) {
      const item = itemsByName.get(name)
      expect(item, `missing ${name}`).toBeDefined()
      expect(item?.type).toBe("registry:ui")
      expect(item?.files).toEqual([
        { path: `registry/ui/${name}.tsx`, type: "registry:ui", target: `@ui/${name}.tsx` },
      ])
      expect(item?.registryDependencies).toEqual([
        "@mapseek/theme",
        ...overlayDataAndFeedbackDependencies[name],
      ])
      expect(item?.dependencies ?? []).toEqual(overlayDataAndFeedbackNpmDependencies[name])
    }
  })
})

describe("application shell, status, and resource block inventory", () => {
  it("registers every block atomically with exact dependencies", async () => {
    const itemsByName = new Map((await loadCatalog(repoRoot)).map((item) => [item.name, item]))

    for (const name of applicationShellStatusAndResourceBlocks) {
      const item = itemsByName.get(name)
      expect(item, `missing ${name}`).toBeDefined()
      expect(item?.type).toBe("registry:block")
      expect(item?.files.length).toBeGreaterThan(0)
      expect(
        item?.files.every((file) => file.target?.startsWith(`@components/blocks/${name}/`)),
      ).toBe(true)
      expect(item?.registryDependencies).toEqual(
        applicationShellStatusAndResourceDependencies[name],
      )
    }
  })
})
