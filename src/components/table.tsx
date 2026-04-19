import * as React from "react"
import { cn } from "@workspace/ui/lib/utils"

function Table({ className, ...props }: React.ComponentProps<"table">) {
  return (
    <div className="w-full border border-border bg-card">
      <table
        data-slot="table"
        className={cn(
          "w-full caption-bottom border-collapse text-xs",
          className
        )}
        {...props}
      />
    </div>
  )
}

function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return (
    <thead
      data-slot="table-header"
      className={cn("bg-muted", className)}
      {...props}
    />
  )
}

function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return (
    <tbody data-slot="table-body" className={cn("", className)} {...props} />
  )
}

function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        "border-b border-border transition-colors last:border-b-0 hover:bg-muted/50",
        "data-[state=selected]:bg-primary/8 data-[state=selected]:hover:bg-primary/12",
        className
      )}
      {...props}
    />
  )
}

function TableHead({ className, ...props }: React.ComponentProps<"th">) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        "sticky top-0 z-[1] h-10 bg-muted px-2 text-left text-[11px] font-medium tracking-[0.04em] text-muted-foreground uppercase",
        "first:pl-3 last:pr-3",
        className
      )}
      {...props}
    />
  )
}

function TableCell({ className, ...props }: React.ComponentProps<"td">) {
  return (
    <td
      data-slot="table-cell"
      className={cn("h-10 px-2 align-middle first:pl-3 last:pr-3", className)}
      {...props}
    />
  )
}

function TableFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="table-footer"
      className={cn(
        "flex items-center justify-between bg-card px-3 py-2",
        className
      )}
      {...props}
    />
  )
}

export {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableFooter,
}
