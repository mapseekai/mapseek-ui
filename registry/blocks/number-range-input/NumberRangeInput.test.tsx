import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"

import { NumberRangeInput, type NumberRangeInputProps } from "./NumberRangeInput"

describe("NumberRangeInput", () => {
  it("names the group, spinbutton, and actual slider thumb from aria-label", () => {
    const html = renderToStaticMarkup(
      <NumberRangeInput aria-label="Opacity" value={48} min={0} max={100} />,
    )
    expect(html.match(/aria-label="Opacity"/g)?.length).toBeGreaterThanOrEqual(3)
  })

  it("supports visible-label mode and forwards field relationships", () => {
    const html = renderToStaticMarkup(
      <NumberRangeInput
        id="opacity"
        aria-labelledby="opacity-label"
        sliderAriaLabel="Opacity slider"
        aria-describedby="opacity-help opacity-error"
        aria-invalid
        autoComplete="off"
        value={48}
      />,
    )
    expect(html).toContain('id="opacity"')
    expect(html).toContain('aria-labelledby="opacity-label"')
    expect(html).toContain('aria-label="Opacity slider"')
    expect(html).toContain('aria-describedby="opacity-help opacity-error"')
    expect(html).toContain('aria-invalid="true"')
    expect(html).toContain('autoComplete="off"')
  })

  it("uses the standard Input height", () => {
    const html = renderToStaticMarkup(<NumberRangeInput aria-label="Zoom" value={12} />)
    expect(html).toContain("h-8")
    expect(html).not.toContain("h-7")
  })

  it("keeps an explicitly undefined controlled value cleared", () => {
    const html = renderToStaticMarkup(
      <NumberRangeInput aria-label="Opacity" value={undefined} defaultValue={48} />,
    )
    expect(html).toContain('aria-valuenow="0"')
  })
})

const directLabel = { "aria-label": "Opacity" } satisfies NumberRangeInputProps
const visibleLabel = {
  "aria-labelledby": "opacity-label",
  sliderAriaLabel: "Opacity slider",
} satisfies NumberRangeInputProps

// @ts-expect-error NumberRangeInput must have an accessible-name contract.
const missingLabel = {} satisfies NumberRangeInputProps
void directLabel
void visibleLabel
void missingLabel
