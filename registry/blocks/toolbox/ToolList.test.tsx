import { IconTools } from "@tabler/icons-react"
import type { ComponentProps, ReactNode } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it, vi } from "vitest"

type ButtonProps = ComponentProps<"button"> & {
  readonly size?: string
  readonly variant?: string
}

vi.mock("@/components/ui/button", () => ({
  Button: ({ children, size: _size, variant: _variant, ...props }: ButtonProps) => (
    <button {...props}>{children}</button>
  ),
}))

vi.mock("@/components/ui/empty", () => ({
  Empty: ({ children }: { readonly children: ReactNode }) => <div>{children}</div>,
  EmptyDescription: ({ children }: { readonly children: ReactNode }) => <div>{children}</div>,
  EmptyHeader: ({ children }: { readonly children: ReactNode }) => <div>{children}</div>,
  EmptyMedia: ({ children }: { readonly children: ReactNode }) => <div>{children}</div>,
  EmptyTitle: ({ children }: { readonly children: ReactNode }) => <div>{children}</div>,
}))

vi.mock("@/components/ui/input-group", () => ({
  InputGroup: ({ children }: { readonly children: ReactNode }) => <div>{children}</div>,
  InputGroupAddon: ({ children }: { readonly children: ReactNode }) => <div>{children}</div>,
  InputGroupInput: (props: ComponentProps<"input">) => <input {...props} />,
}))

vi.mock("@/components/ui/toggle-group", () => ({
  ToggleGroup: ({ children }: { readonly children: ReactNode }) => <div>{children}</div>,
  ToggleGroupItem: ({ children, ...props }: ComponentProps<"button">) => (
    <button {...props}>{children}</button>
  ),
}))

vi.mock("@/lib/utils", () => ({
  cn: (...classes: Array<string | false | undefined>) => classes.filter(Boolean).join(" "),
}))

import { ToolList } from "./ToolList"

const labels = {
  title: "Tools",
  close: "Close",
  open: "Open",
  search: "Search tools…",
  tabs: { all: "All", favorites: "Favorites", recent: "Recent" },
  quickAccess: "Quick access",
  categories: "Categories",
  toolCount: (count: number) => `${count} tools`,
  empty: "No tools",
  favorite: (tool: string) => `Favorite ${tool}`,
  unfavorite: (tool: string) => `Unfavorite ${tool}`,
  back: "Back",
  parameters: "Parameters",
  inputLayer: "Input layer",
  distance: "Distance",
  distanceRequired: "Enter a buffer distance",
  parametersValid: "Parameters valid",
  completed: "Completed",
  run: (tool: string) => `Run ${tool}`,
}

function renderToolList(tab: "all" | "favorites" = "favorites") {
  return renderToStaticMarkup(
    <ToolList
      tools={[
        {
          id: "buffer",
          label: "Buffer analysis",
          description: "Create a buffer around selected features",
          group: "Analysis",
          icon: IconTools,
        },
      ]}
      favoriteIds={new Set()}
      tab={tab}
      query=""
      labels={labels}
      onTabChange={() => {}}
      onQueryChange={() => {}}
      onFavoriteChange={() => {}}
      onOpenTool={() => {}}
      onOpenChange={() => {}}
    />,
  )
}

describe("ToolList", () => {
  it("uses a neutral hover treatment for ordinary tool rows", () => {
    const html = renderToolList()

    expect(html).toContain(
      'class="flex items-center gap-2 border border-transparent px-2 py-1.5 transition-colors hover:bg-accent/50 motion-reduce:transition-none"',
    )
    expect(html).not.toContain("hover:border-primary")
  })

  it("keeps compact toolbox content discoverable and design-token aligned", () => {
    const html = renderToolList("all")

    expect(html).toContain("<h2")
    expect(html).toContain("grid-cols-1")
    expect(html).toContain("sm:grid-cols-2")
    expect(html).toContain('name="toolbox-search"')
    expect(html).toContain('autoComplete="off"')
    expect(html).toContain('title="Buffer analysis"')
    expect(html).toContain('title="Create a buffer around selected features"')
    expect(html).toContain('title="Analysis · Create a buffer around selected features"')
    expect(html).toContain("hover:border-primary")
    expect(html).toContain("hover:bg-primary/5")
    expect(html).toContain("tnum")
    expect(html.match(/motion-reduce:transition-none/g)).toHaveLength(2)
    expect(html).toContain(
      'class="flex size-7 items-center justify-center bg-muted text-muted-foreground"',
    )
    expect(html).not.toContain(
      'class="flex size-7 items-center justify-center bg-primary text-primary-foreground"',
    )
    expect(html).not.toContain(
      'class="flex size-7 items-center justify-center bg-primary/10 text-primary"',
    )
  })
})
