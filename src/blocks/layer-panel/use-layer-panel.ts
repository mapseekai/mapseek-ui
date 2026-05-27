import * as React from "react"
import type {
  LayerData,
  LayerPanelContextValue,
} from "./types"

export const LayerPanelContext = React.createContext<
  LayerPanelContextValue | null
>(null)

export function useLayerPanelContext(): LayerPanelContextValue {
  const ctx = React.useContext(LayerPanelContext)
  if (!ctx) {
    throw new Error(
      "LayerPanel sub-components must be used inside <LayerPanel>.",
    )
  }
  return ctx
}

/** Set by `<LayerPanel.Item>` for descendant `<LayerPanel.Section>`s. */
export const LayerItemContext = React.createContext<LayerData | null>(null)

export function useLayerItemContext(): LayerData {
  const layer = React.useContext(LayerItemContext)
  if (!layer) {
    throw new Error(
      "<LayerPanel.Section> must be used inside <LayerPanel.Item>.",
    )
  }
  return layer
}

/**
 * Owns the per-(layerId, sectionId) expanded state internally.
 * The first time a Section renders for a given (layer, section) pair, it
 * registers its `defaultOpen` value — subsequent renders are ignored so
 * caller-driven re-renders don't clobber the user's toggles.
 */
export function useSectionState() {
  const [open, setOpen] = React.useState<Record<string, boolean>>({})
  const seenRef = React.useRef<Set<string>>(new Set())

  const key = (layerId: string, sectionId: string) => `${layerId}::${sectionId}`

  const isSectionOpen = React.useCallback(
    (layerId: string, sectionId: string) => open[key(layerId, sectionId)] ?? false,
    [open],
  )

  const toggleSection = React.useCallback(
    (layerId: string, sectionId: string) => {
      const k = key(layerId, sectionId)
      setOpen((prev) => ({ ...prev, [k]: !prev[k] }))
    },
    [],
  )

  const registerSectionDefault = React.useCallback(
    (layerId: string, sectionId: string, defaultOpen: boolean) => {
      const k = key(layerId, sectionId)
      if (seenRef.current.has(k)) return
      seenRef.current.add(k)
      setOpen((prev) => (k in prev ? prev : { ...prev, [k]: defaultOpen }))
    },
    [],
  )

  return { isSectionOpen, toggleSection, registerSectionDefault }
}
