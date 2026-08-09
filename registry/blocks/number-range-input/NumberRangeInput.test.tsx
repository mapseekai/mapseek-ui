import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"

import { NumberRangeInput, type NumberRangeInputProps } from "./NumberRangeInput"

function getSliderRoot(html: string): string {
  const sliderRoot = html.match(/<div\b[^>]*role="group"[^>]*>/)?.[0]
  if (!sliderRoot) throw new Error("Expected the Slider root")
  return sliderRoot
}

function getInputByType(html: string, type: "number" | "range"): string {
  const input = html.match(/<input\b[^>]*>/g)?.find((element) => element.includes(`type="${type}"`))
  if (!input) throw new Error(`Expected a ${type} input`)
  return input
}

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
    const sliderRoot = getSliderRoot(html)
    const sliderThumb = getInputByType(html, "range")
    const spinbutton = getInputByType(html, "number")

    expect(sliderRoot).toContain('aria-labelledby="opacity-label"')
    expect(sliderRoot).toContain('aria-describedby="opacity-help opacity-error"')
    expect(sliderRoot).toContain('aria-invalid="true"')
    expect(sliderThumb).toContain('aria-label="Opacity slider"')
    expect(spinbutton).toContain('id="opacity"')
    expect(spinbutton).toContain('aria-labelledby="opacity-label"')
    expect(spinbutton).toContain('aria-describedby="opacity-help opacity-error"')
    expect(spinbutton).toContain('aria-invalid="true"')
    expect(spinbutton).toContain('autoComplete="off"')
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

  it("uses defaultValue as the initial uncontrolled committed slider value", () => {
    const html = renderToStaticMarkup(<NumberRangeInput aria-label="Opacity" defaultValue={48} />)
    expect(getInputByType(html, "range")).toContain('aria-valuenow="48"')
  })

  it("rejects a blank direct accessible name", () => {
    expect(() => renderToStaticMarkup(<NumberRangeInput aria-label="  " value={48} />)).toThrow(
      "aria-label",
    )
  })

  it("rejects a blank visible accessible name", () => {
    expect(() =>
      renderToStaticMarkup(
        <NumberRangeInput aria-labelledby="  " sliderAriaLabel="Opacity slider" value={48} />,
      ),
    ).toThrow("aria-labelledby")
  })

  it("rejects blank explicit slider labels", () => {
    expect(() =>
      renderToStaticMarkup(
        <NumberRangeInput aria-label="Opacity" sliderAriaLabel="  " value={48} />,
      ),
    ).toThrow("sliderAriaLabel")
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
