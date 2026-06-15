import React from "react"
import { cn } from "../../lib/utils"

export type InputMultiInputProps = {
  name?: string
  value: string
  options: (string | [string, string])[]
  onChange(...args: unknown[]): unknown
  "aria-label"?: string
}

export const InputMultiInput: React.FC<InputMultiInputProps> = ({
  name,
  value,
  options: propsOptions,
  onChange,
  "aria-label": ariaLabel,
}) => {
  // Accept either ["value", "label"] tuples or a flat string[] (which expands
  // to [v, v]); normalize to tuples.
  const options: [string, string][] =
    propsOptions.length > 0 && !Array.isArray(propsOptions[0])
      ? (propsOptions as string[]).map((v) => [v, v])
      : (propsOptions as [string, string][])

  const selectedValue = value || (options.length > 0 ? options[0][0] : undefined)

  return (
    <fieldset className="m-0 flex min-w-0 items-center border-none p-0" aria-label={ariaLabel}>
      {options.map(([val, label]) => {
        const isSelected = val === selectedValue
        return (
          <button
            type="button"
            key={val}
            role="radio"
            aria-checked={isSelected}
            name={name}
            value={val}
            onClick={() => {
              if (!isSelected) onChange(val)
            }}
            className={cn(
              "z-0 -ml-px flex h-7 flex-1 cursor-pointer items-center justify-center border border-input px-3 text-xs font-medium whitespace-nowrap transition-colors first:ml-0 hover:bg-muted focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none",
              isSelected
                ? "z-10 border-primary bg-primary text-primary-foreground hover:bg-primary/90"
                : "bg-background text-muted-foreground",
            )}
          >
            {label}
          </button>
        )
      })}
    </fieldset>
  )
}
