import { RadioGroup as RadioGroupPrimitive, Radio as RadioPrimitive } from "@base-ui/react"
import type { ReactNode } from "react"

import { cn } from "@/registry/lib/utils"

type ButtonRadioGroupSize = "xs" | "sm" | "default" | "lg"
type ButtonRadioGroupVariant = "default" | "soft"

function ButtonRadioGroup({
  className,
  required = true,
  size = "default",
  variant = "default",
  ...props
}: RadioGroupPrimitive.Props & {
  size?: ButtonRadioGroupSize
  variant?: ButtonRadioGroupVariant
}) {
  return (
    <RadioGroupPrimitive
      data-slot="button-radio-group"
      data-size={size}
      data-variant={variant}
      required={required}
      className={cn(
        "group/button-radio-group flex flex-wrap overflow-hidden rounded-md border-t border-l border-border",
        className,
      )}
      {...props}
    />
  )
}

type ButtonRadioGroupItemProps = RadioPrimitive.Root.Props & {
  icon?: ReactNode
}

function ButtonRadioGroupItem({ children, className, icon, ...props }: ButtonRadioGroupItemProps) {
  return (
    <RadioPrimitive.Root
      data-slot="button-radio-group-item"
      className={cn(
        "inline-flex min-w-max flex-1 cursor-pointer items-center justify-center gap-1 border-r border-b border-border bg-background text-body-md-medium whitespace-nowrap text-foreground outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 group-data-[size=default]/button-radio-group:h-8 group-data-[size=default]/button-radio-group:px-2.5 group-data-[size=default]/button-radio-group:[&_svg:not([class*='size-'])]:size-4 group-data-[size=lg]/button-radio-group:h-9 group-data-[size=lg]/button-radio-group:px-2.5 group-data-[size=lg]/button-radio-group:[&_svg:not([class*='size-'])]:size-4 group-data-[size=sm]/button-radio-group:h-7 group-data-[size=sm]/button-radio-group:px-2.5 group-data-[size=sm]/button-radio-group:[&_svg:not([class*='size-'])]:size-3.5 group-data-[size=xs]/button-radio-group:h-6 group-data-[size=xs]/button-radio-group:px-2 group-data-[size=xs]/button-radio-group:[&_svg:not([class*='size-'])]:size-3 [&_svg]:pointer-events-none [&_svg]:shrink-0 group-data-[variant=default]/button-radio-group:data-checked:bg-primary group-data-[variant=default]/button-radio-group:data-checked:text-primary-foreground group-data-[variant=soft]/button-radio-group:data-checked:bg-selection-bg group-data-[variant=soft]/button-radio-group:data-checked:text-primary group-data-[variant=soft]/button-radio-group:data-checked:hover:bg-selection-bg group-data-[variant=soft]/button-radio-group:data-checked:hover:text-primary",
        className,
      )}
      {...props}
    >
      {icon ? (
        <span data-slot="button-radio-group-item-icon" aria-hidden="true" className="inline-flex">
          {icon}
        </span>
      ) : null}
      {children}
    </RadioPrimitive.Root>
  )
}

export {
  ButtonRadioGroup,
  ButtonRadioGroupItem,
  type ButtonRadioGroupItemProps,
  type ButtonRadioGroupSize,
  type ButtonRadioGroupVariant,
}
