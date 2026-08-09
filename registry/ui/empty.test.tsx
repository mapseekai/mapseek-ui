import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it, vi } from "vitest"

vi.mock("@/registry/lib/utils", () => ({
  cn: (...values: Array<string | undefined>) => values.filter(Boolean).join(" "),
}))

import { Empty } from "./empty"

function emptyClasses(className?: string) {
  const html = renderToStaticMarkup(<Empty className={className} />)
  const renderedClassName = html.match(/class="([^"]+)"/u)?.[1]

  if (!renderedClassName) throw new Error("Empty did not render a class attribute")
  return new Set(renderedClassName.split(/\s+/u))
}

describe("Empty border styles", () => {
  it("is borderless by default", () => {
    const classes = emptyClasses()

    expect(classes).not.toContain("border")
    expect(classes).not.toContain("border-dashed")
    expect(classes).not.toContain("border-border")
  })

  it("accepts an explicit border utility", () => {
    expect(emptyClasses("border")).toContain("border")
  })
})
