import type React from "react"
import { Select } from "@/components/ui/select"

export type InputSelectProps = {
  value: string
  "data-wd-key"?: string
  options: [string, React.ReactNode][] | string[]
  style?: React.CSSProperties
  onChange(value: string): void
  title?: string
  "aria-label"?: string
  className?: string
  size?: React.ComponentProps<typeof Select>["size"]
}

export const InputSelect: React.FC<InputSelectProps> = ({
  value,
  "data-wd-key": dataWdKey,
  options: propsOptions,
  style,
  onChange,
  title,
  "aria-label": ariaLabel,
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
  const mappedValue = value === "" ? EMPTY_VALUE : value

  const handleValueChange = (newVal: string) => {
    onChange(newVal === EMPTY_VALUE ? "" : newVal)
  }

  return (
    <Select
      value={mappedValue}
      onValueChange={handleValueChange}
      placeholder="Select option..."
      className={className}
      size={size}
      data-wd-key={dataWdKey}
      style={style}
      title={title}
      aria-label={ariaLabel}
    >
      {(options as [string, React.ReactNode][]).map(([val, label]) => {
        const itemValue = val === "" ? EMPTY_VALUE : val
        return (
          <Select.Item key={itemValue} value={itemValue} className="text-xs">
            {label}
          </Select.Item>
        )
      })}
    </Select>
  )
}
