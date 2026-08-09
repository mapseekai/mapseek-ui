import { readFile } from "node:fs/promises"
import { expect, it } from "vitest"

const readComponent = (name: string) => readFile(`registry/ui/${name}.tsx`, "utf8")

it("drives the original transparent input treatment from the input-surface token", async () => {
  const [input, textarea, inputGroup] = await Promise.all([
    readComponent("input"),
    readComponent("textarea"),
    readComponent("input-group"),
  ])

  expect(input).toContain("border border-input bg-input-surface px-2.5")
  expect(textarea).toContain("border border-input bg-input-surface px-2.5")
  expect(inputGroup).toContain("border border-input bg-input-surface p-0")

  for (const source of [input, textarea, inputGroup]) {
    expect(source).not.toContain("dark:bg-input/30")
  }
})

it("keeps keyboard focus rings at the three-pixel design token", async () => {
  const components = await Promise.all(
    ["accordion", "button", "checkbox", "input", "input-group", "switch", "textarea"].map(
      readComponent,
    ),
  )

  for (const source of components) {
    expect(source).toContain("ring-(length:--focus-ring-width)")
    expect(source).not.toContain("ring-[length:var(--focus-ring-width)]")
  }

  const slider = await readComponent("slider")
  expect(slider).toContain("has-[:focus-visible]:ring-(length:--focus-ring-width)")
})

it("uses a 20% primary ring for every keyboard focus treatment", async () => {
  const focusRingPaths = [
    "registry/ui/accordion.tsx",
    "registry/ui/badge.tsx",
    "registry/ui/button-radio-group.tsx",
    "registry/ui/button.tsx",
    "registry/ui/calendar.tsx",
    "registry/ui/checkbox.tsx",
    "registry/ui/item.tsx",
    "registry/ui/navigation-menu.tsx",
    "registry/ui/radio-group.tsx",
    "registry/ui/scroll-area.tsx",
    "registry/ui/slider.tsx",
    "registry/ui/switch.tsx",
    "registry/ui/tabs.tsx",
    "registry/ui/toggle.tsx",
    "registry/blocks/attr-table/attr-table-sheet.tsx",
  ]
  const sources = await Promise.all(focusRingPaths.map((path) => readFile(path, "utf8")))

  for (const source of sources) {
    expect(source).toContain("ring-ring/20")
    expect(source).not.toContain("ring-ring/50")
  }

  expect(sources.join("\n")).not.toMatch(/focus-visible:ring-ring(?=[\s"])/u)
})

it("keeps table headers on the full muted surface", async () => {
  const table = await readComponent("table")

  expect(table).toContain("[&_tr]:bg-muted")
  expect(table).not.toContain("[&_tr]:bg-muted/45")
})

it("keeps dialog titles on the headline-md typography token", async () => {
  const dialog = await readComponent("dialog")

  expect(dialog).toContain('className={cn("font-heading text-headline-md", className)}')
})

it("vertically centers confirm dialog title content in the legacy title row", async () => {
  const confirmDialog = await readComponent("confirm-dialog")

  expect(confirmDialog).toContain('className="flex min-h-5 items-center gap-2 leading-none"')
  expect(confirmDialog).not.toContain('className="inline-flex items-center gap-2 leading-none"')
})

it("maps button radio group sizes to the Button height scale", async () => {
  const [component, showcase] = await Promise.all([
    readComponent("button-radio-group"),
    readFile("showcase/src/showcases/ButtonRadioGroupShowcase.tsx", "utf8"),
  ])

  expect(component).toContain('size = "default"')
  expect(component).toContain("data-size={size}")
  expect(component).toContain("group-data-[size=xs]/button-radio-group:h-6")
  expect(component).toContain("group-data-[size=sm]/button-radio-group:h-7")
  expect(component).toContain("group-data-[size=default]/button-radio-group:h-8")
  expect(component).toContain("group-data-[size=lg]/button-radio-group:h-9")

  for (const size of ["xs", "sm", "default", "lg"]) {
    expect(showcase).toContain(`value: "${size}"`)
  }
  expect(showcase).toContain("size={size}")
})

it("keeps the dynamic button radio group example beside the size comparison", async () => {
  const showcase = await readFile("showcase/src/showcases/ButtonRadioGroupShowcase.tsx", "utf8")

  expect(showcase).toContain('data-demo="button-radio-group-controlled"')
  expect(showcase).toContain('data-demo-action="button-radio-group-add"')
  expect(showcase).toContain('data-demo="button-radio-group-sizes"')
})

it("provides a soft button radio selected state without replacing the default variant", async () => {
  const [component, showcase] = await Promise.all([
    readComponent("button-radio-group"),
    readFile("showcase/src/showcases/ButtonRadioGroupShowcase.tsx", "utf8"),
  ])

  expect(component).toContain('variant = "default"')
  expect(component).toContain("data-variant={variant}")
  expect(component).toContain(
    "group-data-[variant=soft]/button-radio-group:data-checked:bg-selection-bg",
  )
  expect(component).toContain(
    "group-data-[variant=soft]/button-radio-group:data-checked:text-primary",
  )
  expect(component).toContain(
    "group-data-[variant=soft]/button-radio-group:data-checked:hover:bg-selection-bg",
  )
  expect(component).not.toContain(
    "group-data-[variant=soft]/button-radio-group:data-checked:bg-primary/10",
  )
  expect(showcase).toContain('{ label: "Soft", value: "soft" }')
  expect(showcase).toContain("variant={variant}")
})

it("documents published grouped-button variants and destructive borders", async () => {
  const [design, designChinese] = await Promise.all([
    readFile("DESIGN.md", "utf8"),
    readFile("DESIGN.zh-CN.md", "utf8"),
  ])

  for (const source of [design, designChinese]) {
    expect(source).toContain("`button-radio-group`")
    expect(source).toContain("`soft`")
    expect(source).toContain("`button-group`")
    expect(source).toContain("`border-destructive/10`")
    expect(source).toContain("`hover:border-destructive/20`")
  }
})

it("exports component design tokens through the runtime theme", async () => {
  const theme = await readFile("registry/theme/registry.json", "utf8")

  expect(theme).toContain('"--color-input-surface": "var(--input-surface)"')
  expect(theme).toContain('"--text-headline-md": "var(--headline-md-font-size)"')
  expect(theme).toContain('"--text-headline-md--line-height": "var(--headline-md-line-height)"')
  expect(theme).toContain('"--text-headline-md--font-weight": "var(--headline-md-font-weight)"')
  expect(theme).toContain('"--headline-md-font-size": "15px"')
  expect(theme).toContain('"--headline-md-line-height": "1.25"')
  expect(theme).toContain('"--headline-md-font-weight": "600"')
  expect(theme).toContain('"--text-label-md": "var(--label-md-font-size)"')
  expect(theme).toContain('"--text-label-md--line-height": "var(--label-md-line-height)"')
  expect(theme).toContain('"--text-label-md--font-weight": "var(--label-md-font-weight)"')
  expect(theme).toContain('"--text-label-md--letter-spacing": "var(--label-md-letter-spacing)"')
  expect(theme).toContain('"--label-md-font-size": "10px"')
  expect(theme).toContain('"--label-md-font-weight": "500"')
  expect(theme).toContain('"--label-md-letter-spacing": "0.04em"')
  expect(theme).toContain('"--focus-ring-width": "3px"')
  expect(theme).toContain('"--input-surface": "transparent"')
  expect(theme).toContain('"--input-surface": "oklch(1 0 0 / 4.5%)"')
})

it("uses the label-md token for semantic taxonomy labels", async () => {
  const [
    select,
    combobox,
    attrField,
    pixelProbe,
    crsPicker,
    colormapEditor,
    resourceDrawer,
    resourceGrid,
    storageMeter,
    coordinateStatus,
    bandStat,
  ] = await Promise.all([
    readComponent("select"),
    readComponent("combobox"),
    readFile("registry/blocks/attr-inspector/attr-field.tsx", "utf8"),
    readFile("registry/blocks/pixel-probe/PixelProbe.tsx", "utf8"),
    readFile("registry/blocks/crs-picker/CrsPicker.tsx", "utf8"),
    readFile("registry/blocks/raster-style-panel/CustomColormapEditor.tsx", "utf8"),
    readFile("registry/blocks/resource-detail-drawer/ResourceDetailDrawer.tsx", "utf8"),
    readFile("registry/blocks/resource-grid/ResourceGrid.tsx", "utf8"),
    readFile("registry/blocks/storage-meter/StorageMeter.tsx", "utf8"),
    readFile("registry/blocks/map-coordinate-status/MapCoordinateStatus.tsx", "utf8"),
    readFile("registry/blocks/band-stat/BandStat.tsx", "utf8"),
  ])

  expect(select).toContain("px-2 py-1.5 text-label-md uppercase text-muted-foreground")
  expect(combobox).toContain("px-2 py-1.5 text-label-md uppercase text-muted-foreground")

  for (const source of [
    attrField,
    pixelProbe,
    crsPicker,
    colormapEditor,
    resourceDrawer,
    resourceGrid,
    storageMeter,
    coordinateStatus,
    bandStat,
  ]) {
    expect(source).toContain("text-label-md")
  }

  expect(attrField).not.toContain("text-label-md font-normal")
  expect(pixelProbe).not.toContain("text-label-md font-normal")
  expect(crsPicker).not.toContain("tracking-[0.07em]")
  expect(colormapEditor).not.toContain("tracking-[0.06em]")
  expect(resourceDrawer).not.toContain("tracking-[0.06em]")
})

it("keeps dialog and editor titles on their full typography tokens", async () => {
  const [alertDialog, sheet, styleEditorModal, resourceDrawer] = await Promise.all([
    readComponent("alert-dialog"),
    readComponent("sheet"),
    readFile("registry/blocks/style-editor-modal/StyleEditorModal.tsx", "utf8"),
    readFile("registry/blocks/resource-detail-drawer/ResourceDetailDrawer.tsx", "utf8"),
  ])

  expect(alertDialog).toContain('className={cn("text-headline-md", className)}')
  expect(sheet).toContain('className={cn("text-headline-md", className)}')
  expect(styleEditorModal).toContain(
    '<DialogTitle\n            className="text-headline-lg"\n            data-wd-key=',
  )
  expect(resourceDrawer).toContain("text-data-display")
  expect(resourceDrawer).not.toContain("text-5xl")
})

it("uses semantic surfaces for slider thumb contrast in both themes", async () => {
  const slider = await readComponent("slider")

  expect(slider).toContain("border border-ring bg-background dark:bg-foreground")
  expect(slider).not.toContain("bg-white")
})

it("disables combobox popup transitions for reduced motion", async () => {
  const combobox = await readComponent("combobox")

  expect(combobox).toContain("motion-reduce:transition-none")
})

it("keeps long coordinate-system names compact while exposing their full value", async () => {
  const coordinateSystemCombobox = await readFile(
    "registry/blocks/coordinate-system-combobox/CoordinateSystemCombobox.tsx",
    "utf8",
  )

  expect(coordinateSystemCombobox).toContain("block truncate text-body-sm")
  expect(coordinateSystemCombobox).toContain("title={item.name}")
})
