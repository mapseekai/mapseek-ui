import type React from "react"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export type InputSelectProps = {
  value: string
  "data-wd-key"?: string
  options: [string, React.ReactNode][] | string[]
  style?: React.CSSProperties
  onChange(value: string): void
  title?: string
  "aria-label"?: string
  "aria-labelledby"?: string
  "aria-invalid"?: React.AriaAttributes["aria-invalid"]
  id?: string
  name?: string
  disabled?: boolean
  required?: boolean
  placeholder?: React.ReactNode
  className?: string
  size?: React.ComponentProps<typeof SelectTrigger>["size"]
}

export const InputSelect: React.FC<InputSelectProps> = ({
  value,
  "data-wd-key": dataWdKey,
  options: propsOptions,
  style,
  onChange,
  title,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  "aria-invalid": ariaInvalid,
  id,
  name,
  disabled,
  required,
  placeholder,
  className,
  size,
}) => {
  let options = propsOptions
  if (options.length > 0 && !Array.isArray(options[0])) {
    options = options.map((v) => [v, v]) as [string, React.ReactNode][]
  }

  // Shadcn/Radix + base-ui Select don't accept "" as a SelectItem value
  // (the empty string is reserved for "no selection"). Round-trip through
  // a sentinel so style-spec enums with an empty value still work.
  const EMPTY_VALUE = "__MAPUTNIK_EMPTY__"
  const hasEmptyOption = (options as [string, React.ReactNode][]).some(([val]) => val === "")
  const mappedValue = value === "" ? (hasEmptyOption ? EMPTY_VALUE : null) : value
  const items = [
    ...(placeholder !== undefined && !hasEmptyOption ? [{ label: placeholder, value: null }] : []),
    ...(options as [string, React.ReactNode][]).map(([val, label]) => ({
      label,
      value: val === "" ? EMPTY_VALUE : val,
    })),
  ]

  const handleValueChange = (newVal: string | null) => {
    if (newVal == null) return
    onChange(newVal === EMPTY_VALUE ? "" : newVal)
  }

  return (
    <Select
      items={items}
      value={mappedValue}
      name={name}
      disabled={disabled}
      required={required}
      onValueChange={handleValueChange}
    >
      <SelectTrigger
        id={id}
        className={className}
        size={size}
        data-wd-key={dataWdKey}
        style={style}
        title={title}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        aria-invalid={ariaInvalid}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {(options as [string, React.ReactNode][]).map(([val, label]) => {
            const itemValue = val === "" ? EMPTY_VALUE : val
            return (
              <SelectItem key={itemValue} value={itemValue} className="text-body-md">
                {label}
              </SelectItem>
            )
          })}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
