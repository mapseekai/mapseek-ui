import type { ButtonHTMLAttributes } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it, vi } from "vitest"

vi.mock("@/registry/ui/button", () => ({
  Button: ({
    children,
    size,
    ...props
  }: ButtonHTMLAttributes<HTMLButtonElement> & { size?: string }) => (
    <button data-primitive="button" data-size={size} {...props}>
      {children}
    </button>
  ),
}))

vi.mock("@/registry/ui/icon-button", () => ({
  IconButton: ({
    children,
    label,
    size,
    ...props
  }: ButtonHTMLAttributes<HTMLButtonElement> & { label: string; size?: string }) => (
    <button data-primitive="icon-button" data-size={size} {...props} aria-label={label}>
      {children}
    </button>
  ),
}))

import { CopyButton } from "./copy-button"

describe("CopyButton", () => {
  it("renders an accessible icon-only variant by default", () => {
    const html = renderToStaticMarkup(<CopyButton content="dataset.8f12-a91c" />)

    expect(html).toContain('data-slot="copy-button"')
    expect(html).toContain('data-primitive="icon-button"')
    expect(html).toContain('data-size="xs"')
    expect(html).toContain('aria-label="复制"')
    expect(html).toContain("tabler-icon-clipboard")
    expect(html).not.toContain("size-3.5")
    expect(html).not.toContain(">复制</button>")
  })

  it("lets icon consumers opt into the shared 32px action size", () => {
    const html = renderToStaticMarkup(<CopyButton content="dataset.8f12-a91c" iconSize="md" />)

    expect(html).toContain('data-size="md"')
    expect(html).not.toContain("size-3.5")
  })

  it("renders the copy label in the text variant", () => {
    const html = renderToStaticMarkup(
      <CopyButton content="dataset.8f12-a91c" variant="text" label="复制标识" textSize="default" />,
    )

    expect(html).toContain("复制标识")
    expect(html).toContain('data-size="default"')
    expect(html).not.toContain("size-3.5")
  })
})
