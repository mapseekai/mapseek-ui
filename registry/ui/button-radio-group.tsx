import { RadioGroup as RadioGroupPrimitive, Radio as RadioPrimitive } from "@base-ui/react"

import { cn } from "@/registry/lib/utils"

function ButtonRadioGroup({ className, required = true, ...props }: RadioGroupPrimitive.Props) {
  return (
    <RadioGroupPrimitive
      data-slot="button-radio-group"
      required={required}
      className={cn("flex flex-wrap gap-px overflow-hidden rounded-md bg-border p-px", className)}
      {...props}
    />
  )
}

function ButtonRadioGroupItem({ className, ...props }: RadioPrimitive.Root.Props) {
  return (
    <RadioPrimitive.Root
      data-slot="button-radio-group-item"
      className={cn(
        "inline-flex min-h-9 min-w-max flex-1 cursor-pointer items-center justify-center whitespace-nowrap bg-background px-3 py-2 text-sm font-medium text-foreground outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 data-checked:bg-primary data-checked:text-primary-foreground",
        className,
      )}
      {...props}
    />
  )
}

export { ButtonRadioGroup, ButtonRadioGroupItem }
