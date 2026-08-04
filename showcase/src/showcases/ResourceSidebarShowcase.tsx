import {
  ResourceSidebar,
  type ResourceSidebarCategory,
  type ResourceSidebarLabels,
  type ResourceTab,
} from "@registry/blocks/resource-sidebar"
import { useState } from "react"
import type { LocalizedDemoProps } from "./types"

const total: Record<ResourceTab, number> = { icon: 84, sprite: 4, font: 6 }

const labels = {
  "zh-CN": {
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
  },
  en: {
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
  },
}

function createCategories(
  demoLabels: (typeof labels)[keyof typeof labels],
): Record<ResourceTab, ResourceSidebarCategory[]> {
  return {
    icon: [
      { id: "g_basic", label: demoLabels.iconCategoryBasic, count: 32, isDefault: false },
      { id: "g_map", label: demoLabels.iconCategoryMap, count: 24, isDefault: false },
      { id: "g_poi", label: demoLabels.iconCategoryPoi, count: 28, isDefault: false },
    ],
    sprite: [
      { id: "sc_basic", label: demoLabels.spriteCategoryCommon, count: 2, isDefault: false },
      { id: "sc_map", label: demoLabels.spriteCategoryMapPoi, count: 2, isDefault: false },
    ],
    font: [
      { id: "fc_latin", label: demoLabels.fontCategoryLatin, count: 1, isDefault: false },
      { id: "fc_cjk", label: demoLabels.fontCategoryChinese, count: 2, isDefault: false },
    ],
  }
}

function allItemsLabel(tab: ResourceTab, demoLabels: (typeof labels)[keyof typeof labels]): string {
  if (tab === "sprite") return demoLabels.spriteAll
  if (tab === "font") return demoLabels.fontAll
  return demoLabels.iconAll
}

export function ResourceSidebarDemo({ locale = "zh-CN" }: LocalizedDemoProps) {
  const demoLabels = labels[locale]
  const [tab, setTab] = useState<ResourceTab>("icon")
  const [active, setActive] = useState("all")
  const [status, setStatus] = useState(`${demoLabels.selected}: all`)
  const categories = createCategories(demoLabels)

  function selectTab(nextTab: ResourceTab) {
    setTab(nextTab)
    setActive("all")
    setStatus(`${demoLabels.selected}: ${nextTab}`)
  }

  function selectCategory(id: string) {
    setActive(id)
    setStatus(`${demoLabels.selected}: ${id}`)
  }

  return (
    <div className="flex flex-col gap-3">
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
          onRenameCategory={(id) => setStatus(`${demoLabels.renamed}: ${id}`)}
          onRemoveCategory={(id) => setStatus(`${demoLabels.removed}: ${id}`)}
          onCreateCategory={() => setStatus(demoLabels.created)}
          labels={{ ...demoLabels, allItems: allItemsLabel(tab, demoLabels) }}
        />
      </div>
    </div>
  )
}
