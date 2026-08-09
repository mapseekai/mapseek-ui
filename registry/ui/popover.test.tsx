import type { ReactElement } from "react"
import { describe, expect, it } from "vitest"
import { PopoverContent } from "./popover"

describe("PopoverContent motion", () => {
  it("disables popup animations when reduced motion is requested", () => {
    const portal = PopoverContent({ children: "Panel" }) as ReactElement<{
      children: ReactElement<{ children: ReactElement<{ className: string }> }>
    }>
    const popup = portal.props.children.props.children
    const classes = popup.props.className.split(/\s+/)

    expect(classes).toContain("motion-reduce:data-open:animate-none")
    expect(classes).toContain("motion-reduce:data-closed:animate-none")
    expect(classes).toContain("motion-reduce:transition-none")
  })
})
