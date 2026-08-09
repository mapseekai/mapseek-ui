import type React from "react"
import { useCallback, useState } from "react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { NumberRangeInput } from "../number-range-input"

export type InputNumberProps = {
  value?: number
  default?: number
  min?: number
  max?: number
  onChange?(value: number | undefined): unknown
  allowRange?: boolean
  rangeStep?: number
  "data-wd-key"?: string
  required?: boolean
  disabled?: boolean
  id?: string
  name?: string
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"]
  "aria-label"?: string
  "aria-labelledby"?: string
  "aria-invalid"?: React.AriaAttributes["aria-invalid"]
  className?: string
}

/**
 * Numeric input with commit-on-blur validation and an optional inline range
 * slider (when both `min` and `max` are set and `allowRange`). Domain-free.
 * See BLOCKS-EXTRACTION.md § form-inputs.
 */
export const InputNumber: React.FC<InputNumberProps> = ({
  value: propsValue,
  default: defaultValue,
  min,
  max,
  onChange,
  allowRange,
  rangeStep = 1,
  "data-wd-key": dataWdKey,
  required,
  disabled,
  id,
  name,
  inputMode = "decimal",
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  "aria-invalid": ariaInvalid,
  className,
}) => {
  const [editing, setEditing] = useState(false)
  const [value, setValue] = useState(propsValue)
  const [dirtyValue, setDirtyValue] = useState<number | string | undefined>(propsValue)

  const [prevProps, setPrevProps] = useState(propsValue)
  const [prevEditing, setPrevEditing] = useState(editing)

  // Adjust-during-render sync, equivalent to useEffect([propsValue, editing]).
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
      if (min !== undefined && num < min) return false
      if (max !== undefined && num > max) return false
      return true
    },
    [min, max],
  )

  const changeValue = useCallback(
    (newValue: number | string | undefined) => {
      const numValue = newValue === "" || newValue === undefined ? undefined : +newValue
      const hasChanged = propsValue !== numValue

      if (isValid(numValue) && hasChanged) {
        if (onChange) onChange(numValue)
        setValue(numValue)
      } else if (!isValid(numValue) && hasChanged) {
        setValue(undefined)
      }
      setDirtyValue(newValue === "" ? undefined : newValue)
    },
    [propsValue, onChange, isValid],
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

  const isRangeMode = min !== undefined && max !== undefined && allowRange

  if (isRangeMode) {
    return (
      <NumberRangeInput
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        aria-invalid={ariaInvalid}
        className={className}
        data-wd-key={dataWdKey}
        defaultValue={defaultValue}
        disabled={disabled}
        max={max}
        min={min}
        required={required}
        step={rangeStep}
        value={propsValue}
        onChange={onChange}
      />
    )
  }

  const displayValue = editing ? dirtyValue : value

  return (
    <Input
      id={id}
      name={name}
      type="number"
      inputMode={inputMode}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      aria-invalid={ariaInvalid}
      spellCheck="false"
      className={cn("w-full", className)}
      placeholder={defaultValue?.toString()}
      value={displayValue === undefined ? "" : displayValue}
      onChange={(e) => changeValue(e.target.value)}
      onFocus={() => setEditing(true)}
      onBlur={resetValue}
      required={required}
      disabled={disabled}
      data-wd-key={dataWdKey}
    />
  )
}
