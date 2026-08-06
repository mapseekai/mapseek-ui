import type { ReactElement } from "react"
import type { ToasterProps } from "sonner"
import { describe, expect, it, vi } from "vitest"

vi.mock("next-themes", () => ({
  useTheme: () => ({ theme: "light" }),
}))

import { Toaster } from "./sonner"

describe("Toaster", () => {
  it("maps toast borders and the info icon to their semantic type colors", () => {
    const element = Toaster({}) as ReactElement<ToasterProps>
    const toastClassName = element.props.toastOptions?.classNames?.toast
    const infoIcon = element.props.icons?.info as ReactElement<{ className: string }>

    expect(toastClassName).toContain("!border")
    expect(toastClassName).toContain("!border-border")
    expect(toastClassName).toContain("data-[type=success]:!border-primary")
    expect(toastClassName).toContain("data-[type=error]:!border-destructive")
    expect(toastClassName).toContain("data-[type=warning]:!border-warning")
    expect(toastClassName).toContain("data-[type=info]:!border-info")
    expect(toastClassName).not.toContain("!border-0")
    expect(infoIcon.props.className).toContain("text-info")
  })

  it("maps toast titles and descriptions to their semantic type colors", () => {
    const element = Toaster({}) as ReactElement<ToasterProps>
    const classNames = element.props.toastOptions?.classNames

    expect(classNames?.toast).toContain("group/toast")

    for (const semanticClass of [
      "group-data-[type=success]/toast:!text-primary",
      "group-data-[type=error]/toast:!text-destructive",
      "group-data-[type=warning]/toast:!text-warning",
      "group-data-[type=info]/toast:!text-info",
    ]) {
      expect(classNames?.title).toContain(semanticClass)
      expect(classNames?.description).toContain(semanticClass)
    }

    expect(classNames?.description).toContain("!text-muted-foreground")
  })
})
