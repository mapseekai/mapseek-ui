import { expect, it } from "vitest"
import { toggleVariants } from "./toggle"

it("limits toggle transitions to the visual state properties", () => {
  const classes = toggleVariants()

  expect(classes).toContain("transition-[background-color,border-color,color]")
  expect(classes).not.toContain("transition-all")
})
