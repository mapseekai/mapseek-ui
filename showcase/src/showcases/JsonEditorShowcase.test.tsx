import { readFile } from "node:fs/promises"
import type { ReactNode } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { beforeEach, describe, expect, it, vi } from "vitest"

const jsonEditorProps: Array<{ ariaLabel?: string; theme?: string; title?: string }> = []

vi.mock("@registry/blocks/json-editor", () => ({
  JsonEditor: ({ children: _children, ...props }: { children?: ReactNode }) => {
    jsonEditorProps.push(props)
    return <div data-slot="json-editor" />
  },
}))

import { JsonEditorDemo } from "./JsonEditorShowcase"

describe("JsonEditorDemo", () => {
  beforeEach(() => {
    jsonEditorProps.length = 0
  })

  it("renders an accessible four-option theme selector and keeps both examples", async () => {
    const html = renderToStaticMarkup(<JsonEditorDemo locale="zh-CN" />)
    const source = await readFile(new URL("./JsonEditorShowcase.tsx", import.meta.url), "utf8")

    expect(jsonEditorProps).toHaveLength(2)
    expect(jsonEditorProps.every(({ theme }) => theme === "app")).toBe(true)
    expect(jsonEditorProps[0]?.ariaLabel).toBe("样式 JSON 编辑器")
    expect(jsonEditorProps[1]?.title).toBe("JSON")
    expect(html).toContain('aria-label="JSON 编辑器主题"')
    expect(html.match(/data-demo-action="theme-/g) ?? []).toHaveLength(4)
    expect(source).toContain(
      'import { ToggleGroup, ToggleGroupItem } from "@registry/ui/toggle-group"',
    )
    expect(source).toContain("theme={theme}")
    expect(source).not.toContain('from "@registry/ui/button"')
  })

  it("keeps design-token typography and focus-status feedback", () => {
    const html = renderToStaticMarkup(<JsonEditorDemo locale="zh-CN" />)

    expect(html).toContain("font-mono")
    expect(html).toContain("text-muted-foreground")
    expect(html).toContain('data-demo-status="json-editor"')
  })
})
