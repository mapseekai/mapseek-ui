import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"

import { NumberRangeInputDemo } from "./NumberRangeInputShowcase"

const examples = [
  {
    labelId: "number-range-percent-label",
    inputId: "number-range-percent",
    describedBy: "number-range-percent-help number-range-percent-error",
    sliderAriaLabel: {
      "zh-CN": "百分比滑块",
      en: "Percentage slider",
    },
  },
  {
    labelId: "number-range-zoom-label",
    inputId: "number-range-zoom",
    describedBy: "number-range-zoom-help",
    sliderAriaLabel: {
      "zh-CN": "缩放级别滑块",
      en: "Zoom level slider",
    },
  },
  {
    labelId: "number-range-opacity-label",
    inputId: "number-range-opacity",
    describedBy: "number-range-opacity-help",
    sliderAriaLabel: {
      "zh-CN": "不透明度滑块",
      en: "Opacity slider",
    },
  },
  {
    labelId: "number-range-disabled-label",
    inputId: "number-range-disabled",
    describedBy: "number-range-disabled-help",
    sliderAriaLabel: {
      "zh-CN": "禁用示例滑块",
      en: "Disabled example slider",
    },
  },
] as const

function elementMarkups(html: string, pattern: RegExp, description: string) {
  const elements = html.match(pattern) ?? []

  expect(elements, `expected four ${description} in showcase order`).toHaveLength(examples.length)
  return elements
}

describe("NumberRangeInput showcase", () => {
  it.each(["zh-CN", "en"] as const)("renders responsive field states in %s", (locale) => {
    const html = renderToStaticMarkup(<NumberRangeInputDemo locale={locale} />)

    expect(html).toContain('data-slot="field-group"')
    expect(html).toContain('data-slot="field-label"')
    expect(html).toContain('data-slot="field-description"')
    expect(html).toContain('data-slot="field-error"')
    expect(html).toContain("text-body-sm")
    expect(html).toContain("text-body-md")
    expect(html).toContain("sm:flex-row")
    expect(html).toContain("sm:items-start")
    expect(html).toContain("sm:[&amp;&gt;[data-slot=field-label]]:w-36")
    expect(html).not.toContain("grid-cols-[150px_minmax(0,1fr)]")
    expect(html).not.toContain("text-xs")
    expect(html).not.toContain("text-[10px]")

    const sliderRoots = elementMarkups(html, /<div[^>]*data-slot="slider"[^>]*>/g, "Slider roots")
    const rangeThumbs = elementMarkups(html, /<input[^>]*type="range"[^>]*>/g, "range thumbs")
    const numericInputs = elementMarkups(html, /<input[^>]*type="number"[^>]*>/g, "numeric inputs")

    for (const [index, example] of examples.entries()) {
      const sliderAriaLabel = example.sliderAriaLabel[locale]
      const sliderRoot = sliderRoots[index]
      const rangeThumb = rangeThumbs[index]
      const numericInput = numericInputs[index]

      expect(html).toContain(`id="${example.labelId}"`)
      expect(html).toContain(`for="${example.inputId}"`)
      expect(sliderRoot).toContain(`aria-labelledby="${example.labelId}"`)
      expect(sliderRoot).toContain(`aria-describedby="${example.describedBy}"`)
      expect(numericInput).toContain(`id="${example.inputId}"`)
      expect(numericInput).toContain(`aria-labelledby="${example.labelId}"`)
      expect(numericInput).toContain(`aria-describedby="${example.describedBy}"`)
      expect(sliderAriaLabel.trim()).not.toBe("")
      expect(rangeThumb).toContain(`aria-label="${sliderAriaLabel}"`)
    }

    expect(sliderRoots[0]).toContain('aria-invalid="true"')
    expect(sliderRoots[0]).toContain(
      'aria-describedby="number-range-percent-help number-range-percent-error"',
    )
    expect(numericInputs[0]).toContain('aria-invalid="true"')
    expect(numericInputs[0]).toContain(
      'aria-describedby="number-range-percent-help number-range-percent-error"',
    )
    expect(html).toContain('id="number-range-percent-error"')
    expect(html).toContain(locale === "zh-CN" ? "请输入百分比。" : "Enter a percentage.")
    expect(sliderRoots[3]).toContain('data-disabled=""')
    expect(rangeThumbs[3]).toContain('disabled=""')
    expect(numericInputs[3]).toContain('disabled=""')
  })
})
