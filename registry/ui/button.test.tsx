import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it, vi } from "vitest"

vi.mock("@/registry/lib/utils", () => ({
  cn: (...values: Array<string | undefined>) => values.filter(Boolean).join(" "),
}))

import { Button, buttonVariants } from "./button"

const expandedVariantClasses = {
  outline: ["aria-expanded:bg-accent/50", "aria-expanded:text-foreground"],
  secondary: ["aria-expanded:bg-accent/50"],
  ghost: ["aria-expanded:bg-accent/50", "aria-expanded:text-foreground"],
} as const

function expandedClasses(variant: keyof typeof expandedVariantClasses) {
  const html = renderToStaticMarkup(
    <Button aria-expanded variant={variant}>
      Open
    </Button>,
  )
  const className = html.match(/class="([^"]+)"/u)?.[1]

  if (!className) throw new Error("Button did not render a class attribute")
  return new Set(className.split(/\s+/))
}

describe("Button expanded state", () => {
  it.each(Object.entries(expandedVariantClasses))(
    "uses the hover treatment when %s is expanded",
    (variant, expectedClasses) => {
      const classes = expandedClasses(variant as keyof typeof expandedVariantClasses)

      for (const expectedClass of expectedClasses) {
        expect(classes).toContain(expectedClass)
      }
      expect(classes).not.toContain("aria-expanded:bg-selection-bg")
      expect(classes).not.toContain("aria-expanded:text-primary")
    },
  )
})

describe("Button transitions", () => {
  it("limits transitions to colors, borders, and transforms", () => {
    const classes = buttonVariants()

    expect(classes).toContain("transition-[background-color,border-color,color,transform]")
    expect(classes).not.toContain("transition-all")
  })
})
