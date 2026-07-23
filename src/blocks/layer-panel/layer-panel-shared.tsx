import {
  IconGridDots,
  IconLine,
  IconPointFilled,
  IconPolygon,
  IconStack2,
} from "@tabler/icons-react"
import type * as React from "react"
import type { LayerData, LayerGeometry } from "./types"

export const GEOM_LABEL: Record<LayerGeometry, string> = {
  point: "点",
  polyline: "线",
  polygon: "面",
  mixed: "混合",
  raster: "栅格",
}

const countFormatter = new Intl.NumberFormat("zh-CN")

export type LayerPanelItemProps = {
  readonly layer: LayerData
  readonly children?: React.ReactNode
}

export function layerTypeLabel(layer: LayerData) {
  if (layer.kind === "service") return "服务"
  return layer.geometryType === "raster" ? "栅格" : "矢量"
}

export function layerTypeBadgeClass(label: ReturnType<typeof layerTypeLabel>) {
  switch (label) {
    case "栅格":
      return "border-amber-500/40 bg-amber-500/15 text-amber-700 dark:text-amber-400"
    case "服务":
      return "border-blue-500/40 bg-blue-500/15 text-blue-700 dark:text-blue-400"
    default:
      return "border-primary/30 bg-primary/10 text-primary"
  }
}

export function layerDetail(layer: LayerData) {
  if (layer.geometryType === "raster") return "栅格"
  if (layer.featureCount == null) return GEOM_LABEL[layer.geometryType]
  return `${GEOM_LABEL[layer.geometryType]} · ${countFormatter.format(layer.featureCount)} 个要素`
}

export function layerGroupName(layer: LayerData) {
  return layer.group?.trim() || "未分组"
}

export function geomIcon(geometryType: LayerGeometry) {
  switch (geometryType) {
    case "polygon":
      return IconPolygon
    case "polyline":
      return IconLine
    case "point":
      return IconPointFilled
    case "raster":
      return IconGridDots
    default:
      return IconStack2
  }
}

export function moveLayer(order: readonly string[], draggedId: string, targetId: string) {
  if (draggedId === targetId) return order
  const next = order.filter((id) => id !== draggedId)
  const targetIndex = next.indexOf(targetId)
  if (targetIndex === -1) return order
  next.splice(targetIndex, 0, draggedId)
  return next
}

export function moveLayerToAnchor(
  order: readonly string[],
  id: string,
  anchorId: string,
  placement: "before" | "after",
) {
  if (id === anchorId) return order
  const next = order.filter((entry) => entry !== id)
  const anchorIndex = next.indexOf(anchorId)
  if (anchorIndex === -1) return order
  next.splice(placement === "before" ? anchorIndex : anchorIndex + 1, 0, id)
  return next
}

/**
 * Runs a DOM-handler callback that may throw synchronously or return any
 * PromiseLike. Every failure path is routed to `onError`, so nothing escapes
 * as an unhandled rejection or an uncaught synchronous throw.
 */
export function runSafeCallback(
  operation: () => void | PromiseLike<void>,
  onError: (error: unknown) => void,
): void {
  let result: void | PromiseLike<void>
  try {
    result = operation()
  } catch (error) {
    onError(error)
    return
  }
  if (result && typeof result.then === "function") {
    Promise.resolve(result).catch(onError)
  }
}
