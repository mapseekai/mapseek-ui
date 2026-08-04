import { RadioGroup as RadioGroupPrimitive, Radio as RadioPrimitive } from "@base-ui/react"
import { IconCircleFilled } from "@tabler/icons-react"

import { cn } from "@/registry/lib/utils"

function RadioGroup({ className, ...props }: RadioGroupPrimitive.Props) {
  return <RadioGroupPrimitive className={cn("flex", className)} {...props} />
}

function Radio({ className, ...props }: RadioPrimitive.Root.Props) {
  return (
    <RadioPrimitive.Root
      data-slot="radio"
      className={cn(
        "relative flex size-4 shrink-0 items-center justify-center rounded-full border border-input text-primary outline-none after:absolute after:-inset-2 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 data-checked:border-primary",
        className,
      )}
      {...props}
    >
      <RadioPrimitive.Indicator data-slot="radio-indicator" className="grid place-items-center">
        <IconCircleFilled className="size-2" />
      </RadioPrimitive.Indicator>
    </RadioPrimitive.Root>
  )
}

export { Radio, RadioGroup }
