import type { ReactNode } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it, vi } from "vitest"

const inputNumberState = vi.hoisted(() => ({
  onValueChange: undefined as undefined | ((value: number | null) => void),
}))

vi.mock("@/components/ui/button", () => ({
  Button: ({ children, size, ...props }: { children?: ReactNode; size?: string }) => (
    <button data-size={size} {...props}>
      {children}
    </button>
  ),
}))
vi.mock("@/components/ui/calendar", () => ({ Calendar: () => <div data-slot="calendar" /> }))
vi.mock("@/components/ui/input", () => ({
  Input: ({ className, ...props }: { className?: string }) => (
    <input data-slot="input" className={["h-8", className].filter(Boolean).join(" ")} {...props} />
  ),
}))
vi.mock("@/components/ui/input-group", () => ({
  InputGroup: ({ children }: { children?: ReactNode }) => (
    <fieldset data-slot="input-group">{children}</fieldset>
  ),
  InputGroupAddon: ({ children, disabled }: { children?: ReactNode; disabled?: boolean }) => (
    <span data-slot="input-group-addon" data-disabled={disabled}>
      {children}
    </span>
  ),
  InputGroupInput: ({ className, ...props }: { className?: string }) => (
    <input
      data-slot="input-group-input"
      className={["h-8", className].filter(Boolean).join(" ")}
      {...props}
    />
  ),
  InputGroupText: ({ children }: { children?: ReactNode }) => (
    <span data-slot="input-group-text">{children}</span>
  ),
}))
vi.mock("@/components/ui/input-number", () => ({
  InputNumber: ({
    onValueChange,
    unit,
    value,
  }: {
    onValueChange?: (value: number | null) => void
    unit?: string
    value: number | null
  }) => {
    inputNumberState.onValueChange = onValueChange
    return <input data-slot="input-number" data-unit={unit} value={value ?? ""} readOnly />
  },
}))
vi.mock("@/components/ui/popover", () => ({
  Popover: "div",
  PopoverContent: "div",
  PopoverTrigger: ({ render }: { render?: ReactNode }) => <>{render}</>,
}))
vi.mock("@/components/ui/select", () => ({
  Select: "div",
  SelectContent: "div",
  SelectGroup: "div",
  SelectItem: "div",
  SelectTrigger: "button",
  SelectValue: "span",
}))
vi.mock("@/components/ui/tag", () => ({
  Tag: ({ children, color, size }: { children?: ReactNode; color?: string; size?: string }) => (
    <span data-slot="tag" data-color={color} data-size={size}>
      {children}
    </span>
  ),
}))
vi.mock("@/components/ui/tooltip", () => ({
  Tooltip: "div",
  TooltipContent: "div",
  TooltipTrigger: "div",
}))
vi.mock("@/lib/utils", () => ({
  cn: (...values: Array<string | false | undefined>) => values.filter(Boolean).join(" "),
}))

import { EditField, ReadField } from "./attr-field"

describe("EditField", () => {
  it("does not override the shared input surface for editable text fields", () => {
    const html = renderToStaticMarkup(
      <EditField
        name="name"
        value="Road"
        meta={{ name: "name", kind: "text" }}
        primaryKeyLabel="Primary key"
        onChange={() => {}}
      />,
    )

    expect(html).toMatch(/<input[^>]*class="[^"]*w-full[^"]*"/)
    expect(html).toMatch(/<input[^>]*class="[^"]*border-input[^"]*bg-input-surface[^"]*"/)
    expect(html).toContain('aria-label="name"')
    expect(html).toContain("px-2.5")
    expect(html).not.toContain("px-2 ")
    expect(html).not.toMatch(/<input[^>]*class="[^"]*(?:border-border|bg-background)[^"]*"/)
  })

  it("does not override the shared select input surface for enum fields", () => {
    const html = renderToStaticMarkup(
      <EditField
        name="type"
        value="road"
        meta={{ name: "type", enumOptions: ["road", "water"] }}
        primaryKeyLabel="Primary key"
        onChange={() => {}}
      />,
    )

    expect(html).toMatch(/<button[^>]*class="[^"]*w-full[^"]*"/)
    expect(html).toMatch(/<button[^>]*class="[^"]*border-input[^"]*bg-input-surface[^"]*"/)
    expect(html).toContain('aria-label="type"')
    expect(html).not.toMatch(/<button[^>]*class="[^"]*(?:border-border|bg-background)[^"]*"/)
  })

  it("labels editable code controls", () => {
    const html = renderToStaticMarkup(
      <EditField
        name="code"
        value="R2"
        meta={{ name: "code", kind: "code" }}
        primaryKeyLabel="Primary key"
        onChange={() => {}}
      />,
    )

    expect(html).toContain('aria-label="code"')
  })

  it("uses the shared number input and emits normalized numeric changes", () => {
    const onChange = vi.fn()
    const html = renderToStaticMarkup(
      <EditField
        name="area_m2"
        value="48210"
        meta={{ name: "area_m2", kind: "number", unit: "m²" }}
        primaryKeyLabel="Primary key"
        onChange={onChange}
      />,
    )

    expect(html).toContain('data-slot="input-number"')
    expect(html).toContain('data-unit="m²"')
    expect(html).toContain('value="48210"')
    expect(inputNumberState.onValueChange).toBeTypeOf("function")

    inputNumberState.onValueChange?.(512)
    inputNumberState.onValueChange?.(null)

    expect(onChange).toHaveBeenNthCalledWith(1, "area_m2", 512)
    expect(onChange).toHaveBeenNthCalledWith(2, "area_m2", null)
  })

  it("uses an explicit default Button size for date editing", () => {
    const html = renderToStaticMarkup(
      <EditField
        name="updated"
        value="2024-03-12"
        meta={{ name: "updated", kind: "date" }}
        primaryKeyLabel="Primary key"
        onChange={() => {}}
      />,
    )

    expect(html).toContain('data-size="default"')
  })

  it("disables locked fields so they cannot receive focus", () => {
    const html = renderToStaticMarkup(
      <EditField
        name="fid"
        value={1024}
        meta={{ name: "fid", kind: "id", readOnly: true }}
        primaryKeyLabel="Primary key"
        onChange={() => {}}
      />,
    )

    expect(html).toMatch(/<input[^>]*data-slot="input"[^>]*disabled=""/)
    expect(html).toContain('aria-label="fid"')
    expect(html).not.toContain('readOnly=""')
    expect(html).toContain("bg-input-surface")
    expect(html).not.toContain("bg-muted")
    expect(html).toContain('class="mb-1 flex')
    expect(html).not.toContain("mb-[3px]")
  })
})

describe("ReadField", () => {
  it("uses default-height shared controls and a gray sm Tag for field metadata", () => {
    const html = renderToStaticMarkup(
      <ReadField
        name="area_m2"
        value={48210}
        meta={{ name: "area_m2", kind: "number", unit: "m²" }}
        primaryKeyLabel="Primary key"
      />,
    )

    expect(html).toContain('data-slot="tag"')
    expect(html).toContain('data-color="gray"')
    expect(html).toContain('data-size="sm"')
    expect(html).toContain('data-slot="input-group"')
    expect(html).toContain('data-slot="input-group-input"')
    expect(html).toContain('data-slot="input-group-text"')
    expect(html).toMatch(/<input[^>]*data-slot="input-group-input"[^>]*disabled=""/)
    expect(html).toContain('data-slot="input-group-addon" data-disabled="true"')
    expect(html).toContain(">m²</span>")
    expect(html).not.toContain('readOnly=""')
    expect(html).not.toContain("min-h-7")
  })

  it("disables plain read-only values so they cannot receive focus", () => {
    const html = renderToStaticMarkup(
      <ReadField
        name="code"
        value="R2"
        meta={{ name: "code", kind: "text" }}
        primaryKeyLabel="Primary key"
      />,
    )

    expect(html).toMatch(/<input[^>]*data-slot="input"[^>]*disabled=""/)
    expect(html).not.toContain('readOnly=""')
  })
})
