import { IconSearch } from "@tabler/icons-react"
import { Badge } from "@workspace/ui/components/badge"
import { Input } from "@workspace/ui/components/input"
import { cn } from "@workspace/ui/lib/utils"
import * as React from "react"
import { LayerPanelGroup } from "./layer-panel-group"
import type { LayerPanelItemProps } from "./layer-panel-shared"
import { layerGroupName, moveLayerToAnchor } from "./layer-panel-shared"
import type { LayerData } from "./types"
import { useLayerPanelContext } from "./use-layer-panel"

type LayerFilter = "all" | "visible"

const FILTER_OPTIONS: readonly { readonly value: LayerFilter; readonly label: string }[] = [
  { value: "all", label: "全部" },
  { value: "visible", label: "可见" },
]

export function LayerPanelList({ className, children }: React.ComponentProps<"div">) {
  const ctx = useLayerPanelContext()
  const [query, setQuery] = React.useState("")
  const [filter, setFilter] = React.useState<LayerFilter>("all")
  const draggingIdRef = React.useRef<string | null>(null)

  const { items, statusChildren } = React.useMemo(() => {
    const map = new Map<string, React.ReactElement<LayerPanelItemProps>>()
    const rest: React.ReactNode[] = []
    React.Children.forEach(children, (child) => {
      if (React.isValidElement<LayerPanelItemProps>(child) && child.type === LayerPanelItem) {
        map.set(child.props.layer.id, child)
        return
      }
      if (child === null || child === undefined || typeof child === "boolean") return
      rest.push(child)
    })
    return { items: map, statusChildren: rest }
  }, [children])

  const normalizedQuery = query.trim().toLowerCase()
  const filteredLayers = React.useMemo(
    () =>
      ctx.layers.filter((layer) => {
        if (filter === "visible" && !layer.visible) return false
        return !normalizedQuery || layer.name.toLowerCase().includes(normalizedQuery)
      }),
    [ctx.layers, filter, normalizedQuery],
  )

  const filteredIds = React.useMemo(
    () => new Set(filteredLayers.map((layer) => layer.id)),
    [filteredLayers],
  )
  const groupNames = React.useMemo(() => {
    const names: string[] = []
    const seen = new Set<string>()
    for (const group of [...ctx.groups, ...ctx.layers.map((layer) => layer.group ?? "")]) {
      const trimmed = group.trim()
      if (!trimmed || seen.has(trimmed)) continue
      seen.add(trimmed)
      names.push(trimmed)
    }
    if (ctx.layers.some((layer) => !layer.group?.trim())) names.push("未分组")
    return names
  }, [ctx.groups, ctx.layers])

  const orderedIds = React.useMemo(() => ctx.layers.map((layer) => layer.id), [ctx.layers])

  const groupViews = React.useMemo(() => {
    const grouped = new Map<
      string,
      { readonly members: LayerData[]; readonly visibleMembers: LayerData[] }
    >()
    for (const name of groupNames) grouped.set(name, { members: [], visibleMembers: [] })
    for (const layer of ctx.layers) {
      const name = layerGroupName(layer)
      const view = grouped.get(name)
      if (view) {
        view.members.push(layer)
        if (filteredIds.has(layer.id)) view.visibleMembers.push(layer)
        continue
      }
      grouped.set(name, {
        members: [layer],
        visibleMembers: filteredIds.has(layer.id) ? [layer] : [],
      })
    }
    return Array.from(grouped, ([name, view]) => ({ name, ...view }))
  }, [groupNames, ctx.layers, filteredIds])

  const dispatchReorder = (next: readonly string[]) => {
    if (next.join("|") === orderedIds.join("|")) return
    ctx.runCallback(() => ctx.onReorder?.(next), "排序失败，请重试")
  }

  const handleRowDragStart = (id: string) => {
    draggingIdRef.current = id
  }

  const handleRowDrop = (targetId: string) => {
    const draggedId = draggingIdRef.current
    draggingIdRef.current = null
    if (!draggedId) return
    const draggedIndex = orderedIds.indexOf(draggedId)
    const targetIndex = orderedIds.indexOf(targetId)
    if (draggedIndex === -1 || targetIndex === -1) return
    const placement = draggedIndex < targetIndex ? "after" : "before"
    dispatchReorder(moveLayerToAnchor(orderedIds, draggedId, targetId, placement))
  }

  const handleRowMove = (id: string, offset: -1 | 1) => {
    const layer = ctx.layers.find((entry) => entry.id === id)
    if (!layer) return
    const view = groupViews.find((group) => group.name === layerGroupName(layer))
    if (!view) return
    const visibleIds = view.visibleMembers.map((entry) => entry.id)
    const index = visibleIds.indexOf(id)
    const anchorId = visibleIds[index + offset]
    if (index === -1 || !anchorId) return
    dispatchReorder(moveLayerToAnchor(orderedIds, id, anchorId, offset === -1 ? "before" : "after"))
  }

  if (ctx.collapsed) return null

  return (
    <div data-slot="layer-panel-list" className={cn("flex min-h-0 flex-1 flex-col", className)}>
      <div className="space-y-3 border-b border-border px-4 py-3">
        <div className="relative">
          <IconSearch className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="搜索图层名称"
            className="rounded-md pl-8"
          />
        </div>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {FILTER_OPTIONS.map(({ value, label }) => (
              <button
                key={value}
                type="button"
                aria-pressed={filter === value}
                onClick={() => setFilter(value)}
                className={cn(
                  "rounded-none px-3 py-1 text-xs transition-colors",
                  filter === value
                    ? "bg-primary/10 font-semibold text-primary"
                    : "text-muted-foreground hover:bg-muted",
                )}
              >
                {label}
              </button>
            ))}
          </div>
          <Badge variant="outline" className="rounded-none px-2 text-[11px] text-muted-foreground">
            {filteredLayers.length}
          </Badge>
        </div>
        <div className="flex items-center justify-between text-[11px] text-muted-foreground">
          <span>名称与层级</span>
          <span>状态 / 操作</span>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-2 py-2">
        {ctx.callbackError ? (
          <div role="alert" className="mb-2 rounded-md px-2.5 py-1.5 text-[11px] text-destructive">
            {ctx.callbackError}
          </div>
        ) : null}
        {statusChildren}
        {groupViews.map(({ name, members, visibleMembers }) => {
          return (
            <LayerPanelGroup
              key={name}
              group={name}
              members={members}
              visibleMembers={visibleMembers}
              items={items}
              groupNames={groupNames}
              onRowDragStart={handleRowDragStart}
              onRowDrop={handleRowDrop}
              onRowMove={handleRowMove}
            />
          )
        })}
      </div>
    </div>
  )
}

export function LayerPanelItem(_props: LayerPanelItemProps) {
  return null
}
