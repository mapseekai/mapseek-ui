import * as React from "react"
import { cn } from "@workspace/ui/lib/utils"

/**
 * shadcn Empty state component family. Use this whenever a list, panel,
 * or dropdown has zero items — it keeps empty states visually consistent
 * across the app (icon + title + description + optional action).
 *
 * Usage:
 *
 *   <Empty>
 *     <EmptyHeader>
 *       <EmptyMedia variant="icon">
 *         <IconDatabase size={16} stroke={1.5} />
 *       </EmptyMedia>
 *       <EmptyTitle>No datasets</EmptyTitle>
 *       <EmptyDescription>Upload your first dataset to get started.</EmptyDescription>
 *     </EmptyHeader>
 *     <EmptyContent>
 *       <Button size="sm">Upload</Button>
 *     </EmptyContent>
 *   </Empty>
 */
function Empty({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="empty"
      className={cn(
        "flex min-w-0 flex-1 flex-col items-center justify-center gap-4 rounded-none border border-dashed border-border bg-background p-6 text-center text-balance",
        className,
      )}
      {...props}
    />
  )
}

function EmptyHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="empty-header"
      className={cn("flex max-w-sm flex-col items-center gap-1.5", className)}
      {...props}
    />
  )
}

type EmptyMediaProps = React.ComponentProps<"div"> & {
  variant?: "default" | "icon"
}

function EmptyMedia({ className, variant = "default", ...props }: EmptyMediaProps) {
  return (
    <div
      data-slot="empty-media"
      data-variant={variant}
      className={cn(
        "mb-1 grid place-items-center text-muted-foreground",
        variant === "icon" && "size-10 rounded-none border border-border bg-muted",
        className,
      )}
      {...props}
    />
  )
}

function EmptyTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="empty-title"
      className={cn("text-xs font-semibold text-foreground", className)}
      {...props}
    />
  )
}

function EmptyDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="empty-description"
      className={cn("text-[11px] leading-[1.5] text-muted-foreground", className)}
      {...props}
    />
  )
}

function EmptyContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="empty-content"
      className={cn("flex flex-col items-center gap-2", className)}
      {...props}
    />
  )
}

export { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle }
