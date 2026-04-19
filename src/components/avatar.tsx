import * as React from "react"
import { cn } from "@workspace/ui/lib/utils"

function Avatar({ className, children, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="avatar"
      className={cn(
        "grid h-7 w-7 shrink-0 place-items-center rounded-full bg-primary text-[11px] font-semibold text-primary-foreground",
        "font-mono cursor-pointer",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export { Avatar }
