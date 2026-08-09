import type { ReactElement } from "react"
import { describe, expect, it, vi } from "vitest"

vi.mock("@/registry/lib/utils", () => ({
  cn: (...values: Array<string | undefined>) => values.filter(Boolean).join(" "),
}))

import { CardTabs, CardTabsList, CardTabsTrigger } from "./card-tabs"

describe("card tabs", () => {
  it("owns its bordered card surface independently from tabs", () => {
    const root = CardTabs({ defaultValue: "details" }) as ReactElement<{
      "data-slot": string
      className: string
    }>

    expect(root.props["data-slot"]).toBe("card-tabs")
    expect(root.props.className).toContain("border-border")
    expect(root.props.className).toContain("overflow-hidden")
  })

  it("fills triggers and places separators and indicators by orientation", () => {
    const list = CardTabsList({}) as ReactElement<{ className: string }>
    const trigger = CardTabsTrigger({ value: "details" }) as ReactElement<{
      className: string
    }>

    expect(list.props.className).toContain("group-data-horizontal/card-tabs:h-auto")
    expect(list.props.className).toContain("group-data-horizontal/card-tabs:border-b")
    expect(list.props.className).toContain("group-data-vertical/card-tabs:border-e")
    expect(trigger.props.className).toContain("data-active:bg-selection-bg")
    expect(trigger.props.className).not.toContain("data-active:bg-primary/10")
    expect(trigger.props.className).toContain("group-data-horizontal/card-tabs:h-full")
    expect(trigger.props.className).toContain("group-data-horizontal/card-tabs:border-e")
    expect(trigger.props.className).toContain("group-data-horizontal/card-tabs:last:border-e-0")
    expect(trigger.props.className).toContain("group-data-vertical/card-tabs:border-b")
    expect(trigger.props.className).toContain("group-data-vertical/card-tabs:last:border-b-0")
    expect(trigger.props.className).toContain("group-data-horizontal/card-tabs:after:bottom-0")
    expect(trigger.props.className).toContain("group-data-vertical/card-tabs:after:end-0")
  })

  it("uses the content-edge indicator as its focus treatment", () => {
    const trigger = CardTabsTrigger({ value: "details" }) as ReactElement<{
      className: string
    }>

    expect(trigger.props.className).toContain("focus-visible:outline-none")
    expect(trigger.props.className).toContain("focus-visible:after:opacity-100")
    expect(trigger.props.className).not.toContain("focus-visible:ring-")
  })
})
