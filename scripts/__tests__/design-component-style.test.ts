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

it("keeps table headers on the full muted surface", async () => {
  const table = await readComponent("table")

  expect(table).toContain("[&_tr]:bg-muted")
  expect(table).not.toContain("[&_tr]:bg-muted/45")
})

it("keeps dialog titles on the headline-md typography token", async () => {
  const dialog = await readComponent("dialog")

  expect(dialog).toContain('className={cn("font-heading text-headline-md", className)}')
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
  expect(theme).toContain('"--focus-ring-width": "3px"')
  expect(theme).toContain('"--input-surface": "transparent"')
  expect(theme).toContain('"--input-surface": "oklch(1 0 0 / 4.5%)"')
})
