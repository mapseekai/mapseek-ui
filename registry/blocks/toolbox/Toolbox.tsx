import { IconTools } from "@tabler/icons-react"
import { useMemo } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { TOOLBOX_LABELS_ZH_CN } from "./labels"
import { ToolDetail } from "./ToolDetail"
import { ToolList } from "./ToolList"
import type { ToolboxLabels, ToolboxTab, ToolboxTool } from "./types"

export type ToolboxProps = {
  readonly tools: readonly ToolboxTool[]
  readonly favoriteIds: ReadonlySet<string>
  readonly recentIds: readonly string[]
  readonly activeToolId: string | undefined
  readonly inputLayerName: string
  readonly distance: string
  readonly completed: boolean
  readonly open: boolean
  readonly tab: ToolboxTab
  readonly query: string
  readonly labels?: ToolboxLabels
  readonly className?: string
  readonly onOpenChange: (open: boolean) => void
  readonly onTabChange: (tab: ToolboxTab) => void
  readonly onQueryChange: (query: string) => void
  readonly onFavoriteChange: (id: string, favored: boolean) => void
  readonly onOpenTool: (id?: string) => void
  readonly onDistanceChange: (distance: string) => void
  readonly onRun: (id: string) => void
}

export function Toolbox({
  tools,
  favoriteIds,
  recentIds,
  activeToolId,
  inputLayerName,
  distance,
  completed,
  open,
  tab,
  query,
  labels = TOOLBOX_LABELS_ZH_CN,
  className,
  onOpenChange,
  onTabChange,
  onQueryChange,
  onFavoriteChange,
  onOpenTool,
  onDistanceChange,
  onRun,
}: ToolboxProps) {
  const visibleTools = useMemo(() => {
    const keyword = query.trim().toLocaleLowerCase()
    return tools.filter((tool) => {
      if (tab === "favorites" && !favoriteIds.has(tool.id)) return false
      if (tab === "recent" && !recentIds.includes(tool.id)) return false
      return (
        keyword.length === 0 ||
        tool.label.toLocaleLowerCase().includes(keyword) ||
        tool.description.toLocaleLowerCase().includes(keyword)
      )
    })
  }, [favoriteIds, query, recentIds, tab, tools])
  const activeTool = tools.find((tool) => tool.id === activeToolId)

  if (!open) {
    return (
      <Button variant="outline" onClick={() => onOpenChange(true)}>
        <IconTools data-icon="inline-start" aria-hidden="true" />
        {labels.open}
      </Button>
    )
  }

  return (
    <aside
      data-slot="toolbox"
      aria-label={labels.title}
      className={cn(
        "flex h-[560px] w-[360px] min-w-0 max-w-full flex-col overflow-hidden border border-border bg-card",
        className,
      )}
    >
      {activeTool ? (
        <ToolDetail
          tool={activeTool}
          favored={favoriteIds.has(activeTool.id)}
          inputLayerName={inputLayerName}
          distance={distance}
          completed={completed}
          labels={labels}
          onDistanceChange={onDistanceChange}
          onFavoriteChange={onFavoriteChange}
          onBack={() => onOpenTool()}
          onOpenChange={onOpenChange}
          onRun={onRun}
        />
      ) : (
        <ToolList
          tools={visibleTools}
          favoriteIds={favoriteIds}
          tab={tab}
          query={query}
          labels={labels}
          onTabChange={onTabChange}
          onQueryChange={onQueryChange}
          onFavoriteChange={onFavoriteChange}
          onOpenTool={(id) => onOpenTool(id)}
          onOpenChange={onOpenChange}
        />
      )}
    </aside>
  )
}
