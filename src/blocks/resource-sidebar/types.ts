export type ResourceTab = "icon" | "sprite" | "font"

/** One category row in the sidebar list (already resolved to a count). */
export interface ResourceSidebarCategory {
  id: string
  label: string
  count?: number
  protected?: boolean
}

export interface ResourceSidebarLabels {
  /** "资源类型" section header. */
  typeSection: string
  /** Parent group row that owns 图标 + 雪碧图. */
  spriteGroup: string
  /** Leaf labels. */
  icon: string
  sprite: string
  font: string
  /** "分类" section header. */
  categoriesSection: string
  /** "全部图标" / "全部雪碧图" / "全部字体" — resolved by the caller per tab. */
  allItems: string
  /** Footer create-category button. */
  newCategory: string
  /** Row action tooltips. */
  rename: string
  remove: string
}

export interface ResourceSidebarProps {
  tab: ResourceTab
  onTabChange: (tab: ResourceTab) => void
  /** Totals shown next to each type-nav leaf. */
  tabCounts: { icon: number; sprite: number; font: number }
  /** Categories for the active tab. */
  categories: ResourceSidebarCategory[]
  /** Total resources in the active tab (the "全部" row count). */
  totalCount: number
  /** Active category id, or "all". */
  activeCat: string
  onSelectCat: (id: string) => void
  onRenameCategory: (id: string) => void
  onRemoveCategory: (id: string) => void
  onCreateCategory: () => void
  labels: ResourceSidebarLabels
  className?: string
}
