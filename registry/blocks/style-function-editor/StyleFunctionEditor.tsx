import type * as React from "react"

import { Button, type buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { StyleFunctionPanelProps, StyleFunctionStopsTableProps } from "./types"

type ButtonVariant = NonNullable<Parameters<typeof buttonVariants>[0]>["variant"]

export function StyleFunctionPanel({ title, children, className }: StyleFunctionPanelProps) {
  return (
    <section
      data-slot="style-function-panel"
      className={cn("space-y-4 border border-border bg-card p-4", className)}
    >
      <h3 className="m-0 text-xs leading-tight font-semibold text-muted-foreground">{title}</h3>
      <div className="space-y-4">{children}</div>
    </section>
  )
}

export function StyleFunctionStopsTable({
  caption,
  columns,
  children,
  className,
}: StyleFunctionStopsTableProps) {
  return (
    <div className={cn("mt-6", className)}>
      <table data-slot="style-function-stops-table" className="w-full table-fixed border-collapse">
        <caption className="mb-2 text-left text-xs font-bold tracking-wider text-muted-foreground uppercase">
          {caption}
        </caption>
        <thead>
          <tr className="border-b border-border text-[11px] text-muted-foreground uppercase">
            {columns.map((column) => (
              <th
                key={column.id}
                className={cn("pb-1 text-left font-bold", column.className)}
                colSpan={column.colSpan}
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border/30">{children}</tbody>
      </table>
    </div>
  )
}

export function StyleFunctionActions({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return <div className={cn("flex justify-end gap-2 pt-0", className)}>{children}</div>
}

export function StyleFunctionIconButton({
  className,
  variant = "ghost",
  children,
  ...props
}: React.ComponentProps<typeof Button> & { variant?: ButtonVariant }) {
  return (
    <Button
      type="button"
      variant={variant}
      size="icon-sm"
      className={cn("text-muted-foreground hover:text-foreground", className)}
      {...props}
    >
      {children}
    </Button>
  )
}
