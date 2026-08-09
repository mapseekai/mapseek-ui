import type { ReactNode } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { beforeEach, describe, expect, it, vi } from "vitest"

interface CapturedJsonEditorProps {
  ariaLabel?: string
  children?: ReactNode
  theme?: unknown
  title?: string | null
}

const jsonEditorProps = vi.hoisted(() => [] as CapturedJsonEditorProps[])

vi.mock("@registry/blocks/json-editor", () => ({
  JsonEditor: (props: CapturedJsonEditorProps) => {
    jsonEditorProps.push(props)
    return (
      <div
        data-slot="json-editor"
        data-theme={props.theme === undefined ? "app-default" : String(props.theme)}
        data-title={props.title}
      />
    )
  },
}))

import { JsonEditorDemo } from "./JsonEditorShowcase"

describe("JsonEditorDemo", () => {
  beforeEach(() => {
    jsonEditorProps.length = 0
  })

  it("shows only the untitled and titled app-theme examples", () => {
    const html = renderToStaticMarkup(<JsonEditorDemo locale="zh-CN" />)

    expect(jsonEditorProps).toHaveLength(2)
    expect(jsonEditorProps.every(({ theme }) => theme === undefined || theme === "app")).toBe(true)
    expect(jsonEditorProps[0]?.ariaLabel).toBe("样式 JSON 编辑器")
    expect(jsonEditorProps[1]?.title).toBe("JSON")
    expect(html).not.toContain('data-demo-action="theme-')
    expect(html).not.toContain("<button")
  })

  it("uses design typography tokens for metadata and JSON data", () => {
    const html = renderToStaticMarkup(<JsonEditorDemo locale="zh-CN" />)

    expect(html).toContain("text-body-sm")
    expect(html).toContain("text-body-md")
    expect(html).not.toContain("text-[")
  })
})
