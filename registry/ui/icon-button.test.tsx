import type { ButtonHTMLAttributes, ReactElement, ReactNode } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it, vi } from "vitest"

vi.mock("@base-ui/react/button", () => ({
  Button: ({ children, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button data-primitive="base-ui-button" {...props}>
      {children}
    </button>
  ),
}))

vi.mock("@/registry/lib/utils", () => ({
  cn: (...values: Array<string | undefined>) => values.filter(Boolean).join(" "),
}))

vi.mock("@/registry/ui/tooltip", () => ({
  Tooltip: ({ children }: { children: ReactNode }) => <>{children}</>,
  TooltipTrigger: ({ render }: { render: ReactElement }) => render,
  TooltipContent: ({ children }: { children: ReactNode }) => (
    <div data-slot="tooltip-content">{children}</div>
  ),
}))

import { IconButton } from "./icon-button"

const sizes = {
  xs: "size-6",
  sm: "size-7",
  md: "size-8",
  lg: "size-9",
  xl: "size-10",
} as const

describe("IconButton", () => {
  it.each(Object.entries(sizes))("maps %s to %s", (size, className) => {
    const button = IconButton({
      label: "Edit layer",
      size: size as keyof typeof sizes,
    }) as ReactElement<{
      className: string
      "aria-label": string
    }>

    expect(button.props["aria-label"]).toBe("Edit layer")
    expect(button.props.className.split(/\s+/)).toContain(className)
  })

  it("uses a 20px icon inside the 40px xl button", () => {
    const button = IconButton({
      label: "Edit layer",
      size: "xl",
    }) as ReactElement<{ className: string }>

    expect(button.props.className.split(/\s+/)).toContain("[&_svg:not([class*='size-'])]:size-5")
  })

  it("renders through the Base UI button primitive", () => {
    const html = renderToStaticMarkup(<IconButton label="Edit layer" />)

    expect(html).toContain('data-primitive="base-ui-button"')
  })

  it("uses the default md size and shared square focus contract", () => {
    const button = IconButton({ label: "Edit layer" }) as ReactElement<{ className: string }>
    const classes = button.props.className.split(/\s+/)

    expect(classes).toContain("size-8")
    expect(classes).toContain("rounded-none")
    expect(classes).toContain("focus-visible:border-ring")
    expect(classes).toContain("focus-visible:ring-(length:--focus-ring-width)")
    expect(classes).toContain("focus-visible:ring-ring/20")
  })

  it("uses destructive styling when danger is requested", () => {
    const button = IconButton({ label: "Delete layer", danger: true }) as ReactElement<{
      className: string
    }>
    const classes = button.props.className.split(/\s+/)

    expect(classes).toContain("text-destructive")
    expect(classes).toContain("hover:bg-destructive/10")
  })

  it("renders tooltip content only when opted in", () => {
    const noTooltip = renderToStaticMarkup(<IconButton label="Edit layer" />)
    const labelTooltip = renderToStaticMarkup(<IconButton label="Edit layer" tooltip />)
    const customTooltip = renderToStaticMarkup(
      <IconButton label="Open service" tooltip="Open in browser" />,
    )

    expect(noTooltip).not.toContain('data-slot="tooltip-content"')
    expect(labelTooltip).toContain('aria-label="Edit layer"')
    expect(labelTooltip).toContain('data-slot="tooltip-content"')
    expect(labelTooltip).toContain(">Edit layer</div>")
    expect(customTooltip).toContain(">Open in browser</div>")
  })
})
