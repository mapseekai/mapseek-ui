import { NumberField } from "@base-ui/react/number-field"
import { IconMinus, IconPlus } from "@tabler/icons-react"
import type * as React from "react"

import { cn } from "@/registry/lib/utils"

type InputNumberInputProps = Pick<
  React.ComponentProps<"input">,
  | "aria-label"
  | "aria-labelledby"
  | "aria-describedby"
  | "aria-invalid"
  | "autoFocus"
  | "placeholder"
>

type InputNumberProps = Omit<NumberField.Root.Props, "className"> &
  InputNumberInputProps & {
    className?: string
    unit?: React.ReactNode
    decrementLabel?: string
    incrementLabel?: string
  }

function InputNumber({
  className,
  unit,
  step = 1,
  decrementLabel = "Decrease value",
  incrementLabel = "Increase value",
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledby,
  "aria-describedby": ariaDescribedby,
  "aria-invalid": ariaInvalid,
  autoFocus,
  placeholder,
  ...props
}: InputNumberProps) {
  return (
    <NumberField.Root
      data-slot="input-number"
      data-step={step}
      step={step}
      className={cn("group/input-number w-full", className)}
      {...props}
    >
      <NumberField.Group
        data-slot="input-number-group"
        className="relative flex h-8 w-full min-w-0 items-center border border-input bg-input-surface transition-colors outline-none has-[[data-slot=input-number-input]:focus-visible]:border-ring has-[[data-slot=input-number-input]:focus-visible]:ring-(length:--focus-ring-width) has-[[data-slot=input-number-input]:focus-visible]:ring-ring/20 has-[[aria-invalid=true]]:border-destructive has-[[aria-invalid=true]]:ring-3 has-[[aria-invalid=true]]:ring-destructive/20 data-disabled:bg-input/50 data-disabled:opacity-50 dark:data-disabled:bg-input/80 dark:has-[[aria-invalid=true]]:ring-destructive/40"
      >
        <NumberField.Input
          data-slot="input-number-input"
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledby}
          aria-describedby={ariaDescribedby}
          aria-invalid={ariaInvalid}
          autoFocus={autoFocus}
          placeholder={placeholder}
          className="h-full min-w-0 flex-1 bg-transparent px-2.5 py-1 text-body-md outline-none placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed"
        />

        {unit !== undefined && unit !== null && (
          <span
            data-slot="input-number-unit"
            className="pointer-events-none flex h-full min-w-14 shrink-0 items-center justify-end pe-2.5 text-body-md text-muted-foreground group-focus-within/input-number:hidden"
          >
            {unit}
          </span>
        )}

        <span
          data-slot="input-number-controls"
          className="hidden h-full w-14 shrink-0 items-stretch group-focus-within/input-number:flex"
        >
          <NumberField.Decrement
            aria-label={decrementLabel}
            className="flex w-7 cursor-pointer items-center justify-center border-s border-input text-muted-foreground outline-none transition-colors hover:bg-accent/50 hover:text-foreground focus-visible:bg-accent/50 focus-visible:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/20 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3.5"
          >
            <IconMinus />
          </NumberField.Decrement>
          <NumberField.Increment
            aria-label={incrementLabel}
            className="flex w-7 cursor-pointer items-center justify-center border-s border-input text-muted-foreground outline-none transition-colors hover:bg-accent/50 hover:text-foreground focus-visible:bg-accent/50 focus-visible:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/20 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3.5"
          >
            <IconPlus />
          </NumberField.Increment>
        </span>
      </NumberField.Group>
    </NumberField.Root>
  )
}

export type { InputNumberProps }
export { InputNumber }
