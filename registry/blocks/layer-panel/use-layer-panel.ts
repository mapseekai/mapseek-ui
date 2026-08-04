import * as React from "react"
import type { LayerData, LayerPanelContextValue } from "./types"

export const LayerPanelContext = React.createContext<LayerPanelContextValue | null>(null)

export function useLayerPanelContext(): LayerPanelContextValue {
  const ctx = React.useContext(LayerPanelContext)
  if (!ctx) {
    throw new Error("LayerPanel sub-components must be used inside <LayerPanel>.")
  }
  return ctx
}

export const LayerItemContext = React.createContext<LayerData | null>(null)

export function useLayerItemContext(): LayerData {
  const layer = React.useContext(LayerItemContext)
  if (!layer) {
    throw new Error("<LayerPanel.Section> must be used inside <LayerPanel.Item>.")
  }
  return layer
}

export function useSectionState() {
  const [open, setOpen] = React.useState<Record<string, boolean>>({})
  const seenRef = React.useRef<Set<string>>(new Set())

  const key = React.useCallback(
    (layerId: string, sectionId: string) => `${layerId}::${sectionId}`,
    [],
  )

  const isSectionOpen = React.useCallback(
    (layerId: string, sectionId: string) => open[key(layerId, sectionId)] ?? false,
    [key, open],
  )

  const toggleSection = React.useCallback(
    (layerId: string, sectionId: string) => {
      const k = key(layerId, sectionId)
      setOpen((prev) => ({ ...prev, [k]: !prev[k] }))
    },
    [key],
  )

  const registerSectionDefault = React.useCallback(
    (layerId: string, sectionId: string, defaultOpen: boolean) => {
      const k = key(layerId, sectionId)
      if (seenRef.current.has(k)) return
      seenRef.current.add(k)
      setOpen((prev) => (k in prev ? prev : { ...prev, [k]: defaultOpen }))
    },
    [key],
  )

  return { isSectionOpen, toggleSection, registerSectionDefault }
}
