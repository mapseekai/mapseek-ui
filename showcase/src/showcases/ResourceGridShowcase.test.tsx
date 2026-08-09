import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"

import { ResourceGridDemo } from "./ResourceGridShowcase"

describe("ResourceGrid showcase semantics", () => {
  it("exposes the selected demo mode programmatically", () => {
    const html = renderToStaticMarkup(<ResourceGridDemo />)
    const button = (action: string) =>
      html.match(new RegExp(`<button[^>]*data-demo-action="${action}"[^>]*>`))?.[0]

    expect(button("resource-grid-tab-icon")).toContain('aria-pressed="true"')
    expect(button("resource-grid-tab-sprite")).toContain('aria-pressed="false"')
    expect(button("resource-grid-tab-font")).toContain('aria-pressed="false"')
    expect(button("resource-grid-empty")).toContain('aria-pressed="false"')
  })

  it("announces interaction results", () => {
    const html = renderToStaticMarkup(<ResourceGridDemo />)
    const status = html.match(/<span[^>]*data-demo-status="resource-grid"[^>]*>/)?.[0]

    expect(status).toContain('role="status"')
    expect(status).toContain('aria-live="polite"')
    expect(status).toContain('aria-atomic="true"')
  })
})
