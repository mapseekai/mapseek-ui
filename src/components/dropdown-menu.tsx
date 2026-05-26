import * as React from "react"
import { Menu } from "@base-ui/react/menu"
import { Separator } from "@workspace/ui/components/separator"
import { cn } from "@workspace/ui/lib/utils"

const DropdownMenu = Menu.Root
const DropdownMenuTrigger = Menu.Trigger
const DropdownMenuGroup = Menu.Group
const DropdownMenuPortal = Menu.Portal

function DropdownMenuContent({
  className,
  align = "end",
  sideOffset = 4,
  ...props
}: React.ComponentProps<typeof Menu.Popup> & {
  align?: "start" | "end" | "center"
  sideOffset?: number
}) {
  return (
    <Menu.Portal>
      <Menu.Positioner
        align={align}
        sideOffset={sideOffset}
        className="z-[1000]"
      >
        <Menu.Popup
          className={cn(
            "min-w-[160px] border border-border bg-popover text-popover-foreground shadow-md outline-none",
            "transition-opacity duration-100 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0",
            className
          )}
          {...props}
        />
      </Menu.Positioner>
    </Menu.Portal>
  )
}

function DropdownMenuItem({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<typeof Menu.Item> & {
  variant?: "default" | "destructive"
}) {
  return (
    <Menu.Item
      className={cn(
        "flex cursor-pointer items-center gap-2 px-3 py-2 text-xs outline-none",
        "data-[highlighted]:bg-muted",
        variant === "destructive" &&
          "text-destructive data-[highlighted]:bg-destructive/10",
        className
      )}
      {...props}
    />
  )
}

function DropdownMenuSeparator({
  className,
  ...props
}: React.ComponentProps<"div">) {
  // Use the shadcn Separator primitive so dropdown dividers stay visually
  // consistent with section dividers elsewhere (see @workspace/ui/components/separator).
  return (
    <Separator
      data-slot="dropdown-menu-separator"
      // className={cn("my-1", className)}
      className={cn(className)}
      {...props}
    />
  )
}

function DropdownMenuLabel({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "px-3 py-1.5 font-mono text-[10px] tracking-[0.06em] text-muted-foreground uppercase",
        className
      )}
      {...props}
    />
  )
}

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
}
