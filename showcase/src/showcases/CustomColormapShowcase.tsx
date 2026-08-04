import {
  CUSTOM_COLORMAP_LABELS_EN,
  CUSTOM_COLORMAP_LABELS_ZH_CN,
  CustomColormap,
} from "@registry/blocks/custom-colormap"
import {
  type CustomColormap as CustomColormapValue,
  DEFAULT_CUSTOM_COLORMAP,
} from "@registry/blocks/raster-style-panel"
import { useState } from "react"
import type { LocalizedDemoProps } from "./types"

export function CustomColormapDemo({ locale = "zh-CN" }: LocalizedDemoProps) {
  const [open, setOpen] = useState(false)
  const [committed, setCommitted] = useState<CustomColormapValue>(DEFAULT_CUSTOM_COLORMAP)
  const [draft, setDraft] = useState<CustomColormapValue>(DEFAULT_CUSTOM_COLORMAP)
  const labels = locale === "en" ? CUSTOM_COLORMAP_LABELS_EN : CUSTOM_COLORMAP_LABELS_ZH_CN

  return (
    <CustomColormap
      value={committed}
      draft={draft}
      open={open}
      labels={labels}
      onOpenChange={(nextOpen) => {
        if (nextOpen) setDraft(committed)
        setOpen(nextOpen)
      }}
      onDraftChange={setDraft}
      onApply={(nextValue) => {
        setCommitted(nextValue)
        setOpen(false)
      }}
    />
  )
}
