import { Children, isValidElement, type ReactElement, type ReactNode } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it, vi } from "vitest"

import { CopyButton } from "@/components/ui/copy-button"
import { IconButton } from "@/components/ui/icon-button"
import { ServiceEndpointRow } from "./ServiceEndpointRow"
import type { ServiceEndpointRowProps } from "./types"

const baseProps: ServiceEndpointRowProps = {
  title: "Raster tile service",
  subtitle: "XYZ · PNG / WEBP",
  method: "GET",
  url: "https://api.mapseek.io/v1/raster/{uid}/tiles/{z}/{x}/{y}.png",
  onCopy: () => {},
  copyLabel: "Copy URL",
  openLabel: "Open in new window",
  onOpen: () => {},
}

function findElement(
  node: ReactNode,
  predicate: (element: ReactElement<Record<string, unknown>>) => boolean,
): ReactElement<Record<string, unknown>> | undefined {
  for (const child of Children.toArray(node)) {
    if (!isValidElement<Record<string, unknown>>(child)) continue
    if (predicate(child)) return child

    const match = findElement(
      [child.props.children as ReactNode, child.props.render as ReactNode],
      predicate,
    )
    if (match) return match
  }

  return undefined
}

describe("ServiceEndpointRow", () => {
  it("renders the URL as a focusable untranslated LTR code region", () => {
    const html = renderToStaticMarkup(<ServiceEndpointRow {...baseProps} />)

    expect(html).toContain('data-slot="service-endpoint-url"')
    expect(html).toContain('role="region"')
    expect(html).toContain('tabindex="0"')
    expect(html).toContain('dir="ltr"')
    expect(html).toContain('translate="no"')
    expect(html).toContain(`aria-label="${baseProps.url}"`)
    expect(html).toContain(`title="${baseProps.url}"`)
    expect(html).not.toContain("<fieldset")
  })

  it("uses neutral shared UI for the method and URL parameters", () => {
    const html = renderToStaticMarkup(<ServiceEndpointRow {...baseProps} />)

    expect(html).toMatch(/<span[^>]*data-color="gray"[^>]*data-slot="tag"/)
    expect(html).not.toContain("text-warning")
    expect(html).not.toContain("text-info")
  })

  it("keeps long metadata discoverable while constraining it to the row", () => {
    const html = renderToStaticMarkup(<ServiceEndpointRow {...baseProps} />)

    expect(html).toMatch(/<span[^>]*title="Raster tile service"[^>]*class="[^"]*truncate/)
    expect(html).toMatch(/<span[^>]*title="XYZ · PNG [/] WEBP"[^>]*class="[^"]*truncate/)
    expect(html).toContain("grid-cols-[minmax(0,1fr)_auto_auto]")
    expect(html).toContain("scroll-fade-x")
    expect(html.match(/size-8/g)).toHaveLength(2)
  })

  it("passes localized copied feedback and clipboard failures to CopyButton", () => {
    const onCopyError = vi.fn()
    const tree = ServiceEndpointRow({
      ...baseProps,
      copiedLabel: "Copied URL",
      onCopyError,
    })
    const copyButton = findElement(tree, (element) => element.type === CopyButton)

    expect(copyButton?.props.copiedLabel).toBe("Copied URL")
    expect(copyButton?.props.onCopyError).toBe(onCopyError)
    expect(copyButton?.props.iconSize).toBe("md")
  })

  it("falls back to the localized copy label when copiedLabel is omitted", () => {
    const tree = ServiceEndpointRow(baseProps)
    const copyButton = findElement(tree, (element) => element.type === CopyButton)

    expect(copyButton?.props.copiedLabel).toBe("Copy URL")
  })

  it("renders enabled navigation as a native new-window link", () => {
    const onOpen = vi.fn()
    const tree = ServiceEndpointRow({
      ...baseProps,
      openHref: "https://api.mapseek.io/v1/raster/demo/tilejson.json",
      onOpen,
    })
    const link = findElement(tree, (element) => element.type === "a")

    expect(link?.props.href).toBe("https://api.mapseek.io/v1/raster/demo/tilejson.json")
    expect(link?.props.target).toBe("_blank")
    expect(link?.props.rel).toBe("noopener noreferrer")
    expect(link?.props["aria-label"]).toBe("Open in new window")

    ;(link?.props.onClick as (() => void) | undefined)?.()
    expect(onOpen).toHaveBeenCalledOnce()
  })

  it("keeps callback-only opening as an enabled button action", () => {
    const onOpen = vi.fn()
    const tree = ServiceEndpointRow({ ...baseProps, onOpen })
    const button = findElement(tree, (element) => element.type === IconButton)

    expect(button?.props["aria-disabled"]).toBeUndefined()
    expect(button?.props.disabled).toBeUndefined()

    ;(button?.props.onClick as (() => void) | undefined)?.()
    expect(onOpen).toHaveBeenCalledOnce()
  })

  it("keeps an explicitly disabled open action focusable and guarded", () => {
    const onOpen = vi.fn()
    const preventDefault = vi.fn()
    const tree = ServiceEndpointRow({ ...baseProps, openDisabled: true, onOpen })
    const button = findElement(tree, (element) => element.type === IconButton)

    expect(button?.props["aria-disabled"]).toBe(true)
    expect(button?.props.disabled).toBeUndefined()

    ;(button?.props.onClick as ((event: { preventDefault: () => void }) => void) | undefined)?.({
      preventDefault,
    })
    expect(preventDefault).toHaveBeenCalledOnce()
    expect(onOpen).not.toHaveBeenCalled()
  })

  it("disables an actionless open control instead of exposing a no-op", () => {
    const tree = ServiceEndpointRow({ ...baseProps, onOpen: undefined })
    const button = findElement(tree, (element) => element.type === IconButton)

    expect(button?.props["aria-disabled"]).toBe(true)
    expect(button?.props.disabled).toBeUndefined()
  })
})
