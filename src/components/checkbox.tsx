import * as React from "react"
import { IconCheck } from "@tabler/icons-react"
import { cn } from "@workspace/ui/lib/utils"

type CheckboxProps = {
  checked?: boolean
  defaultChecked?: boolean
  onCheckedChange?: (checked: boolean) => void
  disabled?: boolean
  className?: string
  id?: string
  name?: string
  style?: React.CSSProperties
  "aria-label"?: string
  "aria-labelledby"?: string
  "data-wd-key"?: string
}

/**
 * Plain controlled/uncontrolled checkbox built on a real <button> with
 * role=checkbox. Avoids the Base UI Checkbox.Root + hidden <input>
 * indirection — that pattern dropped change events under React's
 * controlled-input value-tracker, leaving 抗锯齿 / 聚合 toggles
 * silently no-op'd.
 */
function Checkbox({
  className,
  checked: controlledChecked,
  defaultChecked,
  onCheckedChange,
  disabled,
  ...props
}: CheckboxProps) {
  const isControlled = controlledChecked !== undefined
  const [internal, setInternal] = React.useState<boolean>(
    isControlled ? !!controlledChecked : !!defaultChecked
  )
  const checked = isControlled ? !!controlledChecked : internal

  const handleClick = () => {
    if (disabled) return
    const next = !checked
    if (!isControlled) setInternal(next)
    onCheckedChange?.(next)
  }

  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-disabled={disabled || undefined}
      data-slot="checkbox"
      data-state={checked ? "checked" : "unchecked"}
      disabled={disabled}
      onClick={handleClick}
      className={cn(
        "peer relative inline-flex h-3.5 w-3.5 shrink-0 cursor-pointer items-center justify-center border border-border bg-background transition-colors",
        "data-[state=checked]:border-primary data-[state=checked]:bg-primary",
        "disabled:pointer-events-none disabled:opacity-50",
        "focus-visible:ring-[3px] focus-visible:ring-ring/30 focus-visible:outline-none",
        className
      )}
      {...props}
    >
      {checked && (
        <IconCheck
          size={10}
          stroke={3}
          className="text-primary-foreground"
        />
      )}
    </button>
  )
}

export { Checkbox }
