import { type CSSProperties, useCallback, useMemo, useState } from "react"

import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { cn } from "@/lib/utils"

export type NumberRangeInputProps = {
  value?: number
  defaultValue?: number
  min?: number
  max?: number
  step?: number
  onChange?(value: number | undefined): unknown
  required?: boolean
  disabled?: boolean
  name?: string
  "data-wd-key"?: string
  "aria-label"?: string
  className?: string
  sliderClassName?: string
  inputClassName?: string
}

function getRangeValue(
  val: number | string | undefined,
  fallback: number,
  min: number,
  max: number,
): number {
  if (val === undefined || val === "") return fallback
  const parsed = +val
  return Number.isNaN(parsed) ? fallback : Math.max(min, Math.min(max, parsed))
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}

function decimalPlaces(value: number): number {
  const text = String(value)
  if (text.includes("e-")) {
    const [, exponent] = text.split("e-")
    return Number(exponent) || 0
  }
  const [, fraction = ""] = text.split(".")
  return fraction.length
}

function roundToStepPrecision(value: number, step: number): number {
  const precision = Math.min(Math.max(decimalPlaces(step), 0), 8)
  return Number(value.toFixed(precision))
}

function snapToStep(value: number, min: number, max: number, step: number): number {
  if (!step) return clamp(value, min, max)
  const snapped = Math.round((value - min) / step) * step + min
  return clamp(roundToStepPrecision(snapped, step), min, max)
}

function formatNumberValue(value: number | string | undefined, step: number) {
  if (value === undefined || value === "") return ""
  if (typeof value === "string") return value
  return String(roundToStepPrecision(value, step))
}

function inputWidthStyle(
  value: number | string | undefined,
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
export function NumberRangeInput({
  value: propsValue,
  defaultValue,
  min = 0,
  max = 100,
  step = 1,
  onChange,
  required,
  disabled,
  name,
  "data-wd-key": dataWdKey,
  "aria-label": ariaLabel,
  className,
  sliderClassName,
  inputClassName,
}: NumberRangeInputProps) {
  const [editing, setEditing] = useState(false)
  const [editingRange, setEditingRange] = useState(false)
  const [keyboardEvent, setKeyboardEvent] = useState(false)
  const [value, setValue] = useState(propsValue)
  const [dirtyValue, setDirtyValue] = useState<number | string | undefined>(propsValue)
  const [prevProps, setPrevProps] = useState(propsValue)
  const [prevEditing, setPrevEditing] = useState(editing)

  // Keep local edit state stable while the user is typing, then resync from
  // controlled props once the edit commits.
  if (propsValue !== prevProps || editing !== prevEditing) {
    setPrevProps(propsValue)
    setPrevEditing(editing)
    if (!editing) {
      setValue(propsValue)
      setDirtyValue(propsValue)
    }
  }

  const isValid = useCallback(
    (v: number | string | undefined) => {
      if (v === undefined || v === "") return true
      const num = +v
      if (Number.isNaN(num)) return false
      if (num < min) return false
      if (num > max) return false
      return true
    },
    [min, max],
  )

  const changeValue = useCallback(
    (newValue: number | string | undefined) => {
      const parsedValue = newValue === "" || newValue === undefined ? undefined : +newValue
      const numValue =
        typeof parsedValue === "number" ? roundToStepPrecision(parsedValue, step) : parsedValue
      const hasChanged = propsValue !== numValue

      if (isValid(numValue) && hasChanged) {
        onChange?.(numValue)
        setValue(numValue)
      } else if (!isValid(numValue) && hasChanged) {
        setValue(undefined)
      }
      setDirtyValue(isValid(numValue) ? numValue : newValue)
    },
    [propsValue, onChange, isValid, step],
  )

  const commitValue = useCallback(
    (nextValue: number) => {
      const normalized = snapToStep(nextValue, min, max, step)
      setKeyboardEvent(false)
      setValue(normalized)
      setDirtyValue(normalized)
      onChange?.(normalized)
    },
    [min, max, step, onChange],
  )

  const resetValue = useCallback(() => {
    setEditing(false)
    if (!value) return

    if (!isValid(value)) {
      if (isValid(propsValue)) {
        changeValue(propsValue)
        setDirtyValue(propsValue)
      } else {
        changeValue(undefined)
        setDirtyValue(undefined)
      }
    }
  }, [value, propsValue, isValid, changeValue])

  const onChangeRange = (next: number | readonly number[]) => {
    const raw = Array.isArray(next) ? next[0] : (next as number)
    if (raw === undefined) return
    let val = raw

    if (step) {
      if (keyboardEvent) {
        val = val < +(dirtyValue || 0) ? (value || 0) - step : (value || 0) + step
      }
    }

    commitValue(val)
  }

  const rangeState = useMemo(() => {
    const displayValue = editing ? dirtyValue : value
    const inputValue = editingRange ? value : displayValue
    const fallbackValue = defaultValue ?? min
    const sliderValue = snapToStep(
      getRangeValue(editingRange ? value : displayValue, fallbackValue, min, max),
      min,
      max,
      step,
    )
    return {
      inputValue,
      sliderValue,
    }
  }, [editing, dirtyValue, editingRange, value, defaultValue, min, max, step])
  const displayedInputValue = formatNumberValue(rangeState.inputValue, step)

  return (
    <div className={cn("flex w-full items-center gap-2", className)}>
      <Slider
        aria-label={ariaLabel}
        className={cn("flex-1", sliderClassName)}
        data-wd-key={dataWdKey ? `${dataWdKey}-range` : undefined}
        disabled={disabled}
        max={max}
        min={min}
        step={step}
        value={rangeState.sliderValue}
        onBlur={() => {
          setEditing(false)
          setEditingRange(false)
          setDirtyValue(value)
        }}
        onKeyDown={() => setKeyboardEvent(true)}
        onPointerDown={() => {
          setEditing(true)
          setEditingRange(true)
        }}
        onPointerUp={() => {
          setEditing(false)
          setEditingRange(false)
        }}
        onValueChange={onChangeRange}
      />
      <Input
        aria-label={ariaLabel}
        className={cn("h-7 shrink-0 text-body-md tabular-nums", inputClassName)}
        data-wd-key={dataWdKey ? `${dataWdKey}-text` : undefined}
        disabled={disabled}
        inputMode="decimal"
        max={max}
        min={min}
        name={name}
        placeholder={defaultValue?.toString()}
        required={required}
        spellCheck="false"
        step={step}
        style={inputWidthStyle(rangeState.inputValue, min, max, step)}
        type="number"
        value={displayedInputValue}
        onBlur={() => {
          setEditing(false)
          resetValue()
        }}
        onChange={(event) => changeValue(event.target.value)}
        onFocus={() => setEditing(true)}
      />
    </div>
  )
}
