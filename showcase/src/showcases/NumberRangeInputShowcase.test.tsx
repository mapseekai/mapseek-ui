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

function inputMarkup(html: string, id: string) {
  const start = html.indexOf(`id="${id}"`)
  const end = html.indexOf(">", start)

  expect(start).toBeGreaterThan(-1)
  return html.slice(start, end + 1)
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

    for (const example of examples) {
      const sliderAriaLabel = example.sliderAriaLabel[locale]
      const input = inputMarkup(html, example.inputId)
      const labelledBy = html.match(new RegExp(`aria-labelledby="${example.labelId}"`, "g")) ?? []
      const describedBy =
        html.match(new RegExp(`aria-describedby="${example.describedBy}"`, "g")) ?? []

      expect(html).toContain(`id="${example.labelId}"`)
      expect(html).toContain(`for="${example.inputId}"`)
      expect(input).toContain(`aria-labelledby="${example.labelId}"`)
      expect(input).toContain(`aria-describedby="${example.describedBy}"`)
      expect(labelledBy).toHaveLength(2)
      expect(describedBy).toHaveLength(2)
      expect(sliderAriaLabel.trim()).not.toBe("")
      expect(html).toMatch(new RegExp(`<input aria-label="${sliderAriaLabel}"[^>]*type="range"`))
    }

    expect(html.match(/aria-invalid="true"/g) ?? []).toHaveLength(2)
    expect(html).toContain('id="number-range-percent-error"')
    expect(html).toContain(locale === "zh-CN" ? "请输入百分比。" : "Enter a percentage.")
    expect(inputMarkup(html, "number-range-disabled")).toContain('disabled=""')
  })
})
