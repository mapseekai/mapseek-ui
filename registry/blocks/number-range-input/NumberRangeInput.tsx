import { type AriaAttributes, type CSSProperties, useCallback, useState } from "react"

import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { cn } from "@/lib/utils"

import {
  getCommittedNumberRangeValue,
  type NumberRangeDraft,
  parseNumberRangeDraft,
  resetNumberRangeDraft,
  snapNumberRangeValue,
  updateUncontrolledNumberRangeValue,
} from "./NumberRangeInput.model"

type DirectAccessibleName = {
  "aria-label": string
  "aria-labelledby"?: never
  sliderAriaLabel?: string
}

type VisibleAccessibleName = {
  "aria-label"?: never
  "aria-labelledby": string
  sliderAriaLabel: string
}

type NumberRangeInputBaseProps = {
  value?: number
  defaultValue?: number
  min?: number
  max?: number
  step?: number
  onChange?(value: number | undefined): unknown
  id?: string
  name?: string
  required?: boolean
  disabled?: boolean
  autoComplete?: string
  "aria-describedby"?: string
  "aria-invalid"?: AriaAttributes["aria-invalid"]
  "data-wd-key"?: string
  className?: string
  sliderClassName?: string
  inputClassName?: string
}

export type NumberRangeInputProps = NumberRangeInputBaseProps &
  (DirectAccessibleName | VisibleAccessibleName)

const hasOwn = Object.prototype.hasOwnProperty

function assertNonBlankAccessibleName(
  value: string | undefined,
  propName: string,
): asserts value is string {
  if (value?.trim()) return
  throw new Error(`NumberRangeInput requires a non-blank ${propName}`)
}

function decimalPlaces(value: number): number {
  const text = String(value)
  if (text.includes("e")) {
    const [mantissa, exponent] = text.split("e")
    const [, fraction = ""] = mantissa.split(".")
    return Math.max(0, fraction.length - (Number(exponent) || 0))
  }
  const [, fraction = ""] = text.split(".")
  return fraction.length
}

function roundToStepPrecision(value: number, step: number): number {
  const precision = Math.min(Math.max(decimalPlaces(step), 0), 8)
  return Number(value.toFixed(precision))
}

function formatNumberValue(value: NumberRangeDraft, step: number) {
  if (value === undefined || value === "") return ""
  if (typeof value === "string") return value
  return String(roundToStepPrecision(value, step))
}

function inputWidthStyle(
  value: NumberRangeDraft,
  min: number,
  max: number,
  step: number,
): CSSProperties {
  const precision = decimalPlaces(step)
  const signed = min < 0 || max < 0
  const integerLength = Math.max(
    1,
    ...[min, max].map((candidate) => Math.trunc(Math.abs(candidate)).toString().length),
  )
  const steppedLength = integerLength + (signed ? 1 : 0) + (precision > 0 ? precision + 1 : 0)
  const candidates = [value, min, max].map((candidate) => formatNumberValue(candidate, step))
  const numericLength = Math.max(
    1,
    ...candidates.map((candidate) => candidate.length),
    steppedLength,
  )

  // Native number inputs reserve space for browser stepper controls, so the
  // visible text needs extra room beyond its character count.
  return {
    width: `clamp(4.5rem, calc(${numericLength}ch + 2.75rem), 9rem)`,
  }
}

/**
 * Compact numeric input paired with a single-thumb range slider.
 * Accepts typed numbers, clamps slider values to min/max, and snaps slider
 * movement to `step`.
 */
export function NumberRangeInput(props: NumberRangeInputProps) {
  const controlled = hasOwn.call(props, "value")
  const {
    value: controlledValue,
    defaultValue,
    min = 0,
    max = 100,
    step = 1,
    onChange,
    id,
    name,
    required,
    disabled,
    autoComplete,
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledBy,
    "aria-describedby": ariaDescribedBy,
    "aria-invalid": ariaInvalid,
    "data-wd-key": dataWdKey,
    className,
    sliderClassName,
    inputClassName,
  } = props
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue)
  const [draft, setDraft] = useState<NumberRangeDraft>(defaultValue)
  const [editing, setEditing] = useState(false)
  const committedValue = getCommittedNumberRangeValue(
    controlled,
    controlledValue,
    uncontrolledValue,
  )

  const commitValue = useCallback(
    (next: number | undefined) => {
      setUncontrolledValue((current) =>
        updateUncontrolledNumberRangeValue(controlled, current, next),
      )
      if (next !== committedValue) onChange?.(next)
    },
    [committedValue, controlled, onChange],
  )

  const handleInputChange = useCallback(
    (nextDraft: string) => {
      setDraft(nextDraft)
      const parsed = parseNumberRangeDraft(nextDraft, min, max, step)
      if (parsed.valid) commitValue(parsed.value)
    },
    [commitValue, max, min, step],
  )

  const handleInputFocus = useCallback(() => {
    setDraft(resetNumberRangeDraft(committedValue))
    setEditing(true)
  }, [committedValue])

  const handleInputBlur = useCallback(() => {
    const parsed = parseNumberRangeDraft(draft, min, max, step)
    setEditing(false)
    if (!parsed.valid) setDraft(resetNumberRangeDraft(committedValue))
  }, [committedValue, draft, max, min, step])

  const handleSliderChange = useCallback(
    (next: number | readonly number[]) => {
      const rawValue = Array.isArray(next) ? next[0] : next
      if (rawValue === undefined) return
      const snappedValue = snapNumberRangeValue(rawValue, min, max, step)
      setDraft(snappedValue)
      commitValue(snappedValue)
    },
    [commitValue, max, min, step],
  )

  const parsedDraft = parseNumberRangeDraft(draft, min, max, step)
  const internalInvalid = editing && !parsedDraft.valid
  const effectiveInvalid = internalInvalid ? true : ariaInvalid
  const inputDisplayValue = editing ? draft : resetNumberRangeDraft(committedValue)
  const sliderValue = snapNumberRangeValue(committedValue ?? min, min, max, step)
  const usesDirectName = "aria-label" in props && props["aria-label"] !== undefined
  const thumbLabel = usesDirectName
    ? (props.sliderAriaLabel ?? props["aria-label"])
    : props.sliderAriaLabel

  if (usesDirectName) {
    assertNonBlankAccessibleName(props["aria-label"], "aria-label")
  } else {
    assertNonBlankAccessibleName(props["aria-labelledby"], "aria-labelledby")
  }
  assertNonBlankAccessibleName(thumbLabel, "sliderAriaLabel")

  return (
    <div className={cn("flex w-full items-center gap-2", className)}>
      <Slider
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        aria-describedby={ariaDescribedBy}
        aria-invalid={effectiveInvalid}
        getAriaLabel={() => thumbLabel}
        className={cn("flex-1", sliderClassName)}
        data-wd-key={dataWdKey ? `${dataWdKey}-range` : undefined}
        disabled={disabled}
        min={min}
        max={max}
        step={step}
        value={sliderValue}
        onValueChange={handleSliderChange}
      />
      <Input
        id={id}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        aria-describedby={ariaDescribedBy}
        aria-invalid={effectiveInvalid}
        autoComplete={autoComplete ?? "off"}
        className={cn("shrink-0 text-body-md tabular-nums", inputClassName)}
        data-wd-key={dataWdKey ? `${dataWdKey}-text` : undefined}
        disabled={disabled}
        inputMode="decimal"
        min={min}
        max={max}
        name={name}
        required={required}
        spellCheck="false"
        step={step}
        style={inputWidthStyle(inputDisplayValue, min, max, step)}
        type="number"
        value={formatNumberValue(inputDisplayValue, step)}
        onBlur={handleInputBlur}
        onChange={(event) => handleInputChange(event.target.value)}
        onFocus={handleInputFocus}
      />
    </div>
  )
}
