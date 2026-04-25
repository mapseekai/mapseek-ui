import * as React from "react"
import { Select as SelectPrimitive } from "@base-ui-components/react/select"
import { IconChevronDown, IconCheck } from "@tabler/icons-react"
import { cn } from "@workspace/ui/lib/utils"

type SelectRootProps = {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  placeholder?: React.ReactNode
  disabled?: boolean
  // className + HTML pass-through props forwarded to the <button> trigger.
  className?: string
  style?: React.CSSProperties
  title?: string
  "aria-label"?: string
  "data-wd-key"?: string
  children: React.ReactNode
}

type SelectItemProps = {
  value: string
  disabled?: boolean
  className?: string
  children: React.ReactNode
}

function SelectItem({ value, disabled, className, children }: SelectItemProps) {
  return (
    <SelectPrimitive.Item
      value={value}
      disabled={disabled}
      className={cn(
        "relative flex cursor-pointer items-center gap-1.5 px-2 py-1 pr-6 text-xs outline-none select-none",
        "data-[highlighted]:bg-muted",
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className
      )}
    >
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
      <SelectPrimitive.ItemIndicator className="absolute right-1.5 flex h-3 w-3 items-center justify-center text-primary">
        <IconCheck size={10} stroke={2} />
      </SelectPrimitive.ItemIndicator>
    </SelectPrimitive.Item>
  )
}

// Walk children to build an items map { [value]: label } so Select.Value can
// render the matching Item's label in the trigger (base-ui RC 1.0.0 resolves
// the selected label from the Root `items` prop, not from rendered Items).
function collectItems(
  children: React.ReactNode,
  acc: Record<string, React.ReactNode>
): Record<string, React.ReactNode> {
  React.Children.forEach(children, (child) => {
    if (!React.isValidElement(child)) return
    if (child.type === SelectItem) {
      const { value, children: label } = child.props as SelectItemProps
      acc[value] = label
      return
    }
    const nested = (child.props as { children?: React.ReactNode }).children
    if (nested != null) collectItems(nested, acc)
  })
  return acc
}

function SelectRoot({
  value,
  defaultValue,
  onValueChange,
  placeholder,
  disabled,
  className,
  style,
  title,
  children,
  ...rest
}: SelectRootProps) {
  // Base UI Select.Root reads `items` and stores it in its internal Zustand
  // store. If the prop reference changes on every render — even when its
  // contents are identical — the store keeps publishing updates, which
  // triggers a "Maximum update depth exceeded" loop. Memoizing on the
  // children reference alone isn't enough because callers like
  // ColorPickerOutput re-create the children array via `[...].map(...)` on
  // every render. Compare the *content* and reuse the previous reference
  // whenever the resolved {value: label} map is unchanged.
  const lastItemsRef = React.useRef<Record<string, React.ReactNode>>({})
  const items = React.useMemo(() => {
    const next = collectItems(children, {})
    const prev = lastItemsRef.current
    const prevKeys = Object.keys(prev)
    const nextKeys = Object.keys(next)
    if (prevKeys.length === nextKeys.length) {
      let same = true
      for (const k of nextKeys) {
        if (prev[k] !== next[k]) {
          same = false
          break
        }
      }
      if (same) return prev
    }
    lastItemsRef.current = next
    return next
  }, [children])

  return (
    <SelectPrimitive.Root
      value={value}
      defaultValue={defaultValue}
      onValueChange={(next) => {
        if (onValueChange && typeof next === "string") onValueChange(next)
      }}
      disabled={disabled}
      items={items}
    >
      <SelectPrimitive.Trigger
        className={cn(
          "inline-flex h-8 cursor-pointer items-center justify-between gap-1.5 border border-border bg-background px-2 text-xs font-medium text-foreground transition-colors outline-none",
          "hover:bg-muted",
          "data-[popup-open]:bg-muted",
          "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/20",
          "disabled:pointer-events-none disabled:opacity-50",
          className
        )}
        style={style}
        title={title}
        aria-label={rest["aria-label"]}
        data-wd-key={rest["data-wd-key"]}
        data-slot="select-trigger"
      >
        <SelectPrimitive.Value>
          {(current: unknown) => {
            const key = current == null ? "" : String(current)
            if (key in items) return items[key]
            return placeholder ?? ""
          }}
        </SelectPrimitive.Value>
        <SelectPrimitive.Icon className="ml-1 shrink-0 text-muted-foreground">
          <IconChevronDown size={10} stroke={1.5} />
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>
      <SelectPrimitive.Portal>
        <SelectPrimitive.Positioner
          sideOffset={4}
          className="z-[1070] outline-none"
        >
          <SelectPrimitive.Popup
            className={cn(
              "min-w-[var(--anchor-width)] border border-border bg-popover py-1 text-popover-foreground shadow-md outline-none",
              "transition-opacity duration-100 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0"
            )}
          >
            {children}
          </SelectPrimitive.Popup>
        </SelectPrimitive.Positioner>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  )
}

const Select = Object.assign(SelectRoot, { Item: SelectItem })

export { Select }
