import React, { type CSSProperties, type PropsWithChildren, type ReactNode, useRef } from "react"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

export type BlockProps = PropsWithChildren & {
  "data-wd-key"?: string
  label?: ReactNode
  /** Full label node; when set it replaces the default `<Label>{label}</Label>`. */
  labelSlot?: ReactNode
  action?: React.ReactElement
  style?: CSSProperties
  wideMode?: boolean
  inline?: boolean
  error?: { message: string }
  className?: string
}

/**
 * Wrap a control with a label, action, and content area. Three layouts:
 * `wideMode` (label+action header above content), `inline`, or default
 * three-column. Label rendering is slot-driven (`labelSlot`) so callers can
 * inject a doc-aware label without coupling this block. See BLOCKS-EXTRACTION.md § layout.
 */
export const Block: React.FC<BlockProps> = (props) => {
  const blockElRef = useRef<HTMLDivElement>(null)

  const onLabelClick = (event: React.MouseEvent<HTMLFieldSetElement>) => {
    const target = event.nativeEvent.target as HTMLElement
    const contains = blockElRef.current?.contains(target)

    if (target.nodeName !== "INPUT" && !contains) {
      event.stopPropagation()
    }
    if ((event.nativeEvent.target as HTMLElement).nodeName !== "A") {
      event.preventDefault()
    }
  }

  const onLabelKeyDown = (event: React.KeyboardEvent<HTMLFieldSetElement>) => {
    if (event.target !== event.currentTarget) return
    if (event.key !== "Enter" && event.key !== " ") return
    event.preventDefault()
  }

  const containerClasses = cn(
    "m-0 min-w-0 border-0 p-0 w-full",
    {
      "flex flex-col gap-1.5 py-1": props.wideMode,
      "flex items-center gap-2 py-1": props.inline,
      "flex items-start gap-2 py-1": !props.wideMode && !props.inline,
      "text-destructive": props.error,
    },
    props.className,
  )

  const labelNode = props.labelSlot ?? (
    <Label
      className={cn("text-xs leading-tight font-medium text-muted-foreground", {
        "text-destructive": props.error,
      })}
    >
      {props.label}
    </Label>
  )

  return (
    <fieldset
      style={props.style}
      data-wd-key={props["data-wd-key"]}
      className={containerClasses}
      onClick={onLabelClick}
      onKeyDown={onLabelKeyDown}
    >
      {props.wideMode ? (
        <>
          {/* wideMode: label + action share a header row, content below */}
          <div className="flex items-center justify-between gap-2 overflow-visible">
            <div className="maputnik-input-block-label min-w-0 flex-1">{labelNode}</div>
            {props.action && (
              <div className="maputnik-input-block-action !w-auto !flex-none !basis-auto overflow-visible">
                {props.action}
              </div>
            )}
          </div>
          <div className="maputnik-input-block-content w-full min-w-0" ref={blockElRef}>
            {props.children}
          </div>
        </>
      ) : (
        <>
          {/* inline / default: three-column horizontal */}
          <div
            className={cn("maputnik-input-block-label shrink-0", {
              "w-auto min-w-[72px]": props.inline,
              "w-[96px]": !props.inline,
              "pt-0.5": !props.inline,
            })}
          >
            {labelNode}
          </div>

          {props.action ? (
            <div
              className={cn("maputnik-input-block-action shrink-0 text-right", {
                "self-center": props.inline,
                "self-start pt-0.5": !props.inline,
              })}
            >
              {props.action}
            </div>
          ) : null}

          <div
            className={cn("maputnik-input-block-content", {
              "min-w-0 flex-1": true,
            })}
            ref={blockElRef}
          >
            {props.children}
          </div>
        </>
      )}
    </fieldset>
  )
}
