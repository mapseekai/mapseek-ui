import {
  ResourceGrid,
  type ResourceGridItem,
  type ResourceTab,
} from "@registry/blocks/resource-grid"
import { Button } from "@registry/ui/button"
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@registry/ui/empty"
import { useMemo, useState } from "react"
import type { LocalizedDemoProps } from "./types"

const labels = {
  "zh-CN": {
    icon: "图标",
    sprite: "雪碧图",
    font: "字体",
    empty: "空态",
    selectIcon: "选择图标",
    selected: "已选择",
    opened: "已打开",
    moved: "已打开菜单",
    emptyTitle: "暂无资源",
    emptyDescription: "上传或生成资源后会显示在这里。",
    fontSpecimen: "Aa 永",
    categoryBasic: "基础",
    iconNames: ["搜索", "定位", "图层", "热力图", "咖啡馆", "医院", "地铁", "公交"],
    published: "已发布",
    draft: "草稿",
    sliced: "已切片",
    spriteBasicName: "基础图标 32",
    spriteArrowName: "箭头 16",
    spriteBasicMeta: ["32 个图标", "32x32", "18 KB"],
    spriteArrowMeta: ["16 个图标", "16x16", "4 KB"],
    fontGeistName: "Geist 无衬线",
    fontPingFangName: "苹方中文",
    fontGeistMeta: ["400/500/600/700", "412 个字形", "168 KB"],
    fontPingFangMeta: ["400/500", "12,238 个字形", "8.4 MB"],
  },
  en: {
    icon: "Icon",
    sprite: "Sprite",
    font: "Font",
    empty: "Empty",
    selectIcon: "Select icon",
    selected: "Selected",
    opened: "Opened",
    moved: "Opened menu",
    emptyTitle: "No resources",
    emptyDescription: "Uploaded or generated resources appear here.",
    fontSpecimen: "Aa永",
    categoryBasic: "Basic",
    iconNames: ["Search", "Locate", "Layers", "Heatmap", "Cafe", "Hospital", "Metro", "Bus"],
    published: "Published",
    draft: "Draft",
    sliced: "Sliced",
    spriteBasicName: "basic-icons-32",
    spriteArrowName: "arrows-16",
    spriteBasicMeta: ["32 icons", "32x32", "18 KB"],
    spriteArrowMeta: ["16 icons", "16x16", "4 KB"],
    fontGeistName: "Geist Sans",
    fontPingFangName: "PingFang CN",
    fontGeistMeta: ["400/500/600/700", "412 glyphs", "168 KB"],
    fontPingFangMeta: ["400/500", "12,238 glyphs", "8.4 MB"],
  },
}

function createItems(
  demoLabels: (typeof labels)[keyof typeof labels],
): Record<ResourceTab, ResourceGridItem[]> {
  const icons = demoLabels.iconNames.map((name, index) => ({
    kind: "icon" as const,
    id: `g_basic:${index}`,
    name,
    seed: `g_basic-${index}`,
    categoryLabel: demoLabels.categoryBasic,
  }))

  return {
    icon: icons,
    sprite: [
      {
        kind: "sprite",
        id: "sp_basic",
        name: demoLabels.spriteBasicName,
        status: { variant: "published", label: demoLabels.published },
        metaParts: [...demoLabels.spriteBasicMeta],
        previewSeeds: Array.from({ length: 8 }, (_, index) => `sp_basic-${index}`),
      },
      {
        kind: "sprite",
        id: "sp_arrow",
        name: demoLabels.spriteArrowName,
        status: { variant: "draft", label: demoLabels.draft },
        metaParts: [...demoLabels.spriteArrowMeta],
        previewSeeds: Array.from({ length: 8 }, (_, index) => `sp_arrow-${index}`),
      },
    ],
    font: [
      {
        kind: "font",
        id: "f_geist",
        name: demoLabels.fontGeistName,
        status: { variant: "published", label: demoLabels.published },
        metaParts: [...demoLabels.fontGeistMeta],
        family: "sans",
      },
      {
        kind: "font",
        id: "f_pingfang",
        name: demoLabels.fontPingFangName,
        status: { variant: "sliced", label: demoLabels.sliced },
        metaParts: [...demoLabels.fontPingFangMeta],
        family: "cjk",
      },
    ],
  }
}

export function ResourceGridDemo({ locale = "zh-CN" }: LocalizedDemoProps) {
  const demoLabels = labels[locale]
  const [tab, setTab] = useState<ResourceTab>("icon")
  const [showEmpty, setShowEmpty] = useState(false)
  const [selectedIds, setSelectedIds] = useState(() => new Set<string>(["g_basic:0"]))
  const [status, setStatus] = useState(`${demoLabels.selected}: 1`)
  const items = useMemo(() => createItems(demoLabels), [demoLabels])
  const visibleItems = showEmpty ? [] : items[tab]
  const selectedIconIds = useMemo(() => selectedIds, [selectedIds])

  function setIconSelected(id: string, selected: boolean) {
    setSelectedIds((current) => {
      const next = new Set(current)
      if (selected) next.add(id)
      else next.delete(id)
      setStatus(`${demoLabels.selected}: ${next.size}`)
      return next
    })
  }

  return (
    <div className="flex w-full min-w-0 flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        {(["icon", "sprite", "font"] as const).map((value) => (
          <Button
            key={value}
            type="button"
            variant={tab === value ? "default" : "outline"}
            size="sm"
            aria-pressed={tab === value}
            data-demo-action={`resource-grid-tab-${value}`}
            onClick={() => {
              setTab(value)
              setShowEmpty(false)
              setStatus(value)
            }}
          >
            {demoLabels[value]}
          </Button>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          aria-pressed={showEmpty}
          data-demo-action="resource-grid-empty"
          onClick={() => {
            setShowEmpty((current) => !current)
            setStatus(demoLabels.empty)
          }}
        >
          {demoLabels.empty}
        </Button>
        <span
          role="status"
          aria-live="polite"
          aria-atomic="true"
          data-demo-status="resource-grid"
          className="self-center font-mono text-xs text-muted-foreground"
        >
          {status}
        </span>
      </div>
      <ResourceGrid
        tab={tab}
        items={visibleItems}
        selectedIconIds={selectedIconIds}
        onIconSelect={setIconSelected}
        iconSelectionLabel={(item) => `${demoLabels.selectIcon}: ${item.name}`}
        onOpen={(kind, id) => setStatus(`${demoLabels.opened}: ${kind}/${id}`)}
        onContextMenu={(event, kind, id) => {
          event.preventDefault()
          setStatus(`${demoLabels.moved}: ${kind}/${id}`)
        }}
        labels={{ fontSpecimen: demoLabels.fontSpecimen }}
        empty={
          <Empty>
            <EmptyHeader>
              <EmptyTitle>{demoLabels.emptyTitle}</EmptyTitle>
              <EmptyDescription>{demoLabels.emptyDescription}</EmptyDescription>
            </EmptyHeader>
          </Empty>
        }
      />
    </div>
  )
}
