import React from "react"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"

export type InputAutocompleteProps = {
  value?: string
  options?: string[][]
  onChange?(value: string | undefined): unknown
  id?: string
  name?: string
  disabled?: boolean
  required?: boolean
  placeholder?: string
  emptyMessage?: React.ReactNode
  "aria-label"?: string
  "aria-labelledby"?: string
  "aria-invalid"?: React.AriaAttributes["aria-invalid"]
}

export function InputAutocomplete({
  value,
  options = [],
  onChange = () => {},
  id,
  name,
  disabled,
  required,
  placeholder,
  emptyMessage,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  "aria-invalid": ariaInvalid,
}: InputAutocompleteProps) {
  const [inputValue, setInputValue] = React.useState(value || "")
  const [prevValue, setPrevValue] = React.useState(value)
  const inputRef = React.useRef<HTMLInputElement>(null)

  // Sync external value into local state on change (adjust-during-render;
  // equivalent to the prior useEffect([value])).
  if (value !== prevValue) {
    setPrevValue(value)
    setInputValue(value || "")
  }

  const handleValueChange = (val: string | null) => {
    const resolvedValue = val || ""
    setInputValue(resolvedValue)
    onChange(resolvedValue === "" ? undefined : resolvedValue)

    // Remove focus highlight after selection (deferred to avoid blocking selection logic)
    if (inputRef.current) {
      const el = inputRef.current
      setTimeout(() => el.blur(), 0)
    }
  }

  return (
    <div className="w-full" data-slot="input-autocomplete">
      <Combobox value={inputValue} onValueChange={handleValueChange}>
        <ComboboxInput
          ref={inputRef}
          id={id}
          name={name}
          disabled={disabled}
          required={required}
          placeholder={placeholder}
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledBy}
          aria-invalid={ariaInvalid}
          className="w-full"
          showTrigger={false}
        />
        {options.length > 0 && (
          <ComboboxContent className="min-w-50">
            {emptyMessage !== undefined && <ComboboxEmpty>{emptyMessage}</ComboboxEmpty>}
            <ComboboxList>
              {options.map((option) => (
                <ComboboxItem key={option[0]} value={option[0]}>
                  {option[1] || option[0]}
                </ComboboxItem>
              ))}
            </ComboboxList>
          </ComboboxContent>
        )}
      </Combobox>
    </div>
  )
}
