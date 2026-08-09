import type { ComponentProps } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { expect, it, vi } from "vitest"

type ButtonProps = ComponentProps<"button"> & {
  readonly size?: string
  readonly variant?: string
}

vi.mock("@/components/ui/button", () => ({
  Button: ({ children, size: _size, variant: _variant, ...props }: ButtonProps) => (
    <button {...props}>{children}</button>
  ),
}))

vi.mock("@/lib/utils", () => ({
  cn: (...classes: Array<string | false | undefined>) => classes.filter(Boolean).join(" "),
}))

vi.mock("./ToolDetail", () => ({
  ToolDetail: () => <div>Tool detail</div>,
}))

vi.mock("./ToolList", () => ({
  ToolList: () => <div>Tool list</div>,
}))

import { LoomToolbox, type LoomToolboxProps } from "./LoomToolbox"

const openProps: LoomToolboxProps = {
  tools: [],
  favoriteIds: new Set(),
  recentIds: [],
  activeToolId: undefined,
  inputLayerName: "Land use",
  distance: "100",
  completed: false,
  open: true,
  tab: "all",
  query: "",
  onOpenChange: vi.fn(),
  onTabChange: vi.fn(),
  onQueryChange: vi.fn(),
  onFavoriteChange: vi.fn(),
  onOpenTool: vi.fn(),
  onDistanceChange: vi.fn(),
  onRun: vi.fn(),
}

it("uses the stable responsive toolbox panel width", () => {
  const html = renderToStaticMarkup(<LoomToolbox {...openProps} />)

  expect(html).toContain('data-slot="loom-toolbox"')
  expect(html).toContain("w-[360px]")
  expect(html).toContain("min-w-0")
  expect(html).toContain("max-w-full")
})
