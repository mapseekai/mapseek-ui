import { IconMap2, IconWorld, type Icon as TablerIcon } from "@tabler/icons-react"
import * as React from "react"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { resolveLabels } from "@/lib/mapseek-labels"
import { cn } from "@/lib/utils"
import { buildCrsList } from "./built-in-crs"
import { DEFAULT_CRS_PICKER_LABELS } from "./defaults"
import type { CrsItem, CrsPickerProps } from "./types"

// ── CrsPicker ─────────────────────────────────────────────────────────────────

export function CrsPicker({
  value: valueProp,
  defaultValue,
  onChange,
  allowedEpsgs,
  extraItems,
  className,
  labels: labelsProp,
}: CrsPickerProps) {
  const labels = resolveLabels(DEFAULT_CRS_PICKER_LABELS, labelsProp)
  const [uncontrolledValue, setUncontrolledValue] = React.useState<string | null>(
    defaultValue ?? null,
  )
  const isControlled = valueProp !== undefined
  const selectedEpsg = isControlled ? (valueProp ?? null) : uncontrolledValue

  const allItems = React.useMemo(
    () => buildCrsList(allowedEpsgs, extraItems),
    [allowedEpsgs, extraItems],
  )

  function handleSelect(epsg: string) {
    if (!isControlled) setUncontrolledValue(epsg)
    onChange?.(epsg)
  }

  const geographic = allItems.filter((i) => i.kind === "geographic")
  const projected = allItems.filter((i) => i.kind === "projected")

  return (
    <div data-slot="crs-picker" className={cn("w-[280px] max-w-full", className)}>
      <Command label={labels.searchLabel} className="w-full bg-background text-body-lg">
        <div className="flex items-center gap-2 border-b border-border px-3 py-2">
          <IconWorld
            aria-hidden
            size={13}
            strokeWidth={1.75}
            className="shrink-0 text-muted-foreground"
          />
          <span className="text-body-md-strong text-foreground">{labels.title}</span>
        </div>

        <CommandInput aria-label={labels.searchLabel} placeholder={labels.searchPlaceholder} />

        <CommandList label={labels.listLabel}>
          <CommandEmpty>{labels.noResults}</CommandEmpty>
          {geographic.length > 0 && (
            <CommandGroup
              className="**:[[cmdk-group-heading]]:py-0"
              heading={<GroupLabel icon={IconWorld}>{labels.geographic}</GroupLabel>}
            >
              {geographic.map((item) => (
                <CrsRow
                  key={item.epsg}
                  item={item}
                  selected={selectedEpsg === item.epsg}
                  onSelect={handleSelect}
                />
              ))}
            </CommandGroup>
          )}
          {projected.length > 0 && (
            <CommandGroup
              className="**:[[cmdk-group-heading]]:py-0"
              heading={<GroupLabel icon={IconMap2}>{labels.projected}</GroupLabel>}
            >
              {projected.map((item) => (
                <CrsRow
                  key={item.epsg}
                  item={item}
                  selected={selectedEpsg === item.epsg}
                  onSelect={handleSelect}
                />
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </Command>
    </div>
  )
}

// ── sub-components ────────────────────────────────────────────────────────────

function GroupLabel({
  children,
  icon: Icon,
  className,
}: {
  children: React.ReactNode
  icon: TablerIcon
  className?: string
}) {
  return (
    <div
      className={cn(
        "mb-1 -mx-2 flex items-center gap-1.5 bg-muted px-2 py-1 text-label-md uppercase text-muted-foreground",
        className,
      )}
    >
      <Icon aria-hidden size={11} stroke={1.75} className="shrink-0" />
      {children}
    </div>
  )
}

function CrsRow({
  item,
  selected,
  onSelect,
}: {
  item: CrsItem
  selected: boolean
  onSelect: (epsg: string) => void
}) {
  return (
    <CommandItem
      value={item.epsg}
      keywords={[item.name]}
      data-checked={selected}
      onSelect={() => onSelect(item.epsg)}
      className={cn(
        "items-start",
        "data-[checked=true]:bg-selection-bg data-[checked=true]:text-primary",
        "data-[checked=true]:data-selected:bg-selection-bg data-[checked=true]:data-selected:text-primary",
        "data-[checked=true]:data-selected:*:[svg]:text-primary",
      )}
    >
      <div className="min-w-0 flex-1">
        <div className="font-mono text-body-md-strong leading-snug text-foreground group-data-[checked=true]/command-item:text-primary">
          {item.epsg}
        </div>
        <div
          className="mt-0.5 truncate font-mono text-body-sm leading-snug text-muted-foreground group-data-[checked=true]/command-item:text-primary"
          title={item.name}
        >
          {item.name}
        </div>
      </div>
    </CommandItem>
  )
}
