import type { ButtonHTMLAttributes, ReactElement } from "react"
import { describe, expect, it, vi } from "vitest"

vi.mock("@/registry/lib/utils", () => ({
  cn: (...values: Array<string | undefined>) => values.filter(Boolean).join(" "),
}))

vi.mock("@/registry/ui/dialog", () => ({
  Dialog: (props: ButtonHTMLAttributes<HTMLDivElement>) => <div {...props} />,
  DialogContent: (props: ButtonHTMLAttributes<HTMLDivElement>) => <div {...props} />,
}))

vi.mock("@/registry/ui/input-group", () => ({
  InputGroup: (props: ButtonHTMLAttributes<HTMLDivElement>) => <div {...props} />,
  InputGroupAddon: (props: ButtonHTMLAttributes<HTMLDivElement>) => <div {...props} />,
}))

import { Command } from "./command"

describe("Command", () => {
  it("owns a visible boundary when used standalone", () => {
    const command = Command({}) as ReactElement<{ className: string }>
    const classes = command.props.className.split(/\s+/)

    expect(classes).toContain("border")
    expect(classes).toContain("border-border")
  })
})
