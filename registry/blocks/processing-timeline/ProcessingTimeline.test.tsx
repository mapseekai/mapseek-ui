import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"
import { ProcessingTimeline } from "./ProcessingTimeline"

const labels = {
  emptyDescription: "Start a processing task to see its status.",
  emptyTitle: "No processing steps",
  log: "View log",
}

describe("ProcessingTimeline", () => {
  it("uses the standard Tag component for status and retry labels", () => {
    const html = renderToStaticMarkup(
      <ProcessingTimeline
        labels={labels}
        steps={[
          {
            key: "ingest",
            label: "Ingest raster",
            retry: "Retry 1",
            state: "done",
            status: "Completed",
            events: [],
          },
        ]}
      />,
    )

    expect(html).toContain('data-slot="tag"')
    expect(html).toContain('data-color="green"')
    expect(html).toContain('data-color="yellow"')
  })

  it("renders a standard empty state instead of a blank ordered list", () => {
    const html = renderToStaticMarkup(<ProcessingTimeline labels={labels} steps={[]} />)

    expect(html).toContain('data-slot="empty"')
    expect(html).toContain("No processing steps")
    expect(html).toContain("Start a processing task to see its status.")
  })

  it("renders an accessible indeterminate progress state", () => {
    const html = renderToStaticMarkup(
      <ProcessingTimeline
        labels={labels}
        steps={[
          {
            key: "transform",
            label: "Transform raster",
            message: "Working",
            progressKind: "indeterminate",
            state: "active",
            events: [],
          },
        ]}
      />,
    )

    expect(html).toContain('role="progressbar"')
    expect(html).toContain('aria-label="Transform raster"')
    expect(html).toContain('aria-valuetext="Working"')
  })

  it("makes active progress readable without motion and keeps its state semantic", () => {
    const html = renderToStaticMarkup(
      <ProcessingTimeline
        labels={labels}
        steps={[
          {
            key: "transform",
            label: "Transform raster",
            percent: 42,
            progressKind: "percent",
            state: "active",
            events: [],
          },
        ]}
      />,
    )

    expect(html).toContain('aria-label="Transform raster: active"')
    expect(html).toContain("motion-reduce:animate-none")
    expect(html).toContain("motion-reduce:transition-none")
  })

  it("uses the primary color family for active marker feedback", () => {
    const html = renderToStaticMarkup(
      <ProcessingTimeline
        labels={labels}
        steps={[
          {
            key: "transform",
            label: "Transform raster",
            state: "active",
            events: [],
          },
        ]}
      />,
    )

    expect(html).toMatch(
      /aria-label="Transform raster: active" class="[^"]*bg-primary\/10[^"]*text-primary/,
    )
    expect(html).not.toMatch(/aria-label="Transform raster: active" class="[^"]*bg-warning/)
  })

  it("keeps long step labels discoverable while allowing the row to shrink", () => {
    const label = "A-long-processing-step-identifier-that-must-not-expand-the-timeline"
    const html = renderToStaticMarkup(
      <ProcessingTimeline
        labels={labels}
        steps={[{ key: "long", label, state: "pending", events: [] }]}
      />,
    )

    expect(html).toContain(`title="${label}"`)
    expect(html).toContain("min-w-0 truncate")
  })

  it("renders a log action only when the caller supplies a handler", () => {
    const step = {
      key: "ingest",
      label: "Ingest raster",
      state: "failed" as const,
      events: [{ log: "GDAL failed", tone: "error" as const }],
    }
    const withoutHandler = renderToStaticMarkup(
      <ProcessingTimeline labels={labels} steps={[step]} />,
    )
    const withHandler = renderToStaticMarkup(
      <ProcessingTimeline labels={labels} steps={[step]} onLogClick={() => {}} />,
    )

    expect(withoutHandler).not.toContain("View log")
    expect(withHandler).toContain("View log")
    expect(withHandler).not.toContain('data-slot="copy-button"')
  })
})
