import { IconAbc } from "@tabler/icons-react"
import type { ReactNode } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it, vi } from "vitest"

const toggleGroupState = vi.hoisted(() => ({
  onValueChange: undefined as undefined | ((value: string[]) => void),
}))

vi.mock("@/components/ui/checkbox", () => ({ Checkbox: "div" }))
vi.mock("@/components/ui/button", () => ({
  Button: ({ children, ...props }: { children?: ReactNode }) => (
    <button {...props}>{children}</button>
  ),
}))
vi.mock("@/components/ui/calendar", () => ({
  Calendar: () => <div data-slot="calendar" />,
}))
vi.mock("@/components/ui/field", () => ({
  Field: "div",
  FieldDescription: "div",
  FieldGroup: "div",
  FieldLabel: ({ children, required }: { children?: ReactNode; required?: boolean }) => (
    <span data-required={required || undefined}>{children}</span>
  ),
  FieldLegend: "legend",
  FieldSet: "fieldset",
}))
vi.mock("@/components/ui/input", () => ({
  Input: ({ className, ...props }: { className?: string }) => (
    <input {...props} className={["h-8", className].filter(Boolean).join(" ")} />
  ),
}))
vi.mock("@/components/ui/input-number", () => ({
  InputNumber: ({ step }: { step?: number | "any" }) => (
    <input data-slot="input-number" data-step={step} />
  ),
}))
vi.mock("@/components/ui/popover", () => ({
  Popover: ({ children }: { children?: ReactNode }) => <div data-slot="popover">{children}</div>,
  PopoverContent: ({ children }: { children?: ReactNode }) => (
    <div data-slot="popover-content">{children}</div>
  ),
  PopoverTrigger: ({ render }: { render?: ReactNode }) => <>{render}</>,
}))
vi.mock("@/components/ui/select", () => ({
  Select: ({ children }: { children?: ReactNode }) => <div data-slot="select">{children}</div>,
  SelectContent: ({ children }: { children?: ReactNode }) => (
    <div data-slot="select-content">{children}</div>
  ),
  SelectGroup: ({ children }: { children?: ReactNode }) => <div>{children}</div>,
  SelectItem: ({ children, value, ...props }: { children?: ReactNode; value?: string | null }) => (
    <div {...props} data-slot="select-item" data-value={value ?? "unset"}>
      {children}
    </div>
  ),
  SelectTrigger: ({ children }: { children?: ReactNode }) => (
    <button data-slot="select-trigger" type="button">
      {children}
    </button>
  ),
  SelectValue: () => <span data-slot="select-value" />,
}))
vi.mock("@/components/ui/textarea", () => ({
  Textarea: ({ className, ...props }: { className?: string }) => (
    <textarea {...props} className={["min-h-16", className].filter(Boolean).join(" ")} />
  ),
}))
vi.mock("@/components/ui/toggle-group", () => ({
  ToggleGroup: ({
    children,
    onValueChange,
  }: {
    children?: ReactNode
    onValueChange?: (value: string[]) => void
  }) => {
    toggleGroupState.onValueChange = onValueChange
    return <div>{children}</div>
  },
  ToggleGroupItem: "button",
}))
vi.mock("@/lib/utils", () => ({
  cn: (...values: Array<string | false | undefined>) => values.filter(Boolean).join(" "),
}))

import { AddFieldForm } from "./AddFieldForm"
import type { AddFieldFormLabels, AddFieldValue, FieldTypeOption } from "./types"

describe("AddFieldForm", () => {
  const fieldTypes: FieldTypeOption[] = [
    { id: "text", label: "文字", icon: IconAbc },
    { id: "integer", label: "整型", icon: IconAbc },
    { id: "float", label: "浮点型", icon: IconAbc },
    { id: "boolean", label: "布尔", icon: IconAbc },
    { id: "date", label: "日期", icon: IconAbc },
  ]

  const labels: AddFieldFormLabels = {
    nameLabel: "Name",
    namePlaceholder: "status",
    typeLabel: "Type",
    defaultLabel: "Default",
    booleanTrueLabel: "Yes",
    booleanFalseLabel: "No",
    nullableLabel: "Nullable",
    descLabel: "Description",
    descPlaceholder: "Feature status",
  }

  const renderForm = (
    type: AddFieldValue["type"] = "text",
    onChange: (next: AddFieldValue) => void = () => {},
  ) =>
    renderToStaticMarkup(
      <AddFieldForm
        value={{
          name: "status",
          type,
          defaultVal: "",
          nullable: true,
          desc: "Feature status",
        }}
        onChange={onChange}
        fieldTypes={fieldTypes}
        labels={labels}
      />,
    )

  it("uses the shared input surface and default height for every single-line field", () => {
    const html = renderForm()
    const inputTags = Array.from(html.matchAll(/<input[^>]*>/g)).map(([tag]) => tag)

    expect(inputTags).toHaveLength(2)
    for (const inputTag of inputTags) {
      expect(inputTag).toContain("h-8")
      expect(inputTag).not.toContain("h-7")
      expect(inputTag).toContain("border-input")
      expect(inputTag).toContain("bg-input-surface")
      expect(inputTag).toContain("px-2.5")
      expect(inputTag).not.toMatch(/class="[^"]*(?:border-border|bg-background)[^"]*"/)
    }
    expect(inputTags[0]).toContain('required=""')
    expect(inputTags[0]).toContain('name="field-name"')
    expect(inputTags[0]).toContain('autoComplete="off"')
    expect(inputTags[0]).toContain('spellCheck="false"')
  })

  it("does not render the legacy schema-key hint", () => {
    expect(renderForm()).not.toContain("Field name")
  })

  it("shows only primary labels without trailing helper copy", () => {
    const html = renderForm()

    expect(html).not.toContain("Required")
    expect(html).not.toContain("Optional")
    expect(html).not.toContain("Can be empty")
  })

  it("marks the required field name through the shared FieldLabel API", () => {
    expect(renderForm()).toContain('data-required="true"')
  })

  it("renders the description as a multi-line textarea", () => {
    const textareaTags = Array.from(renderForm().matchAll(/<textarea[^>]*>/g)).map(([tag]) => tag)

    expect(textareaTags).toHaveLength(1)
    expect(textareaTags[0]).toContain("min-h-16")
    expect(textareaTags[0]).toContain('placeholder="Feature status"')
  })

  it("renders a default-value control that matches the selected field type", () => {
    expect(renderForm("integer")).toContain('data-slot="input-number" data-step="1"')
    expect(renderForm("float")).toContain('data-slot="input-number" data-step="0.1"')

    const booleanHtml = renderForm("boolean")
    expect(booleanHtml).toContain('data-slot="select"')
    expect(booleanHtml).not.toContain(">Empty</div>")
    expect(booleanHtml).toContain(">Yes</div>")
    expect(booleanHtml).toContain(">No</div>")
    expect(booleanHtml.match(/data-slot="select-item"/g)).toHaveLength(2)

    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 7, 8, 12))
    try {
      const dateHtml = renderForm("date")
      expect(dateHtml).toContain(">2026-08-08</span>")
      expect(dateHtml).toContain('data-slot="calendar"')
      expect(dateHtml).not.toContain('type="date"')
    } finally {
      vi.useRealTimers()
    }
  })

  it("sets boolean and date defaults when the field type changes", () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 7, 8, 12))
    const changes: AddFieldValue[] = []

    try {
      renderForm("text", (next) => changes.push(next))

      expect(toggleGroupState.onValueChange).toBeTypeOf("function")
      toggleGroupState.onValueChange?.(["boolean"])
      toggleGroupState.onValueChange?.(["date"])

      expect(changes).toEqual([
        {
          name: "status",
          type: "boolean",
          defaultVal: false,
          nullable: true,
          desc: "Feature status",
        },
        {
          name: "status",
          type: "date",
          defaultVal: "2026-08-08",
          nullable: true,
          desc: "Feature status",
        },
      ])
    } finally {
      vi.useRealTimers()
    }
  })
})
