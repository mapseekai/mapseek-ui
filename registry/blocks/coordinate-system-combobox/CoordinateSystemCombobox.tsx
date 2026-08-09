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

function formatCoordinateSystem(item: CoordinateSystemItem) {
  return `${item.epsg} · ${item.name}`
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
  const isControlled = valueProp !== undefined
  const selectedEpsg = isControlled ? (valueProp ?? null) : uncontrolledValue
  const items = buildCoordinateSystemList(extraItems)
  const selectedItem = items.find((item) => item.epsg === selectedEpsg) ?? null
  const geographicItems = items.filter((item) => item.kind === "geographic")
  const projectedItems = items.filter((item) => item.kind === "projected")

  function handleValueChange(item: CoordinateSystemItem | null) {
    const nextValue = item?.epsg ?? null

    if (!isControlled) setUncontrolledValue(nextValue)
    onValueChange?.(nextValue)
  }

  return (
    <Combobox<CoordinateSystemItem>
      value={selectedItem}
      onValueChange={handleValueChange}
      itemToStringLabel={formatCoordinateSystem}
      itemToStringValue={(item) => item.epsg}
      isItemEqualToValue={(left, right) => left.epsg === right.epsg}
      autoHighlight
      disabled={disabled}
    >
      <ComboboxInput
        aria-label={labels.inputLabel}
        placeholder={labels.searchPlaceholder}
        className={cn("w-full", className)}
        disabled={disabled}
        showClear={selectedEpsg !== null}
      />
      <ComboboxContent>
        <ComboboxEmpty>{labels.noResults}</ComboboxEmpty>
        <ComboboxList>
          {geographicItems.length > 0 && (
            <ComboboxGroup>
              <ComboboxLabel>{labels.geographic}</ComboboxLabel>
              {geographicItems.map((item) => (
                <ComboboxItem key={item.epsg} value={item}>
                  {formatCoordinateSystem(item)}
                </ComboboxItem>
              ))}
            </ComboboxGroup>
          )}
          {projectedItems.length > 0 && (
            <ComboboxGroup>
              <ComboboxLabel>{labels.projected}</ComboboxLabel>
              {projectedItems.map((item) => (
                <ComboboxItem key={item.epsg} value={item}>
                  {formatCoordinateSystem(item)}
                </ComboboxItem>
              ))}
            </ComboboxGroup>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}
