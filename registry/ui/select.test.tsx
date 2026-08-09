import type { ReactElement } from "react"
import { describe, expect, it, vi } from "vitest"

vi.mock("@/registry/lib/utils", () => ({
  cn: (...values: Array<string | undefined>) => values.filter(Boolean).join(" "),
}))

import { SelectContent, SelectGroup, SelectItem, SelectTrigger } from "./select"

describe("SelectTrigger size variants", () => {
  it.each([
    ["xs", "data-[size=xs]:h-6"],
    ["sm", "data-[size=sm]:h-7"],
    ["default", "data-[size=default]:h-8"],
    ["lg", "data-[size=lg]:h-9"],
  ] as const)("maps %s to its height", (size, heightClass) => {
    const trigger = SelectTrigger({ size, children: "Value" }) as ReactElement<{
      "data-size": string
      className: string
    }>

    expect(trigger.props["data-size"]).toBe(size)
    expect(trigger.props.className).toContain(heightClass)
  })

  it("uses the default height when size is omitted", () => {
    const trigger = SelectTrigger({ children: "Value" }) as ReactElement<{
      "data-size": string
    }>

    expect(trigger.props["data-size"]).toBe("default")
  })
})

describe("SelectTrigger surface", () => {
  it("uses the shared input surface instead of an opaque background", () => {
    const trigger = SelectTrigger({ children: "Value" }) as ReactElement<{
      className: string
    }>
    const classes = trigger.props.className.split(/\s+/)

    expect(classes).toContain("border-input")
    expect(classes).toContain("bg-input-surface")
    expect(classes).not.toContain("bg-background")
  })
})

describe("SelectContent width", () => {
  it("grows to the longest option while staying within the available width", () => {
    const portal = SelectContent({ children: "Options" }) as ReactElement<{
      children: ReactElement<{ children: ReactElement<{ className: string }> }>
    }>
    const popup = portal.props.children.props.children
    const classes = popup.props.className.split(/\s+/)

    expect(classes).toContain("w-max")
    expect(classes).toContain("min-w-(--anchor-width)")
    expect(classes).toContain("max-w-(--available-width)")
  })
})

describe("SelectContent motion", () => {
  it("disables popup animations when reduced motion is requested", () => {
    const portal = SelectContent({ children: "Options" }) as ReactElement<{
      children: ReactElement<{ children: ReactElement<{ className: string }> }>
    }>
    const popup = portal.props.children.props.children
    const classes = popup.props.className.split(/\s+/)

    expect(classes).toContain("motion-reduce:data-open:animate-none")
    expect(classes).toContain("motion-reduce:data-closed:animate-none")
    expect(classes).toContain("motion-reduce:transition-none")
  })
})

describe("SelectGroup popup layout", () => {
  it("matches the upstream Select group without synthetic popup padding", () => {
    const group = SelectGroup({ children: "Options" }) as ReactElement<{
      className: string
    }>
    const classes = group.props.className.split(/\s+/)

    expect(classes).toContain("scroll-my-1")
    expect(classes).not.toContain("p-1")
    expect(classes).not.toContain("py-1")
  })
})

describe("SelectContent positioning", () => {
  it("aligns the selected item with the trigger by default", () => {
    const portal = SelectContent({ children: "Options" }) as ReactElement<{
      children: ReactElement<{ alignItemWithTrigger: boolean }>
    }>

    expect(portal.props.children.props.alignItemWithTrigger).toBe(true)
  })

  it("allows consumers to opt out of selected-item alignment", () => {
    const portal = SelectContent({
      alignItemWithTrigger: false,
      children: "Options",
    }) as ReactElement<{
      children: ReactElement<{ alignItemWithTrigger: boolean }>
    }>

    expect(portal.props.children.props.alignItemWithTrigger).toBe(false)
  })
})

describe("SelectTrigger width", () => {
  it("uses the fixed container width by default", () => {
    const trigger = SelectTrigger({ children: "Value" }) as ReactElement<{
      className: string
    }>
    const classes = trigger.props.className.split(/\s+/)

    expect(classes).toContain("w-full")
    expect(classes).not.toContain("w-fit")
  })

  it("can shrink within a constrained fixed-width layout", () => {
    const trigger = SelectTrigger({ children: "Value" }) as ReactElement<{
      className: string
    }>
    const classes = trigger.props.className.split(/\s+/)

    expect(classes).toContain("min-w-0")
  })

  it("can follow the selected content width", () => {
    const trigger = SelectTrigger({ width: "content", children: "Value" }) as ReactElement<{
      className: string
    }>
    const classes = trigger.props.className.split(/\s+/)

    expect(classes).toContain("w-fit")
    expect(classes).not.toContain("w-full")
  })
})

describe("SelectItem height", () => {
  it("matches the trigger height exposed by the popup anchor", () => {
    const item = SelectItem({ value: "option", children: "Option" }) as ReactElement<{
      className: string
    }>
    const classes = item.props.className.split(/\s+/)

    expect(classes).toContain("h-(--anchor-height)")
    expect(classes).not.toContain("py-2")
  })
})
