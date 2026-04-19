import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@workspace/ui/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center gap-1 border px-1.5 py-0.5 font-mono text-[10px] font-medium uppercase leading-none tracking-[0.02em]",
  {
    variants: {
      variant: {
        default: "bg-muted text-muted-foreground border-border",
        primary:
          "bg-primary/12 text-primary border-primary/25",
        destructive:
          "bg-destructive/10 text-destructive border-destructive/25",
        warning:
          "bg-warning/12 text-warning border-warning/25",
        info:
          "bg-info/12 text-info border-info/25",
        outline:
          "border-border bg-background text-foreground",
      },
      shape: {
        square: "rounded-none",
        pill: "rounded-full",
      },
    },
    defaultVariants: { variant: "default", shape: "square" },
  }
)

type BadgeProps = React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>

function Badge({ className, variant, shape, ...props }: BadgeProps) {
  return (
    <span
      data-slot="badge"
      className={cn(badgeVariants({ variant, shape }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
