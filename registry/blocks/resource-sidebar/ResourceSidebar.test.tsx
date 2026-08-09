import type { ComponentProps } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it, vi } from "vitest"

vi.mock("@/components/ui/button", () => ({
  Button: ({
    variant: _variant,
    size: _size,
    ...props
  }: ComponentProps<"button"> & {
    variant?: string
    size?: string
  }) => <button {...props} />,
}))
vi.mock("@/components/ui/tooltip", () => ({
  Tooltip: "div",
  TooltipContent: "div",
  TooltipTrigger: "div",
}))
vi.mock("@/lib/utils", () => ({
  cn: (...values: Array<string | false | null | undefined>) => values.filter(Boolean).join(" "),
}))

import { ResourceSidebar } from "./ResourceSidebar"

const labels = {
  typeSection: "Resource type",
  spriteGroup: "Graphics",
  icon: "Icons",
  sprite: "Sprites",
  font: "Fonts",
  categoriesSection: "Categories",
  allItems: "All icons",
  newCategory: "New category",
  rename: "Rename",
  remove: "Remove",
}

function renderSidebar() {
  return renderToStaticMarkup(
    <ResourceSidebar
      tab="icon"
      onTabChange={() => {}}
      tabCounts={{ icon: 12, sprite: 3, font: 2 }}
      categories={[
        { id: "maps", label: "Maps", count: 4, isDefault: true },
        {
          id: "long-category",
          label: "A category name that must truncate",
          count: 1234,
          isDefault: false,
        },
      ]}
      totalCount={12}
      activeCat="maps"
      onSelectCat={() => {}}
      onRenameCategory={() => {}}
      onRemoveCategory={() => {}}
      onCreateCategory={() => {}}
      labels={labels}
    />,
  )
}

function buttonAttributes(html: string, label: string) {
  const button = [...html.matchAll(/<button\b([^>]*)>([\s\S]*?)<\/button>/g)].find((match) =>
    match[2].includes(label),
  )
  return button?.[1] ?? ""
}

describe("ResourceSidebar selected rows", () => {
  it("exposes selected type and category state to assistive technology", () => {
    const html = renderSidebar()

    expect(buttonAttributes(html, "Icons")).toContain('aria-pressed="true"')
    expect(buttonAttributes(html, "Maps")).toContain('aria-pressed="true"')
    expect(buttonAttributes(html, "Sprites")).toContain('aria-pressed="false"')
  })

  it("reserves the persistent edge for the selected top-level type", () => {
    const html = renderSidebar()
    const iconsButton = buttonAttributes(html, "Icons").match(/class="([^"]*)"/)
    const mapsButton = buttonAttributes(html, "Maps").match(/class="([^"]*)"/)

    expect(iconsButton?.[1].split(/\s+/)).toEqual(
      expect.arrayContaining(["before:w-0.5", "before:bg-primary", "before:opacity-100"]),
    )
    expect(mapsButton?.[1].split(/\s+/)).toContain("text-body-md-medium")
    expect(mapsButton?.[1]).not.toContain("before:")
  })
})

describe("ResourceSidebar design contract", () => {
  it("uses standard 32px rows and tabular numerals for every count", () => {
    const html = renderSidebar()

    expect(html).not.toContain("h-[34px]")
    expect(html.match(/\bh-8\b/g)).toHaveLength(6)
    expect(html.match(/\btnum\b/g)).toHaveLength(6)
  })

  it("keeps truncated category labels discoverable and actions keyboard-reachable", () => {
    const html = renderSidebar()

    expect(html).toContain('title="A category name that must truncate"')
    expect(html).toContain("group-focus-within/cat:hidden")
    expect(html).toContain("group-focus-within/cat:flex")
  })

  it("uses the shared Separator primitive for section dividers", () => {
    const html = renderSidebar()

    expect(html.match(/data-slot="separator"/g)).toHaveLength(2)
  })
})
