import { IconChevronDown, IconChevronUp } from "@tabler/icons-react"
import * as React from "react"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { cn } from "@/lib/utils"
import type { MapSwitcherContextValue, MapSwitcherItemData, MapSwitcherProps } from "./types"

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
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  mode = "image",
  className,
  children,
}: MapSwitcherProps) {
  const [selectedUncontrolled, setSelectedUncontrolled] = React.useState(defaultValue ?? null)
  const isValueControlled = valueProp !== undefined
  const selectedId = isValueControlled ? (valueProp ?? null) : selectedUncontrolled

  const [openUncontrolled, setOpenUncontrolled] = React.useState(defaultOpen)
  const isOpenControlled = openProp !== undefined
  const open = openProp ?? openUncontrolled

  const [items, setItems] = React.useState<Map<string, MapSwitcherItemData>>(new Map())
  const rootRef = React.useRef<HTMLDivElement>(null)

  const setOpen = React.useCallback(
    (nextOpen: boolean) => {
      if (!isOpenControlled) setOpenUncontrolled(nextOpen)
      onOpenChange?.(nextOpen)
    },
    [isOpenControlled, onOpenChange],
  )

  React.useEffect(() => {
    if (!open) return
    function handleMouseDown(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleMouseDown)
    return () => document.removeEventListener("mousedown", handleMouseDown)
  }, [open, setOpen])

  React.useEffect(() => {
    if (!open) return
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false)
      }
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [open, setOpen])

  const onSelect = React.useCallback(
    (id: string) => {
      if (!isValueControlled) setSelectedUncontrolled(id)
      onChange?.(id)
      setOpen(false)
    },
    [isValueControlled, onChange, setOpen],
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
      open,
      mode,
      registerItem,
      unregisterItem,
      getItem,
    }),
    [selectedId, onSelect, open, mode, registerItem, unregisterItem, getItem],
  )

  return (
    <MapSwitcherContext.Provider value={ctx}>
      <Collapsible
        ref={rootRef}
        open={open}
        onOpenChange={setOpen}
        data-slot="map-switcher"
        className={cn("relative inline-block", className)}
      >
        {children}
      </Collapsible>
    </MapSwitcherContext.Provider>
  )
}

// ---------------------------------------------------------------------------
// Item
// ---------------------------------------------------------------------------

function MapSwitcherItem({ id, label, image, color }: MapSwitcherItemData) {
  const { selectedId, onSelect, mode, registerItem, unregisterItem } = useMapSwitcherContext()
  const isActive = selectedId === id

  React.useEffect(() => {
    registerItem({ id, label, image, color })
    // Preload the thumbnail before trigger changes (button mode has no <img> DOM).
    if (image) {
      const preload = new window.Image()
      preload.src = image
    }
    return () => unregisterItem(id)
  }, [id, label, image, color, registerItem, unregisterItem])

  if (mode === "image") {
    return (
      <Button
        variant="ghost"
        size="sm"
        type="button"
        role="option"
        aria-selected={isActive}
        onClick={() => onSelect(id)}
        className="flex h-auto w-[76px] flex-col items-center gap-0.5 cursor-pointer bg-transparent p-0 border-0"
        title={label}
      >
        {/* Thumbnail: 76×52px */}
        <div
          className={cn(
            "flex h-[52px] w-[76px] items-center justify-center overflow-hidden",
            isActive && "outline-2 -outline-offset-2 outline-primary",
          )}
        >
          {image ? (
            <img src={image} alt={label} className="h-full w-full object-cover" />
          ) : (
            <div
              className="flex h-full w-full items-center justify-center text-[10px] text-foreground"
              style={{ background: color ?? "var(--muted)" }}
            >
              {label}
            </div>
          )}
        </div>
        {/* Label below thumbnail */}
        <span className="text-[10px] text-foreground truncate max-w-[76px] px-0.5">{label}</span>
      </Button>
    )
  }

  // mode="button"
  return (
    <Button
      variant="ghost"
      size="sm"
      type="button"
      role="option"
      aria-selected={isActive}
      onClick={() => onSelect(id)}
      className={cn(
        "flex w-full items-center justify-start gap-2 border-0 border-l-2 bg-transparent px-2 py-1.5 text-left text-sm cursor-pointer",
        isActive
          ? "border-l-primary bg-selection-bg text-primary font-semibold hover:bg-selection-bg hover:text-primary"
          : "border-l-transparent hover:bg-accent/50 text-foreground",
      )}
    >
      {/* Color dot */}
      <span
        className="size-2 shrink-0"
        style={{ background: color ?? "var(--muted-foreground)" }}
      />
      <span className="truncate">{label}</span>
    </Button>
  )
}

// ---------------------------------------------------------------------------
// Trigger
// ---------------------------------------------------------------------------

function MapSwitcherTrigger() {
  const { selectedId, open, getItem, mode } = useMapSwitcherContext()
  const item = selectedId ? getItem(selectedId) : undefined
  const chevron = open ? (
    <IconChevronUp strokeWidth={1.75} className="text-muted-foreground shrink-0" />
  ) : (
    <IconChevronDown strokeWidth={1.75} className="text-muted-foreground shrink-0" />
  )

  if (mode === "button") {
    return (
      <CollapsibleTrigger
        render={
          <Button
            variant="ghost"
            size="sm"
            type="button"
            aria-haspopup="listbox"
            className="flex h-8 w-auto min-w-[72px] justify-center gap-2 bg-transparent px-2 cursor-pointer"
            title={item?.label}
          >
            <span className="truncate text-center text-foreground">{item?.label ?? ""}</span>
            {chevron}
          </Button>
        }
      />
    )
  }

  return (
    <CollapsibleTrigger
      render={
        <Button
          variant="ghost"
          size="sm"
          type="button"
          aria-haspopup="listbox"
          className="flex h-auto w-[76px] flex-col border-border bg-card p-0 cursor-pointer"
          title={item?.label}
        >
          {/* Top area: thumbnail or color block */}
          <div className="flex h-11 w-full items-center justify-center overflow-hidden">
            {item?.image ? (
              <img
                src={item.image}
                alt={item.label}
                className="block h-full w-full object-cover object-center"
              />
            ) : (
              <div
                className="flex h-full w-full items-center justify-center text-[10px] text-foreground"
                style={{ background: item?.color ?? "var(--muted)" }}
              >
                {item?.label ?? ""}
              </div>
            )}
          </div>
          {/* Bottom row: label + chevron */}
          <div className="grid h-6 w-full grid-cols-[1rem_minmax(0,1fr)_1rem] items-center">
            <span aria-hidden="true" />
            <span className="min-w-0 truncate text-center text-[11px] text-foreground">
              {item?.label ?? ""}
            </span>
            <span className="flex items-center justify-center">{chevron}</span>
          </div>
        </Button>
      }
    />
  )
}

// ---------------------------------------------------------------------------
// Panel
// ---------------------------------------------------------------------------

function MapSwitcherPanel({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  const { mode } = useMapSwitcherContext()

  return (
    <CollapsibleContent
      keepMounted
      data-slot="map-switcher-panel"
      role="listbox"
      className={cn(
        "absolute right-0 bottom-[calc(100%+4px)] z-10 overflow-hidden border border-border bg-card",
        mode === "image"
          ? "grid w-[174px] grid-cols-2 gap-1.5 p-2"
          : "flex min-w-[130px] flex-col items-stretch p-1",
        className,
      )}
    >
      {children}
    </CollapsibleContent>
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
