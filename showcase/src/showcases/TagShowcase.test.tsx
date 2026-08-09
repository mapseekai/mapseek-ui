import type { ReactNode } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it, vi } from "vitest"

vi.mock("@registry/ui/tag", () => ({
  Tag: ({ children, size, ...props }: { children?: ReactNode; size?: string }) => (
    <span {...props} data-size={size} data-slot="tag">
      {children}
    </span>
  ),
}))

import { TagOverviewDemo } from "./TagShowcase"

describe("TagOverviewDemo", () => {
  it("keeps each size value outside its Tag in the size scale", () => {
    const html = renderToStaticMarkup(<TagOverviewDemo locale="zh-CN" />)

    expect(html).toContain('data-demo="tag-sizes"')

    for (const [size, value] of [
      ["xs", "12px"],
      ["sm", "16px"],
      ["default", "20px"],
      ["lg", "24px"],
      ["xl", "28px"],
    ] as const) {
      const example = html.match(
        new RegExp(`<div[^>]*data-demo="tag-size-${size}"[^>]*>([\\s\\S]*?)</div>`),
      )?.[1]

      expect(example, `missing ${size} size example`).toBeDefined()
      if (!example) continue

      const tag = example.match(
        /<span(?=[^>]*data-slot="tag")(?=[^>]*data-size="[^"]+")[^>]*>([\s\S]*?)<\/span>/,
      )?.[1]

      expect(tag).toBeDefined()
      expect(tag).not.toContain(value)
      expect(example).toContain(`data-slot="tag-size-value">${value}</span>`)
    }
  })
})
