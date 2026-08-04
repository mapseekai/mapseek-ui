import type React from "react"
import type { PropsWithChildren, ReactElement, ReactNode } from "react"
import { cn } from "@/lib/utils"

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
    <fieldset
      className={cn(
        "m-0 flex min-w-0 flex-col gap-2 border-t border-border/60 p-0 pt-3 first:border-t-0 first:pt-0",
        { "text-destructive": props.error },
        props.className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          {props.labelSlot ?? (
            <legend className="block text-xs leading-tight font-medium text-muted-foreground">
              {props.label}
            </legend>
          )}
        </div>
        {props.action && <div className="shrink-0">{props.action}</div>}
      </div>

      <div className="flex flex-col gap-2">{props.children}</div>
    </fieldset>
  )
}
