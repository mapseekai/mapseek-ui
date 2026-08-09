import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"
import { EmptyOverviewDemo } from "./EmptyShowcase"

describe("EmptyOverviewDemo", () => {
  it("separates the three empty states with horizontal separators", () => {
    const html = renderToStaticMarkup(<EmptyOverviewDemo />)
    const structure = Array.from(
      html.matchAll(/data-demo="([^"]+)"|data-slot="separator"/gu),
      (match) => match[1] ?? "separator",
    )

    expect(structure).toEqual([
      "empty-default",
      "separator",
      "empty-action",
      "separator",
      "empty-no-action",
    ])
  })
})
