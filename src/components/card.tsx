import * as React from "react"
import { cn } from "@workspace/ui/lib/utils"

function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={cn("border border-border bg-card text-card-foreground", className)}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn("border-b border-border px-4 py-3 text-xs font-semibold", className)}
      {...props}
    />
  )
}

function CardBody({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="card-body" className={cn("p-4", className)} {...props} />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("border-t border-border px-4 py-2", className)}
      {...props}
    />
  )
}

export { Card, CardHeader, CardBody, CardFooter }
