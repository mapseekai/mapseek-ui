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

  const handleValueChange = (newVal: string | null) => {
    if (newVal == null) return
    onChange(newVal === EMPTY_VALUE ? "" : newVal)
  }

  return (
    <Select value={mappedValue} onValueChange={handleValueChange}>
      <SelectTrigger
        className={className}
        size={size}
        data-wd-key={dataWdKey}
        style={style}
        title={title}
        aria-label={ariaLabel}
      >
        <SelectValue placeholder="Select option..." />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {(options as [string, React.ReactNode][]).map(([val, label]) => {
            const itemValue = val === "" ? EMPTY_VALUE : val
            return (
              <SelectItem key={itemValue} value={itemValue} className="text-xs">
                {label}
              </SelectItem>
            )
          })}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
