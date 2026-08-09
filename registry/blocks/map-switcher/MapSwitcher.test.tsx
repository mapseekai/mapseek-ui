import type { ReactElement, ReactNode } from "react"
import { createContext, useContext } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it, vi } from "vitest"

vi.mock("@/components/ui/button", () => ({ Button: "button" }))
vi.mock("@/components/ui/dropdown-menu", () => {
  const RadioGroupContext = createContext<{ value: string }>({ value: "" })
  return {
    DropdownMenu: ({ children }: { children?: ReactNode }) => (
      <div data-primitive="menu">{children}</div>
    ),
    DropdownMenuTrigger: ({ render }: { render: ReactElement }) => render,
    DropdownMenuContent: ({ children }: { children?: ReactNode }) => (
      <div data-primitive="menu-content">{children}</div>
    ),
    DropdownMenuRadioGroup: ({
      value,
      children,
    }: {
      value: string
      children?: ReactNode
    }) => (
      <RadioGroupContext.Provider value={{ value }}>
        <div data-primitive="radio-group">{children}</div>
      </RadioGroupContext.Provider>
    ),
    DropdownMenuRadioItem: ({
      value,
      title,
      children,
    }: {
      value: string
      title?: string
      children?: ReactNode
    }) => {
      const group = useContext(RadioGroupContext)
      return (
        <div role="menuitemradio" aria-checked={group.value === value} title={title}>
          {children}
        </div>
      )
    },
  }
})
vi.mock("@/lib/utils", () => ({
  cn: (...classes: Array<string | false | undefined>) => classes.filter(Boolean).join(" "),
}))

import { MapSwitcher } from "./MapSwitcher"

const items = [
  { id: "road", label: "Road", image: "road.png", color: "var(--muted)" },
  { id: "satellite", label: "Satellite", image: "satellite.png", color: "var(--cat-2)" },
]

describe("MapSwitcher", () => {
  it("renders a layers-icon trigger in the default icon variant", () => {
    const html = renderToStaticMarkup(
      <MapSwitcher defaultValue="road">
        <MapSwitcher.Trigger label="Basemap" />
        <MapSwitcher.Panel>
          {items.map((item) => (
            <MapSwitcher.Item key={item.id} {...item} />
          ))}
        </MapSwitcher.Panel>
      </MapSwitcher>,
    )

    // Icon trigger: a labeled button with the layers svg; the list panel
    // renders color dots, not thumbnails.
    expect(html).toContain('aria-label="Basemap"')
    expect(html).toContain("<svg")
    expect(html).not.toContain("<img")
    expect(html).toContain('data-primitive="menu"')
    expect(html).toContain('data-primitive="radio-group"')
  })

  it("shows the selected basemap thumbnail in the image-variant trigger", () => {
    const html = renderToStaticMarkup(
      <MapSwitcher value="satellite" onChange={() => {}} variant="image">
        <MapSwitcher.Trigger />
        <MapSwitcher.Panel>
          {items.map((item) => (
            <MapSwitcher.Item key={item.id} {...item} />
          ))}
        </MapSwitcher.Panel>
      </MapSwitcher>,
    )

    expect(html).toContain('src="satellite.png"')
    // Trigger label row shows the selected item's label.
    expect(html).toContain("Satellite")
    // Thumbnail labels use the label-md token, never raw pixel sizes.
    expect(html).toContain("text-label-md")
    expect(html).not.toContain("text-[10px]")
  })

  it("marks the controlled value as the checked radio item", () => {
    const html = renderToStaticMarkup(
      <MapSwitcher value="satellite" onChange={() => {}}>
        <MapSwitcher.Trigger />
        <MapSwitcher.Panel>
          {items.map((item) => (
            <MapSwitcher.Item key={item.id} {...item} />
          ))}
        </MapSwitcher.Panel>
      </MapSwitcher>,
    )

    expect(html).toContain('aria-checked="true"')
    expect(html.match(/aria-checked="true"/g)).toHaveLength(1)
  })

  it("falls back to the uncontrolled default value", () => {
    const html = renderToStaticMarkup(
      <MapSwitcher defaultValue="road">
        <MapSwitcher.Trigger />
        <MapSwitcher.Panel>
          {items.map((item) => (
            <MapSwitcher.Item key={item.id} {...item} />
          ))}
        </MapSwitcher.Panel>
      </MapSwitcher>,
    )

    expect(html).toContain('aria-checked="true"')
  })
})
