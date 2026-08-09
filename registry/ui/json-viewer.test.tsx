import type { ButtonHTMLAttributes } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it, vi } from "vitest"

vi.mock("@/registry/ui/copy-button", () => ({
  CopyButton: ({
    content,
    label,
    copiedLabel,
    duration,
    className,
    ...props
  }: ButtonHTMLAttributes<HTMLButtonElement> & {
    content: string
    label: string
    copiedLabel: string
    duration: number
  }) => (
    <button
      type="button"
      data-slot="copy-button"
      data-content={content}
      data-label={label}
      data-copied-label={copiedLabel}
      data-duration={duration}
      className={["size-6", className].filter(Boolean).join(" ")}
      {...props}
    />
  ),
}))

import { JsonViewer } from "./json-viewer"

const data = { nested: [1, 2] }

describe("JsonViewer", () => {
  it("reuses CopyButton with injected labels and the requested source text", () => {
    const html = renderToStaticMarkup(
      <JsonViewer
        data={data}
        copyLabel="Copy JSON"
        copiedLabel="Copied"
        copyContent="raw-json-source"
        copyFeedbackDurationMs={1800}
      />,
    )

    expect(html).toContain('data-slot="copy-button"')
    expect(html).toContain('data-content="raw-json-source"')
    expect(html).toContain('data-label="Copy JSON"')
    expect(html).toContain('data-copied-label="Copied"')
    expect(html).toContain('data-duration="1800"')
  })

  it("composes every tree control with the accessible collapsible trigger", () => {
    const html = renderToStaticMarkup(<JsonViewer data={data} />)
    const triggers = Array.from(
      html.matchAll(/<button[^>]*data-slot="collapsible-trigger"[^>]*>/g),
      ([tag]) => tag,
    )

    expect(triggers).toHaveLength(2)
    for (const trigger of triggers) {
      expect(trigger).toContain('aria-expanded="')
      expect(trigger).toContain("focus-visible:ring-(length:--focus-ring-width)")
      expect(trigger).toContain("hover:bg-accent/50")
    }
    expect(triggers.some((trigger) => trigger.includes('aria-controls="'))).toBe(true)
  })

  it("keeps expanded tree rows visually neutral when they are not hovered", () => {
    const html = renderToStaticMarkup(<JsonViewer data={data} />)
    const expandedTrigger = html.match(
      /<button[^>]*data-slot="collapsible-trigger"[^>]*aria-expanded="true"[^>]*>/,
    )?.[0]

    expect(expandedTrigger).toBeTruthy()
    expect(expandedTrigger).toContain("aria-expanded:bg-transparent")
    expect(expandedTrigger).not.toContain("aria-expanded:bg-accent/50")
    expect(expandedTrigger).toContain("hover:bg-accent/50")
  })

  it("uses one 24px toolbar control height", () => {
    const html = renderToStaticMarkup(<JsonViewer data={data} />)
    const toolbar = html.slice(0, html.indexOf('class="min-h-0 w-full flex-1'))

    expect(toolbar).not.toContain("h-7")
    expect(toolbar.match(/h-6|size-6/g)).toHaveLength(3)
  })

  it("injects singular and plural count labels and uses a Unicode ellipsis", () => {
    const html = renderToStaticMarkup(
      <JsonViewer data={data} itemLabel="entry" itemsLabel="entries" />,
    )

    expect(html).toContain("…")
    expect(html).toContain("2 entries")
    expect(html).not.toContain("...")
    expect(html).not.toContain("2 items")
  })

  it("keeps the default toolbar and count copy in one locale", () => {
    const html = renderToStaticMarkup(<JsonViewer data={data} />)

    expect(html).toContain("2 项")
    expect(html).not.toContain("2 items")
  })

  it("uses semantic tokens and reduced-motion-safe transitions", () => {
    const html = renderToStaticMarkup(<JsonViewer data={data} />)

    expect(html).toContain("border-border")
    expect(html).not.toContain("rgba(")
    expect(html).toContain("transition-transform")
    expect(html).toContain("motion-reduce:transition-none")
    expect(html).not.toContain("transition-all")
  })

  it("does not place tree layout elements inside pre or code", () => {
    const html = renderToStaticMarkup(<JsonViewer data={data} />)

    expect(html).not.toContain("<pre")
    expect(html).not.toContain("<code")
  })
})
