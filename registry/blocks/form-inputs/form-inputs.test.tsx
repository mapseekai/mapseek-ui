import type { ComponentType, ReactNode } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"

import { InputCheckbox } from "./InputCheckbox"
import { InputFont } from "./InputFont"
import { InputMultiInput } from "./InputMultiInput"
import { InputNumber } from "./InputNumber"
import { InputSelect, type InputSelectProps } from "./InputSelect"
import { InputString } from "./InputString"

describe("form inputs", () => {
  it("forwards field semantics through the checkbox wrapper", () => {
    const html = renderToStaticMarkup(
      <InputCheckbox
        id="visibility"
        name="visibility"
        aria-label="Visibility"
        aria-invalid
        disabled
        required
        value
        onChange={() => {}}
      />,
    )

    expect(html).toContain('id="visibility"')
    expect(html).toContain('name="visibility"')
    expect(html).toContain('aria-label="Visibility"')
    expect(html).toContain('aria-invalid="true"')
    expect(html).toContain("disabled")
    expect(html).toContain('aria-required="true"')
  })

  it("renders the numeric editor as a standard-sized decimal input", () => {
    const html = renderToStaticMarkup(
      <InputNumber aria-label="Opacity" value={12} onChange={() => {}} />,
    )

    expect(html).toContain('type="number"')
    expect(html).toContain('inputMode="decimal"')
    expect(html).toContain("h-8")
    expect(html).not.toContain("h-7")
  })

  it("forwards the strict field contract in range mode", () => {
    const html = renderToStaticMarkup(
      <InputNumber
        allowRange
        id="opacity"
        name="opacity"
        min={0}
        max={100}
        value={48}
        aria-labelledby="opacity-label"
        sliderAriaLabel="Opacity slider"
        aria-describedby="opacity-help"
        aria-invalid
        autoComplete="off"
      />,
    )

    expect(html).toContain('id="opacity"')
    expect(html).toContain('name="opacity"')
    expect(html).toContain('aria-label="Opacity slider"')
    expect(html).toContain('aria-describedby="opacity-help"')
    expect(html).toContain('aria-invalid="true"')
    expect(html).toMatch(/autocomplete="off"/i)
  })

  it("keeps a default-only range uncontrolled", () => {
    const html = renderToStaticMarkup(
      <InputNumber allowRange aria-label="Opacity" default={48} min={0} max={100} />,
    )

    expect(html).toContain('aria-valuenow="48"')
  })

  it("preserves the input primitive spacing and semantic surface", () => {
    const html = renderToStaticMarkup(
      <InputString aria-label="Layer name" value="Roads" onChange={() => {}} />,
    )

    expect(html).toContain("bg-input-surface")
    expect(html).toContain("px-2.5")
    expect(html).not.toContain("w-full bg-transparent px-3")
    expect(html).not.toContain("px-3")
  })

  it("draws keyboard focus on the visible segmented option", () => {
    const html = renderToStaticMarkup(
      <InputMultiInput
        aria-label="Visibility"
        value="visible"
        options={["visible", "none"]}
        onChange={() => {}}
      />,
    )

    expect(html).toContain("has-focus-visible:ring-3")
    expect(html).toContain("has-focus-visible:ring-ring/20")
  })

  it("uses caller-provided select copy", () => {
    const SelectWithPlaceholder = InputSelect as ComponentType<
      InputSelectProps & { placeholder?: ReactNode }
    >

    const selectHtml = renderToStaticMarkup(
      <SelectWithPlaceholder
        value=""
        options={["mercator"]}
        placeholder="选择选项…"
        onChange={() => {}}
      />,
    )

    expect(selectHtml).toContain("选择选项…")
  })

  it("gives every font-stack input a distinct accessible name", () => {
    const html = renderToStaticMarkup(
      <InputFont
        name="text-font"
        aria-label="Font stack"
        value={["Open Sans Regular"]}
        fonts={["Open Sans Regular", "Roboto Mono"]}
        onChange={() => {}}
      />,
    )

    expect(html).toContain('aria-label="Font stack 1"')
    expect(html).toContain('aria-label="Font stack 2"')
  })
})

const directRangeLabel = {
  allowRange: true,
  "aria-label": "Opacity",
} satisfies React.ComponentProps<typeof InputNumber>

const visibleRangeLabel = {
  allowRange: true,
  "aria-labelledby": "opacity-label",
  sliderAriaLabel: "Opacity slider",
} satisfies React.ComponentProps<typeof InputNumber>

const ordinaryNumberWithoutLabel = {} satisfies React.ComponentProps<typeof InputNumber>

// @ts-expect-error Range mode must have an accessible-name contract.
const missingRangeLabel = { allowRange: true } satisfies React.ComponentProps<typeof InputNumber>

const missingSliderLabel = {
  allowRange: true,
  "aria-labelledby": "opacity-label",
  // @ts-expect-error Visible labels require a separate slider label in range mode.
} satisfies React.ComponentProps<typeof InputNumber>

void directRangeLabel
void visibleRangeLabel
void ordinaryNumberWithoutLabel
void missingRangeLabel
void missingSliderLabel
