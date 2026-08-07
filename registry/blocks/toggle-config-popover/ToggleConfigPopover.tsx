import { IconChevronDown, type Icon as TablerIcon } from "@tabler/icons-react"
import * as React from "react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { resolveLabels } from "@/lib/mapseek-labels"
import { cn } from "@/lib/utils"
import { DEFAULT_TOGGLE_CONFIG_POPOVER_LABELS } from "./defaults"
import type { ToggleConfigPopoverLabels } from "./labels"

export type ToggleConfigPopoverProps = {
  icon: TablerIcon
  label: string
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  children: React.ReactNode
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  disabled?: boolean
  toggleLabel?: string
  labels?: Partial<ToggleConfigPopoverLabels>
  triggerLabel?: string
  tooltip?: string
  settingsTooltip?: string
  switchLabel?: string
  className?: string
  toggleClassName?: string
  triggerClassName?: string
  contentClassName?: string
}

function ToggleConfigPopover({
  icon: Icon,
  label,
  checked,
  onCheckedChange,
  children,
  open,
  defaultOpen = false,
  onOpenChange,
  disabled = false,
  toggleLabel,
  labels: labelsProp,
  triggerLabel,
  tooltip,
  settingsTooltip,
  switchLabel,
  className,
  toggleClassName,
  triggerClassName,
  contentClassName,
}: ToggleConfigPopoverProps) {
  const labels = resolveLabels(DEFAULT_TOGGLE_CONFIG_POPOVER_LABELS, labelsProp)
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen)
  const actualOpen = open ?? uncontrolledOpen

  const setOpen = (next: boolean) => {
    if (open === undefined) setUncontrolledOpen(next)
    onOpenChange?.(next)
  }

  const resolvedToggleLabel = toggleLabel ?? switchLabel ?? label
  const resolvedTriggerLabel = triggerLabel ?? `${label}${labels.settingsSuffix}`
  const resolvedTooltip = tooltip ?? resolvedToggleLabel
  const resolvedSettingsTooltip = settingsTooltip ?? resolvedTriggerLabel
  const resolvedSwitchLabel = switchLabel ?? resolvedToggleLabel

  return (
    <div
      data-slot="toggle-config-popover"
      className={cn("inline-flex items-center gap-[0.5px]", className)}
    >
      <Tooltip>
        <TooltipTrigger
          render={
            <Button
              type="button"
              variant="ghost"
              size="icon"
              role="switch"
              aria-checked={checked}
              aria-label={resolvedToggleLabel}
              disabled={disabled}
              onClick={() => onCheckedChange(!checked)}
              className={cn(
                "relative size-8 rounded-none",
                checked
                  ? "bg-selection-bg text-primary hover:bg-selection-bg hover:text-primary"
                  : "bg-transparent text-muted-foreground",
                toggleClassName,
              )}
            >
              <Icon />
              <span
                aria-hidden="true"
                className={cn(
                  "absolute right-1 bottom-1 size-[5px] rounded-full",
                  checked ? "bg-primary opacity-100" : "bg-muted-foreground opacity-40",
                )}
              />
            </Button>
          }
        />
        <TooltipContent side="bottom">{resolvedTooltip}</TooltipContent>
      </Tooltip>

      <Popover open={actualOpen} onOpenChange={setOpen}>
        <Tooltip>
          <TooltipTrigger render={<span className="inline-flex" />}>
            <PopoverTrigger
              render={
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  disabled={disabled}
                  aria-label={resolvedTriggerLabel}
                  className={cn(
                    "h-8 w-[18px] rounded-none text-muted-foreground",
                    actualOpen &&
                      "bg-selection-bg text-primary hover:bg-selection-bg hover:text-primary",
                    triggerClassName,
                  )}
                >
                  <IconChevronDown stroke={2.25} className="text-muted-foreground" />
                </Button>
              }
            />
          </TooltipTrigger>
          <TooltipContent side="bottom">{resolvedSettingsTooltip}</TooltipContent>
        </Tooltip>
        <PopoverContent
          side="bottom"
          align="center"
          sideOffset={4}
          className={cn("w-[280px] gap-0 p-0", contentClassName)}
        >
          <header className="flex h-9 items-center gap-2 border-b border-border px-3">
            <Icon size={14} className={checked ? "text-primary" : "text-muted-foreground"} />
            <span className="text-body-md-strong leading-none">{label}</span>
            <span className="flex-1" />
            <Button
              type="button"
              variant="ghost"
              role="switch"
              aria-checked={checked}
              aria-label={resolvedSwitchLabel}
              disabled={disabled}
              onClick={() => onCheckedChange(!checked)}
              className={cn(
                "relative h-4 w-7 rounded-none border p-0",
                checked
                  ? "border-transparent bg-primary hover:bg-primary"
                  : "border-border bg-muted",
              )}
            >
              <span
                className="absolute top-px size-3 bg-background transition-[left] duration-[120ms]"
                style={{ left: checked ? 13 : 1 }}
              />
            </Button>
          </header>
          <div className={cn("transition-opacity duration-150", !checked && "opacity-50")}>
            {children}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}

export { ToggleConfigPopover }
