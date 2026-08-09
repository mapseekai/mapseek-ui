import type React from "react"
import { useCallback, useState } from "react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { NumberRangeInput } from "../number-range-input"

type InputNumberBaseProps = {
  value?: number
  default?: number
  min?: number
  max?: number
  onChange?(value: number | undefined): unknown
  rangeStep?: number
  "data-wd-key"?: string
  required?: boolean
  disabled?: boolean
  id?: string
  name?: string
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"]
  "aria-describedby"?: string
  "aria-invalid"?: React.AriaAttributes["aria-invalid"]
  autoComplete?: string
  className?: string
}

type InputNumberRangeDirectName = {
  "aria-label": string
  "aria-labelledby"?: never
  sliderAriaLabel?: string
}

type InputNumberRangeVisibleName = {
  "aria-label"?: never
  "aria-labelledby": string
  sliderAriaLabel: string
}

type InputNumberRangeProps = InputNumberBaseProps & { allowRange: true } & (
    | InputNumberRangeDirectName
    | InputNumberRangeVisibleName
  )

type InputNumberSingleProps = InputNumberBaseProps & {
  allowRange?: false | undefined
  "aria-label"?: string
  "aria-labelledby"?: string
  sliderAriaLabel?: string
}

export type InputNumberProps = InputNumberRangeProps | InputNumberSingleProps

/**
 * Numeric input with commit-on-blur validation and an optional inline range
 * slider (when both `min` and `max` are set and `allowRange`). Domain-free.
 * See BLOCKS-EXTRACTION.md § form-inputs.
 */
export const InputNumber: React.FC<InputNumberProps> = (props) => {
  const controlled = Object.hasOwn(props, "value")
  const {
    value: propsValue,
    default: defaultValue,
    min,
    max,
    onChange,
    rangeStep = 1,
    "data-wd-key": dataWdKey,
    required,
    disabled,
    id,
    name,
    inputMode = "decimal",
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledBy,
    "aria-describedby": ariaDescribedBy,
    "aria-invalid": ariaInvalid,
    autoComplete,
    className,
  } = props
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

  if (props.allowRange === true && min !== undefined && max !== undefined) {
    const valueProps = controlled ? { value: propsValue } : {}
    const accessibleNameProps =
      "aria-label" in props && props["aria-label"] !== undefined
        ? {
            "aria-label": props["aria-label"],
            sliderAriaLabel: props.sliderAriaLabel,
          }
        : {
            "aria-labelledby": props["aria-labelledby"],
            sliderAriaLabel: props.sliderAriaLabel,
          }

    return (
      <NumberRangeInput
        {...valueProps}
        {...accessibleNameProps}
        id={id}
        name={name}
        aria-describedby={ariaDescribedBy}
        aria-invalid={ariaInvalid}
        autoComplete={autoComplete}
        className={className}
        data-wd-key={dataWdKey}
        defaultValue={defaultValue}
        disabled={disabled}
        max={max}
        min={min}
        required={required}
        step={rangeStep}
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
      aria-describedby={ariaDescribedBy}
      aria-invalid={ariaInvalid}
      autoComplete={autoComplete}
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
