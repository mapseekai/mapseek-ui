import type { ReactNode } from "react"

export type ResourceTab = "icon" | "sprite" | "font"

/** Sample font-family bucket → which token the block renders specimens with. */
export type FontFamilyKind = "sans" | "mono" | "cjk" | "icon"

/** Normalized publish status — the label is injected so it can be localized. */
export interface ResourceStatus {
  variant: "published" | "draft" | "sliced"
  label: string
}

export interface ResourceIconItem {
  kind: "icon"
  id: string
  name: string
  /** PlaceholderGlyph seed. */
  seed: string
  /** Shown only in the cross-category ("全部") view. */
  categoryLabel?: string
}

export interface ResourceSpriteItem {
  kind: "sprite"
  id: string
  name: string
  status: ResourceStatus
  /** Pre-composed, already-localized meta segments (joined with "·"). */
  metaParts: string[]
  /** Seeds for the 8-cell preview mosaic. */
  previewSeeds: string[]
}

export interface ResourceFontItem {
  kind: "font"
  id: string
  name: string
  status: ResourceStatus
  metaParts: string[]
  family: FontFamilyKind
}

export type ResourceGridItem = ResourceIconItem | ResourceSpriteItem | ResourceFontItem

export interface ResourceGridProps {
  tab: ResourceTab
  items: ResourceGridItem[]
  onOpen: (kind: ResourceTab, id: string) => void
  onContextMenu: (e: React.MouseEvent, kind: ResourceTab, id: string) => void
  /** Rendered when `items` is empty. */
  empty?: ReactNode
  className?: string
  /** 覆盖 icon 单元格预览(真实 SVG 懒取);缺省 PlaceholderGlyph。 */
  renderIconPreview?: (item: ResourceIconItem) => ReactNode
  /** 覆盖 sprite 卡片预览(真实 sprite.png);缺省 seed 马赛克。 */
  renderSpritePreview?: (item: ResourceSpriteItem) => ReactNode
}
