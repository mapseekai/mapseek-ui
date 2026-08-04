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
  "aria-label"?: string
}

export function InputAutocomplete({
  value,
  options = [],
  onChange = () => {},
  "aria-label": ariaLabel,
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
          placeholder=""
          aria-label={ariaLabel}
          className="w-full"
          showTrigger={false}
        />
        {options.length > 0 && (
          <ComboboxContent className="z-50 min-w-[200px]">
            <ComboboxEmpty>No results found.</ComboboxEmpty>
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
