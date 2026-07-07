import type { FontFamilyKind } from "../resource-grid"

/** A label/value row in the drawer body. Values render in mono, right-aligned. */
export interface DetailKV {
  k: string
  v: string
}

export interface IconDetail {
  kind: "icon"
  title: string
  subtitle: string
  seed: string
  /** Real SVG markup for the large preview; falls back to PlaceholderGlyph when absent. */
  svg?: string
  rows: DetailKV[]
  tagsTitle: string
  tags: string[]
  sizesTitle: string
  /** Preview sizes in px, e.g. [16, 24, 32, 48]. */
  sizes: number[]
  copyLabel: string
  downloadLabel: string
}

export interface SpriteDetail {
  kind: "sprite"
  title: string
  subtitle: string
  /** Seeds for the preview mosaic (rendered up to 32). */
  previewSeeds: string[]
  /** Real sprite.png URL; falls back to the seed mosaic when absent. */
  previewUrl?: string
  cols: number
  sourceTitle: string
  /** Source icon groups; `tag` is a short suffix label (e.g. "引用"). */
  sources: { label: string; tag: string }[]
  infoTitle: string
  infoRows: DetailKV[]
  filesTitle: string
  files: { name: string; desc: string }[]
  editLabel: string
  downloadLabel: string
}

export interface SliceCharset {
  id: string
  name: string
  range: string
  glyphs: number
  size: string
}

export interface FontDetail {
  kind: "font"
  title: string
  subtitle: string
  family: FontFamilyKind
  rows: DetailKV[]
  sampleTitle: string
  sample: string
  /** Big specimen string in the preview header (e.g. "Aa 永"). */
  specimen: string
  slicing: {
    configureLabel: string
    downloadLabel: string
    panelTitle: string
    collapseLabel: string
    cancelLabel: string
    runLabel: string
    customTitle: string
    customPlaceholder: string
    rawSizeLabel: string
    rawSizeValue: string
    estimateLabel: string
    selectedLabel: string
    charsets: SliceCharset[]
    defaultSelected: string[]
  }
}

export type ResourceDetail = IconDetail | SpriteDetail | FontDetail

export interface ResourceDetailDrawerProps {
  detail: ResourceDetail
  onClose: () => void
  /** Sprite detail: jump to the (stubbed) sprite editor. */
  onEditSprite?: () => void
  /** Primary/secondary action handlers (copy / download / run slice). */
  onCopy?: () => void
  onDownload?: () => void
  onRunSlice?: (selected: string[], customChars: string) => void
  className?: string
}
