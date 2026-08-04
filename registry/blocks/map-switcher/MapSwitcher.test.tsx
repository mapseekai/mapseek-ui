import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it, vi } from "vitest"

vi.mock("@/components/ui/button", () => ({ Button: "button" }))
vi.mock("@/components/ui/collapsible", () => ({
  Collapsible: ({ children }: { children?: React.ReactNode }) => (
    <div data-primitive="collapsible">{children}</div>
  ),
  CollapsibleContent: ({ children }: { children?: React.ReactNode }) => (
    <div data-primitive="collapsible-content">{children}</div>
  ),
  CollapsibleTrigger: ({ children }: { children?: React.ReactNode }) => (
    <div data-primitive="collapsible-trigger">{children}</div>
  ),
}))
vi.mock("@/lib/utils", () => ({
  cn: (...classes: Array<string | false | undefined>) => classes.filter(Boolean).join(" "),
}))

import { MapSwitcher } from "./MapSwitcher"

describe("MapSwitcher", () => {
  it("composes its disclosure from the Collapsible primitives", () => {
    const html = renderToStaticMarkup(
      <MapSwitcher defaultValue="road" mode="button">
        <MapSwitcher.Trigger />
        <MapSwitcher.Panel>
          <MapSwitcher.Item id="road" label="Road" />
        </MapSwitcher.Panel>
      </MapSwitcher>,
    )

    expect(html).toContain('data-primitive="collapsible"')
    expect(html).toContain('data-primitive="collapsible-trigger"')
    expect(html).toContain('data-primitive="collapsible-content"')
  })
})
