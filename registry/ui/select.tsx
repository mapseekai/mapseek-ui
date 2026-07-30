import { Select as SelectPrimitive } from "@base-ui/react/select"
import { IconCheck, IconChevronDown } from "@tabler/icons-react"
import { cn } from "@/registry/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"

const selectTriggerVariants = cva(
  "inline-flex w-full cursor-pointer items-center justify-between border border-border bg-background text-xs font-medium text-foreground transition-colors outline-none hover:bg-muted focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/20 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 data-[popup-open]:bg-muted dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
  {
    variants: {
      size: {
        sm: "h-7 gap-1.5 px-2",
        default: "h-8 gap-1.5 px-2.5",
      },
    },
    defaultVariants: {
      size: "default",
    },
  },
)

type SelectRootProps = VariantProps<typeof selectTriggerVariants> & {
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

const itemsCache = new Map<string, Record<string, React.ReactNode>>()

function SelectItem({ value, disabled, className, children }: SelectItemProps) {
  return (
    <SelectPrimitive.Item
      value={value}
      disabled={disabled}
      className={cn(
        "relative flex h-8 cursor-pointer items-center gap-1.5 px-2 pr-6 text-xs outline-none select-none",
        "data-[highlighted]:bg-muted",
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className,
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
  acc: Record<string, React.ReactNode>,
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

function signaturePart(node: React.ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node)
  if (node == null || typeof node === "boolean") return ""
  if (Array.isArray(node)) return node.map(signaturePart).join(",")
  if (React.isValidElement(node)) {
    const props = node.props as { children?: React.ReactNode }
    return `${String(node.type)}(${signaturePart(props.children)})`
  }
  return String(node)
}

function collectItemsSignature(children: React.ReactNode): string {
  const parts: string[] = []
  React.Children.forEach(children, (child) => {
    if (!React.isValidElement(child)) return
    if (child.type === SelectItem) {
      const { value, children: label } = child.props as SelectItemProps
      parts.push(`${value}:${signaturePart(label)}`)
      return
    }
    const nested = (child.props as { children?: React.ReactNode }).children
    if (nested != null) parts.push(collectItemsSignature(nested))
  })
  return parts.join("|")
}

function SelectRoot({
  value,
  defaultValue,
  onValueChange,
  placeholder,
  disabled,
  className,
  size,
  style,
  title,
  children,
  ...rest
}: SelectRootProps) {
  const itemsSignature = collectItemsSignature(children)
  const items = React.useMemo(() => {
    const cached = itemsCache.get(itemsSignature)
    if (cached) return cached

    const next = collectItems(children, {})
    itemsCache.set(itemsSignature, next)
    return next
  }, [children, itemsSignature])

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
        className={cn(selectTriggerVariants({ size, className }))}
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
        <SelectPrimitive.Positioner sideOffset={4} className="z-[1070] outline-none">
          <SelectPrimitive.Popup
            className={cn(
              "max-h-[220px] min-w-[var(--anchor-width)] overflow-y-auto border border-border bg-popover p-1 text-popover-foreground shadow-md outline-none",
              "transition-opacity duration-100 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0",
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
