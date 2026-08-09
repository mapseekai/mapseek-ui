import type React from "react"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export type InputStringProps = {
  "data-wd-key"?: string
  value?: string
  style?: React.CSSProperties
  default?: string
  onChange?(value: string | undefined): unknown
  onInput?(value: string | undefined): unknown
  multi?: boolean
  required?: boolean
  disabled?: boolean
  spellCheck?: boolean
  id?: string
  name?: string
  autoComplete?: string
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"]
  "aria-label"?: string
  "aria-labelledby"?: string
  "aria-invalid"?: React.AriaAttributes["aria-invalid"]
  title?: string
}

/**
 * Text input with commit-on-blur / commit-on-Enter semantics: edits are local
 * until blur (or Enter for single-line), then flushed via `onChange`; `onInput`
 * fires on every keystroke. Domain-free. See BLOCKS-EXTRACTION.md § form-inputs.
 */
export const InputString: React.FC<InputStringProps> = ({
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  "aria-invalid": ariaInvalid,
  "data-wd-key": dataWdKey,
  id,
  name,
  autoComplete,
  inputMode,
  spellCheck,
  disabled,
  style,
  value: propsValue,
  default: placeholder,
  title,
  onChange,
  onInput,
  multi,
  required,
}) => {
  const [editing, setEditing] = useState(false)
  const [value, setValue] = useState(propsValue || "")
  const [prevProps, setPrevProps] = useState(propsValue)
  const [prevEditing, setPrevEditing] = useState(editing)

  // Sync external value into local state when value/editing changes, but only
  // while not actively editing. Adjust-during-render (React "you might not need
  // an effect") — equivalent to the prior useEffect([propsValue, editing]).
  if (propsValue !== prevProps || editing !== prevEditing) {
    setPrevProps(propsValue)
    setPrevEditing(editing)
    if (!editing) setValue(propsValue || "")
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newVal = e.target.value
    setEditing(true)
    setValue(newVal)
    if (onInput) onInput(newVal)
  }

  const handleBlur = () => {
    if (value !== propsValue) {
      setEditing(false)
      if (onChange) onChange(value)
    } else {
      setEditing(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !multi && onChange) {
      onChange(value)
    }
  }

  const commonProps = {
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledBy,
    "aria-invalid": ariaInvalid,
    "data-wd-key": dataWdKey,
    id,
    name,
    autoComplete,
    inputMode,
    spellCheck: spellCheck !== undefined ? spellCheck : !multi,
    disabled,
    style,
    value,
    placeholder,
    title,
    onChange: handleChange,
    onBlur: handleBlur,
    onKeyDown: handleKeyDown,
    required,
  }

  if (multi) {
    return <Textarea {...commonProps} />
  }

  return <Input {...commonProps} />
}
