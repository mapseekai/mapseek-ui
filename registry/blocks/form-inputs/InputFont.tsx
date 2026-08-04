import type React from "react"
import { useCallback } from "react"
import { InputAutocomplete } from "./InputAutocomplete"

const FONT_INPUT_KEYS = Array.from({ length: 64 }, (_, index) => `font-input-${index}`)

export type InputFontProps = {
  name: string
  value?: string[]
  default?: string[]
  fonts?: string[]
  style?: React.CSSProperties
  onChange(values: string[]): void
  "aria-label"?: string
}

/**
 * Font-stack editor: a column of autocomplete rows, always trailing one empty
 * row so the user can append. Domain-free. See BLOCKS-EXTRACTION.md § form-inputs.
 */
export const InputFont: React.FC<InputFontProps> = ({
  name,
  value,
  default: defaultValue,
  fonts = [],
  style,
  onChange,
  "aria-label": ariaLabel,
}) => {
  const getValues = () => {
    // Guard against a non-array value: during a function-conversion the
    // parent briefly feeds us a `{ stops: ... }` object before its dataType
    // state catches up. Spreading a non-array crashes.
    const out = Array.isArray(value) ? value : Array.isArray(defaultValue) ? defaultValue : []
    // Always put a "" in the last field to allow adding entries
    if (out[out.length - 1] !== "") {
      return [...out, ""]
    }
    return out
  }

  const currentValues = getValues()

  const changeFont = useCallback(
    (idx: number, newValue: string | undefined) => {
      const nextValues = [...currentValues]
      nextValues[idx] = newValue || ""
      const filteredValues = nextValues.filter((v) => v !== undefined && v !== "")
      onChange(filteredValues)
    },
    [currentValues, onChange],
  )

  const inputs = currentValues.map((val, i) => (
    <div key={FONT_INPUT_KEYS[i] ?? `font-input-extra-${i}`}>
      <InputAutocomplete
        aria-label={ariaLabel || name}
        value={val}
        options={fonts.map((f) => [f, f])}
        onChange={(v) => changeFont(i, v)}
      />
    </div>
  ))

  return (
    <div className="flex flex-col gap-2" style={style}>
      {inputs}
    </div>
  )
}
