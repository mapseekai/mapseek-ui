import type React from "react"
import { InputMultiInput } from "./InputMultiInput"
import { InputSelect } from "./InputSelect"

function optionsLabelLength(options: [string, string][]) {
  return options.reduce((sum, [, label]) => sum + label.length, 0)
}

export type InputEnumProps = {
  "data-wd-key"?: string
  value?: string
  style?: React.CSSProperties
  default?: string
  name?: string
  onChange(value: string): void
  options: [string, string][]
  "aria-label"?: string
  "aria-labelledby"?: string
  "aria-invalid"?: React.AriaAttributes["aria-invalid"]
  id?: string
  disabled?: boolean
  required?: boolean
  placeholder?: React.ReactNode
  label?: string
}

/**
 * Enum picker that adapts to option count: ≤3 short options render as an inline
 * radio button group (InputMultiInput), otherwise as a dropdown (InputSelect).
 */
export const InputEnum: React.FC<InputEnumProps> = ({
  options,
  value,
  onChange,
  name,
  label,
  default: defaultValue,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  "aria-invalid": ariaInvalid,
  id,
  disabled,
  required,
  placeholder,
}) => {
  const currentValue = value || defaultValue || ""

  if (options.length <= 3 && optionsLabelLength(options) <= 20) {
    return (
      <InputMultiInput
        name={name}
        id={id}
        disabled={disabled}
        required={required}
        options={options}
        value={currentValue}
        onChange={onChange}
        aria-label={ariaLabel || label}
        aria-labelledby={ariaLabelledBy}
        aria-invalid={ariaInvalid}
      />
    )
  } else {
    return (
      <InputSelect
        options={options}
        value={currentValue}
        id={id}
        name={name}
        disabled={disabled}
        required={required}
        placeholder={placeholder}
        onChange={onChange}
        aria-label={ariaLabel || label}
        aria-labelledby={ariaLabelledBy}
        aria-invalid={ariaInvalid}
      />
    )
  }
}
