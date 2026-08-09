import { createElement } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { afterEach, describe, expect, it, vi } from "vitest"

import * as ResourceGridModule from "./ResourceGrid"
import type { ResourceGridItem, ResourceTab } from "./types"

const noop = () => undefined

function renderGrid(tab: ResourceTab, items: ResourceGridItem[]) {
  return renderToStaticMarkup(
    createElement(ResourceGridModule.ResourceGrid, {
      tab,
      items,
      onOpen: noop,
      onContextMenu: noop,
      onIconSelect: noop,
      selectedIconIds: new Set<string>(),
    }),
  )
}

describe("ResourceGrid layout", () => {
  it("uses auto-fill for the fixed-width icon card grid", () => {
    const html = renderGrid("icon", [
      { kind: "icon", id: "search", name: "Search", seed: "search" },
    ])

    expect(html).toContain("grid-cols-[repeat(auto-fill,minmax(96px,1fr))]")
    expect(html).not.toContain("grid-cols-[repeat(auto-fit,minmax(96px,1fr))]")
  })

  it("keeps icon selection visible on touch layouts and mirrors its position in RTL", () => {
    const html = renderGrid("icon", [
      { kind: "icon", id: "search", name: "Search", seed: "search" },
    ])

    expect(html).toContain("start-2")
    expect(html).not.toContain("left-2")
    expect(html).toContain("pointer-fine:opacity-0")
    expect(html).toContain("pointer-fine:group-hover:opacity-100")
    expect(html).toContain("group-focus-within:opacity-100")
  })

  it("contains long card titles and metadata while exposing their full values", () => {
    const longName = "RESOURCE_WITH_AN_EXTREMELY_LONG_UNBROKEN_IDENTIFIER"
    const longMeta = "123456789012345678901234567890_METADATA"
    const html = renderGrid("sprite", [
      {
        kind: "sprite",
        id: "sprite",
        name: longName,
        status: { variant: "published", label: "Published" },
        metaParts: [longMeta],
        previewSeeds: [],
      },
    ])
    const card = html.match(/<button[^>]*data-slot="button"[^>]*>/)?.[0]

    expect(html).toContain(`title="${longName}"`)
    expect(html).toContain(`title="${longMeta}"`)
    expect(html).toContain("min-w-0 truncate")
    expect(card).toContain("text-start")
    expect(card).toContain("transition-[background-color,border-color,color]")
    expect(card).toContain("motion-reduce:transition-none")
    expect(card).not.toContain("transition-all")
  })

  it("hides decorative status icons from assistive technology", () => {
    const html = renderGrid("sprite", [
      {
        kind: "sprite",
        id: "published",
        name: "Published",
        status: { variant: "published", label: "Published" },
        metaParts: [],
        previewSeeds: [],
      },
      {
        kind: "sprite",
        id: "sliced",
        name: "Sliced",
        status: { variant: "sliced", label: "Sliced" },
        metaParts: [],
        previewSeeds: [],
      },
    ])
    const statusIcons = html.match(/<svg[^>]*tabler-icon-(?:circle-filled|scissors)[^>]*>/g) ?? []

    expect(statusIcons).toHaveLength(2)
    for (const icon of statusIcons) expect(icon).toContain('aria-hidden="true"')
  })
})

describe("ResourceGrid keyboard context menu", () => {
  afterEach(() => vi.unstubAllGlobals())

  it.each([
    { key: "ContextMenu", shiftKey: false },
    { key: "F10", shiftKey: true },
  ])("dispatches a contextmenu event for $key", ({ key, shiftKey }) => {
    class TestMouseEvent extends Event {
      readonly button: number
      readonly clientX: number
      readonly clientY: number

      constructor(type: string, init: MouseEventInit = {}) {
        super(type, init)
        this.button = init.button ?? 0
        this.clientX = init.clientX ?? 0
        this.clientY = init.clientY ?? 0
      }
    }

    vi.stubGlobal("MouseEvent", TestMouseEvent)
    const dispatched: Event[] = []
    const preventDefault = vi.fn()
    const currentTarget = {
      dispatchEvent(event: Event) {
        dispatched.push(event)
        return true
      },
      getBoundingClientRect() {
        return { left: 10, top: 20, width: 100, height: 40 }
      },
    }
    const dispatchKeyboardContextMenu = (
      ResourceGridModule as typeof ResourceGridModule & {
        dispatchKeyboardContextMenu?: (event: unknown) => void
      }
    ).dispatchKeyboardContextMenu

    expect(dispatchKeyboardContextMenu).toBeTypeOf("function")
    dispatchKeyboardContextMenu?.({ key, shiftKey, preventDefault, currentTarget })

    expect(preventDefault).toHaveBeenCalledOnce()
    expect(dispatched).toHaveLength(1)
    expect(dispatched[0]).toMatchObject({
      type: "contextmenu",
      bubbles: true,
      cancelable: true,
      button: 2,
      clientX: 60,
      clientY: 40,
    })
  })
})
