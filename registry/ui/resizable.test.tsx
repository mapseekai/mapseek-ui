import type { ReactElement } from "react"
import type * as ResizablePrimitive from "react-resizable-panels"
import { describe, expect, it } from "vitest"

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "./resizable"

type SlottedProps = {
  "data-slot": string
}

describe("Resizable components", () => {
  it("assigns slots and layout classes to groups and panels", () => {
    const group = ResizablePanelGroup({
      orientation: "horizontal",
    }) as ReactElement<ResizablePrimitive.GroupProps & SlottedProps>
    const panel = ResizablePanel({ id: "primary" }) as ReactElement<
      ResizablePrimitive.PanelProps & SlottedProps
    >

    expect(group.props["data-slot"]).toBe("resizable-panel-group")
    expect(group.props.className).toContain("flex")
    expect(group.props.className).toContain("aria-[orientation=vertical]:flex-col")
    expect(panel.props["data-slot"]).toBe("resizable-panel")
  })

  it("renders a bordered focusable separator without shadows", () => {
    const handle = ResizableHandle({
      withHandle: true,
    }) as ReactElement<ResizablePrimitive.SeparatorProps & SlottedProps>

    expect(handle.props["data-slot"]).toBe("resizable-handle")
    expect(handle.props.className).toContain("bg-border")
    expect(handle.props.className).toContain("focus-visible:border-ring")
    expect(handle.props.className).toContain("focus-visible:ring-(length:--focus-ring-width)")
    expect(handle.props.className).toContain("focus-visible:ring-ring/20")
    expect(handle.props.className).not.toMatch(/shadow(?:-|\b)/)
  })
})
