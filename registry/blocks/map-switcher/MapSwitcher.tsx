import { IconChevronDown, IconStack2 } from "@tabler/icons-react"
import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import type {
  MapSwitcherContextValue,
  MapSwitcherItemData,
  MapSwitcherPanelProps,
  MapSwitcherProps,
  MapSwitcherTriggerProps,
} from "./types"

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const MapSwitcherContext = React.createContext<MapSwitcherContextValue | null>(null)

function useMapSwitcherContext(): MapSwitcherContextValue {
  const ctx = React.useContext(MapSwitcherContext)
  if (!ctx) throw new Error("MapSwitcher sub-components must be used inside <MapSwitcher>")
  return ctx
}

// ---------------------------------------------------------------------------
// Root
// ---------------------------------------------------------------------------

function MapSwitcherRoot({
  value: valueProp,
  defaultValue,
  onChange,
  open,
  defaultOpen,
  onOpenChange,
  variant = "icon",
  children,
}: MapSwitcherProps) {
  const [selectedUncontrolled, setSelectedUncontrolled] = React.useState(defaultValue ?? null)
  const isValueControlled = valueProp !== undefined
  const selectedId = isValueControlled ? (valueProp ?? null) : selectedUncontrolled

  const [items, setItems] = React.useState<Map<string, MapSwitcherItemData>>(new Map())

  const onSelect = React.useCallback(
    (id: string) => {
      if (!isValueControlled) setSelectedUncontrolled(id)
      onChange?.(id)
      // The menu closes itself after a radio-item selection.
    },
    [isValueControlled, onChange],
  )

  const registerItem = React.useCallback((data: MapSwitcherItemData) => {
    setItems((current) => new Map(current).set(data.id, data))
  }, [])

  const unregisterItem = React.useCallback((id: string) => {
    setItems((current) => {
      const next = new Map(current)
      next.delete(id)
      return next
    })
  }, [])

  const getItem = React.useCallback((id: string) => items.get(id), [items])

  const ctx = React.useMemo<MapSwitcherContextValue>(
    () => ({
      selectedId,
      onSelect,
      variant,
      registerItem,
      unregisterItem,
      getItem,
    }),
    [selectedId, onSelect, variant, registerItem, unregisterItem, getItem],
  )

  return (
    <MapSwitcherContext.Provider value={ctx}>
      <DropdownMenu open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
        {children}
      </DropdownMenu>
    </MapSwitcherContext.Provider>
  )
}

// ---------------------------------------------------------------------------
// Item
// ---------------------------------------------------------------------------

function MapSwitcherItem({ id, label, image, color }: MapSwitcherItemData) {
  const { variant, registerItem, unregisterItem } = useMapSwitcherContext()

  React.useEffect(() => {
    registerItem({ id, label, image, color })
    // Preload the thumbnail before the trigger needs it (icon-variant panels
    // are only mounted while open).
    if (image) {
      const preload = new window.Image()
      preload.src = image
    }
    return () => unregisterItem(id)
  }, [id, label, image, color, registerItem, unregisterItem])

  if (variant === "image") {
    return (
      <DropdownMenuRadioItem
        value={id}
        closeOnClick
        title={label}
        className={cn(
          "flex w-[88px] cursor-pointer flex-col items-center gap-1 p-1.5 ring-inset transition-colors",
          // Card-type tile: hover and selected share the primary 5% fill + 1px ring.
          "hover:bg-primary/5 hover:ring-1 hover:ring-primary focus:bg-primary/5 focus:text-foreground focus:ring-1 focus:ring-primary",
          "data-checked:bg-primary/5 data-checked:ring-1 data-checked:ring-primary",
          // The persistent fill + ring is the selection indicator — no check badge.
          "[&_[data-slot=dropdown-menu-radio-item-indicator]]:hidden",
        )}
      >
        {/* Thumbnail: 76×52px */}
        <span className="flex h-[52px] w-[76px] items-center justify-center overflow-hidden">
          {image ? (
            <img src={image} alt={label} className="h-full w-full object-cover" />
          ) : (
            <span
              className="flex h-full w-full items-center justify-center font-mono text-label-md text-foreground"
              style={{ background: color ?? "var(--muted)" }}
            >
              {label}
            </span>
          )}
        </span>
        <span className="max-w-[76px] truncate px-0.5 font-mono text-label-md text-foreground">
          {label}
        </span>
      </DropdownMenuRadioItem>
    )
  }

  // variant === "icon"
  return (
    <DropdownMenuRadioItem value={id} closeOnClick title={label} className="cursor-pointer">
      <span
        className="size-2 shrink-0"
        style={{ background: color ?? "var(--muted-foreground)" }}
      />
      <span className="truncate">{label}</span>
    </DropdownMenuRadioItem>
  )
}

// ---------------------------------------------------------------------------
// Trigger
// ---------------------------------------------------------------------------

function MapSwitcherTrigger({ label = "Basemap", className }: MapSwitcherTriggerProps) {
  const { selectedId, getItem, variant } = useMapSwitcherContext()
  const item = selectedId ? getItem(selectedId) : undefined

  if (variant === "icon") {
    return (
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            type="button"
            aria-label={label}
            title={label}
            className={cn(
              "size-8 rounded-none border border-border bg-card text-muted-foreground hover:text-foreground",
              className,
            )}
          >
            <IconStack2 size={14} stroke={1.5} />
          </Button>
        }
      />
    )
  }

  return (
    <DropdownMenuTrigger
      render={
        <Button
          variant="ghost"
          size="sm"
          type="button"
          title={item?.label}
          className={cn(
            "group flex h-auto w-[76px] cursor-pointer flex-col gap-0 border-border bg-card p-0",
            className,
          )}
        >
          {/* Top area: thumbnail or color block */}
          <span className="flex h-11 w-full items-center justify-center overflow-hidden">
            {item?.image ? (
              <img
                src={item.image}
                alt={item.label}
                className="block h-full w-full object-cover object-center"
              />
            ) : (
              <span
                className="flex h-full w-full items-center justify-center font-mono text-label-md text-foreground"
                style={{ background: item?.color ?? "var(--muted)" }}
              >
                {item?.label ?? ""}
              </span>
            )}
          </span>
          {/* Bottom row: label + chevron */}
          <span className="grid h-6 w-full grid-cols-[1rem_minmax(0,1fr)_1rem] items-center pe-1">
            <span aria-hidden="true" />
            <span className="min-w-0 truncate text-center text-body-sm text-foreground">
              {item?.label ?? ""}
            </span>
            <span className="flex items-center justify-center">
              <IconChevronDown
                strokeWidth={1.75}
                className="size-3.5 shrink-0 text-muted-foreground transition-transform group-data-[popup-open]:rotate-180"
              />
            </span>
          </span>
        </Button>
      }
    />
  )
}

// ---------------------------------------------------------------------------
// Panel
// ---------------------------------------------------------------------------

function MapSwitcherPanel({ className, children }: MapSwitcherPanelProps) {
  const { variant, selectedId, onSelect } = useMapSwitcherContext()

  return (
    <DropdownMenuContent
      // Keep items mounted so the image-variant trigger can resolve the
      // selected basemap thumbnail while the menu is closed.
      keepMounted
      side="top"
      align="end"
      sideOffset={4}
      data-slot="map-switcher-panel"
      className={cn(variant === "image" && "w-[196px] whitespace-normal", className)}
    >
      <DropdownMenuRadioGroup
        value={selectedId ?? ""}
        onValueChange={onSelect}
        className={cn(variant === "image" && "grid grid-cols-2 gap-1")}
      >
        {children}
      </DropdownMenuRadioGroup>
    </DropdownMenuContent>
  )
}

// ---------------------------------------------------------------------------
// Composite export
// ---------------------------------------------------------------------------

export const MapSwitcher = Object.assign(MapSwitcherRoot, {
  Trigger: MapSwitcherTrigger,
  Panel: MapSwitcherPanel,
  Item: MapSwitcherItem,
})
