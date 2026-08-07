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

describe("ToolList", () => {
  it("uses a neutral hover treatment for ordinary tool rows", () => {
    const html = renderToStaticMarkup(
      <ToolList
        tools={[
          {
            id: "buffer",
            label: "Buffer",
            description: "Create a buffer around features",
            group: "Analysis",
            icon: IconTools,
          },
        ]}
        favoriteIds={new Set()}
        tab="favorites"
        query=""
        labels={{
          title: "Tools",
          close: "Close",
          open: "Open",
          search: "Search tools",
          tabs: { all: "All", favorites: "Favorites", recent: "Recent" },
          quickAccess: "Quick access",
          categories: "Categories",
          toolCount: (count) => `${count} tools`,
          empty: "No tools",
          favorite: (tool) => `Favorite ${tool}`,
          unfavorite: (tool) => `Unfavorite ${tool}`,
          back: "Back",
          parameters: "Parameters",
          inputLayer: "Input layer",
          distance: "Distance",
          parametersValid: "Parameters valid",
          completed: "Completed",
          run: (tool) => `Run ${tool}`,
        }}
        onTabChange={() => {}}
        onQueryChange={() => {}}
        onFavoriteChange={() => {}}
        onOpenTool={() => {}}
        onOpenChange={() => {}}
      />,
    )

    expect(html).toContain(
      'class="flex items-center gap-2 border border-transparent px-2 py-1.5 transition-colors hover:bg-accent/50"',
    )
    expect(html).not.toContain("hover:border-primary")
  })
})
