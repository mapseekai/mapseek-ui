import { type FC, useId } from "react"
import { Radio, RadioGroup } from "@/components/ui/radio-group"
import { cn } from "@/lib/utils"

export type InputMultiInputProps = {
  name?: string
  value: string
  options: (string | [string, string])[]
  onChange(...args: unknown[]): unknown
  "aria-label"?: string
}

export const InputMultiInput: FC<InputMultiInputProps> = ({
  name,
  value,
  options: propsOptions,
  onChange,
  "aria-label": ariaLabel,
}) => {
  const groupId = useId()
  // Accept either ["value", "label"] tuples or a flat string[] (which expands
  // to [v, v]); normalize to tuples.
  const options: [string, string][] =
    propsOptions.length > 0 && !Array.isArray(propsOptions[0])
      ? (propsOptions as string[]).map((v) => [v, v])
      : (propsOptions as [string, string][])

  const selectedValue = value || (options.length > 0 ? options[0][0] : undefined)

  return (
    <RadioGroup
      className="m-0 flex min-w-0 items-center border-none p-0"
      aria-label={ariaLabel}
      name={name}
      value={selectedValue}
      onValueChange={(next) => {
        if (next !== selectedValue) onChange(next)
      }}
    >
      {options.map(([val, label], index) => {
        const isSelected = val === selectedValue
        const optionId = `${groupId}-${index}`
        return (
          <label
            key={val}
            htmlFor={optionId}
            className={cn(
              "z-0 -ml-px flex h-7 flex-1 cursor-pointer items-center justify-center border border-input px-3 text-body-md-medium whitespace-nowrap transition-colors first:ml-0 hover:bg-accent/50 focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none",
              isSelected
                ? "z-10 border-primary bg-primary text-primary-foreground hover:bg-primary"
                : "bg-background text-muted-foreground",
            )}
          >
            <Radio id={optionId} value={val} className="sr-only" />
            {label}
          </label>
        )
      })}
    </RadioGroup>
  )
}
