import { cloneElement, type ReactElement, type ReactNode } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it, vi } from "vitest"

vi.mock("@/components/ui/popover", () => ({
  Popover: ({ children }: { children?: ReactNode }) => <div data-slot="popover">{children}</div>,
  PopoverTrigger: ({
    children,
    render,
  }: {
    children?: ReactNode
    render: ReactElement<{ children?: ReactNode; "data-slot"?: string }>
  }) => cloneElement(render, { "data-slot": "popover-trigger" }, children),
  PopoverContent: ({
    align: _align,
    children,
    className,
  }: {
    align?: string
    children?: ReactNode
    className?: string
  }) => (
    <section data-slot="popover-content" className={className}>
      {children}
    </section>
  ),
  PopoverTitle: ({ children, ...props }: { children?: ReactNode }) => (
    <h2 data-slot="popover-title" {...props}>
      {children}
    </h2>
  ),
  PopoverDescription: ({ children, ...props }: { children?: ReactNode }) => (
    <p data-slot="popover-description" {...props}>
      {children}
    </p>
  ),
}))

import { NotificationCenter } from "./NotificationCenter"
import type { NotificationCenterItem, NotificationCenterLabels } from "./types"

const labels: NotificationCenterLabels = {
  trigger: "Notification center",
  title: "Notification center",
  clearAll: "Clear all",
  clearOne: "Clear",
  emptyTitle: "No new notifications",
  emptyDescription: "Completed jobs appear here.",
  loadingTitle: "Loading notifications",
  errorTitle: "NOTIFICATION_LOAD_FAILED",
  errorDescription: "Notification list failed to load. Retry.",
  retry: "Retry",
  streamActive: "LIVE",
  streamIdle: "IDLE",
  total: "TOTAL",
  processing: "Processing summary sentinel",
  completed: "Completed",
  failed: "Failed",
}

const items: NotificationCenterItem[] = [
  {
    key: "processing",
    title: "Long processing title",
    description: "Long processing description",
    sourceUid: "dataset.identifier.with.full.value",
    sourceType: "DATASET",
    sourceLabel: "Dataset",
    statusLabel: "Processing",
    statusTone: "processing",
  },
  {
    key: "success",
    title: "Successful dataset",
    description: "Finished successfully",
    sourceUid: "dataset.success",
    sourceType: "DATASET",
    sourceLabel: "Dataset",
    statusLabel: "Completed",
    statusTone: "success",
  },
  {
    key: "failed",
    title: "Failed tileset",
    description: "Processing failed",
    sourceUid: "tileset.failed",
    sourceType: "TILESET",
    sourceLabel: "Tileset",
    statusLabel: "Failed",
    statusTone: "failed",
  },
]

function renderNotificationCenter(
  props: Partial<Parameters<typeof NotificationCenter>[0]> = {},
): string {
  return renderToStaticMarkup(
    <NotificationCenter
      items={items}
      labels={labels}
      streamActive
      onRetry={() => {}}
      onClearAll={() => {}}
      onClearItem={() => {}}
      {...props}
    />,
  )
}

describe("NotificationCenter", () => {
  it("uses rich-popover semantics and exposes the current count", () => {
    const html = renderNotificationCenter()

    expect(html).toContain('data-slot="popover"')
    expect(html).not.toContain('data-slot="dropdown-menu"')
    expect(html).toContain('data-slot="popover-title"')
    expect(html).toContain('data-slot="popover-description"')
    expect(html).toContain('aria-label="Notification center, TOTAL: 3"')
    expect(html).toContain('role="status"')
    expect(html).toContain('aria-live="polite"')
    expect(html).toContain('aria-atomic="true"')
  })

  it("reveals item clear actions on hover or keyboard focus while preserving touch access", () => {
    const html = renderNotificationCenter()
    const destructiveActions =
      html.match(/<button\b[^>]*class="[^"]*bg-destructive\/10[^"]*"[^>]*>/g) ?? []

    expect(destructiveActions).toHaveLength(items.length + 1)
    expect(html).toContain("group-hover:opacity-100")
    expect(html).toContain("group-focus-within:opacity-100")
    expect(html).toContain("[@media(hover:none)]:opacity-100")
    expect(html).toContain("motion-reduce:transition-none")
  })

  it("exposes complete values for truncated notification fields", () => {
    const html = renderNotificationCenter()

    expect(html).toContain('title="Long processing title"')
    expect(html).toContain('title="Long processing description"')
    expect(html).toContain('title="dataset.identifier.with.full.value"')
  })

  it("hides stale summaries while loading or reporting an error", () => {
    const loadingHtml = renderNotificationCenter({ isLoading: true })
    const errorHtml = renderNotificationCenter({ isError: true })

    expect(loadingHtml).not.toContain("Processing summary sentinel")
    expect(loadingHtml).toContain('aria-label="Notification center, Loading notifications"')
    expect(errorHtml).not.toContain("Processing summary sentinel")
    expect(errorHtml).toContain('aria-label="Notification center, NOTIFICATION_LOAD_FAILED"')
    expect(errorHtml).toContain('role="alert"')
  })

  it("hides decorative icons from assistive technology", () => {
    const html = renderNotificationCenter()
    const icons = Array.from(html.matchAll(/<svg\b[^>]*>/g), ([icon]) => icon)

    expect(icons.length).toBeGreaterThan(0)
    for (const icon of icons) {
      expect(icon).toContain('aria-hidden="true"')
    }
  })

  it("disables the processing spinner when reduced motion is requested", () => {
    const html = renderNotificationCenter()
    const spinner = html.match(/<svg\b[^>]*class="[^"]*animate-spin[^"]*"[^>]*>/)?.[0]

    expect(spinner).toBeTruthy()
    expect(spinner).toContain("motion-reduce:animate-none")
  })
})
