import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@workspace/ui/lib/utils"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Textarea } from "@workspace/ui/components/textarea"

/**
 * InputGroup compound — port of the shadcn InputGroup pattern, adapted
 * to this package's square-corner / border-first design system. Lets
 * callers compose an input with leading/trailing addons (icons, buttons,
 * text labels) inside a single bordered container that focuses as a
 * unit.
 *
 * Use:
 *   <InputGroup>
 *     <InputGroupAddon align="inline-start"><SearchIcon/></InputGroupAddon>
 *     <InputGroupInput placeholder="…" />
 *     <InputGroupAddon align="inline-end">
 *       <InputGroupButton variant="ghost" size="icon-xs"><XIcon/></InputGroupButton>
 *     </InputGroupAddon>
 *   </InputGroup>
 *
 * Note: InputGroupButton extends @workspace/ui Button and inherits its
 * base-ui base. Use `render={<MyTrigger/>}` (base-ui pattern), not the
 * Radix `asChild` prop — workspace Button doesn't support asChild.
 */

function InputGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="input-group"
      role="group"
      className={cn(
        "group/input-group relative flex h-8 w-full min-w-0 items-center border border-border bg-background outline-none transition-colors",
        "has-disabled:bg-muted/40 has-disabled:opacity-50",
        "has-[[data-slot=input-group-control]:focus-visible]:border-ring",
        "has-[[data-slot=input-group-control]:focus-visible]:ring-[3px]",
        "has-[[data-slot=input-group-control]:focus-visible]:ring-ring/20",
        "has-[[data-slot][aria-invalid=true]]:border-destructive",
        "has-[[data-slot][aria-invalid=true]]:ring-[3px]",
        "has-[[data-slot][aria-invalid=true]]:ring-destructive/20",
        "has-[>textarea]:h-auto",
        "has-[>[data-align=block-end]]:h-auto has-[>[data-align=block-end]]:flex-col",
        "has-[>[data-align=block-start]]:h-auto has-[>[data-align=block-start]]:flex-col",
        className
      )}
      {...props}
    />
  )
}

const inputGroupAddonVariants = cva(
  "flex h-auto cursor-text items-center justify-center gap-2 py-1.5 text-xs font-medium text-muted-foreground select-none group-data-[disabled=true]/input-group:opacity-50 [&>svg:not([class*='size-'])]:size-3.5",
  {
    variants: {
      align: {
        "inline-start":
          "order-first pl-2 has-[>button]:ml-[-0.25rem]",
        "inline-end":
          "order-last pr-2 has-[>button]:mr-[-0.25rem]",
        "block-start":
          "order-first w-full justify-start px-2 pt-1.5",
        "block-end":
          "order-last w-full justify-start px-2 pb-1.5",
      },
    },
    defaultVariants: { align: "inline-start" },
  }
)

function InputGroupAddon({
  className,
  align = "inline-start",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof inputGroupAddonVariants>) {
  return (
    <div
      role="group"
      data-slot="input-group-addon"
      data-align={align}
      className={cn(inputGroupAddonVariants({ align }), className)}
      onClick={(event) => {
        // Forward clicks on the addon (but not its inner button) to the
        // input — matches the shadcn InputGroup behaviour where clicking
        // the leading icon focuses the field.
        if ((event.target as HTMLElement).closest("button")) return
        event.currentTarget.parentElement
          ?.querySelector("input, textarea")
          ?.dispatchEvent(new Event("focus"))
      }}
      {...props}
    />
  )
}

const inputGroupButtonVariants = cva(
  "flex items-center gap-1 text-xs shadow-none",
  {
    variants: {
      size: {
        xs: "h-6 gap-1 px-1.5 [&>svg:not([class*='size-'])]:size-3",
        sm: "",
        "icon-xs":
          "size-6 p-0 has-[>svg]:p-0 [&>svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-7 p-0 has-[>svg]:p-0",
      },
    },
    defaultVariants: { size: "xs" },
  }
)

function InputGroupButton({
  className,
  type = "button",
  variant = "ghost",
  size = "xs",
  ...props
}: Omit<React.ComponentProps<typeof Button>, "size"> &
  VariantProps<typeof inputGroupButtonVariants>) {
  return (
    <Button
      type={type}
      data-size={size}
      variant={variant}
      className={cn(inputGroupButtonVariants({ size }), className)}
      {...props}
    />
  )
}

function InputGroupText({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "flex items-center gap-1.5 text-xs text-muted-foreground",
        "[&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-3.5",
        className
      )}
      {...props}
    />
  )
}

function InputGroupInput({
  className,
  ...props
}: React.ComponentProps<typeof Input>) {
  return (
    <Input
      data-slot="input-group-control"
      className={cn(
        "h-full flex-1 border-0 bg-transparent px-2 shadow-none focus-visible:ring-0 focus-visible:border-0",
        className
      )}
      {...props}
    />
  )
}

function InputGroupTextarea({
  className,
  ...props
}: React.ComponentProps<typeof Textarea>) {
  return (
    <Textarea
      data-slot="input-group-control"
      className={cn(
        "flex-1 resize-none border-0 bg-transparent px-2 py-1.5 shadow-none focus-visible:ring-0 focus-visible:border-0",
        className
      )}
      {...props}
    />
  )
}

export {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupText,
  InputGroupInput,
  InputGroupTextarea,
}
