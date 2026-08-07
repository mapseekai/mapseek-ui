import type { ButtonHTMLAttributes, ReactElement } from "react"
import { describe, expect, it, vi } from "vitest"

vi.mock("@/registry/lib/utils", () => ({
  cn: (...values: Array<string | undefined>) => values.filter(Boolean).join(" "),
}))

vi.mock("@/registry/ui/button", () => ({
  Button: (props: ButtonHTMLAttributes<HTMLButtonElement>) => <button {...props} />,
}))

import { AlertDialogOverlay } from "./alert-dialog"

describe("AlertDialogOverlay", () => {
  it("keeps spatial context visible behind the light modal backdrop", () => {
    const overlay = AlertDialogOverlay({}) as ReactElement<{ className: string }>
    const classes = overlay.props.className.split(/\s+/)

    expect(classes).toContain("bg-black/10")
    expect(classes).toContain("supports-backdrop-filter:backdrop-blur-xs")
    expect(classes).not.toContain("bg-black/40")
  })
})
