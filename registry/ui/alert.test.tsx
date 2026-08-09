import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"
import { Alert } from "./alert"

describe("Alert", () => {
  it("uses the info palette and polite status semantics for passive messages", () => {
    const html = renderToStaticMarkup(<Alert>Ready</Alert>)

    expect(html).toContain('role="status"')
    expect(html).toContain("border-info/30")
    expect(html).toContain("bg-info/10")
    expect(html).toContain("text-info")
    expect(html).not.toContain("border-primary/20")
  })

  it("keeps destructive messages assertive", () => {
    const html = renderToStaticMarkup(<Alert variant="destructive">Failed</Alert>)

    expect(html).toContain('role="alert"')
    expect(html).toContain("border-destructive/30")
  })

  it("respects an explicit caller role", () => {
    const html = renderToStaticMarkup(<Alert role="region">Details</Alert>)

    expect(html).toContain('role="region"')
  })
})
