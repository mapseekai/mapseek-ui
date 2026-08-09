import type { ReactElement } from "react"
import { describe, expect, it, vi } from "vitest"

vi.mock("@/registry/lib/utils", () => ({
  cn: (...values: Array<string | undefined>) => values.filter(Boolean).join(" "),
}))

import { TabsTrigger, tabsListVariants } from "./tabs"

describe("tabs primary variant", () => {
  it("keeps the list muted and gives the active trigger semantic primary colors", () => {
    const trigger = TabsTrigger({ value: "schema", children: "Schema" }) as ReactElement<{
      className: string
    }>

    expect(tabsListVariants({ variant: "primary" })).toContain("bg-muted")
    expect(trigger.props.className).toContain(
      "group-data-[variant=primary]/tabs-list:data-active:bg-primary",
    )
    expect(trigger.props.className).toContain(
      "group-data-[variant=primary]/tabs-list:data-active:text-primary-foreground",
    )
  })

  it("keeps selected primary tab text readable on dark-mode hover", () => {
    const trigger = TabsTrigger({ value: "schema", children: "Schema" }) as ReactElement<{
      className: string
    }>

    expect(trigger.props.className).toContain(
      "dark:group-data-[variant=primary]/tabs-list:data-active:hover:text-primary-foreground",
    )
  })

  it("transitions only visual properties that the trigger changes", () => {
    const trigger = TabsTrigger({ value: "schema", children: "Schema" }) as ReactElement<{
      className: string
    }>

    expect(trigger.props.className).toContain(
      "transition-[background-color,border-color,color,opacity]",
    )
    expect(trigger.props.className).not.toContain("transition-all")
  })
})
