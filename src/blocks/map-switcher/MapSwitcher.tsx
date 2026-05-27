import * as React from "react"
import { IconChevronDown, IconChevronUp } from "@tabler/icons-react"
import { cn } from "@workspace/ui/lib/utils"
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
  const open = isOpenControlled ? openProp! : openUncontrolled

  const itemsRef = React.useRef<Map<string, MapSwitcherItemData>>(new Map())
  const rootRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (!open) return
    function handleMouseDown(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) {
        if (!isOpenControlled) setOpenUncontrolled(false)
        onOpenChange?.(false)
      }
    }
    document.addEventListener("mousedown", handleMouseDown)
    return () => document.removeEventListener("mousedown", handleMouseDown)
  }, [open, isOpenControlled, onOpenChange])

  React.useEffect(() => {
    if (!open) return
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        if (!isOpenControlled) setOpenUncontrolled(false)
        onOpenChange?.(false)
      }
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [open, isOpenControlled, onOpenChange])

  const toggleOpen = React.useCallback(() => {
    const next = !open
    if (!isOpenControlled) setOpenUncontrolled(next)
    onOpenChange?.(next)
  }, [open, isOpenControlled, onOpenChange])

  const onSelect = React.useCallback(
    (id: string) => {
      if (!isValueControlled) setSelectedUncontrolled(id)
      onChange?.(id)
      if (!isOpenControlled) setOpenUncontrolled(false)
      onOpenChange?.(false)
    },
    [isValueControlled, isOpenControlled, onChange, onOpenChange],
  )

  const registerItem = React.useCallback((data: MapSwitcherItemData) => {
    itemsRef.current.set(data.id, data)
  }, [])

  const unregisterItem = React.useCallback((id: string) => {
    itemsRef.current.delete(id)
  }, [])

  const getItem = React.useCallback((id: string) => itemsRef.current.get(id), [])

  const ctx = React.useMemo<MapSwitcherContextValue>(
    () => ({ selectedId, onSelect, open, toggleOpen, mode, registerItem, unregisterItem, getItem }),
    [selectedId, onSelect, open, toggleOpen, mode, registerItem, unregisterItem, getItem],
  )

  return (
    <MapSwitcherContext.Provider value={ctx}>
      <div ref={rootRef} data-slot="map-switcher" className={cn("relative inline-block", className)}>
        {children}
      </div>
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
    return () => unregisterItem(id)
  }, [id, label, image, color, registerItem, unregisterItem])

  if (mode === "image") {
    return (
      <button
        type="button"
        role="option"
        aria-selected={isActive}
        onClick={() => onSelect(id)}
        className="flex flex-col items-center gap-0.5 cursor-pointer bg-transparent p-0 border-0"
        title={label}
      >
        {/* Thumbnail: 76×52px */}
        <div
          className={cn(
            "w-[76px] h-[52px] overflow-hidden flex items-center justify-center",
            isActive
              ? "shadow-[inset_0_0_0_2px_var(--primary)]"
              : "shadow-[inset_0_0_0_1px_var(--border)]",
          )}
        >
          {image ? (
            <img src={image} alt={label} className="w-full h-full object-cover" />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center text-[10px] text-foreground"
              style={{ background: color ?? "var(--muted)" }}
            >
              {label}
            </div>
          )}
        </div>
        {/* Label below thumbnail */}
        <span className="text-[10px] text-foreground truncate max-w-[76px] px-0.5">{label}</span>
      </button>
    )
  }

  // mode="button"
  return (
    <button
      type="button"
      role="option"
      aria-selected={isActive}
      onClick={() => onSelect(id)}
      className={cn(
        "flex items-center gap-2 w-full px-2 py-1.5 text-sm cursor-pointer bg-transparent border-0 border-l-2 text-left",
        isActive
          ? "border-l-primary bg-selection-bg text-primary font-semibold"
          : "border-l-transparent hover:bg-muted text-foreground",
      )}
    >
      {/* Color dot */}
      <span
        className="w-2 h-2 shrink-0"
        style={{ background: color ?? "var(--muted-foreground)" }}
      />
      <span className="truncate">{label}</span>
    </button>
  )
}

// ---------------------------------------------------------------------------
// Trigger
// ---------------------------------------------------------------------------

function MapSwitcherTrigger() {
  const { selectedId, open, toggleOpen, getItem } = useMapSwitcherContext()
  const item = selectedId ? getItem(selectedId) : undefined

  return (
    <button
      type="button"
      onClick={toggleOpen}
      aria-expanded={open}
      aria-haspopup="listbox"
      className="w-16 flex flex-col border border-border bg-card shadow-[var(--shadow-map-float)] cursor-pointer p-0"
      title={item?.label}
    >
      {/* Top area: thumbnail or color block */}
      <div className="h-11 border-b border-border overflow-hidden flex items-center justify-center w-full">
        {item?.image ? (
          <img src={item.image} alt={item.label} className="w-full h-full object-cover" />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center text-[10px] text-foreground"
            style={{ background: item?.color ?? "var(--muted)" }}
          >
            {item?.label ?? ""}
          </div>
        )}
      </div>
      {/* Bottom row: label + chevron */}
      <div className="h-[22px] flex items-center justify-between px-1.5 w-full">
        <span className="text-[11px] text-foreground truncate flex-1">{item?.label ?? ""}</span>
        {open ? (
          <IconChevronUp size={11} strokeWidth={1.75} className="text-muted-foreground shrink-0" />
        ) : (
          <IconChevronDown size={11} strokeWidth={1.75} className="text-muted-foreground shrink-0" />
        )}
      </div>
    </button>
  )
}

// ---------------------------------------------------------------------------
// Panel
// ---------------------------------------------------------------------------

function MapSwitcherPanel({ className, children }: { className?: string; children: React.ReactNode }) {
  const { open, mode } = useMapSwitcherContext()

  return (
    <div
      data-slot="map-switcher-panel"
      role="listbox"
      hidden={!open}
      className={cn(
        "absolute bottom-[calc(100%+4px)] right-0 z-10 border border-border bg-card shadow-[var(--shadow-map-float)]",
        mode === "image" ? "grid grid-cols-2 gap-1.5 p-2" : "flex flex-col p-1 min-w-[130px]",
        !open && "hidden",
        className,
      )}
    >
      {children}
    </div>
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
