import { IconChevronDown, type Icon as TablerIcon } from "@tabler/icons-react"
import * as React from "react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { resolveLabels } from "@/lib/mapseek-labels"
import { cn } from "@/lib/utils"
import { DEFAULT_SPLIT_TOOL_PICKER_LABELS } from "./defaults"
import type { SplitToolPickerLabels } from "./labels"

export type SplitToolActionSource = "primary" | "menu"

export type SplitToolItem = {
  id: string
  icon: TablerIcon
  label: string
  hint?: string
  description?: string
}

export type SplitToolPickerProps = {
  items: SplitToolItem[]
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  onAction?: (value: string, source: SplitToolActionSource) => void
  active?: boolean
  disabled?: boolean
  label?: string
  labels?: Partial<SplitToolPickerLabels>
  className?: string
  contentClassName?: string
}

function SplitToolPicker({
  items,
  value,
  defaultValue,
  onValueChange,
  onAction,
  active = true,
  disabled = false,
  label,
  labels: labelsProp,
  className,
  contentClassName,
}: SplitToolPickerProps) {
  const labels = resolveLabels(DEFAULT_SPLIT_TOOL_PICKER_LABELS, labelsProp)
  const resolvedLabel = label ?? labels.tool
  const [open, setOpen] = React.useState(false)
  const [uncontrolledValue, setUncontrolledValue] = React.useState(
    defaultValue ?? items[0]?.id ?? "",
  )
  const selectedValue = value ?? uncontrolledValue
  const selectedItem = items.find((item) => item.id === selectedValue) ?? items[0]

  const commitValue = (next: string, source: SplitToolActionSource) => {
    if (value === undefined) setUncontrolledValue(next)
    onValueChange?.(next)
    onAction?.(next, source)
  }

  if (!selectedItem) return null

  const SelectedIcon = selectedItem.icon

  return (
    <div data-slot="split-tool-picker" className={cn("inline-flex items-center", className)}>
      <Tooltip>
        <TooltipTrigger
          render={
            <Button
              type="button"
              variant="ghost"
              size="icon"
              disabled={disabled}
              aria-label={selectedItem.label}
              aria-pressed={active}
              onClick={() => commitValue(selectedItem.id, "primary")}
              className={cn(
                "size-8",
                active
                  ? "bg-selection-bg text-primary hover:bg-selection-bg hover:text-primary"
                  : "bg-transparent text-foreground",
              )}
              data-active={active ? "true" : undefined}
            >
              <SelectedIcon />
            </Button>
          }
        />
        <TooltipContent side="bottom">
          {selectedItem.label}
          {selectedItem.hint ? ` · ${selectedItem.hint}` : ""}
        </TooltipContent>
      </Tooltip>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          render={
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              disabled={disabled}
              aria-label={`${resolvedLabel}${labels.menu}`}
              className={cn(
                "h-8 w-4.5 text-muted-foreground",
                open && "bg-selection-bg text-primary hover:bg-selection-bg hover:text-primary",
              )}
            >
              <IconChevronDown stroke={2.25} />
            </Button>
          }
        />
        <PopoverContent
          side="bottom"
          align="start"
          sideOffset={4}
          className={cn("w-47.5 gap-0 p-0", contentClassName)}
        >
          <div className="px-3 pt-2 pb-1 text-label-sm leading-none text-muted-foreground uppercase">
            {resolvedLabel}
          </div>
          <div role="listbox" aria-label={resolvedLabel} className="flex flex-col gap-1 p-1.5">
            {items.map((item) => {
              const Icon = item.icon
              const selected = item.id === selectedItem.id
              return (
                <Button
                  variant="ghost"
                  size="sm"
                  key={item.id}
                  type="button"
                  role="option"
                  aria-selected={selected}
                  onClick={() => {
                    commitValue(item.id, "menu")
                    setOpen(false)
                  }}
                  className={cn(
                    "flex h-auto w-full cursor-pointer items-center gap-2.5 border-y-0 border-r-0 border-l-2 border-l-transparent px-2 py-2 text-left outline-none",
                    selected
                      ? "border-l-primary bg-selection-bg text-primary hover:bg-selection-bg hover:text-primary"
                      : "text-foreground hover:bg-accent/50",
                  )}
                >
                  <Icon
                    data-icon="inline-start"
                    stroke={1.75}
                    className={selected ? "text-primary" : "text-muted-foreground"}
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block text-body-md-medium leading-none">{item.label}</span>
                    {item.description ? (
                      <span className="mt-1 block truncate text-body-sm leading-none text-muted-foreground">
                        {item.description}
                      </span>
                    ) : null}
                  </span>
                  {item.hint ? (
                    <span className="font-mono text-[10px] font-medium text-muted-foreground">
                      {item.hint}
                    </span>
                  ) : null}
                </Button>
              )
            })}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}

export { SplitToolPicker }
