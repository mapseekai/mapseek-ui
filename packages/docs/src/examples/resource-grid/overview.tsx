import {
  ResourceGrid,
  type ResourceGridItem,
  type ResourceTab,
} from "@registry/blocks/resource-grid"
import { Button } from "@registry/ui/button"
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@registry/ui/empty"
import { useMemo, useState } from "react"

export type ResourceGridDemoLabels = {
  readonly icon: string
  readonly sprite: string
  readonly font: string
  readonly empty: string
  readonly selectIcon: string
  readonly selected: string
  readonly opened: string
  readonly moved: string
  readonly emptyTitle: string
  readonly emptyDescription: string
  readonly fontSpecimen: string
  readonly categoryBasic: string
  readonly iconNames: string[]
  readonly published: string
  readonly draft: string
  readonly sliced: string
  readonly spriteBasicName: string
  readonly spriteArrowName: string
  readonly spriteBasicMeta: string[]
  readonly spriteArrowMeta: string[]
  readonly fontGeistName: string
  readonly fontPingFangName: string
  readonly fontGeistMeta: string[]
  readonly fontPingFangMeta: string[]
}

export const zhResourceGridLabels = {
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
} satisfies ResourceGridDemoLabels

export const enResourceGridLabels = {
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
} satisfies ResourceGridDemoLabels

function createItems(labels: ResourceGridDemoLabels): Record<ResourceTab, ResourceGridItem[]> {
  const icons = labels.iconNames.map((name, index) => ({
    kind: "icon" as const,
    id: `g_basic:${index}`,
    name,
    seed: `g_basic-${index}`,
    categoryLabel: labels.categoryBasic,
  }))

  return {
    icon: icons,
    sprite: [
      {
        kind: "sprite",
        id: "sp_basic",
        name: labels.spriteBasicName,
        status: { variant: "published", label: labels.published },
        metaParts: labels.spriteBasicMeta,
        previewSeeds: Array.from({ length: 8 }, (_, index) => `sp_basic-${index}`),
      },
      {
        kind: "sprite",
        id: "sp_arrow",
        name: labels.spriteArrowName,
        status: { variant: "draft", label: labels.draft },
        metaParts: labels.spriteArrowMeta,
        previewSeeds: Array.from({ length: 8 }, (_, index) => `sp_arrow-${index}`),
      },
    ],
    font: [
      {
        kind: "font",
        id: "f_geist",
        name: labels.fontGeistName,
        status: { variant: "published", label: labels.published },
        metaParts: labels.fontGeistMeta,
        family: "sans",
      },
      {
        kind: "font",
        id: "f_pingfang",
        name: labels.fontPingFangName,
        status: { variant: "sliced", label: labels.sliced },
        metaParts: labels.fontPingFangMeta,
        family: "cjk",
      },
    ],
  }
}

export function ResourceGridDemo({ labels }: { readonly labels: ResourceGridDemoLabels }) {
  const [tab, setTab] = useState<ResourceTab>("icon")
  const [showEmpty, setShowEmpty] = useState(false)
  const [selectedIds, setSelectedIds] = useState(() => new Set<string>(["g_basic:0"]))
  const [status, setStatus] = useState(`${labels.selected}: 1`)
  const items = useMemo(() => createItems(labels), [labels])
  const visibleItems = showEmpty ? [] : items[tab]
  const selectedIconIds = useMemo(() => selectedIds, [selectedIds])

  function setIconSelected(id: string, selected: boolean) {
    setSelectedIds((current) => {
      const next = new Set(current)
      if (selected) next.add(id)
      else next.delete(id)
      setStatus(`${labels.selected}: ${next.size}`)
      return next
    })
  }

  return (
    <div data-demo="resource-grid" className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        {(["icon", "sprite", "font"] as const).map((value) => (
          <Button
            key={value}
            type="button"
            variant={tab === value ? "default" : "outline"}
            size="sm"
            data-demo-action={`resource-grid-tab-${value}`}
            onClick={() => {
              setTab(value)
              setShowEmpty(false)
              setStatus(value)
            }}
          >
            {labels[value]}
          </Button>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          data-demo-action="resource-grid-empty"
          onClick={() => {
            setShowEmpty((current) => !current)
            setStatus(labels.empty)
          }}
        >
          {labels.empty}
        </Button>
        <span
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
        iconSelectionLabel={(item) => `${labels.selectIcon}: ${item.name}`}
        onOpen={(kind, id) => setStatus(`${labels.opened}: ${kind}/${id}`)}
        onContextMenu={(event, kind, id) => {
          event.preventDefault()
          setStatus(`${labels.moved}: ${kind}/${id}`)
        }}
        labels={{ fontSpecimen: labels.fontSpecimen }}
        empty={
          <Empty>
            <EmptyHeader>
              <EmptyTitle>{labels.emptyTitle}</EmptyTitle>
              <EmptyDescription>{labels.emptyDescription}</EmptyDescription>
            </EmptyHeader>
          </Empty>
        }
      />
    </div>
  )
}
