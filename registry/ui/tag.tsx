import { cva, type VariantProps } from "class-variance-authority"
import type { ComponentProps } from "react"

import { cn } from "@/registry/lib/utils"

const tagVariants = cva(
  "group/tag inline-flex w-fit shrink-0 items-center justify-center overflow-hidden rounded-none whitespace-nowrap focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/20 [&>svg]:pointer-events-none",
  {
    variants: {
      size: {
        xs: "h-3 gap-0.5 px-1 py-0 text-label-md has-data-[icon=inline-end]:pe-0.5 has-data-[icon=inline-start]:ps-0.5 [&>svg]:size-2!",
        sm: "h-4 gap-0.5 px-1.5 py-0 text-label-md has-data-[icon=inline-end]:pe-1 has-data-[icon=inline-start]:ps-1 [&>svg]:size-2.5!",
        default:
          "h-5 gap-1 px-2 py-0.5 text-body-md-medium has-data-[icon=inline-end]:pe-1.5 has-data-[icon=inline-start]:ps-1.5 [&>svg]:size-3!",
        lg: "h-6 gap-1 px-2.5 py-0.5 text-body-md-medium has-data-[icon=inline-end]:pe-2 has-data-[icon=inline-start]:ps-2 [&>svg]:size-3.5!",
        xl: "h-7 gap-1.5 px-3 py-0.5 text-body-md-medium has-data-[icon=inline-end]:pe-2.5 has-data-[icon=inline-start]:ps-2.5 [&>svg]:size-4!",
      },
      variant: {
        outline: "border",
        solid: "border-0 text-primary-foreground",
      },
      color: {
        green: "",
        blue: "",
        yellow: "",
        orange: "",
        purple: "",
        cyan: "",
        gray: "",
      },
    },
    compoundVariants: [
      { variant: "outline", color: "green", class: "border-primary/30 bg-primary/10 text-primary" },
      { variant: "outline", color: "blue", class: "border-cat-2/30 bg-cat-2/10 text-cat-2" },
      { variant: "outline", color: "yellow", class: "border-cat-3/30 bg-cat-3/10 text-cat-3" },
      { variant: "outline", color: "orange", class: "border-cat-4/30 bg-cat-4/10 text-cat-4" },
      { variant: "outline", color: "purple", class: "border-cat-5/30 bg-cat-5/10 text-cat-5" },
      { variant: "outline", color: "cyan", class: "border-cat-6/30 bg-cat-6/10 text-cat-6" },
      {
        variant: "outline",
        color: "gray",
        class: "border-border bg-muted/50 text-muted-foreground",
      },
      { variant: "solid", color: "green", class: "bg-primary" },
      { variant: "solid", color: "blue", class: "bg-cat-2" },
      { variant: "solid", color: "yellow", class: "bg-cat-3" },
      { variant: "solid", color: "orange", class: "bg-cat-4" },
      { variant: "solid", color: "purple", class: "bg-cat-5" },
      { variant: "solid", color: "cyan", class: "bg-cat-6" },
      { variant: "solid", color: "gray", class: "bg-muted-foreground" },
    ],
    defaultVariants: {
      color: "green",
      size: "default",
      variant: "outline",
    },
  },
)

type TagColor = NonNullable<VariantProps<typeof tagVariants>["color"]>
type TagSize = NonNullable<VariantProps<typeof tagVariants>["size"]>
type TagVariant = NonNullable<VariantProps<typeof tagVariants>["variant"]>

function Tag({
  className,
  color = "green",
  size = "default",
  variant = "outline",
  ...props
}: ComponentProps<"span"> & VariantProps<typeof tagVariants>) {
  return (
    <span
      data-color={color}
      data-size={size}
      data-slot="tag"
      data-variant={variant}
      {...props}
      className={cn(tagVariants({ color, size, variant }), className)}
    />
  )
}

export { Tag, type TagColor, type TagSize, type TagVariant, tagVariants }
