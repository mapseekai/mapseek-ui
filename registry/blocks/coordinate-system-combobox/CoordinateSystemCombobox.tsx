import { IconMap2, IconWorld, type Icon as TablerIcon } from "@tabler/icons-react"
import * as React from "react"

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
} from "@/components/ui/combobox"
import { resolveLabels } from "@/lib/mapseek-labels"
import { cn } from "@/lib/utils"

import { buildCoordinateSystemList } from "./built-in-coordinate-systems"
import { DEFAULT_COORDINATE_SYSTEM_COMBOBOX_LABELS } from "./defaults"
import type { CoordinateSystemComboboxProps, CoordinateSystemItem } from "./types"

function matchesCoordinateSystem(item: CoordinateSystemItem, query: string) {
  const normalizedQuery = query.trim().toLowerCase()

  return (
    normalizedQuery.length === 0 ||
    item.name.toLowerCase().includes(normalizedQuery) ||
    item.epsg.toLowerCase().includes(normalizedQuery)
  )
}

function CoordinateSystemOption({ item }: { item: CoordinateSystemItem }) {
  return (
    <ComboboxItem value={item} aria-label={`${item.epsg}, ${item.name}`}>
      <span className="min-w-0">
        <span className="block font-mono text-body-md-strong leading-snug text-foreground">
          {item.epsg}
        </span>
        <span className="mt-0.5 block text-body-sm leading-snug text-muted-foreground">
          {item.name}
        </span>
      </span>
    </ComboboxItem>
  )
}

function CoordinateSystemGroup({
  items,
  label,
  icon: Icon,
}: {
  items: CoordinateSystemItem[]
  label: string
  icon: TablerIcon
}) {
  return (
    <ComboboxGroup>
      <ComboboxLabel className="flex items-center gap-1.5">
        <Icon aria-hidden="true" className="shrink-0" size={12} stroke={1.75} />
        <span>{label}</span>
      </ComboboxLabel>
      {items.map((item) => (
        <CoordinateSystemOption key={item.epsg} item={item} />
      ))}
    </ComboboxGroup>
  )
}

export function CoordinateSystemCombobox({
  value: valueProp,
  defaultValue,
  onValueChange,
  extraItems,
  disabled,
  className,
  labels: labelsProp,
}: CoordinateSystemComboboxProps) {
  const labels = resolveLabels(DEFAULT_COORDINATE_SYSTEM_COMBOBOX_LABELS, labelsProp)
  const [uncontrolledValue, setUncontrolledValue] = React.useState<string | null>(
    defaultValue ?? null,
  )
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState("")
  const isControlled = valueProp !== undefined
  const selectedEpsg = isControlled ? (valueProp ?? null) : uncontrolledValue
  const items = buildCoordinateSystemList(extraItems)
  const selectedItem = items.find((item) => item.epsg === selectedEpsg) ?? null
  const filteredItems = items.filter((item) => matchesCoordinateSystem(item, query))
  const geographicItems = filteredItems.filter((item) => item.kind === "geographic")
  const projectedItems = filteredItems.filter((item) => item.kind === "projected")

  function handleValueChange(item: CoordinateSystemItem | null) {
    const nextValue = item?.epsg ?? null

    if (!isControlled) setUncontrolledValue(nextValue)
    onValueChange?.(nextValue)
  }

  return (
    <Combobox<CoordinateSystemItem>
      value={selectedItem}
      onValueChange={handleValueChange}
      open={open}
      inputValue={open ? query : (selectedItem?.epsg ?? "")}
      onInputValueChange={(inputValue, eventDetails) => {
        if (eventDetails.reason === "input-change" || eventDetails.reason === "input-clear") {
          setQuery(inputValue)
        }
      }}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen)
        setQuery("")
      }}
      itemToStringLabel={(item) => item.epsg}
      itemToStringValue={(item) => item.epsg}
      isItemEqualToValue={(left, right) => left.epsg === right.epsg}
      autoHighlight
      disabled={disabled}
    >
      <ComboboxInput
        aria-label={labels.inputLabel}
        placeholder={labels.searchPlaceholder}
        className={cn("w-[calc(100%-4px)] max-w-xs", className)}
        disabled={disabled}
        showClear={selectedEpsg !== null}
      />
      <ComboboxContent>
        <ComboboxEmpty>{labels.noResults}</ComboboxEmpty>
        <ComboboxList>
          {geographicItems.length > 0 && (
            <CoordinateSystemGroup
              items={geographicItems}
              label={labels.geographic}
              icon={IconWorld}
            />
          )}
          {projectedItems.length > 0 && (
            <CoordinateSystemGroup
              items={projectedItems}
              label={labels.projected}
              icon={IconMap2}
            />
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}
