import {
  ResourceSidebar,
  type ResourceSidebarCategory,
  type ResourceSidebarLabels,
  type ResourceTab,
} from "@registry/blocks/resource-sidebar"
import { useState } from "react"

const total: Record<ResourceTab, number> = { icon: 84, sprite: 4, font: 6 }

export type ResourceSidebarDemoLabels = ResourceSidebarLabels & {
  readonly iconAll: string
  readonly spriteAll: string
  readonly fontAll: string
  readonly selected: string
  readonly renamed: string
  readonly removed: string
  readonly created: string
  readonly iconCategoryBasic: string
  readonly iconCategoryMap: string
  readonly iconCategoryPoi: string
  readonly spriteCategoryCommon: string
  readonly spriteCategoryMapPoi: string
  readonly fontCategoryLatin: string
  readonly fontCategoryChinese: string
}

export const zhResourceSidebarLabels = {
  typeSection: "资源类型",
  spriteGroup: "雪碧图",
  icon: "图标",
  sprite: "雪碧图",
  font: "字体",
  categoriesSection: "分类",
  allItems: "全部图标",
  newCategory: "新建分类",
  rename: "重命名",
  remove: "删除",
  iconAll: "全部图标",
  spriteAll: "全部雪碧图",
  fontAll: "全部字体",
  selected: "已选择",
  renamed: "已重命名",
  removed: "已删除",
  created: "已新建分类",
  iconCategoryBasic: "基础操作",
  iconCategoryMap: "地图导航",
  iconCategoryPoi: "POI 类型",
  spriteCategoryCommon: "通用",
  spriteCategoryMapPoi: "地图与 POI",
  fontCategoryLatin: "拉丁",
  fontCategoryChinese: "中文",
} satisfies ResourceSidebarDemoLabels

export const enResourceSidebarLabels = {
  typeSection: "Resource type",
  spriteGroup: "Sprites",
  icon: "Icons",
  sprite: "Sprites",
  font: "Fonts",
  categoriesSection: "Categories",
  allItems: "All icons",
  newCategory: "New category",
  rename: "Rename",
  remove: "Remove",
  iconAll: "All icons",
  spriteAll: "All sprites",
  fontAll: "All fonts",
  selected: "Selected",
  renamed: "Renamed",
  removed: "Removed",
  created: "Created category",
  iconCategoryBasic: "Basic operations",
  iconCategoryMap: "Map navigation",
  iconCategoryPoi: "POI types",
  spriteCategoryCommon: "Common",
  spriteCategoryMapPoi: "Map and POI",
  fontCategoryLatin: "Latin",
  fontCategoryChinese: "Chinese",
} satisfies ResourceSidebarDemoLabels

function createCategories(
  labels: ResourceSidebarDemoLabels,
): Record<ResourceTab, ResourceSidebarCategory[]> {
  return {
    icon: [
      { id: "g_basic", label: labels.iconCategoryBasic, count: 32, isDefault: false },
      { id: "g_map", label: labels.iconCategoryMap, count: 24, isDefault: false },
      { id: "g_poi", label: labels.iconCategoryPoi, count: 28, isDefault: false },
    ],
    sprite: [
      { id: "sc_basic", label: labels.spriteCategoryCommon, count: 2, isDefault: false },
      { id: "sc_map", label: labels.spriteCategoryMapPoi, count: 2, isDefault: false },
    ],
    font: [
      { id: "fc_latin", label: labels.fontCategoryLatin, count: 1, isDefault: false },
      { id: "fc_cjk", label: labels.fontCategoryChinese, count: 2, isDefault: false },
    ],
  }
}

function allItemsLabel(tab: ResourceTab, labels: ResourceSidebarDemoLabels): string {
  if (tab === "sprite") return labels.spriteAll
  if (tab === "font") return labels.fontAll
  return labels.iconAll
}

export function ResourceSidebarDemo({ labels }: { readonly labels: ResourceSidebarDemoLabels }) {
  const [tab, setTab] = useState<ResourceTab>("icon")
  const [active, setActive] = useState("all")
  const [status, setStatus] = useState(`${labels.selected}: all`)
  const categories = createCategories(labels)

  function selectTab(nextTab: ResourceTab) {
    setTab(nextTab)
    setActive("all")
    setStatus(`${labels.selected}: ${nextTab}`)
  }

  function selectCategory(id: string) {
    setActive(id)
    setStatus(`${labels.selected}: ${id}`)
  }

  return (
    <div data-demo="resource-sidebar" className="flex flex-col gap-3">
      <span data-demo-status="resource-sidebar" className="font-mono text-xs text-muted-foreground">
        {status}
      </span>
      <div className="h-[480px] max-w-full overflow-hidden border border-border">
        <ResourceSidebar
          tab={tab}
          onTabChange={selectTab}
          tabCounts={{ icon: 132, sprite: 4, font: 6 }}
          categories={categories[tab]}
          totalCount={total[tab]}
          activeCat={active}
          onSelectCat={selectCategory}
          onRenameCategory={(id) => setStatus(`${labels.renamed}: ${id}`)}
          onRemoveCategory={(id) => setStatus(`${labels.removed}: ${id}`)}
          onCreateCategory={() => setStatus(labels.created)}
          labels={{ ...labels, allItems: allItemsLabel(tab, labels) }}
        />
      </div>
    </div>
  )
}
