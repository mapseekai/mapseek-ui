import React from "react"
import { InputSelect } from "./InputSelect"
import { InputMultiInput } from "./InputMultiInput"

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
}) => {
  const currentValue = value || defaultValue

  if (options.length <= 3 && optionsLabelLength(options) <= 20) {
    return (
      <InputMultiInput
        name={name}
        options={options}
        value={currentValue!}
        onChange={onChange}
        aria-label={ariaLabel || label}
      />
    )
  } else {
    return (
      <InputSelect
        options={options}
        value={currentValue!}
        onChange={onChange}
        aria-label={ariaLabel || label}
      />
    )
  }
}
