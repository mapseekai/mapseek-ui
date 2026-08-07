import type { ComponentProps } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it, vi } from "vitest"

type ButtonProps = ComponentProps<"button"> & {
  readonly variant?: string
  readonly size?: string
}

vi.mock("@/components/ui/button", () => ({
  Button: ({ children, size: _size, variant: _variant, ...props }: ButtonProps) => (
    <button {...props}>{children}</button>
  ),
}))

vi.mock("@/lib/utils", () => ({
  cn: (...classes: Array<string | false | undefined>) => classes.filter(Boolean).join(" "),
}))

import { ColormapPicker } from "./ColormapPicker"

describe("ColormapPicker", () => {
  it("keeps the selected colormap surface and text on hover", () => {
    const html = renderToStaticMarkup(
      <ColormapPicker
        value="viridis"
        options={["viridis"]}
        customLabel="Custom"
        onChange={() => {}}
      />,
    )

    const selectedButton = html.match(/<button(?=[^>]*data-selected="true")[^>]*>/)?.[0] ?? ""

    expect(selectedButton).toContain("bg-selection-bg")
    expect(selectedButton).toContain("text-primary")
    expect(selectedButton).toContain("hover:bg-selection-bg")
    expect(selectedButton).toContain("hover:text-primary")
  })
})
