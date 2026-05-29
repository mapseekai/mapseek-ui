import React, {
  type PropsWithChildren,
  type ReactElement,
  type ReactNode,
} from "react"
import { cn } from "../../lib/utils"

export type FieldsetProps = PropsWithChildren & {
  label?: ReactNode
  /** Full label node; when set it replaces the default `<label>{label}</label>`. */
  labelSlot?: ReactNode
  action?: ReactElement
  error?: { message: string }
  className?: string
}

/** Grouped section with a top hairline + label/action header. Label is slot-driven. */
export const Fieldset: React.FC<FieldsetProps> = (props) => {
  return (
    <div
      className={cn(
        "space-y-2 border-t border-border/60 pt-3 first:border-t-0 first:pt-0",
        { "text-destructive": props.error },
        props.className,
      )}
      role="group"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          {props.labelSlot ?? (
            <label className="block text-xs leading-tight font-medium text-muted-foreground">
              {props.label}
            </label>
          )}
        </div>
        {props.action && <div className="shrink-0">{props.action}</div>}
      </div>

      <div className="space-y-2">{props.children}</div>
    </div>
  )
}
