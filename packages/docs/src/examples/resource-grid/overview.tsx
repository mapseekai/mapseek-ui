import {
  ResourceGrid,
  type ResourceGridItem,
  type ResourceTab,
} from "@registry/blocks/resource-grid"
import { Button } from "@registry/ui/button"
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@registry/ui/empty"
import { useMemo, useState } from "react"

const icons: ResourceGridItem[] = [
  "Search",
  "Locate",
  "Layers",
  "Heatmap",
  "Cafe",
  "Hospital",
  "Metro",
  "Bus",
].map((name, index) => ({
  kind: "icon",
  id: `g_basic:${index}`,
  name,
  seed: `g_basic-${index}`,
  categoryLabel: "Basic",
}))

const sprites: ResourceGridItem[] = [
  {
    kind: "sprite",
    id: "sp_basic",
    name: "basic-icons-32",
    status: { variant: "published", label: "Published" },
    metaParts: ["32 icons", "32x32", "18 KB"],
    previewSeeds: Array.from({ length: 8 }, (_, index) => `sp_basic-${index}`),
  },
  {
    kind: "sprite",
    id: "sp_arrow",
    name: "arrows-16",
    status: { variant: "draft", label: "Draft" },
    metaParts: ["16 icons", "16x16", "4 KB"],
    previewSeeds: Array.from({ length: 8 }, (_, index) => `sp_arrow-${index}`),
  },
]

const fonts: ResourceGridItem[] = [
  {
    kind: "font",
    id: "f_geist",
    name: "Geist Sans",
    status: { variant: "published", label: "Published" },
    metaParts: ["400/500/600/700", "412 glyphs", "168 KB"],
    family: "sans",
  },
  {
    kind: "font",
    id: "f_pingfang",
    name: "PingFang CN",
    status: { variant: "sliced", label: "Sliced" },
    metaParts: ["400/500", "12,238 glyphs", "8.4 MB"],
    family: "cjk",
  },
]

const items: Record<ResourceTab, ResourceGridItem[]> = {
  icon: icons,
  sprite: sprites,
  font: fonts,
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
}

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
}

export function ResourceGridDemo({ labels }: { readonly labels: typeof zhResourceGridLabels }) {
  const [tab, setTab] = useState<ResourceTab>("icon")
  const [showEmpty, setShowEmpty] = useState(false)
  const [selectedIds, setSelectedIds] = useState(() => new Set<string>(["g_basic:0"]))
  const [status, setStatus] = useState(`${labels.selected}: 1`)
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
