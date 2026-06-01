import { cn } from "../../lib/utils"
import type {
  StyleFilterEditorActionsProps,
  StyleFilterEditorInfoProps,
  StyleFilterEditorInlineErrorProps,
  StyleFilterEditorRowProps,
  StyleFilterEditorSingleProps,
  StyleFilterEditorUnsupportedProps,
} from "./types"

export function StyleFilterEditorRow({
  children,
  action,
  className,
}: StyleFilterEditorRowProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="min-w-0 flex-1">{children}</div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  )
}

export function StyleFilterEditorSingle({
  property,
  operator,
  value,
  className,
}: StyleFilterEditorSingleProps) {
  return (
    <div className={cn("flex w-full items-center gap-2", className)}>
      <div className="min-w-0 flex-[2]">{property}</div>
      <div className="min-w-20 flex-1">{operator}</div>
      {value ? <div className="min-w-0 flex-[2]">{value}</div> : null}
    </div>
  )
}

export function StyleFilterEditorActions({
  children,
  className,
}: StyleFilterEditorActionsProps) {
  return (
    <div className={cn("mt-2 flex justify-end gap-2", className)}>
      {children}
    </div>
  )
}

export function StyleFilterEditorInlineError({
  children,
  className,
}: StyleFilterEditorInlineErrorProps) {
  return (
    <div className={cn("mt-1 text-xs font-medium text-destructive", className)}>
      {children}
    </div>
  )
}

export function StyleFilterEditorUnsupported({
  children,
  action,
  className,
}: StyleFilterEditorUnsupportedProps) {
  return (
    <div
      className={cn(
        "space-y-3 border border-destructive/25 bg-destructive/5 p-3 text-sm",
        className
      )}
    >
      <div className="text-destructive">{children}</div>
      {action ? <div>{action}</div> : null}
    </div>
  )
}

export function StyleFilterEditorInfo({
  children,
  className,
}: StyleFilterEditorInfoProps) {
  return (
    <div className={cn("mt-2 bg-muted/60 p-3 text-xs", className)}>
      {children}
    </div>
  )
}
