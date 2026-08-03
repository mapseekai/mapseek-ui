import { cn } from "@registry/lib/utils"
import { Badge } from "@registry/ui/badge"
import { Button } from "@registry/ui/button"
import { Input } from "@registry/ui/input"
import {
  IconChevronDown,
  IconChevronRight,
  IconEye,
  IconEyeOff,
  IconFolder,
  IconFolderPlus,
  IconLayoutSidebar,
  IconLine,
  IconPlus,
  IconPointFilled,
  IconPolygon,
  IconSearch,
  IconStack2,
} from "@tabler/icons-react"
import { useMemo, useState } from "react"

type DemoLayer = {
  id: string
  name: string
  group: string
  geometry: "polygon" | "polyline" | "point"
  count: number
  visible: boolean
}

const INITIAL_LAYERS: DemoLayer[] = [
  {
    id: "land",
    name: "用地分类",
    group: "基础数据",
    geometry: "polygon",
    count: 1284,
    visible: true,
  },
  {
    id: "road",
    name: "道路中心线",
    group: "基础数据",
    geometry: "polyline",
    count: 532,
    visible: true,
  },
  {
    id: "poi",
    name: "公共服务设施",
    group: "专题分析",
    geometry: "point",
    count: 86,
    visible: false,
  },
]

const GEOMETRY = {
  polygon: { icon: IconPolygon, label: "面" },
  polyline: { icon: IconLine, label: "线" },
  point: { icon: IconPointFilled, label: "点" },
} as const

export function LoomLayerPanelShowcase() {
  const [layers, setLayers] = useState(INITIAL_LAYERS)
  const [selectedId, setSelectedId] = useState("land")
  const [query, setQuery] = useState("")
  const [visibleOnly, setVisibleOnly] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const [collapsedGroups, setCollapsedGroups] = useState<ReadonlySet<string>>(() => new Set())

  const filtered = useMemo(() => {
    const keyword = query.trim().toLowerCase()
    return layers.filter(
      (layer) =>
        (!visibleOnly || layer.visible) && (!keyword || layer.name.toLowerCase().includes(keyword)),
    )
  }, [layers, query, visibleOnly])
  const groups = ["基础数据", "专题分析"]

  const addLayer = () => {
    if (layers.some((layer) => layer.id === "water")) return
    setLayers((current) => [
      ...current,
      {
        id: "water",
        name: "河流水系",
        group: "基础数据",
        geometry: "polyline",
        count: 214,
        visible: true,
      },
    ])
  }

  if (collapsed) {
    return (
      <section className="space-y-3">
        <p className="text-xs text-muted-foreground">原 Loom 编辑器左侧图层场景：折叠状态。</p>
        <Button
          variant="outline"
          size="icon"
          aria-label="展开图层面板"
          onClick={() => setCollapsed(false)}
        >
          <IconStack2 />
        </Button>
      </section>
    )
  }

  return (
    <section className="space-y-3">
      <div>
        <h2 className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          原 Loom 编辑器图层案例
        </h2>
        <p className="mt-1 text-xs text-muted-foreground">
          覆盖分组、搜索、可见性筛选、当前图层与面板折叠；“添加图层”会加入河流水系。
        </p>
      </div>

      <aside
        data-testid="loom-layer-panel"
        className="flex h-[560px] w-[360px] max-w-full flex-col overflow-hidden border border-border bg-card"
      >
        <header className="flex items-center gap-2 border-b border-border px-3 py-2">
          <span className="flex size-7 items-center justify-center bg-primary text-primary-foreground">
            <IconStack2 className="size-4" />
          </span>
          <span className="flex-1 text-sm font-semibold">图层</span>
          <Badge variant="outline">{layers.length}</Badge>
          <Button
            variant="ghost"
            size="icon"
            className="size-7"
            aria-label="新建分组"
            title="新建分组"
          >
            <IconFolderPlus className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="size-7"
            aria-label="添加图层"
            title="添加图层"
            onClick={addLayer}
          >
            <IconPlus className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="size-7"
            aria-label="收起图层面板"
            title="收起图层面板"
            onClick={() => setCollapsed(true)}
          >
            <IconLayoutSidebar className="size-4" />
          </Button>
        </header>

        <div className="space-y-2 border-b border-border px-3 py-2.5">
          <div className="relative">
            <IconSearch className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              aria-label="搜索图层"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="pl-8"
              placeholder="搜索图层"
            />
          </div>
          <div className="flex gap-1">
            <button
              type="button"
              aria-pressed={!visibleOnly}
              className={cn(
                "px-2.5 py-1 text-xs",
                !visibleOnly ? "bg-primary/10 font-semibold text-primary" : "text-muted-foreground",
              )}
              onClick={() => setVisibleOnly(false)}
            >
              全部
            </button>
            <button
              type="button"
              aria-pressed={visibleOnly}
              className={cn(
                "px-2.5 py-1 text-xs",
                visibleOnly ? "bg-primary/10 font-semibold text-primary" : "text-muted-foreground",
              )}
              onClick={() => setVisibleOnly(true)}
            >
              可见
            </button>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-3">
          {groups.map((group) => {
            const members = filtered.filter((layer) => layer.group === group)
            const groupCollapsed = collapsedGroups.has(group)
            if (members.length === 0) return null
            return (
              <section key={group} className="mb-3">
                <button
                  type="button"
                  aria-expanded={!groupCollapsed}
                  className="flex w-full items-center gap-2 py-1.5 text-left"
                  onClick={() =>
                    setCollapsedGroups((current) => {
                      const next = new Set(current)
                      next.has(group) ? next.delete(group) : next.add(group)
                      return next
                    })
                  }
                >
                  {groupCollapsed ? (
                    <IconChevronRight className="size-4 text-muted-foreground" />
                  ) : (
                    <IconChevronDown className="size-4 text-muted-foreground" />
                  )}
                  <IconFolder className="size-4 text-primary" />
                  <span className="flex-1 text-xs font-semibold">{group}</span>
                  <span className="text-[11px] text-muted-foreground">{members.length}</span>
                </button>
                {!groupCollapsed && (
                  <div className="space-y-1 pl-5">
                    {members.map((layer) => {
                      const GeometryIcon = GEOMETRY[layer.geometry].icon
                      const selected = selectedId === layer.id
                      return (
                        <div
                          key={layer.id}
                          className={cn(
                            "flex items-center gap-2 border px-2.5 py-2",
                            selected ? "border-primary/30 bg-primary/10" : "border-border",
                          )}
                        >
                          <button
                            type="button"
                            aria-label={`选择图层 ${layer.name}`}
                            className="flex min-w-0 flex-1 items-center gap-2 text-left"
                            onClick={() => setSelectedId(layer.id)}
                          >
                            <GeometryIcon className="size-3.5 shrink-0 text-primary" />
                            <span className="min-w-0 flex-1">
                              <span className="block truncate text-xs font-medium">
                                {layer.name}
                              </span>
                              <span className="block truncate text-[11px] text-muted-foreground">
                                {GEOMETRY[layer.geometry].label} ·{" "}
                                {layer.count.toLocaleString("zh-CN")} 个要素
                              </span>
                            </span>
                            {selected && <Badge>当前</Badge>}
                          </button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-7"
                            aria-label={
                              layer.visible ? `隐藏图层 ${layer.name}` : `显示图层 ${layer.name}`
                            }
                            onClick={() =>
                              setLayers((current) =>
                                current.map((item) =>
                                  item.id === layer.id ? { ...item, visible: !item.visible } : item,
                                ),
                              )
                            }
                          >
                            {layer.visible ? (
                              <IconEye className="size-4 text-primary" />
                            ) : (
                              <IconEyeOff className="size-4 text-muted-foreground" />
                            )}
                          </Button>
                        </div>
                      )
                    })}
                  </div>
                )}
              </section>
            )
          })}
          {filtered.length === 0 && (
            <p className="py-10 text-center text-xs text-muted-foreground">没有匹配的图层</p>
          )}
        </div>
      </aside>
    </section>
  )
}
