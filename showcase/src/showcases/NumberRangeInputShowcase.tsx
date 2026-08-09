import { NumberRangeInput } from "@registry/blocks/number-range-input"
import { Button } from "@registry/ui/button"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@registry/ui/field"
import { useState } from "react"
import type { LocalizedDemoProps } from "./types"

const labels = {
  "zh-CN": {
    intro: "数字输入和单滑块组合。支持直接输入、键盘步进、min/max 限制和小数 step。",
    reset: "清空",
    percent: "百分比",
    percentSlider: "百分比滑块",
    percentDescription: "0–100 · 步进 1",
    requiredError: "请输入百分比。",
    zoom: "缩放级别",
    zoomSlider: "缩放级别滑块",
    zoomDescription: "0–24 · 步进 0.5",
    opacity: "不透明度",
    opacitySlider: "不透明度滑块",
    opacityDescription: "0–1 · 步进 0.001",
    disabled: "禁用示例",
    disabledSlider: "禁用示例滑块",
    disabledDescription: "此值已锁定，不能编辑。",
  },
  en: {
    intro:
      "Number input paired with a single slider. Supports typing, keyboard steps, min/max, and decimal steps.",
    reset: "Clear",
    percent: "Percentage",
    percentSlider: "Percentage slider",
    percentDescription: "0–100 · step 1",
    requiredError: "Enter a percentage.",
    zoom: "Zoom level",
    zoomSlider: "Zoom level slider",
    zoomDescription: "0–24 · step 0.5",
    opacity: "Opacity",
    opacitySlider: "Opacity slider",
    opacityDescription: "0–1 · step 0.001",
    disabled: "Disabled example",
    disabledSlider: "Disabled example slider",
    disabledDescription: "This value is locked and cannot be edited.",
  },
}

const fieldClassName =
  "sm:flex-row sm:items-start sm:[&>[data-slot=field-label]]:w-36 sm:[&>[data-slot=field-label]]:shrink-0"

export function NumberRangeInputDemo({ locale = "zh-CN" }: LocalizedDemoProps) {
  const demoLabels = labels[locale]
  const [percent, setPercent] = useState<number | undefined>(undefined)
  const [zoom, setZoom] = useState<number | undefined>(12)
  const [opacity, setOpacity] = useState<number | undefined>(0.625)
  const percentInvalid = percent === undefined ? true : undefined

  return (
    <div className="flex w-full max-w-[560px] flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="m-0 text-body-sm text-muted-foreground">{demoLabels.intro}</p>
        <Button
          type="button"
          data-demo-action="clear-ranges"
          variant="outline"
          size="xs"
          onClick={() => {
            setPercent(undefined)
            setZoom(undefined)
            setOpacity(undefined)
          }}
        >
          {demoLabels.reset}
        </Button>
      </div>

      <FieldGroup className="gap-3 border border-border p-3">
        <Field orientation="vertical" data-invalid={percentInvalid} className={fieldClassName}>
          <FieldLabel
            id="number-range-percent-label"
            htmlFor="number-range-percent"
            required
            className="text-body-md"
          >
            {demoLabels.percent}
          </FieldLabel>
          <FieldContent>
            <NumberRangeInput
              id="number-range-percent"
              aria-labelledby="number-range-percent-label"
              sliderAriaLabel={demoLabels.percentSlider}
              aria-describedby={
                percent === undefined
                  ? "number-range-percent-help number-range-percent-error"
                  : "number-range-percent-help"
              }
              aria-invalid={percentInvalid}
              required
              value={percent}
              min={0}
              max={100}
              step={1}
              onChange={setPercent}
            />
            <FieldDescription id="number-range-percent-help" className="text-body-sm">
              {demoLabels.percentDescription}
            </FieldDescription>
            {percent === undefined ? (
              <FieldError id="number-range-percent-error" className="text-body-md">
                {demoLabels.requiredError}
              </FieldError>
            ) : null}
          </FieldContent>
        </Field>

        <Field orientation="vertical" className={fieldClassName}>
          <FieldLabel
            id="number-range-zoom-label"
            htmlFor="number-range-zoom"
            className="text-body-md"
          >
            {demoLabels.zoom}
          </FieldLabel>
          <FieldContent>
            <NumberRangeInput
              id="number-range-zoom"
              aria-labelledby="number-range-zoom-label"
              sliderAriaLabel={demoLabels.zoomSlider}
              aria-describedby="number-range-zoom-help"
              value={zoom}
              min={0}
              max={24}
              step={0.5}
              onChange={setZoom}
            />
            <FieldDescription id="number-range-zoom-help" className="text-body-sm">
              {demoLabels.zoomDescription}
            </FieldDescription>
          </FieldContent>
        </Field>

        <Field orientation="vertical" className={fieldClassName}>
          <FieldLabel
            id="number-range-opacity-label"
            htmlFor="number-range-opacity"
            className="text-body-md"
          >
            {demoLabels.opacity}
          </FieldLabel>
          <FieldContent>
            <NumberRangeInput
              id="number-range-opacity"
              aria-labelledby="number-range-opacity-label"
              sliderAriaLabel={demoLabels.opacitySlider}
              aria-describedby="number-range-opacity-help"
              value={opacity}
              min={0}
              max={1}
              step={0.001}
              onChange={setOpacity}
            />
            <FieldDescription id="number-range-opacity-help" className="text-body-sm">
              {demoLabels.opacityDescription}
            </FieldDescription>
          </FieldContent>
        </Field>

        <Field orientation="vertical" data-disabled className={fieldClassName}>
          <FieldLabel
            id="number-range-disabled-label"
            htmlFor="number-range-disabled"
            className="text-body-md"
          >
            {demoLabels.disabled}
          </FieldLabel>
          <FieldContent>
            <NumberRangeInput
              id="number-range-disabled"
              aria-labelledby="number-range-disabled-label"
              sliderAriaLabel={demoLabels.disabledSlider}
              aria-describedby="number-range-disabled-help"
              value={50}
              min={0}
              max={100}
              step={1}
              disabled
            />
            <FieldDescription id="number-range-disabled-help" className="text-body-sm">
              {demoLabels.disabledDescription}
            </FieldDescription>
          </FieldContent>
        </Field>
      </FieldGroup>

      <pre className="m-0 max-h-[180px] min-w-0 max-w-full overflow-auto border border-border bg-muted/30 p-2 font-mono text-body-md">
        {JSON.stringify({ percent, zoom, opacity }, null, 2)}
      </pre>
    </div>
  )
}
