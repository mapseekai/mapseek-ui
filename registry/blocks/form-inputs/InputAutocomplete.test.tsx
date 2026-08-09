import type { ReactNode } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it, vi } from "vitest"

vi.mock("@/components/ui/combobox", () => ({
  Combobox: ({ children }: { children?: ReactNode }) => <div>{children}</div>,
  ComboboxContent: ({ children }: { children?: ReactNode }) => <div>{children}</div>,
  ComboboxEmpty: ({ children }: { children?: ReactNode }) => <div>{children}</div>,
  ComboboxInput: ({ showTrigger: _showTrigger, ...props }: { showTrigger?: boolean }) => (
    <input {...props} />
  ),
  ComboboxItem: ({ children }: { children?: ReactNode }) => <div>{children}</div>,
  ComboboxList: ({ children }: { children?: ReactNode }) => <div>{children}</div>,
}))

import { InputAutocomplete } from "./InputAutocomplete"

describe("InputAutocomplete", () => {
  it("renders caller-provided empty-state copy", () => {
    const html = renderToStaticMarkup(
      <InputAutocomplete value="missing" options={[["Arial"]]} emptyMessage="没有匹配结果。" />,
    )

    expect(html).toContain("没有匹配结果。")
    expect(html).not.toContain("No results found.")
  })
})
