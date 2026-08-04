import { cva, type VariantProps } from "class-variance-authority"
import type * as React from "react"

import { cn } from "@/registry/lib/utils"

const alertVariants = cva(
  "relative grid w-full grid-cols-[auto_1fr] items-start gap-x-2 gap-y-0.5 border px-3 py-2 text-xs [&>svg]:mt-0.5 [&>svg]:size-4 [&>svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "border-primary/20 bg-primary/5 text-primary",
        destructive: "border-destructive/30 bg-destructive/10 text-destructive",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
)

function Alert({
  className,
  variant,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
  return (
    <div
      data-slot="alert"
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  )
}

function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="alert-title" className={cn("font-medium leading-none", className)} {...props} />
  )
}

function AlertDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-description"
      className={cn("text-[11px] leading-normal", className)}
      {...props}
    />
  )
}

function AlertAction({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="alert-action" className={cn("col-start-2 mt-1", className)} {...props} />
}

export { Alert, AlertAction, AlertDescription, AlertTitle }
