import type { ComponentProps } from "react"
import { describe, expect, it, vi } from "vitest"

vi.mock("@/registry/lib/utils", () => ({
  cn: (...values: Array<string | undefined>) => values.filter(Boolean).join(" "),
}))

import { type Tag, tagVariants } from "./tag"

type TagHasRenderProp = "render" extends keyof ComponentProps<typeof Tag> ? true : false

describe("Tag", () => {
  it("does not expose a render prop", () => {
    const hasRenderProp: TagHasRenderProp = false

    expect(hasRenderProp).toBe(false)
  })

  it("stays static without a transition", () => {
    const classes = tagVariants()

    expect(classes).not.toContain("transition-[background-color,border-color,color,transform]")
    expect(classes).not.toContain("transition-all")
  })

  it("uses a primary-green soft outline by default", () => {
    expect(tagVariants()).toContain("border-primary/30")
    expect(tagVariants()).toContain("bg-primary/10")
    expect(tagVariants()).toContain("text-primary")
  })

  it("maps each named category color to a soft outline surface", () => {
    for (const [color, classes] of [
      ["blue", ["border-cat-2/30", "bg-cat-2/10", "text-cat-2"]],
      ["yellow", ["border-cat-3/30", "bg-cat-3/10", "text-cat-3"]],
      ["orange", ["border-cat-4/30", "bg-cat-4/10", "text-cat-4"]],
      ["purple", ["border-cat-5/30", "bg-cat-5/10", "text-cat-5"]],
      ["cyan", ["border-cat-6/30", "bg-cat-6/10", "text-cat-6"]],
      ["gray", ["border-border", "bg-muted/50", "text-muted-foreground"]],
    ] as const) {
      const tagClasses = tagVariants({ color })

      for (const className of classes) {
        expect(tagClasses).toContain(className)
      }
    }
  })

  it("uses borderless solid category fills with the adaptive theme foreground", () => {
    for (const [color, background] of [
      ["green", "bg-primary"],
      ["blue", "bg-cat-2"],
      ["yellow", "bg-cat-3"],
      ["orange", "bg-cat-4"],
      ["purple", "bg-cat-5"],
      ["cyan", "bg-cat-6"],
      ["gray", "bg-muted-foreground"],
    ] as const) {
      const tagClasses = tagVariants({ color, variant: "solid" } as never)

      expect(tagClasses).toContain("border-0")
      expect(tagClasses).toContain(background)
      expect(tagClasses).toContain("text-primary-foreground")
    }
  })

  it("keeps direct SVG children compact as inline start icons", () => {
    const tagClasses = tagVariants()

    expect(tagClasses).toContain("gap-1")
    expect(tagClasses).toContain("has-data-[icon=inline-start]:ps-1.5")
    expect(tagClasses).toContain("[&>svg]:pointer-events-none")
    expect(tagClasses).toContain("[&>svg]:size-3!")
  })

  it("provides the standard five-step size scale", () => {
    for (const [size, classes] of [
      ["xs", ["h-3", "px-1", "[&>svg]:size-2!"]],
      ["sm", ["h-4", "px-1.5", "[&>svg]:size-2.5!"]],
      ["default", ["h-5", "px-2", "[&>svg]:size-3!"]],
      ["lg", ["h-6", "px-2.5", "[&>svg]:size-3.5!"]],
      ["xl", ["h-7", "px-3", "[&>svg]:size-4!"]],
    ] as const) {
      const tagClasses = tagVariants({ size } as never)

      for (const className of classes) {
        expect(tagClasses).toContain(className)
      }
    }
  })
})
