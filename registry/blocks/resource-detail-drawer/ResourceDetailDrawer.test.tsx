import type { ComponentProps, ReactNode } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it, vi } from "vitest"
import { ResourceDetailDrawer } from "./ResourceDetailDrawer"
import type { FontDetail, IconDetail } from "./types"

vi.mock("@/components/ui/sheet", () => ({
  Sheet: ({ children }: { children: ReactNode }) => <div data-slot="sheet">{children}</div>,
  SheetBody: ({ children, ...props }: ComponentProps<"div">) => (
    <div data-slot="sheet-body" {...props}>
      {children}
    </div>
  ),
  SheetContent: ({
    children,
    className,
    side: _side,
    ...props
  }: ComponentProps<"div"> & { side?: string }) => (
    <div data-slot="sheet-content" className={className} {...props}>
      {children}
    </div>
  ),
  SheetDescription: ({ children, ...props }: ComponentProps<"div">) => (
    <div {...props}>{children}</div>
  ),
  SheetHeader: ({ children, ...props }: ComponentProps<"div">) => <div {...props}>{children}</div>,
  SheetTitle: ({ children, ...props }: ComponentProps<"div">) => <h2 {...props}>{children}</h2>,
}))

const longValue = "resource-identifier-that-is-too-long-to-fit-without-a-discoverable-full-value"

const iconDetail: IconDetail = {
  copyLabel: "Copy resource",
  downloadLabel: "Download resource",
  kind: "icon",
  rows: [{ k: "Identifier", v: longValue }],
  seed: "icon-seed",
  sizes: [16],
  sizesTitle: "Sizes",
  subtitle: "resources/icons/marker.svg",
  tags: ["navigation"],
  tagsTitle: "Tags",
  title: "Marker",
}

const fontDetail: FontDetail = {
  family: "sans",
  kind: "font",
  rows: [],
  sample: "Mapseek",
  sampleTitle: "Sample",
  slicing: {
    cancelLabel: "Cancel",
    charsets: [],
    collapseLabel: "Collapse",
    configureLabel: "Configure slice",
    customPlaceholder: "Enter characters…",
    customTitle: "Custom characters",
    defaultSelected: [],
    downloadLabel: "Download",
    estimateLabel: "Estimated size",
    panelTitle: "Slice configuration",
    rawSizeLabel: "Raw size",
    rawSizeValue: "2 MB",
    runLabel: "Create slice",
    selectedLabel: "Selected glyphs",
  },
  specimen: "Aa 永",
  subtitle: "Mapseek Sans",
  title: "Mapseek Sans",
}

describe("ResourceDetailDrawer", () => {
  it("uses the standard Tag primitive for resource categories", () => {
    const html = renderToStaticMarkup(
      <ResourceDetailDrawer detail={iconDetail} onClose={() => undefined} />,
    )

    expect(html).toContain('data-slot="tag"')
  })

  it("does not expose an enabled action when its callback is unavailable", () => {
    const html = renderToStaticMarkup(
      <ResourceDetailDrawer detail={iconDetail} onClose={() => undefined} />,
    )

    expect(html).not.toContain("Copy resource")
    expect(html).not.toContain("Download resource")
  })

  it("keeps truncated resource metadata discoverable", () => {
    const html = renderToStaticMarkup(
      <ResourceDetailDrawer detail={iconDetail} onClose={() => undefined} />,
    )

    expect(html).toContain(`title="${longValue}"`)
  })

  it("exposes the collapsed slice disclosure state", () => {
    const html = renderToStaticMarkup(
      <ResourceDetailDrawer
        detail={fontDetail}
        onClose={() => undefined}
        onRunSlice={() => undefined}
      />,
    )

    expect(html).toContain("aria-controls=")
    expect(html).toContain('aria-expanded="false"')
  })

  it("does not expose a slice action when no slice handler is available", () => {
    const html = renderToStaticMarkup(
      <ResourceDetailDrawer detail={fontDetail} onClose={() => undefined} />,
    )

    expect(html).not.toContain("Configure slice")
    expect(html).not.toContain("Download")
  })

  it("uses a narrow-screen sheet layout with a collapsed size grid", () => {
    const html = renderToStaticMarkup(
      <ResourceDetailDrawer detail={iconDetail} onClose={() => undefined} />,
    )

    expect(html).toContain("max-sm:inset-y-4")
    expect(html).toContain("max-sm:w-[calc(100%-2rem)]")
    expect(html).toContain("grid-cols-1")
    expect(html).toContain("sm:grid-cols-3")
  })

  it("renders an injected empty state when no resource detail is available", () => {
    const html = renderToStaticMarkup(
      <ResourceDetailDrawer
        detail={null}
        state={{
          description: "Select a resource to inspect its metadata.",
          kind: "empty",
          title: "No resource selected",
        }}
        onClose={() => undefined}
      />,
    )

    expect(html).toContain('data-slot="empty"')
    expect(html).toContain("No resource selected")
  })

  it("gives an injected state precedence over stale detail content", () => {
    const html = renderToStaticMarkup(
      <ResourceDetailDrawer
        detail={iconDetail}
        state={{ kind: "loading", title: "Loading resource" }}
        onClose={() => undefined}
      />,
    )

    expect(html).toContain("Loading resource")
    expect(html).not.toContain(">Tags<")
  })

  it("omits empty metadata partitions", () => {
    const html = renderToStaticMarkup(
      <ResourceDetailDrawer
        detail={{ ...iconDetail, rows: [], sizes: [], tags: [] }}
        onClose={() => undefined}
      />,
    )

    expect(html).not.toContain(">Tags<")
    expect(html).not.toContain(">Sizes<")
  })

  it("gives image previews dimensions and section labels semantic headings", () => {
    const html = renderToStaticMarkup(
      <ResourceDetailDrawer
        detail={{ ...iconDetail, svg: '<svg xmlns="http://www.w3.org/2000/svg" />' }}
        onClose={() => undefined}
      />,
    )

    expect(html).toContain('width="56"')
    expect(html).toContain("<h3")
  })
})
